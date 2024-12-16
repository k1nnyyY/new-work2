const express = require("express");
const supabase = require("./server");
const YooKassa = require("yookassa");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());

app.use(
  cors({
    origin: ['http://localhost', 'https://angel-voice.ru', 'http://angel-voice.ru'],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const yooKassa = new YooKassa({
  shopId: "995548",
  secretKey: "test_jv6MLJHEyQXARJ-mib7sDe35eaPccpD2TVwcGOK1fmQ",
});
app.post("/api/payment/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Fetch the user's star balance from the database
    const { data: user, error } = await supabase
      .from("users")
      .select("star")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userStars = user.star || 0;
    const originalAmount = 249.0;
    const discount = Math.min(userStars, originalAmount);
    const finalAmount = (originalAmount - discount).toFixed(2);

    // Create payment with adjusted amount
    const payment = await yooKassa.createPayment({
      amount: {
        value: finalAmount,
        currency: "RUB",
      },
      confirmation: {
        type: "redirect",
        return_url: "http://localhost:5173/profile",
      },
      description: `Subscription payment for user ${userId}`,
    });

    // Deduct used stars from the user's account
    const remainingStars = userStars - discount;
    await supabase
      .from("users")
      .update({ star: remainingStars })
      .eq("id", userId);

    // Add subscription data
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1);

    await supabase
      .from("users")
      .update({
        subscription: true,
        expiredsubscription: expirationDate.toISOString(),
      })
      .eq("id", userId);

    res.json({ paymentUrl: payment.confirmation.confirmation_url });
  } catch (error) {
    console.error("Ошибка создания платежа:", error);
    res.status(500).json({ error: "Failed to create payment" });
  }
});

app.post("/webhook/yookassa", async (req, res) => {
  const { object } = req.body;

  if (object.status === "succeeded") {
    const userId = object.description.split(" ").pop(); // Извлекаем ID пользователя из описания

    try {
      // Установим флаг подписки и срок действия подписки
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);

      const { error } = await supabase
        .from("users")
        .update({
          subscription: true,
          expiredsubscription: expirationDate.toISOString(),
        })
        .eq("id", userId);

      if (error) {
        console.error("Ошибка обновления подписки:", error);
        return res.status(500).json({ error: "Failed to update subscription" });
      }

      console.log(`Subscription updated for user ${userId}`);
      res.status(200).send("Webhook processed");
    } catch (err) {
      console.error("Ошибка обработки webhook:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(400).send("Payment not successful");
  }
});

app.post("/api/check-subscription", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("subscription, expiredsubscription")
      .eq("id", userId)
      .single();

    if (error) {
      return res
        .status(500)
        .json({ error: "Error fetching user data", details: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }

    // Проверяем, не истекла ли подписка
    const currentDate = new Date();
    const expiredDate = new Date(data.expiredsubscription);

    if (expiredDate < currentDate) {
      await supabase
        .from("users")
        .update({ subscription: false })
        .eq("id", userId);
      return res.json({ userId, subscription: false });
    }

    res.json({ userId, subscription: data.subscription });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
});

app.post("/api/viewed-content", async (req, res) => {
  const { user_id, content_id } = req.body;

  console.log("Received data from client:", req.body); // Лог входящих данных

  if (!user_id || !content_id) {
    console.error("Missing user_id or content_id");
    return res
      .status(400)
      .json({ error: "user_id and content_id are required." });
  }

  try {
    const { data, error } = await supabase
      .from("viewed_content")
      .insert([
        { user_id: parseInt(user_id), content_id: parseInt(content_id) },
      ]);

    if (error) {
      console.error("Error inserting into database:", error);
      return res.status(500).json({ error: error.message });
    }

    res
      .status(201)
      .json({ message: "Content viewed recorded successfully", data });
  } catch (err) {
    console.error("Error saving viewed content:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/recently-viewed/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const { data, error } = await supabase
      .from("viewed_content")
      .select(
        `
        content (
          id,
          title,
          type,
          subtitle,
          duration,
          image_url
        )
      `
      )
      .eq("user_id", user_id)
      .order("viewed_at", { ascending: false }) // Сортируем по дате
      .limit(5)
      .order("viewed_at", { ascending: false });

    if (error) {
      console.error("Error fetching recently viewed:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(200).json({ recentlyViewed: data });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/check-user", async (req, res) => {
  const { username } = req.query; // Извлекаем username из строки запроса

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const { data, error } = await supabase
      .from("users") // Таблица "users"
      .select("*")
      .eq("username", username) // Изменено на "username"
      .single();

    if (error && error.code !== "PGRST116") {
      return res.status(500).json({ error: error.message });
    }

    if (data) {
      return res.json({ message: `User ${username} exists`, user: data });
    } else {
      return res.status(404).json({ message: `User ${username} not found` });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/check-favorites", async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: `No favorites found for user ID ${user_id}` });
    }

    res.json({
      message: `Favorites found for user ID ${user_id}`,
      favorites: data,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/favorites", async (req, res) => {
  const { user_id, content_id } = req.body;

  if (!user_id || !content_id) {
    return res
      .status(400)
      .json({ error: "user_id and content_id are required." });
  }

  const { data, error } = await supabase
    .from("favorites")
    .insert([{ user_id: parseInt(user_id), content_id: parseInt(content_id) }])
    .select("*");
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: "Added to favorites", data });
});

// Получение избранных записей для пользователя
app.get("/api/favorites/:user_id", async (req, res) => {
  const { user_id } = req.params;

  // Получаем избранный контент для пользователя
  const { data, error } = await supabase
    .from("favorites")
    .select(
      `
      content (
        id,
        title,
        type,
        subtitle,
        duration,
        image_url
      )
    `
    )
    .eq("user_id", parseInt(user_id));

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ favorites: data });
});

// Удаление из избранного
app.delete("/api/favorites", async (req, res) => {
  const { user_id, content_id } = req.body;

  // Проверяем, что параметры переданы
  if (!user_id || !content_id) {
    return res
      .status(400)
      .json({ error: "user_id and content_id are required." });
  }

  // Удаляем запись из таблицы favorites
  const { data, error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", parseInt(user_id))
    .eq("content_id", parseInt(content_id));

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: "Removed from favorites", data });
});

app.post("/api/favorites", async (req, res) => {
  const { user_id, content_id } = req.body;

  if (!user_id || !content_id) {
    return res
      .status(400)
      .json({ error: "user_id and content_id are required." });
  }

  const { data, error } = await supabase
    .from("favorites")
    .insert([{ user_id, content_id }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: "Added to favorites", data });
});

app.get("/api/favorites/:user_id", async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from("favorites")
    .select("content(*)")
    .eq("user_id", user_id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ favorites: data });
});

app.delete("/api/favorites", async (req, res) => {
  const { user_id, content_id } = req.body;

  if (!user_id || !content_id) {
    return res
      .status(400)
      .json({ error: "user_id and content_id are required." });
  }

  const { data, error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user_id)
    .eq("content_id", content_id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: "Removed from favorites", data });
});
app.post("/api/payment", async (req, res) => {
  const { userId, tariffName, amount } = req.body;

  console.log("Received payment request:", { userId, tariffName, amount });

  if (!userId || !tariffName || !amount) {
    console.log("Payment creation failed: Missing required fields");
    return res
      .status(400)
      .json({ error: "userId, tariffName, and amount are required" });
  }

  try {
    console.log(
      `Creating payment for userId: ${userId}, tariff: ${tariffName}, amount: ${amount}`
    );
    const payment = await yooKassa.createPayment({
      amount: { value: amount, currency: "RUB" },
      confirmation: {
        type: "redirect",
        return_url: "https://angel-voice.ru/profile",
      },
      description: `${tariffName} for user ${userId}`,
    });

    console.log("Payment created successfully:", payment);

    await supabase.from("payments").insert([
      {
        user_id: userId,
        tariff_name: tariffName,
        amount,
        payment_id: payment.id,
        status: "pending",
        created_at: new Date(),
      },
    ]);

    console.log("Payment record saved in database");
    res.json({ paymentUrl: payment.confirmation.confirmation_url });
  } catch (error) {
    console.log("Error creating payment:", error.message);
    res.status(500).json({ error: "Payment creation failed" });
  }
});
app.post("/api/webhook", async (req, res) => {
  const { object } = req.body;

  console.log("Webhook received:", object);

  if (object && object.status === "succeeded") {
    const paymentId = object.id;

    console.log(`Processing successful payment with ID: ${paymentId}`);

    try {
      const { data: paymentData, error: paymentError } = await supabase
        .from("payments")
        .select("user_id, tariff_name")
        .eq("payment_id", paymentId)
        .single();

      if (paymentError || !paymentData) {
        console.log("Payment not found in database:", paymentError?.message || "No data found");
        return res.status(400).json({ error: "Payment not found" });
      }

      const { user_id: userId, tariff_name: tariffName } = paymentData;
      console.log(`Found payment in database. UserID: ${userId}, Tariff: ${tariffName}`);

      // Calculate subscription expiration date
      let monthsToAdd;
      if (tariffName === "1 год") monthsToAdd = 12;
      else if (tariffName === "6 месяцев") monthsToAdd = 6;
      else if (tariffName === "1 месяц") monthsToAdd = 1;

      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + monthsToAdd);

      console.log(`Calculated subscription expiration date: ${expirationDate}`);

      // Activate subscription
      await supabase.from("subscriptions").insert([
        {
          user_id: userId,
          expires_at: expirationDate,
        },
      ]);

      console.log(`Subscription activated for user ${userId}, expires at: ${expirationDate}`);

      // Update payment status
      await supabase
        .from("payments")
        .update({ status: "succeeded" })
        .eq("payment_id", paymentId);

      console.log(`Payment status updated to 'succeeded' for payment ID: ${paymentId}`);
      res.status(200).send("OK");
    } catch (error) {
      console.log("Error processing webhook:", error.message);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  } else {
    console.log("Invalid webhook data or payment not succeeded");
    res.status(400).send("Invalid webhook data");
  }
});

// Проверка подписки
app.post("/api/check-subscription", async (req, res) => {
  const { userId } = req.body;

  console.log("Checking subscription for user ID:", userId);

  if (!userId) {
    console.log("Check subscription failed: User ID is required");
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("subscription, expiredsubscription")
      .eq("id", userId)
      .single();

    if (error) {
      console.log("Error fetching user data:", error.message);
      return res.status(500).json({ error: "Error fetching user data" });
    }

    if (!data) {
      console.log("User not found in database");
      return res.status(404).json({ error: "User not found" });
    }

    const currentDate = new Date();
    const expiredDate = new Date(data.expiredsubscription);

    console.log(`Subscription check: Current Date: ${currentDate}, Expired Date: ${expiredDate}`);

    if (expiredDate < currentDate) {
      console.log("Subscription has expired. Updating database...");
      await supabase
        .from("users")
        .update({ subscription: false })
        .eq("id", userId);

      console.log("Subscription marked as inactive in database");
      return res.json({ userId, subscription: false });
    }

    console.log("Subscription is still active");
    res.json({ userId, subscription: data.subscription });
  } catch (err) {
    console.log("Error checking subscription:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/api/users", async (req, res) => {
  const {
    username,
    dayofbirth,
    gender,
    maritalstatus,
    whatisjob,
    yourobjective,
    star,
    subscription,
    expiredsubscription,
    job,
    firstName,
  } = req.body;

  if (!username || !gender || !dayofbirth) {
    return res.status(400).json({
      error: "id, username, gender, and dayofbirth are required fields.",
    });
  }

  try {
    const { data, error } = await supabase.from("users").insert([
      {
        username,
        dayofbirth,
        gender,
        maritalstatus,
        whatisjob,
        yourobjective,
        star: star || 0,
        subscription: subscription || false,
        expiredsubscription,
        job,
        firstName,
      },
    ]);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/audio_players/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("audio_players")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: "Запись не найдена" });
  }

  res.json(data);
});

app.get("/api/all_data", async (req, res) => {
  const { data, error } = await supabase.from("all_data").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get("/api/all_data/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("all_data")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: "Запись не найдена" });
  }

  res.json(data);
});

app.get("/api/cards", async (req, res) => {
  const { data, error } = await supabase.from("cards").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get("/api/cards/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: "Запись не найдена" });
  }

  res.json(data);
});

app.get("/api/lessons", async (req, res) => {
  const { data, error } = await supabase.from("lessons").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get("/api/lessons/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: "Запись не найдена" });
  }

  res.json(data);
});

app.get("/api/content", async (req, res) => {
  const { data, error } = await supabase.from("content").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get("/api/content/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("content")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: "Запись не найдена" });
  }

  res.json(data);
});

app.get("/api/meditations", async (req, res) => {
  const { data, error } = await supabase.from("meditations").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get("/api/meditations/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("meditations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: "Запись не найдена" });
  }

  res.json(data);
});

app.get("/api/subscriptions", async (req, res) => {
  const { data, error } = await supabase.from("subscriptions").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Маршрут для получения записи по ID
app.get("/api/subscriptions/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: "Запись не найдена" });
  }

  res.json(data);
});

app.get("/api/user_dashboard", async (req, res) => {
  const { data, error } = await supabase.from("user_dashboard").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get("/api/user_dashboard/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("user_dashboard")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: "Запись не найдена" });
  }

  res.json(data);
});

const PORT = 9000;

app.use((err, req, res, next) => {
  console.error("Ошибка:", err.stack);
  res.status(500).send("Internal Server Error");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require("express");
const supabase = require("./server");
const bodyParser = require("body-parser");
const YooKassa = require("yookassa");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://angel-voice.ru", // Разрешаем запросы с вашего фронтенда
    methods: ["GET", "POST", "PUT", "DELETE"], // Разрешенные методы
    credentials: true, // Если нужно передавать cookies или заголовки аутентификации
  })
);

const yooKassa = new YooKassa({
  shopId: "995548", // Укажите ваш shopId
  secretKey: "test_jv6MLJHEyQXARJ-mib7sDe35eaPccpD2TVwcGOK1fmQ", // Укажите ваш secretKey
});

// Создание платежа
app.post("/api/payment/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const payment = await yooKassa.createPayment({
      amount: {
        value: "249.00", // Сумма платежа
        currency: "RUB",
      },
      confirmation: {
        type: "redirect",
        return_url: "https://example.com/profile",
      },
      description: `Subscription payment for user ${userId}`,
    });

    // Отправляем ссылку для оплаты клиенту
    res.json({ paymentUrl: payment.confirmation.confirmation_url });
  } catch (error) {
    console.error("Ошибка создания платежа:", error);
    res.status(500).json({ error: "Failed to create payment" });
  }
});

// Обработка webhook от YooKassa для подтверждения платежа
app.post("/webhook/yookassa", async (req, res) => {
  const { object } = req.body;

  if (object.status === "succeeded") {
    const userId = object.description.split(" ").pop(); // Извлекаем ID пользователя из описания

    try {
      // Обновляем статус подписки в Supabase
      const { error } = await supabase
        .from("users")
        .update({ subscription: true })
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

// Проверка подписки
app.post("/api/check-subscription", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("subscription")
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

    res.json({ userId, subscription: data.subscription });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
});

app.get("/check-user", async (req, res) => {
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

app.get("/check-favorites", async (req, res) => {
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

app.post("/favorites", async (req, res) => {
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
app.get("/favorites/:user_id", async (req, res) => {
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
app.delete("/favorites", async (req, res) => {
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

app.post("/favorites", async (req, res) => {
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

app.get("/favorites/:user_id", async (req, res) => {
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

app.delete("/favorites", async (req, res) => {
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

// Маршрут для создания платежа
app.post("/api/payment", async (req, res) => {
  const { userId, email } = req.body;

  if (!userId || !email) {
    return res.status(400).json({ error: "userId and email are required" });
  }

  try {
    // Создание платежа
    const payment = await yooKassa.createPayment({
      amount: {
        value: "200.00",
        currency: "RUB",
      },
      confirmation: {
        type: "redirect",
        return_url: "http://localhost:9000/success",
      },
      description: `Subscription for user ${email}`,
    });

    // Сохранение платежа в таблице
    await supabase.from("payments").insert([
      {
        user_id: userId,
        payment_id: payment.id,
        status: "pending",
        created_at: new Date(),
      },
    ]);

    res.json({ paymentUrl: payment.confirmation.confirmation_url });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ error: "Payment creation failed" });
  }
});

app.post("/webhook", async (req, res) => {
  try {
    console.log("Webhook received:", JSON.stringify(req.body, null, 2));

    // Извлекаем userId из тела запроса
    const userId = parseInt(req.body.object.description.split(":")[1], 10);

    if (!userId) {
      console.error(
        "Invalid userId in webhook data:",
        req.body.object.description
      );
      return res.status(400).send({ error: "Invalid userId" });
    }

    // Обновляем статус пользователя в базе данных
    const result = await db.query(
      "UPDATE users SET status = $1 WHERE id = $2",
      ["succeeded", userId]
    );

    if (result.rowCount === 0) {
      console.error(`No rows updated for userId: ${userId}`);
      return res.status(404).send({ error: "User not found" });
    }

    console.log(`User status updated successfully for userId: ${userId}`);
    res.status(200).send({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Error processing webhook:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.post("/api/users", async (req, res) => {
  const {
    id,
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

  if (!id || !username || !gender || !dayofbirth) {
    return res.status(400).json({
      error: "id, username, gender, and dayofbirth are required fields.",
    });
  }

  try {
    const { data, error } = await supabase.from("users").insert([
      {
        id,
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
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

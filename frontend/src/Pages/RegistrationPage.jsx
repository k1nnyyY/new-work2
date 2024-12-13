import React, { useEffect, useState } from "react";

const RegistrationPage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Функция для проверки пользователя
  const authenticateUser = async () => {
    try {
      const initData = window.Telegram.WebApp.initData; // Получение initData от Telegram Web App

      if (!initData) {
        throw new Error("initData is not available. Please open this page in Telegram.");
      }

      // Отправляем initData на сервер
      const response = await fetch("http://localhost:9000/api/check-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ initData }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user); // Сохраняем данные пользователя
      } else {
        throw new Error(data.error || "Failed to authenticate user.");
      }
    } catch (err) {
      setError(err.message); // Сохраняем ошибку
    }
  };

  useEffect(() => {
    authenticateUser(); // Вызываем проверку при монтировании компонента
  }, []);

  return (
    <div>
      <h1>Registration Page</h1>

      {/* Если есть ошибка */}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Если пользователь успешно загружен */}
      {user ? (
        <div>
          <h2>Welcome, {user.userName || "User"}!</h2>
          <p>Telegram ID: {user.id}</p>
          <p>Gender: {user.Gender || "Not specified"}</p>
          <p>Day of Birth: {user.dayOfBirth || "Not specified"}</p>
        </div>
      ) : (
        !error && <p>Authenticating...</p> // Пока идет проверка
      )}
    </div>
  );
};

export default RegistrationPage;

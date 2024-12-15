import React, { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { GlobalStyles } from "./GlobalStyles";
import { lightTheme, darkTheme } from "./theme";
import WelcomePage from "./Pages/WelcomePage";
import QuizPage from "./Pages/QuizPage";
import ProfilePage from "./Pages/ProfilePage";
import PlayerPage from "./Pages/PlayerPage";
import CardPage from "./Pages/CardPage";
import PaymentInfoPage from "./Pages/PaymentInfoPage";
import MainPage from "./Pages/MainPage";
import CategoryPage from "./Pages/CategoryPage";
import MainListPage from "./Pages/MainListPage";
import PayPage from "./Pages/PayPage";
import SelectPlayerPage from "./Pages/SelectPlayerPage";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const fixedUsername = "k1nnyyY";
        const response = await fetch(
          `http://angel-voice.ru/api/api/check-user?username=${fixedUsername}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            setIsAuthenticated(false);
          } else {
            console.error(
              "Ошибка при проверке пользователя:",
              response.statusText
            );
          }
          return;
        }

        const data = await response.json();

        // Сохраняем ID пользователя и данные
        if (data?.user?.id) {
          localStorage.setItem("userId", data.user.id);
          setUserData(data.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Ошибка подключения к серверу:", err);
        setIsAuthenticated(false);
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    if (
      isAuthenticated === false &&
      location.pathname !== "/welcome" &&
      location.pathname !== "/quiz"
    ) {
      navigate("/welcome");
    } else if (isAuthenticated === true && location.pathname === "/welcome") {
      navigate("/profile");
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? lightTheme : darkTheme}>
      <GlobalStyles />
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        {isAuthenticated && (
          <>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/player" element={<PlayerPage />} />
            <Route path="/card" element={<CardPage />} />
            <Route path="/payment-info" element={<PaymentInfoPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/main-list" element={<MainListPage />} />
            <Route path="/pay" element={<PayPage />} />
            <Route path="/select-player" element={<SelectPlayerPage />} />
          </>
        )}
      </Routes>
      <button
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "10px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={toggleTheme}
      >
        Переключить тему
      </button>
    </ThemeProvider>
  );
};

export default App;

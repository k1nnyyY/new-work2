import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMoon,
  faHeart,
  faFolder,
  faCircle,
} from "@fortawesome/free-regular-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";

const FooterContainer = styled.div`
  width: 100%;
  max-width: 360px;
  position: fixed;
  height: 7%;
  bottom: 0;
  left: 50%;
  border-radius: 20px 20px 0 0;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 10; /* Убедитесь, что элементы на переднем плане */
`;

const FooterButton = styled.button`
  all: unset;
  cursor: pointer;
  font-size: 24px;
  color: ${({ isActive }) => (isActive ? "#1C0019" : "#fff")};

  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Получаем текущий путь
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    console.log("Toggle theme clicked");
    setIsDarkMode(!isDarkMode);
  };

  const handleRedirect = (path) => {
    console.log(`Redirect to: ${path}`);
    if (window.Telegram?.WebApp) {
      console.log("Telegram WebApp redirect");
      window.location.href = path;
    } else {
      console.log("Browser redirect");
      navigate(path);
    }
  };

  // Сопоставление пути с активной кнопкой
  const routes = {
    home: "/",
    card: "/card",
    category: "/category",
  };

  return (
    <FooterContainer>
      <FooterButton
        isActive={location.pathname === routes.home}
        onClick={() => handleRedirect(routes.home)}
      >
        <FontAwesomeIcon icon={faUser} />
      </FooterButton>
      <FooterButton
        isActive={location.pathname === routes.card}
        onClick={() => handleRedirect(routes.card)}
      >
        <FontAwesomeIcon icon={faFolder} />
      </FooterButton>
      <FooterButton onClick={toggleTheme}>
        <FontAwesomeIcon icon={faMoon} />
      </FooterButton>
      <FooterButton>
        <FontAwesomeIcon icon={faHeart} />
      </FooterButton>
      <FooterButton
        isActive={location.pathname === routes.category}
        onClick={() => handleRedirect(routes.category)}
      >
        <FontAwesomeIcon icon={faCircle} />
      </FooterButton>
    </FooterContainer>
  );
};

export default Footer;

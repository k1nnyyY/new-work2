import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faMoon, faHeart, faFolder, faCircle } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";

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
  color: ${({ theme }) => theme.color};

  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }

  /* Временные границы для отладки */
  border: 1px solid red;
`;

const Footer = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    console.log("Toggle theme clicked");
    setIsDarkMode(!isDarkMode);
  };

  const handleRedirect = (path) => {
    console.log(`Redirect to: ${path}`);
    if (window.Telegram?.WebApp) {
      console.log("Telegram WebApp redirect");
      // Используем стандартный способ перенаправления
      window.location.href = path;
    } else {
      console.log("Browser redirect");
      navigate(path);
    }
  };
  

  return (
    <FooterContainer>
      <FooterButton
        role="button"
        tabIndex="0"
        onClick={() => handleRedirect("/profile")}
      >
        <FontAwesomeIcon icon={faUser} />
      </FooterButton>
      <FooterButton
        role="button"
        tabIndex="0"
        onClick={() => handleRedirect("/card")}
      >
        <FontAwesomeIcon icon={faFolder} />
      </FooterButton>
      <FooterButton
        role="button"
        tabIndex="0"
        onClick={toggleTheme}
      >
        <FontAwesomeIcon icon={faMoon} />
      </FooterButton>
      <FooterButton role="button" tabIndex="0">
        <FontAwesomeIcon icon={faHeart} />
      </FooterButton>
      <FooterButton
        role="button"
        tabIndex="0"
        onClick={() => handleRedirect("/category")}
      >
        <FontAwesomeIcon icon={faCircle} />
      </FooterButton>
    </FooterContainer>
  );
};

export default Footer;

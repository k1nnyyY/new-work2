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
`;

const FooterButton = styled.button`
  all: unset; /* Убираем все стили кнопки */
  cursor: pointer;
  font-size: 24px;
  color: ${({ theme }) => theme.color};

  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const Footer = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleRedirect = (path) => {
    if (window.Telegram?.WebApp) {
      console.log("hi");
      window.Telegram.WebApp.navigateTo(path);
    } else {
      navigate(path);
    }
  };

  return (
    <FooterContainer>
      <FooterButton onClick={() => handleRedirect("/profile")}>
        <FontAwesomeIcon icon={faUser} />
      </FooterButton>
      <FooterButton onClick={() => handleRedirect("/card")}>
        <FontAwesomeIcon icon={faFolder} />
      </FooterButton>
      <FooterButton onClick={toggleTheme}>
        <FontAwesomeIcon icon={faMoon} />
      </FooterButton>
      <FooterButton>
        <FontAwesomeIcon icon={faHeart} />
      </FooterButton>
      <FooterButton onClick={() => handleRedirect("/category")}>
        <FontAwesomeIcon icon={faCircle} />
      </FooterButton>
    </FooterContainer>
  );
};

export default Footer;

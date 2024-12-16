import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faMoon, faHeart, faFolder, faCircle } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeProvider";

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

const FooterIcon = styled.div`
  font-size: 24px;
  color: ${({ theme }) => theme.color};
  cursor: pointer;

  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const Footer = () => {
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();

  const handleRedirect = (path) => {
    if (window.Telegram?.WebApp) {
      console.log("hi")
      // Если приложение запущено в Telegram WebApp, используем `Telegram.WebApp.navigateTo`
      window.Telegram.WebApp.navigateTo(path);
    } else {
      // Обычный редирект для браузера
      navigate(path);
    }
  };

  return (
    <FooterContainer>
      <FooterIcon onClick={() => handleRedirect("/profile")}>
        <FontAwesomeIcon icon={faUser} />
      </FooterIcon>
      <FooterIcon onClick={() => handleRedirect("/card")}>
        <FontAwesomeIcon icon={faFolder} />
      </FooterIcon>
      <FooterIcon onClick={toggleTheme}>
        <FontAwesomeIcon icon={faMoon} />
      </FooterIcon>
      <FooterIcon>
        <FontAwesomeIcon icon={faHeart} />
      </FooterIcon>
      <FooterIcon onClick={() => handleRedirect("/category")}>
        <FontAwesomeIcon icon={faCircle} />
      </FooterIcon>
    </FooterContainer>
  );
};

export default Footer;

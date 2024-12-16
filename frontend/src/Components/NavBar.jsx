import React from "react";
import musicIcon from "../assets/Vector.svg";
import photoIcon from "../assets/Vector2.svg";
import meditationIcon from "../assets/meditation.svg";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const handleRedirect = (title) => {
    switch (title) {
      case "Игры":
        // Редирект на Telegram-бота
        window.location.href = "https://t.me/av_game_test_bot";
        break;
      case "Медитации":
        // Редирект на /main
        navigate("/main");
        break;
      case "практики":
        // Редирект на /select-player
        navigate("/select-player");
        break;
      default:
        break;
    }
  };

  const Tab = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    color: #fff;
    text-transform: capitalize;
    font-size: 14px;

    & > img {
      width: 30px;
      height: 30px;
      margin-bottom: 5px;
    }

    &:not(:last-child) {
      margin-right: 10px;
    }
  `;

  const Header = styled.div`
    position: fixed; /* Закрепляет элемент */
    top: 5%; /* Отступ сверху */
    left: 50%; /* Центрирование относительно ширины */
    transform: translateX(-50%); /* Учитывает ширину элемента */
    display: flex;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 15px;
    width: 100%;
    padding: 10px;
    z-index: 100; /* Обеспечивает отображение поверх других элементов */
  `;

  const tabs = [
    { title: "Игры", icon: musicIcon },
    { title: "Медитации", icon: meditationIcon },
    { title: "практики", icon: photoIcon },
  ];

  return (
    <Header>
      {tabs.map((tab, index) => (
        <Tab key={index} onClick={() => handleRedirect(tab.title)}>
          <img src={tab.icon} alt={tab.title} />
          {tab.title}
        </Tab>
      ))}
    </Header>
  );
};

export default NavBar;

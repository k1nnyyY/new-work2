import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Footer from "../Components/Footer";
import NavBar from "../Components/NavBar";
import Logo from "../assets/Ellipse 1.svg";

// Основной фон страницы
const Background = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: url("/path/to/background-image.jpg") center/cover no-repeat;
  background-color: ${({ theme }) => theme.background};
  background-size: cover;
`;


const TextContainer = styled.div`
  display: flex;
  flex-direction: column; /* Располагаем элементы вертикально */
  text-align: right; /* Выравниваем текст справа */
  margin-left: auto; /* Отталкиваем от аватара */

  .greeting {
    font-size: 16px;
    margin-bottom: 5px;
    font-weight: bold;
    color: ${({ theme }) => theme.color};
  }

  .user-id {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }
`;

const ScrollableContainer = styled.div`
  flex: 1; /* Займает оставшееся пространство */
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  overflow-y: auto; /* Добавляет вертикальный скролл при переполнении */
  padding: 20px 0;

  /* Скрытие скроллбара */
  scrollbar-width: none; /* Для Firefox */
  -ms-overflow-style: none; /* Для Internet Explorer и Edge */

  &::-webkit-scrollbar {
    display: none; /* Для Chrome, Safari и других WebKit-браузеров */
  }
`;

// Контейнер профиля
const ProfileContainer = styled.div`
  width: 100%;
  max-width: 360px;
  padding: 20px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 35%;
`;

// Аватар
const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: url("https://via.placeholder.com/80") center/cover no-repeat;
  margin: 0 auto 15px;
  border: 2px solid ${({ theme }) => theme.color};
`;

const ProfileContainerData = styled.div`
  display: flex;
  align-items: center; /* Центрируем элементы по вертикали */
  justify-content: space-between; /* Распределяем элементы по сторонам */
  width: 100%;
  max-width: 360px;
  padding: 20px;
  border-radius: 20px;
  overflow: hidden;
  margin: 0 auto; /* Центрируем по вертикали */
`;

const PayPage = () => {

  const [userData, setUserData] = useState({
    id: "2345678",
    name: "Тимур",
    avatar: Logo, // Replace with uploaded image path
  });

  return (
    <Background>
      <ScrollableContainer>
        <ProfileContainer>
        <ProfileContainerData>
            <Avatar style={{ backgroundImage: Logo }} />
            <TextContainer>
              <div className="greeting">Добрый день, Тимур</div>
              <div className="user-id">id 12999923</div>
            </TextContainer>
          </ProfileContainerData>
        </ProfileContainer>
      </ScrollableContainer>
      <Footer />
    </Background>
  );
};

export default PayPage;

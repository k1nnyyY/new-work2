import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Footer from "../Components/Footer";
import NavBar from "../Components/NavBar";
import Logo from "../assets/Ellipse 1.svg";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../userSlice";
import musicIcon from "../assets/Vector.svg";
import photoIcon from "../assets/Vector2.svg";
import medIcon from "../assets/med.svg";
import meditationIcon from "../assets/meditation icon.svg";
import blurBg from "../assets/blur-background.svg";
import { useNavigate } from "react-router-dom";

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

const ProfileContainer = styled.div`
  width: 100%;
  max-width: 360px;
  padding: 20px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
`;

const ProfileContainerData = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: url("https://via.placeholder.com/80") center/cover no-repeat;
  border: 2px solid ${({ theme }) => theme.color};
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;

  .greeting {
    font-size: 16px;
    font-weight: bold;
    color: white;
  }

  .user-id {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }
`;

const SubscribeButton = styled.button`
  display: block;
  width: 100%;
  padding: 15px;
  background-color: #5a205d;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #8e24aa;
  }
`;

const ScrollableContainer = styled.div`
  flex: 1; /* Занимает оставшееся пространство */
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  overflow-y: auto;
  padding: 20px 0;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FooterContainer = styled.div`
  margin-top: auto; /* Сдвигает футер вниз */
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
`;

// Заголовок
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
  width: 100%;

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
  display: flex;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 15px;
  width: 100%;
  padding: 10px;
  margin: 10% 0 10% 0;
  z-index: 100; /* Обеспечивает отображение поверх других элементов */
`;

// Секция данных
// Секция данных с рамкой
const Section = styled.div`
  margin-bottom: 20px;
  padding: 10px 10px 15px 10px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.3); /* Обводка для каждой секции */
  background-color: rgba(255, 255, 255, 0.1); /* Лёгкий фон для секции */
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.color};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-size: 14px;
  color: ${({ theme }) => theme.color};
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  span {
    flex: 1;
  }

  a {
    color: ${({ theme }) => theme.color};
    text-decoration: none;
    font-weight: bold;
  }
`;

// Кнопки выхода и удаления
const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  button {
    flex: 1;
    padding: 10px 20px;
    margin: 0 5px;
    font-size: 14px;
    font-weight: bold;
    color: ${({ theme }) => theme.color};
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.4);
    }
  }
`;

const CardContainer = styled.div`
  width: 100%;
  max-width: 360px;
  height: 60vh; /* Установить фиксированную высоту */
  overflow-y: auto; /* Включить вертикальный скроллинг */
  margin-top: 40%;
  -ms-overflow-style: none; /* Убирает скроллбар в IE и Edge */
  scrollbar-width: none; /* Убирает скроллбар в Firefox */

  &::-webkit-scrollbar {
    display: none; /* Убирает скроллбар в Chrome и Safari */
  }
`;

const BackgroundImage = styled.img`
  display: block;
  width: 100%; /* Make the image responsive */
  height: auto; /* Maintain aspect ratio */
  max-width: 360px; /* Ensure it doesn’t exceed the container’s max-width */
  margin: 0 auto; /* Center the image horizontally */
  border-radius: 15px; /* Optional: Add rounded corners */
  margin-bottom: 20%;
  margin-top: 5%;
`;

const SectionWrapper = styled.div`
  margin-top: 10%;
`;

const ProfilePage = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const [username, setUsername] = useState("Гость");
  const [photoUrl, setPhotoUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Telegram WebApp integration
    const telegramData = window.Telegram.WebApp.initDataUnsafe?.user || {};
    setUsername(telegramData.username || "Гость");
    setPhotoUrl(telegramData.photo_url || "https://via.placeholder.com/80");

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://angel-voice.ru/api/check-user?username=${telegramData.username}`
        );
        const data = await response.json();

        if (response.ok) {
          dispatch(setUser(data.user));
        } else {
          console.error("Ошибка загрузки данных:", data.message);
        }
      } catch (err) {
        console.error("Ошибка подключения к серверу:", err);
      }
    };

    fetchUserData();
  }, [dispatch]);


  

  useEffect(() => {
    console.log("Redux state for user in ProfilePage:", userData);
  }, [userData]);

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

  const tabs = [
    { title: "Игры", icon: musicIcon },
    { title: "Медитации", icon: medIcon },
    { title: "практики", icon: photoIcon },
  ];

  return (
    <Background>
      {/* Основной прокручиваемый контейнер */}
      <ScrollableContainer>
        <ProfileContainer>
          {userData.subscription ? (
            <>
              <ProfileContainerData>
                <Avatar style={{ backgroundImage: `url(${Logo})` }} />
                <TextContainer>
                  <div className="greeting">
                    Добрый день, {userData.firstName || "Гость"}
                  </div>
                  <div className="user-id">ID: {userData.id || "—"}</div>
                </TextContainer>
              </ProfileContainerData>
              <SectionWrapper>
                <Section>
                  <SectionTitle>Личное</SectionTitle>
                  <InfoRow>
                    <span>Имя</span>
                    <span>{userData.firstName || "Не указано"}</span>
                  </InfoRow>
                  <InfoRow>
                    <span>Дата рождения</span>
                    <span>{userData.dayOfBirth || "Не указано"}</span>
                  </InfoRow>
                  <InfoRow>
                    <span>Пол</span>
                    <span>{userData.gender || "Не указано"}</span>
                  </InfoRow>
                  <InfoRow>
                    <span>Профессия</span>
                    <span>{userData.whatisjob || "Не указано"}</span>
                  </InfoRow>
                  <InfoRow>
                    <span>Отношения</span>
                    <span>{userData.maritalStatus || "Не указано"}</span>
                  </InfoRow>
                  <InfoRow>
                    <span>Цели</span>
                    <span>{userData.yourObjective || "Не указано"}</span>
                  </InfoRow>
                </Section>
                <Section>
                  <SectionTitle>Подписка</SectionTitle>
                  <InfoRow>
                    <span>Подписка</span>
                    <span>
                      {userData.subscription ? "Оплачена" : "Не оплачена"}
                    </span>
                  </InfoRow>
                  <InfoRow>
                    <span>Окончание подписки</span>
                    <span>{userData.expiredSubscription || "Не оплачена"}</span>
                  </InfoRow>
                </Section>
                <Section>
                  <SectionTitle>Юридическое</SectionTitle>
                  <InfoRow>
                    <span>Политика конфиденциальности</span>
                    <a href="#">Открыть</a>
                  </InfoRow>
                  <InfoRow>
                    <span>Политика конфиденциальности</span>
                    <a href="#">Открыть</a>
                  </InfoRow>
                </Section>
                <ActionButtons>
                  <button>Выйти</button>
                  <button>Удалить</button>
                </ActionButtons>
              </SectionWrapper>
            </>
          ) : (
            <>
              <ProfileContainerData>
                <Avatar style={{ backgroundImage: `url(${Logo})` }} />
                <TextContainer>
                  <div className="greeting">
                    Добрый день, {userData.firstName || "Гость"}
                  </div>
                  <div className="user-id">ID: {userData.id || "—"}</div>
                </TextContainer>
              </ProfileContainerData>
              <Header>
                {tabs.map((tab, index) => (
                  <Tab key={index} onClick={() => handleRedirect(tab.title)}>
                    <img src={tab.icon} alt={tab.title} />
                    {tab.title}
                  </Tab>
                ))}
              </Header>
              <SubscribeButton onClick={handleNext}>
                🔒 Оплатить подписку
              </SubscribeButton>
              <BackgroundImage src={blurBg}></BackgroundImage>
            </>
          )}
        </ProfileContainer>
      </ScrollableContainer>
      <FooterContainer>
        <Footer />
      </FooterContainer>
    </Background>
  );
};

export default ProfilePage;

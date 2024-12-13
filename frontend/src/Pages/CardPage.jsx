import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FiHeart, FiShare2, FiArrowLeft } from "react-icons/fi";
import Footer from "../Components/Footer.jsx";
import Navigation from "../Components/Header.jsx";

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("background-image-url.jpg") no-repeat center center/cover;
  overflow: hidden; /* Убираем прокрутку на уровне фона */
`;


const Container = styled.div`
  width: 90%;
  max-width: 360px;
  height: 80vh; /* Ограничиваем высоту контейнера */
  overflow-y: auto; /* Добавляем возможность вертикальной прокрутки */
  padding: 20px;
  color: ${({ theme }) => theme.color};
  border-radius: 20px;
  position: relative;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);

  /* Скрываем стандартный скроллбар */
  scrollbar-width: thin; /* Для Firefox */
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const HeaderSection = styled.div`
  margin-bottom: 15%;
  margin-top:5%;
  text-align: center; /* Центрируем заголовок и подзаголовок */
  & h2 {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
  color: ${({ theme }) => theme.color};
  }

  & p {
    font-size: 14px;
  color: ${({ theme }) => theme.color};
    margin: 5px 0 0;
  }
`;

const DateText = styled.p`
  font-size: 14px;
  font-weight:600;
  color: ${({ theme }) => theme.color};
  margin: 10px 0;
  text-align: left;
`;
const ImageWrapper = styled.div`
  display: flex;
  justify-content: center; /* Центрируем изображение */
  margin: 15px 0;
`;

const Image = styled.img`
  width: 100%;
  max-width: 300px;
  border-radius: 15px;
  object-fit: cover;
`;

const DescriptionWrapper = styled.div`
  margin-top: 15px;
  text-align: center; /* Центрируем описание и заголовок */
  & h3 {
    font-size: 16px;
    font-weight: bold;
    margin: 0 0 5px;
  color: ${({ theme }) => theme.color};
  }

  & p {
    font-size: 14px;
  color: ${({ theme }) => theme.color};
    line-height: 1.6;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.color};
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.color};
  font-size: 20px;
  cursor: pointer;

  &:hover {
  color: ${({ theme }) => theme.color};
  }
`;

const JustifiedText = styled.p`
  color: ${({ theme }) => theme.color};
  text-align: justify; 
  margin: 0 auto; 
  max-width: 90%;
`;

//<p>{cardData.description || "Описание отсутствует."}</p>

const CardPage = () => {
  const [cardData, setCardData] = useState(null);

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await fetch(`http://localhost:9000/api/cards/1`);
        if (!response.ok) {
          throw new Error("Ошибка загрузки данных");
        }
        const data = await response.json();
        setCardData(data);
      } catch (error) {
        console.error("Ошибка:", error.message);
      }
    };

    fetchCardData();
  }, []);

  if (!cardData) {
    return (
      <Background>
        <Container>
          <Header>
            <IconButton>
              <FiArrowLeft />
            </IconButton>
          </Header>
          <Description>Загрузка...</Description>
        </Container>
      </Background>
    );
  }

  return (
    <Background>
      <Container>
        <Navigation />
        <HeaderSection>
          <h2>{cardData.title || "Метафорические карты"}</h2>
          <p>{cardData.subtitle || "Карта дня поможет услышать себя"}</p>
        </HeaderSection>
        <DateText>{cardData.date || "Вторник, 15.11.2024"}</DateText>
        <ImageWrapper>
          <Image
            src={cardData.image_url || "default-image-url.jpg"}
            alt="Card of the Day"
          />
        </ImageWrapper>
        <DescriptionWrapper>
          <h3>Ваша карта дня</h3>
          <JustifiedText>Метафорические ассоциативные карты – это терапевтический метод, который помогает нам открыть дверь в подсознание. Они не предсказывают будущее и не содержат в себе прямых рекомендаций. Изображенные на них предметы, персонажи и ситуации помогают узнать новое о себе и о мире вокруг или получить подсказку по поводу того, что вас беспокоит.</JustifiedText>
        </DescriptionWrapper>
      </Container>
      <Footer />
    </Background>
  );
};

export default CardPage;

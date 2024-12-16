import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Footer from "../Components/Footer";
import NavBar from "../Components/NavBar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) =>
    theme.background || "url('/background.jpg') no-repeat center center fixed"};
  background-size: cover;
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

const Card = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 10px;
  margin-bottom: 15px;
  padding: 10px;
  color: ${({ theme }) => theme.color};
  box-shadow: 0px 0px 15px 0px #ffffff1a inset;

  & img {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    margin-right: 10px;
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 14px;

  & h4 {
    margin: 0;
    font-size: 16px;
  }

  & p {
    margin: 0;
    font-size: 12px;
    opacity: 0.8;
  }

  & .card-info {
    display: flex;
    align-items: center;
    gap: 0;
  }
`;
const Container = styled.div`
  width: 90%;
  max-height: 85vh;
  max-width: 360px;
  padding: 20px;
  text-align: left;
  color: ${({ theme }) => theme.color};
  border-radius: 20px;
  position: relative;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
`;
const Subtitle = styled.p`
  color: ${({ theme }) => theme.color};
  font-weight: 300;
  font-size: 12px; 
  opacity: 0.9; 
  margin: 0;
`;

const NavBarWrapper = styled.div`
  margin: 50% 0 50% 0;
`;
const MainPage = () => {
  const [cards, setCards] = useState([]);
  const currentUser = useSelector((state) => state.user);
  const userData = useSelector((state) => state.user);

  const navigate = useNavigate();
  useEffect(() => {
    console.log("Redux state for user in ProfilePage:", userData);
  }, [userData]);

  useEffect(() => {
    const fetchAudioPlayers = async () => {
      try {
        const response = await axios.get("https://angel-voice.ru/api/audio_players");
        setCards(response.data);
      } catch (error) {
        console.error("Error fetching audio players:", error);
      }
    };
    fetchAudioPlayers();
  }, []);

  const handleCardClick = async (userId, audioId) => {
    try {
      const response = await axios.post(
        "https://angel-voice.ru/api/viewed-content",
        {
          user_id: userId,
          audio_id: audioId,
        }
      );

      const { audioData } = response.data;
      navigate("/players", { state: { audioData } });
    } catch (error) {
      console.error("Error recording view:", error);
    }
  };

  return (
    <Background>
      <Container>
        <NavBarWrapper>
          <NavBar />
        </NavBarWrapper>
        <CardContainer>
          {cards.length === 0 ? (
            <p>Нет доступного контента.</p>
          ) : (
            cards.map((card) => (
              <Card
                key={card.id}
                onClick={() => handleCardClick(currentUser.id, card.id)}
              >
                <img
                  src={card.image_url || "https://via.placeholder.com/60"}
                  alt={card.title}
                />
                <CardContent>
                  <div className="card-info">
                    <p>{card.type}</p>
                    <p>{card.duration}</p>
                  </div>
                  <h4>{card.title}</h4>
                  <Subtitle>{card.subtitle}</Subtitle>
                </CardContent>
              </Card>
            ))
          )}
        </CardContainer>
      </Container>
      <Footer />
    </Background>
  );
};

export default MainPage;

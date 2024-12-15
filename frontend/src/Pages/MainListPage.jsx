import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Footer from "../Components/Footer";
import NavBar from "../Components/NavBar";
import axios from "axios";

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
  height: 60vh; /* Область для скроллинга */
  overflow-y: auto;
  margin-top: 40%;
  -ms-overflow-style: none; /* Убирает скроллбар в IE и Edge */
  scrollbar-width: none; /* Убирает скроллбар в Firefox */

  &::-webkit-scrollbar {
    display: none; /* Убирает скроллбар в Chrome и Safari */
  }

  & h3 {
  color: ${({ theme }) => theme.color};
    font-size: 18px;
    margin-bottom: 10px;
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
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);

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
  min-height: 85vh;
  max-width: 360px;
  padding: 20px;
  text-align: left;
  color: ${({ theme }) => theme.color};
  border-radius: 20px;
  position: relative;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  overflow: hidden;
`;
const NewBlock = styled.div`
  margin-bottom: 20px;

  & h3 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
  color: ${({ theme }) => theme.color};
  }
`;

const HorizontalScroll = styled.div`
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding-bottom: 10px;
  scroll-snap-type: x mandatory;

  -ms-overflow-style: none; /* Hides scrollbar in IE and Edge */
  scrollbar-width: none; /* Hides scrollbar in Firefox */

  &::-webkit-scrollbar {
    display: none; /* Hides scrollbar in Chrome and Safari */
  }
`;

const NewCard = styled.div`
  flex: 0 0 auto; /* Ensures horizontal layout */
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-image: url(${(props) => props.image});
  background-size: cover;
  background-position: center;
  height: 180px;
  width: 280px;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.color};
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7));
    z-index: 1;
  }
`;

const CardContentOverlay = styled.div`
  position: relative;
  z-index: 2;
  padding: 10px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 10px;
  margin: 0 10px 10px 10px; /* Add some spacing inside the card */

  & .card-info {
    display: flex;
    align-items: center;
    gap: 0;
  }

  & h4 {
    font-size: 16px;
    font-weight: bold;
    margin: 5px 0;
    line-height: 1.2;
  }

  & p {
    font-size: 12px;
    margin: 0;
    opacity: 0.9;
  }
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.color};
  font-weight: 300;
  font-size: 12px;
  opacity: 0.9;
  margin: 0;
`;
const MainListPage = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get("http://angel-voice.ru/api/content");
        setCards(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchContent();
  }, []);

  return (
    <Background>
      <Container>
        <NavBar />
        <CardContainer>
          <NewBlock>
            <h3>Новое</h3>
            <HorizontalScroll>
              {Array.isArray(cards) &&
                cards.map((card, index) => (
                  <NewCard key={index} image={card.image_url}>
                    <CardContentOverlay>
                      <div className="card-info">
                        <p>{card.type}</p>
                        <p>{card.duration}</p>
                      </div>
                      <h4>{card.title}</h4>
                      <Subtitle>{card.subtitle}</Subtitle>
                    </CardContentOverlay>
                  </NewCard>
                ))}
            </HorizontalScroll>
          </NewBlock>
          {/* Блок "Недавние" */}
          <h3>Недавние</h3>
          {Array.isArray(cards) && cards.length === 0 ? (
            <p>Loading content...</p>
          ) : (
            Array.isArray(cards) &&
            cards.map((card, index) => (
              <Card key={index}>
                <img src={card.image_url} alt={card.title} />
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

export default MainListPage;

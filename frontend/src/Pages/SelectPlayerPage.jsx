import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NavBar from "../Components/Header";
import axios from "axios";
import tuiButton from "../assets/tui-button.svg";
import { FiHeart } from "react-icons/fi";

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) =>
    theme.background || "url('/background.jpg') no-repeat center center fixed"};
  background-size: contain;
`;

const CardContainer = styled.div`
  width: 100%;
  overflow-y: auto;
  margin-top: 5%;

  & h3 {
    color: ${({ theme }) => theme.color};
    font-size: 18px;
    margin-bottom: 10px;
  }
`;

const Container = styled.div`
  width: 90%;
  min-height: 90vh;
  margin-top: 5%;
  padding: 16px;
  text-align: left;
  color: ${({ theme }) => theme.color};
  border-radius: 25px;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
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
  width: 100%;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.color};
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.3),
      rgba(0, 0, 0, 0.7)
    );
    z-index: 1;
  }
`;

const ListenButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 50px;
  background-color: #1b0b21; /* Dark background */
  color: #ffffff; /* White text */
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3); /* Subtle shadow */
  transition: all 0.3s ease-in-out;
  margin-top:-10%;

  &:hover {
    background-color: #2e1a34; /* Slightly lighter color on hover */
    transform: scale(1.02); /* Small scaling effect */
  }

  &:active {
    transform: scale(0.98); /* Press effect */
  }

  & svg {
    width: 20px;
    height: 20px;
  }
`;

const Icon = styled.span`
  display: flex;
  align-items: center;
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

const ImageButton = styled.div`
  width: 200%; /* Adjust width based on the image */
  max-width: 300px; /* Example maximum width */
  height: auto;
  cursor: pointer;
  margin-top: 20px;

  img {
    width: 100%;
    height: auto;
    display: block;
  }

  &:hover {
    opacity: 0.9; /* Optional hover effect */
  }
`;

const ListContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  padding: 10px 0;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  &:last-child {
    border-bottom: none;
  }
`;

const NumberCircle = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: white;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
`;

const ItemInfo = styled.div`
  flex: 1;
  margin-left: 15px;

  & h4 {
    margin: 0;
    font-size: 16px;
    color: white;
    font-weight: 500;
  }

  & p {
    margin: 5px 0 0;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
  }
`;

const FavoriteIcon = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
  background: url("/heart-icon.svg") no-repeat center;
  background-size: contain;

  &:hover {
    opacity: 0.8;
  }
`;

const FavoriteButton = styled.button`
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  font-size: 24px;

  &:hover {
    color: white;
  }

  &:active {
    transform: scale(0.9); /* Add a simple scaling effect */
  }
`;
const SelectPlayerPage = () => {
  const [cards, setCards] = useState([]);
  const items = [
    { number: 1, title: "Учимся быть мечтателем", duration: "12 мин" },
    { number: 2, title: "Учимся быть мечтателем", duration: "12 мин" },
    { number: 3, title: "Учимся быть мечтателем", duration: "12 мин" },
    { number: 4, title: "Учимся быть мечтателем", duration: "12 мин" },
    { number: 5, title: "Учимся быть мечтателем", duration: "12 мин" },
    { number: 6, title: "Учимся быть мечтателем", duration: "12 мин" },
    { number: 7, title: "Учимся быть мечтателем", duration: "12 мин" },
    { number: 8, title: "Учимся быть мечтателем", duration: "12 мин" },
    // Add more items as needed
  ];

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get("http://angel-voice.ru/api/api/content/4");
        console.log("Fetched content:", response.data);
        setCards(response.data);
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
            <HorizontalScroll>
              {cards && (
                <NewCard image={cards.image_url}>
                  <CardContentOverlay>
                    <div className="card-info">
                      <p>{cards.type}</p>
                      <p>{cards.duration}</p>
                    </div>
                    <h4>{cards.title}</h4>
                    <Subtitle>{cards.subtitle}</Subtitle>
                  </CardContentOverlay>
                </NewCard>
              )}
            </HorizontalScroll>
          </NewBlock>
        </CardContainer>{" "}
        <ListenButton>
          <Icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-6.586-4.243a1 1 0 00-1.528.857v8.486a1 1 0 001.528.857l6.586-4.243a1 1 0 000-1.714z"
              />
            </svg>
          </Icon>
          Слушать
        </ListenButton>
        <ListContainer>
          {items.map((item, index) => (
            <ListItem key={index}>
              <NumberCircle>{item.number}</NumberCircle>
              <ItemInfo>
                <h4>{item.title}</h4>
                <p>{item.duration}</p>
              </ItemInfo>
              <FavoriteButton>
                <FiHeart />
              </FavoriteButton>
            </ListItem>
          ))}
        </ListContainer>
      </Container>
    </Background>
  );
};

export default SelectPlayerPage;

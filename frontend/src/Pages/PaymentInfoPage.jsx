import React from "react";
import styled from "styled-components";
import logBackground from "../assets/Logo-light.svg";
import buttonImage from "../assets/Frame 38.svg";
import buttonImage2 from "../assets/tarif 2.svg";
import buttonImage3 from "../assets/price123.svg";
import buttonImageLight from "../assets/price_dark.svg";

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("background-image-url.jpg") no-repeat center center/cover; // Replace with your actual background image URL
`;

const Container = styled.div`
  width: 90%;
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

const Logo = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 10%;
  background-image: url(${logBackground});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const FeatureList = styled.div`
  margin: 20px 0;
  text-align: left;
  font-size: 16px;
  line-height: 1.5;

  div {
    position: relative; /* Needed for proper placement of ::after */
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    padding-bottom: 5%; /* Space between the text and the line */
  }

  div::before {
    content: "∞";
    color: ${({ theme }) => theme.color};
    margin-right: 10px; /* Space between "∞" and the text */
  }

  div::after {
    content: "";
    position: absolute;
    left: 20px; /* Start the line after the "∞" */
    right: 0; /* Extend the line beyond the text */
    bottom: 0;
    height: 1px; /* Thickness of the line */
    background-color: ${({ theme }) => theme.color}; /* Line color */
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 30%;
`;

const Button = styled.button`
  width: 70%; /* Button width */
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.color};
  background-color: #1c0019;
  border: none;
  border-radius: 12px;
  cursor: pointer;

  &:hover {
    background-color: #5a3e5b;
  }
`;

const ImageButton = styled.div`
  width: 100%;
  height: auto;
  cursor: pointer;
  margin-top: 10px;

  img {
    width: 100%;
    height: auto;
    display: block;
  }

  &:hover {
    opacity: 0.9; /* Optional hover effect */
  }
`;
const MainText = styled.h3`
  display: flex;
  justify-content: center;
  font-size:22px;
  margin-bottom:30px;
`;
//        <ButtonContainer>
//<Button>Попробовать</Button>
//</ButtonContainer>

const PaymentInfoPage = () => {
  const handlePayment = async (tariffName, amount) => {
    const userId = "5"; // Replace with real user ID logic
    try {
      const response = await fetch(
        `http://angel-voice.ru/api/api/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, tariffName, amount }),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при создании платежа");
      }

      const { paymentUrl } = await response.json();
      window.location.href = paymentUrl; // Redirect to YooKassa
    } catch (error) {
      console.error("Ошибка оплаты:", error);
      alert("Не удалось создать платеж. Попробуйте снова.");
    }
  };
  return (
    <Background>
      <Container>
        <Logo />
        <MainText>Тарифы</MainText>
        <ImageButton onClick={() => handlePayment("1 год", "2988.00")}>
          <img src={buttonImage} alt="1 год - 2988 руб" />
        </ImageButton>
        <ImageButton onClick={() => handlePayment("6 месяцев", "1992.00")}>
          <img src={buttonImage2} alt="6 месяцев - 1992 руб" />
        </ImageButton>
        <ImageButton onClick={() => handlePayment("1 месяц", "415.00")}>
          <img src={buttonImage3} alt="1 месяц - 415 руб" />
        </ImageButton>
      </Container>
    </Background>
  );
};

export default PaymentInfoPage;

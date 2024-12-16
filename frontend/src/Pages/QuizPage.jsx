import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 90%;
  max-width: 360px;
  padding: 30px 20px;
  text-align: center;
  color: ${({ theme }) => theme.color};
  border-radius: 20px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.15); /* Светлый полупрозрачный фон */
  backdrop-filter: blur(15px); /* Размытие фона */
  -webkit-backdrop-filter: blur(15px); /* Для Safari */
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between; /* Разделяем элементы */
  align-items: center; /* Выравниваем элементы по вертикали */
  padding: 2% 0 50% 0;
`;

const Title = styled.h2`
  font-size: 100%;
  color: ${({ theme }) => theme.color};
  font-weight: 550; /* Жирный текст для заголовка */
`;

const Step = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.color};
  font-weight: 400; /* Легкий текст для шага */
  margin: 0; /* Убираем стандартные отступы */
`;
const Label = styled.label`
  font-size: 110%;
  color: ${({ theme }) => theme.color};
  display: block;
  margin-bottom: 7%;
  font-weight: 550;
`;

const Input = styled.input`
  width: 95%;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 20px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: ${({ theme }) => theme.color};
  font-size: 16px;
  font-weight: 100;

  &::placeholder {
    color: ${({ theme }) => theme.color};
    font-weight: 100;
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.3); /* Более светлый фон при фокусе */
  }
`;

const Button = styled.button`
  padding: 15px;
  width: 70%;
  border: none;
  border-radius: 15px;
  background: #1C0019;
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.color};
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;
  margin: 25% 0 10% 0;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 15px 0;

  label {
    font-size: 16px;
    color: ${({ theme }) => theme.color};
    margin: 5px 0;
  }

  input {
    margin-right: 10px;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 15px 0;

  label {
    font-size: 16px;
    color: ${({ theme }) => theme.color};
    margin: 5px 0;
  }

  input {
    margin-right: 10px;
  }
`;

// Основной компонент
const QuizPage = () => {
  const [step, setStep] = useState(1);
  const [occupation, setOccupation] = useState("");
  const [goals, setGoals] = useState([]);
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const navigate = useNavigate();
  const handleNext = async () => {
    if (step < 6) {
      setStep(step + 1);
    } else {

      const telegramData = window.Telegram.WebApp.initDataUnsafe?.user || {};
      const telegramUsername = telegramData.username || "unknown_user";

      // Данные для отправки
      const requestData = {
        username:telegramUsername,
        firstName: name,
        dayofbirth: birthdate,
        gender: gender,
        maritalstatus: relationshipStatus,
        whatisjob: occupation,
        yourobjective: goals,
        star: 0,
        subscription: false,
      };
  

      console.log("Data being sent to backend:", requestData);
      
      try {
        const response = await fetch("https://angel-voice.ru/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Ошибка при отправке данных:", errorData.error);
          alert("Не удалось завершить регистрацию. Попробуйте снова.");
        } else {
          const data = await response.json();
          console.log("Данные успешно отправлены:", data);
          alert("Регистрация завершена!");
          navigate("/profile");
        }
      } catch (error) {
        console.error("Ошибка при отправке данных:", error.message);
        alert("Произошла ошибка. Попробуйте снова.");
      }
    }
  };
  
  const handleGoalChange = (goal) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter((g) => g !== goal));
    } else {
      setGoals([...goals, goal]);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Регистрация</Title>
        <Step>шаг {step} из 6</Step>
      </Header>
      {step === 1 && (
        <>
          <Label>Введите имя</Label>
          <Input
            type="text"
            placeholder="Введите имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </>
      )}
      {step === 2 && (
        <>
          <Label>Ваша дата рождения</Label>
          <Input
            type="text"
            placeholder="00.00.0000"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
          />
        </>
      )}
      {step === 3 && (
        <>
          <Label>Ваш пол</Label>
          <RadioGroup>
            <label>
              <input
                type="radio"
                value="1"
                checked={gender === "Мужской"}
                onChange={(e) => setGender(e.target.value)}
              />
              Мужской
            </label>
            <label>
              <input
                type="radio"
                value="Женский"
                checked={gender === "Женский"}
                onChange={(e) => setGender(e.target.value)}
              />
              Женский
            </label>
          </RadioGroup>
        </>
      )}
      {step === 4 && (
        <>
          <Label>Семейное положение</Label>
          <RadioGroup>
            <label>
              <input
                type="radio"
                value="Холост"
                checked={relationshipStatus === "Холост"}
                onChange={(e) => setRelationshipStatus(e.target.value)}
              />
              Холост
            </label>
            <label>
              <input
                type="radio"
                value="Женат / замужем"
                checked={relationshipStatus === "Женат / замужем"}
                onChange={(e) => setRelationshipStatus(e.target.value)}
              />
              Женат / замужем
            </label>
            <label>
              <input
                type="radio"
                value="В отношениях"
                checked={relationshipStatus === "В отношениях"}
                onChange={(e) => setRelationshipStatus(e.target.value)}
              />
              В отношениях
            </label>
          </RadioGroup>
        </>
      )}
      {step === 5 && (
        <>
          <Label>Чем вы занимаетесь?</Label>
          <RadioGroup>
            {[
              "Учусь",
              "Предприниматель",
              "В поиске работы",
              "Фрилансер",
              "Сотрудник в найме",
              "Домохозяин / домохозяйка",
            ].map((item) => (
              <label key={item}>
                <input
                  type="radio"
                  value={item}
                  checked={occupation === item}
                  onChange={(e) => setOccupation(e.target.value)}
                />
                {item}
              </label>
            ))}
          </RadioGroup>
        </>
      )}
      {step === 6 && (
        <>
          <Label>Укажите ваши цели</Label>
          <CheckboxGroup>
            {[
              "Убрать стресс / тревогу",
              "Улучшить сон",
              "Улучшить отношения",
              "Понять себя",
              "Саморазвитие",
              "Достижение целей",
            ].map((goal) => (
              <label key={goal}>
                <input
                  type="checkbox"
                  value={goal}
                  checked={goals.includes(goal)}
                  onChange={() => handleGoalChange(goal)}
                />
                {goal}
              </label>
            ))}
          </CheckboxGroup>
        </>
      )}
      <Button onClick={handleNext}>Далее</Button>
    </Container>
  );
};

export default QuizPage;

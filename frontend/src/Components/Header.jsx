import React from "react";
import styled from "styled-components";
import { FiHeart, FiShare2, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background: rgba(0, 0, 0, 0.45);
    border-radius: 30px;
    width: 100%;
    margin: 0 auto;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  `;

  const IconGroup = styled.div`
    display: flex;
    gap: 15px; /* Расстояние между иконками */
  `;

  const IconButton = styled.button`
    background: none;
    border: none;
    color: #fff;
    font-size: 24px;
    cursor: pointer;
    &:hover {
      color: #f4a261;
    }

    &:focus {
      outline: none;
    }
  `;

  return (
    <Header>
      <IconButton onClick={handleBackClick}>
        <FiArrowLeft /> {/* Первая кнопка слева */}
      </IconButton>
      <IconGroup>
        <IconButton>
          <FiHeart /> {/* Первая кнопка в группе справа */}
        </IconButton>
        <IconButton>
          <FiShare2 /> {/* Вторая кнопка в группе справа */}
        </IconButton>
      </IconGroup>
    </Header>
  );
};

export default Header;

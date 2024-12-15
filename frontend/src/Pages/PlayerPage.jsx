import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { FaPlay, FaPause, FaRedo, FaUndo } from "react-icons/fa";
import Header from "../Components/Header";

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("background-image.jpg") center center / cover no-repeat;
  background-size: cover;
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

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 60% 0 60% 0;
`;

const Avatar = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 15px;
  border: 3px solid #fff;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileName = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const AudioControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const TimeBar = styled.input`
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 3px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
  }
`;

const TimeDisplay = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 5px;
`;

const PlayerButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  color: ${({ theme }) => theme.color};
  font-size: 20px;
  cursor: pointer;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    color: #f4a261;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
  }
`;
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* Darker background */
  backdrop-filter: blur(10px); /* Slight blur for the background */
  -webkit-backdrop-filter: blur(10px); /* Safari compatibility */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: #1c0019; /* Match the dark purple color */
  color: ${({ theme }) => theme.color};
  padding: 30px 20px;
  border-radius: 16px;
  width: 90%;
  max-width: 360px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15px;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
`;

const ModalText = styled.p`
  font-size: 85%;
  margin: 0;
  white-space: nowrap;
  margin-bottom: 5%;
`;

const ModalButton = styled.button`
  background: #fff;
  color: #000;
  width: 60%;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #eee; /* Lighter hover effect */
  }
`;
const PlaybackControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-top: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

const Modal = ({ onClose }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalTitle>Отлично!</ModalTitle>
        <ModalText>Вы завершили занятие «Учимся расслабляться»</ModalText>
        <ButtonContainer>
          <ModalButton onClick={onClose}>Следующий урок</ModalButton>
        </ButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};
const PlayerPage = () => {
  const [audioData, setAudioData] = useState(null); // Состояние для данных аудио
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    const fetchAudioData = async () => {
      try {
        const response = await fetch(`http://angel-voice.ru/api/api/audio_players/2`); // ID = 1
        if (!response.ok) {
          throw new Error("Ошибка загрузки данных аудио");
        }
        const data = await response.json();
        setAudioData(data); // Устанавливаем данные аудио
      } catch (error) {
        console.error("Ошибка:", error.message);
      }
    };

    fetchAudioData();
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleAudioEnd = () => {
    setIsModalOpen(true); // Открыть модальное окно по завершении аудио
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };


  if (!audioData) {
    return (
      <Background>
        <Container>
          <Header />
          <ProfileName>Загрузка аудио...</ProfileName>
        </Container>
      </Background>
    );
  }

  return (
    <Background>
      <Container>
        <Header />
        <Profile>
          <Avatar>
            <AvatarImage
              src={audioData.profile_image || "https://via.placeholder.com/90"}
              alt="Profile"
            />
          </Avatar>
          <ProfileName>{audioData.title || "Название отсутствует"}</ProfileName>
        </Profile>
        <AudioControls>
          <TimeBar
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
          />
          <TimeDisplay>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </TimeDisplay>

          <PlaybackControls>
            <PlayerButton onClick={() => (audioRef.current.currentTime -= 15)}>
              <FaUndo />
            </PlayerButton>
            <PlayerButton onClick={togglePlay}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </PlayerButton>
            <PlayerButton onClick={() => (audioRef.current.currentTime += 15)}>
              <FaRedo />
            </PlayerButton>
          </PlaybackControls>
        </AudioControls>
        <audio
          ref={audioRef}
          src={audioData.audio_link || ""}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleAudioEnd}
        />
      </Container>
      {isModalOpen && <Modal onClose={handleCloseModal} />}
    </Background>
  );
};

export default PlayerPage;

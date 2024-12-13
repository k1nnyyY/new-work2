import lightBackground from './assets/1103_beach-sea-sunset_1640x2360.jpg';
import darkBackground from './assets/winter.jpeg';

export const lightTheme = {
  background: `url(${lightBackground})`,
  backgroundSize: "cover",
  color: "#000",
  inputBackground: "rgba(255, 255, 255, 0.8)",
  buttonBackground: "#000",
  buttonColor: "#FFF",
  isLightTheme: true,
};

export const darkTheme = {
  background: `url(${darkBackground})`,
  backgroundSize: "cover",
  color: "#FFF",
  inputBackground: "rgba(0, 0, 0, 0.8)",
  buttonBackground: "#FFF",
  buttonColor: "#000",
  isLightTheme: false,
};


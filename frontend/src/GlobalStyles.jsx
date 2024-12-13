import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Noto Sans', sans-serif;
    background: ${({ theme }) => theme.background};
    background-size: cover; /* Сохраняем пропорции фона */
    background-position: center;
    color: ${({ theme }) => theme.color};
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #root {
    height: 100%;
    width: 100%;
  }
`;

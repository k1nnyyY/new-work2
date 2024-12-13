import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faMoon, faHeart, faFolder, faCircle } from "@fortawesome/free-regular-svg-icons";

const Footer = () => {
  const Footer = styled.div`
    width: 100%;
    max-width: 360px;
    position: fixed;
    height:7%;
    bottom: 0;
    left: 50%;
    border-radius: 20px 20px 0 0;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 10px 0;
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  `;

  const FooterIcon = styled.div`
    font-size: 24px;
    color: ${({ theme }) => theme.color};
    cursor: pointer;

    &:hover {
      color: rgba(255, 255, 255, 0.8);
    }
  `;

  return (
    <Footer>
      <FooterIcon>
        <FontAwesomeIcon icon={faUser} />
      </FooterIcon>
      <FooterIcon>
        <FontAwesomeIcon icon={faFolder} />
      </FooterIcon>
      <FooterIcon>
        <FontAwesomeIcon icon={faMoon} />
      </FooterIcon>
      <FooterIcon>
        <FontAwesomeIcon icon={faHeart} />
      </FooterIcon>
      <FooterIcon>
        <FontAwesomeIcon icon={faCircle} />
      </FooterIcon>
    </Footer>
  );
};

export default Footer;

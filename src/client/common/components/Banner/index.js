import React from "react";
import styled from "styled-components";
import { whiteSmoke, fadedBlack, red, desktopWidth } from "@edulastic/colors";

export const Banner = ({ text, buttonText, onButtonClick, showButton }) => (
  <BannerContainer>
    <BannerText>{text}</BannerText>
    {showButton && <Button onClick={onButtonClick}>{buttonText}</Button>}
  </BannerContainer>
);

const Button = styled.button`
  background-color: ${whiteSmoke};
  border: none;
  border-radius: 2px;
  cursor: pointer;
  padding: 5px 10px;
  color: ${fadedBlack};
  font-weight: bold;
  margin-right: 30px;
  @media (max-width: ${desktopWidth}) {
    margin-right: 20px;
  }
`;

const BannerContainer = styled.div`
  height: 35px;
  background-color: ${red};
  color: white;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  align-items: center;
`;

const BannerText = styled.div`
  font-weight: bold;
  text-align: center;
  flex: 1;
`;

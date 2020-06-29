import { mediumDesktopExactWidth, mobileWidthLarge, white, themeColorBlue } from "@edulastic/colors";
import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  margin-left: 5px;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  pointer-events: ${props => (props.disabled ? "none" : "all")};
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  transition: opacity 300ms ease-in-out;

  @media (min-width: ${mediumDesktopExactWidth}) {
    margin-left: 10px;
  }
`;

export const ItemsAmount = styled.span`
  width: 22px;
  height: 22px;
  margin-left: 17px;
  text-align: center;
  border-radius: 50%;
  background: ${themeColorBlue};
  color: ${white};
  font-size: 14px;
  line-height: 22px;
  font-weight: bold;
  @media (max-width: ${mobileWidthLarge}) {
    display: block;
    position: absolute;
    top: -10px;
    right: -10px;
    margin: 0px;
    background: #42d184;
  }
`;

import styled from "styled-components";
import { Button } from "antd";

import { white, mobileWidth, themeColor, mediumDesktopWidth, mobileWidthLarge } from "@edulastic/colors";

import iconCart from "./shopping-cart.svg";

export const Container = styled.div`
  position: relative;
  margin-left: 20px;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  pointer-events: ${props => (props.disabled ? "none" : "all")};
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  transition: opacity 300ms ease-in-out;

  @media (max-width: ${mediumDesktopWidth}) {
    margin-left: 10px;
  }
  @media (max-width: ${mobileWidth}) {
    margin-left: 5px;
  }
`;

export const CartButtonWrapper = styled(Button)`
  height: 44px;
  width: 140px;
  padding-left: 40px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${white} url(${iconCart}) -20px center no-repeat;
  background-size: 60% 50%;
  color: ${themeColor};
  border-color: ${themeColor};

  &:hover,
  &:focus,
  &:active {
    background: ${white} url(${iconCart});
    color: ${themeColor};
    border-color: ${themeColor};
  }

  @media (max-width: ${mediumDesktopWidth}) {
    height: 36px;
  }

  @media (max-width: ${mobileWidthLarge}) {
    height: 40px;
    width: 45px;
    border-radius: 3px;
    font-size: 0;
    background-position: center;
    padding: 0;
  }
`;

export const ItemsAmount = styled.span`
  display: block;
  position: absolute;
  top: -10px;
  right: -10px;
  width: 22px;
  height: 21px;
  text-align: center;
  border-radius: 10px;
  background: #42d184;
  color: ${white};
  font-size: 14px;
  line-height: 22px;
  font-weight: bold;
`;

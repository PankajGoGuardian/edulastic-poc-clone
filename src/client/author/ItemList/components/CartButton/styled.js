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
  height: 45px;
  padding: 0px 10px 0px 34px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${themeColor};
  border-color: ${themeColor};
  &:hover,
  &:focus,
  &:active {
    color: ${themeColor};
    border-color: ${themeColor};
  }

  @media (max-width: ${mediumDesktopWidth}) {
    height: 36px;
  }

  @media (max-width: ${mobileWidthLarge}) {
    background: ${white} url(${iconCart}) center no-repeat;
    background-size: 60% 50%;
    background-position: center;
    height: 40px;
    width: 45px;
    border-radius: 3px;
    font-size: 0;
    padding: 0;
    padding: 0px;
  }
`;

export const ItemsAmount = styled.span`
  width: 22px;
  height: 22px;
  margin-left: 17px;
  text-align: center;
  border-radius: 50%;
  background: ${themeColor};
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

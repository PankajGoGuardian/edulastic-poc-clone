import styled from "styled-components";
import { Button } from "antd";

import { white, green, mobileWidth, desktopWidth } from "@edulastic/colors";

import iconCart from "./shopping-cart.svg";

export const Container = styled.div`
  position: relative;
  margin-left: 20px;

  @media (max-width: ${mobileWidth}) {
    margin-left: 5px;
  }

  opacity: ${props => (props.disabled ? 0.5 : 1)};
  transition: opacity 300ms ease-in-out;
  pointer-events: ${props => (props.disabled ? "none" : "all")};
  cursor: ${props => (props.disabled ? "default" : "pointer")};
`;

export const CartButtonWrapper = styled(Button)`
  height: 44px;
  width: 160px;
  padding-left: 60px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  background: url(${iconCart}) -20% center no-repeat, ${white};
  background-size: 60% 50%;
  color: #00ad50;
  border-color: #00ad50;

  &:hover,
  &:focus,
  &:active {
    background: url(${iconCart}) -20% center no-repeat, ${white};
    background-size: 60% 50%;
    color: #00ad50;
    border-color: #00ad50;
  }

  @media (max-width: ${desktopWidth}) {
    background-size: 50%;
  }

  @media (max-width: ${mobileWidth}) {
    height: 40px;
    width: 45px;
    border-radius: 3px;
    background-size: 40%;
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

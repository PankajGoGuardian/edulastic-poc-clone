import styled from "styled-components";
import { Button } from "antd";

import { white, secondaryTextColor, mobileWidth, desktopWidth } from "@edulastic/colors";

import iconCart from "./shopping-cart.svg";

export const Container = styled.div`
  position: relative;
  margin-left: 20px;

  @media (max-width: ${mobileWidth}) {
    margin-left: 5px;
  }
`;

export const CartButtonWrapper = styled(Button)`
  height: 44px;
  width: 44px;
  background: url(${iconCart}) center center no-repeat, ${white};
  background-size: 60%;

  &:hover,
  &:focus,
  &:active {
    background: url(${iconCart}) center center no-repeat, ${white};
    background-size: 60%;
  }

  @media (max-width: ${desktopWidth}) {
    background-size: 50%;
  }

  @media (max-width: ${mobileWidth}) {
    height: 40px;
    width: 45px;
    border-radius: 3px;
    background-size: 40%;
  }
`;

export const ItemsAmount = styled.span`
  display: block;
  position: absolute;
  top: 6px;
  right: 4px;
  width: 16px;
  height: 16px;
  text-align: center;
  border: 2px solid ${secondaryTextColor};
  border-radius: 10px;
  background: ${white};
  color: ${secondaryTextColor};
  font-size: 9px;
  line-height: 13px;
  font-weight: bold;
`;

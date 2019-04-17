import { white, newBlue, mobileWidth, tabletWidth } from "@edulastic/colors";
import styled from "styled-components";
import { IconMenuOpenClose } from "@edulastic/icons";

export const Container = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 70px;
  background: ${newBlue};
  padding: 0px 45px;
  height: 96px;
  z-index: 10;

  @media (max-width: ${mobileWidth}) {
    margin-bottom: 30px;
    padding: 0 26px;
  }
`;

export const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  line-height: 1.36;
  color: ${white};

  @media (max-width: ${mobileWidth}) {
    padding-left: 0;
    margin-top: -5px;
  }
`;

export const MenuIcon = styled(IconMenuOpenClose)`
  display: none;
  fill: ${white};
  width: 22.3px;
  margin-top: 1px;
  margin-right: 25px !important;
  pointer-events: all;

  @media (max-width: ${tabletWidth}) {
    display: block;
  }
`;

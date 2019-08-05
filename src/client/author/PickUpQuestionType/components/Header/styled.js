import { white, mobileWidth, tabletWidth, smallDesktopWidth, mediumDesktopWidth } from "@edulastic/colors";
import styled from "styled-components";
import { IconMenuOpenClose } from "@edulastic/icons";

export const Container = styled.div`
  position: fixed;
  top: 0px;
  left: 100px;
  right: 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme.header.headerBgColor};
  padding: 0px 30px;
  height: 96px;
  z-index: 10;

  @media only screen and (min-width: ${smallDesktopWidth}) and (max-width: ${mediumDesktopWidth}) {
    height: 60px;
  }
  @media (max-width: ${mobileWidth}) {
    margin-bottom: 30px;
    padding: 25px 26px 0;
    left: 0px;
  }
`;

export const Title = styled.div`
  font-size: ${props => props.theme.header.headerTitleFontSize};
  color: ${props => props.theme.header.headerTitleTextColor};
  font-weight: bold;
  line-height: 1.36;

  @media only screen and (min-width: ${smallDesktopWidth}) and (max-width: ${mediumDesktopWidth}) {
    font-size: 18px;
  }
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

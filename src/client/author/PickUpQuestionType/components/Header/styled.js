import { tabletWidth, white, mobileWidth, mediumDesktopWidth } from "@edulastic/colors";
import styled from "styled-components";
import { IconMenuOpenClose } from "@edulastic/icons";

export const Title = styled.div`
  font-size: ${props => props.theme.header.headerTitleFontSize};
  color: ${props => props.theme.header.headerTitleTextColor};
  font-weight: bold;
  line-height: 1.36;

  @media (max-width: ${mediumDesktopWidth}) {
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
  margin-right: 25px;
  pointer-events: all;

  @media (max-width: ${tabletWidth}) {
    display: block;
    margin-right: 15px;
  }
`;

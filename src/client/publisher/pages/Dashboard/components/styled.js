import styled from "styled-components";
import { Button } from "antd";
import { black, fadedBlack, mediumDesktopWidth, mediumDesktopExactWidth } from "@edulastic/colors";

export const StyledH4 = styled.h4`
  font-weight: 700;
  color: ${fadedBlack};
  font-size: 18px;
  margin: 0px 0px 10px;
`;

export const StyledH3 = styled.h3`
  font-weight: 700;
  color: ${fadedBlack};
  font-size: 20px;
  margin: 0px 0px 10px;
`;

export const StyledH2 = styled.h2`
  font-weight: 700;
  color: ${fadedBlack};
  font-size: 25px;
  margin: 0px 0px 10px;
`;

export const ItemContent = styled.div`
  padding: 10px 20px;

  @media (max-width: ${mediumDesktopWidth}) {
    padding: 10px;
  }

  @media (max-width: ${mediumDesktopExactWidth}) {
    padding: 10px;
  }

  p {
    //   copied from pick question type question font css
    font-size: 12px;
    font-weight: 600;
    color: ${black};
    display: flex;
    align-items: center;
    padding-left: 21px;
    text-transform: uppercase;
  }
`;

export const StyledPrimaryGreenButton = styled(Button)`
  border: none;
  width: auto;
  background: ${({ theme }) => theme.default.headerRightButtonIconColor};
  color: ${({ theme }) => theme.default.headerRightButtonBgColor};
  height: ${props => props.theme.default.headerToolbarButtonWidth};
  font-size: 12px;
  font-weight: 600;
  margin: 0 5px;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  svg {
    height: ${props => props.theme.default.headerRightButtonFontIconHeight};
    fill: ${({ theme }) => theme.default.headerRightButtonBgColor};
  }

  &:hover,
  &:focus {
    background: ${({ theme }) => theme.default.headerRightButtonIconColor};
    color: ${({ theme }) => theme.default.headerRightButtonBgColor};
  }
`;

export const StyledPrimaryWhiteButton = styled(StyledPrimaryGreenButton)`
  background: ${({ theme }) => theme.default.headerRightButtonBgColor};
  color: ${({ theme }) => theme.default.headerRightButtonIconColor};

  svg {
    height: ${props => props.theme.default.headerRightButtonFontIconHeight};
    fill: ${({ theme }) => theme.default.headerRightButtonIconColor};
  }

  &:hover,
  &:focus {
    background: ${({ theme }) => theme.default.headerRightButtonBgColor};
    color: ${({ theme }) => theme.default.headerRightButtonIconColor};
  }
`;

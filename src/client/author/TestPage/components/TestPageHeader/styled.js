import styled from "styled-components";
import { FlexContainer, EduButton } from "@edulastic/common";

import {
  themeColor,
  white,
  textColor,
  draftColor,
  publishedColor,
  mediumDesktopWidth,
  desktopWidth,
  mobileWidthLarge
} from "@edulastic/colors";
import { IconShare } from "@edulastic/icons";

import { Status } from "../../../AssessmentPage/components/Header/styled";

export const MobileHeader = styled.div`
  height: auto;
  display: flex;
  align-items: center;
  background: ${themeColor};
  padding: 15px 20px;
`;

export const MainContainer = styled(FlexContainer)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const RightWrapper = styled(FlexContainer)``;

export const Title = styled.h1`
  font-size: ${props => props.theme.header.headerTitleFontSize};
  color: ${props => props.theme.header.headerTitleTextColor};
  font-weight: bold;
  line-height: normal
  margin: 0px;
  max-width: 250px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  word-break: break-all;

  @media screen and (max-width: ${mediumDesktopWidth}) {
    font-size: 18px;
    max-width: 170px;
  }
  @media screen and (max-width: ${mobileWidthLarge}) {
    max-width: 140px;
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 20%;
`;

export const RightFlexContainer = styled(FlexContainer)`
  flex-basis: 30%;
`;

export const AssignButton = styled(EduButton)`
  width: 120px;

  @media (max-width: ${desktopWidth}) {
    width: auto;
  }
`;

export const ShareIcon = styled(IconShare)`
  width: 16px;
  height: 16px;
  fill: ${themeColor};
`;

export const MenuIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const TestStatus = styled(Status)`
  margin-top: 0;
  color: ${props => (props.mode === "embedded" ? white : textColor)};
  background: ${props => (props.mode === "embedded" ? textColor : white)};
  font-weight: 600;
  margin-left: 0px;
  &.draft {
    background: ${draftColor};
    color: white;
  }
  &.published {
    background: ${publishedColor};
    color: white;
  }
`;

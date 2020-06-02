import styled from "styled-components";
import { FlexContainer, EduButton } from "@edulastic/common";

import {
  themeColor,
  white,
  textColor,
  draftColor,
  publishedColor,
  desktopWidth,
  mobileWidthLarge,
  tabletWidth
} from "@edulastic/colors";
import { IconShare } from "@edulastic/icons";

import { Status } from "../../../AssessmentPage/components/Header/styled";

export const RightFlexContainer = styled(FlexContainer)`
  /* flex-basis: 30%; */
`;

export const AssignButton = styled(EduButton)`
  width: 110px;

  @media (max-width: ${desktopWidth}) {
    width: auto;
  }
`;

export const SaveBtn = styled(EduButton)`
  width: 80px;

  @media screen and (max-width: ${mobileWidthLarge}) {
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
  justify-content: flex-start;
  align-items: center;
  flex-basis: 50%;
  margin: 0px;
`;

export const RightWrapper = styled(FlexContainer)`
  flex-basis: 50%;
  justify-content: flex-end;
  margin: 0px;

  @media (max-width: ${tabletWidth}) {
    flex-basis: auto;
  }
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

export const MobileHeaderFilterIcon = styled.div`
  display: none;
  button {
    position: relative;
    margin: 0px;
    box-shadow: none;
    width: 45px;
    border-radius: 4px;
    border-color: ${themeColor};
    padding: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      height: 25px;
      width: 25px;
    }

    @media (max-width: ${desktopWidth}) {
      height: 40px;
    }
  }

  @media (max-width: ${desktopWidth}) {
    display: block;
  }
`;

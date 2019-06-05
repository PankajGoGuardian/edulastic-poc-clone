import styled from "styled-components";
import { Icon } from "antd";

import {
  mainBlueColor,
  white,
  darkBlueSecondary,
  tabletWidth,
  textColor,
  draftColor,
  publishedColor
} from "@edulastic/colors";
import { IconShare } from "@edulastic/icons";

import { Status } from "../../../AssessmentPage/components/Header/styled";

export const Container = styled.div`
  height: 130px;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: ${darkBlueSecondary};
  align-items: center;
`;

export const Title = styled.div`
  font-size: 22px;
  margin: 0;
  word-break: break-all;
  font-weight: bold;
  max-width: 300px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: normal;
  color: ${white};
  align-items: center;
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-basis: 450px;
`;

export const ShareIcon = styled(IconShare)`
  width: 16px;
  height: 16px;
  fill: ${mainBlueColor};
`;

export const MenuIcon = styled(Icon)`
  display: none;
  @media (max-width: ${tabletWidth}) {
    display: block;
    color: #fff;
    font-size: 20px;
    margin-right: 8px;
  }
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
  &.draft {
    background: ${draftColor};
    color: white;
  }
  &.published {
    background: ${publishedColor};
    color: white;
  }
`;

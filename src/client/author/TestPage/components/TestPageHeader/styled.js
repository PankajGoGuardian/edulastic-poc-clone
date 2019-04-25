import styled from "styled-components";
import { Icon } from "antd";

import { mainBlueColor, white, darkBlueSecondary, tabletWidth, textColor } from "@edulastic/colors";
import { IconShare } from "@edulastic/icons";

import { Status } from "../../../AssessmentPage/components/Header/styled";

export const Container = styled.div`
  height: 130px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  background: ${darkBlueSecondary};
  align-items: center;
`;

export const Title = styled.div`
  font-size: 22px;
  margin: 0;
  word-break: break-all;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: normal;
  color: ${white};
  display: flex;
  align-items: center;
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
  color: ${textColor};
  background: ${white};
`;

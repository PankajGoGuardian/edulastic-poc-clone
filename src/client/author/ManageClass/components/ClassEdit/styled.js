import styled, { css } from "styled-components";
import { white, themeColor, title, mediumDesktopExactWidth } from "@edulastic/colors";
import { Button, Col, Row } from "antd";
import { MainContentWrapper } from "@edulastic/common";

export const StyledFlexContainer = styled(Row)``;

const ShareButtonStyle = css`
  font-weight: 600;
  font-size: 14px;
  border-radius: 25px;
  height: 36px;
  display: flex;

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: 40px;
  }
`;

export const SaveClassBtn = styled(Button)`
  ${ShareButtonStyle}
  padding: 5px 20px;
  color: ${white};
  background: ${themeColor};
  border-color: ${themeColor};
  margin-left: 20px;
  &:hover,
  &:focus {
    color: ${white};
    background: ${themeColor};
  }
`;

export const CancelClassBtn = styled(Button)`
  ${ShareButtonStyle}
  padding: 5px 20px;
  color: ${themeColor};
  background: ${white};
  border-color: ${themeColor};
  &:hover,
  &:focus {
    color: ${themeColor};
    background: ${white};
  }
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: right;
`;

// main content

export const Container = styled(MainContentWrapper)`
  .ant-form-item-control {
    line-height: normal;
  }
`;

export const FormTitle = styled.div`
  color: ${title};
  font-size: ${props => props.theme.subtitleFontSize};
  line-height: 1;
  margin-bottom: 25px;
  font-weight: bold;
  text-align: left;
  display: flex;
`;

export const MainContainer = styled.div``;

export const LeftContainer = styled(Col)``;

export const RightContainer = styled(Col)``;

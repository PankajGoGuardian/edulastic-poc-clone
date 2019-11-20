import styled, { css } from "styled-components";
import { white, red, mediumDesktopWidth, themeColor, title, themeColorLight } from "@edulastic/colors";
import { Button, Col, Row } from "antd";
import { IconManage } from "@edulastic/icons";

export const StyledFlexContainer = styled(Row)`
  .ant-select-selection__placeholder {
    margin-left: 6px;
  }
`;

export const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  line-height: 1.36;
  text-align: left;
  display: flex;
  color: ${white};

  @media (max-width: ${mediumDesktopWidth}) {
    font-size: 18px;
  }
`;

export const IconManageClass = styled(IconManage)`
  margin-top: 5px;
  margin-right: 10px;
`;

const ShareButtonStyle = css`
  font-weight: 600;
  font-size: 14px;
  border-radius: 25px;
  height: 40px;
  display: flex;

  @media (max-width: ${mediumDesktopWidth}) {
    height: 36px;
  }
`;

export const SaveClassBtn = styled(Button)`
  ${ShareButtonStyle}
  padding: 5px 20px;
  border: none;
  color: ${white};
  background: ${themeColorLight};
  margin-left: 20px;
  &:hover,
  &:focus {
    color: ${white};
    background: ${themeColorLight};
  }
`;

export const CancelClassBtn = styled(Button)`
  ${ShareButtonStyle}
  padding: 5px 20px;
  border: none;
  color: ${themeColorLight};
  background: ${white};
  &:hover,
  &:focus {
    color: ${white};
    background: ${themeColorLight};
  }
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: right;
`;

// main content

export const Container = styled.div`
  padding: 30px;

  .ant-form-item-control {
    line-height: normal;
    .ant-input,
    .ant-select-selection {
      min-height: 40px;
      background: #f8f8f8;
      .ant-select-selection__rendered {
        line-height: 40px;
      }
    }
    .ant-calendar-picker-icon {
      color: ${themeColor};
    }
  }
`;

export const FormTitle = styled(Title)`
  color: ${title};
  font-size: ${props => props.theme.subtitleFontSize};
  line-height: 1;
  margin-bottom: 25px;
`;

export const MainContainer = styled.div``;

export const LeftContainer = styled(Col)``;

export const RightContainer = styled(Col)``;

export const StandardsValidationMSG = styled.div`
  color: ${red};
`;

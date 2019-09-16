import styled from "styled-components";
import { white, whiteSmoke, numBtnColors, themeColor, title, titleColor, lightGreySecondary } from "@edulastic/colors";
import { Input, Col, Modal, Button } from "antd";

export const LightGreenSpan = styled.span`
  color: ${themeColor};
  font-weight: bold;
`;

export const StyledCol = styled(Col)`
  justify-content: center;
  display: flex;
`;

export const StyledInput = styled(Input)`
  margin: 0 auto;
  width: 100%;
  text-align: center;
  margin-top: 20px;
`;

export const StyledP = styled.p`
  margin-bottom: 5px;
`;

export const StyledModal = styled(Modal)`
  min-width: ${props => (props.modalWidth ? props.modalWidth : "600px")};
  top: ${props => (props.top ? props.top : "100px")};

  .ant-modal-content {
    background: ${lightGreySecondary};
    padding: 20px;
    .ant-modal-close {
      color: ${title};
    }
    .ant-modal-header {
      padding: 0px 0px 15px;
      background: ${lightGreySecondary};
      border: none;
      .ant-modal-title {
        font-size: 18px;
        color: ${title};
        font-weight: 600;
      }
    }
    .ant-modal-body {
      align-items: center;
      background: ${white};
      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.07);
      border-radius: 4px;
      padding: 60px;
      text-align: ${props => (props.textAlign ? props.textAlign : "center")};
      min-height: ${({ bodyHeight }) => bodyHeight || "180px"};
      p {
        font-size: 16px;
        color: ${titleColor};
      }
      margin-top: ${props => (!props.title ? "30px" : 0)};
    }
    .ant-modal-footer {
      border: none;
      display: flex;
      justify-content: center;
      padding: 15px 0px 0px;
      .ant-btn {
        font-size: 12px;
        padding: 5px 50px;
        border-radius: 4px;
        background: ${themeColor};
        border-color: ${themeColor};
        color: ${white};
        &[disabled],
        &[disabled]:hover,
        &[disabled]:active {
          background-color: grey;
          border-color: grey;
        }
        &.ant-btn-background-ghost {
          color: ${themeColor};
          background: transparent;
          &:hover,
          &:focus {
            color: ${themeColor};
          }
        }
        &:hover,
        &:focus {
          background: ${themeColor};
          border-color: ${themeColor};
          color: ${white};
        }
      }
    }
  }
`;

export const YesButton = styled(Button)`
  color: ${props => (props.disabled ? "rgba(0, 0, 0, 0.25)" : white)} !important;
  background-color: ${props => (props.disabled ? whiteSmoke : themeColor)} !important;
  border-color: ${props => (props.disabled ? numBtnColors.borderColor : themeColor)} !important;
`;

import { Modal } from "antd";
import { white, themeColor, title, titleColor, lightGreySecondary } from "@edulastic/colors";
import styled from "styled-components";

export const ConfirmationModal = styled(Modal)`
  min-width: 600px;
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
      display: ${props => (props.textAlign !== "left" ? "flex" : "block")};
      align-items: center;
      background: ${white};
      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.07);
      border-radius: 4px;
      text-align: ${props => (props.textAlign ? props.textAlign : "center")};
      min-height: 180px;
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
        font-size: 11px;
        padding: 5px 50px;
        border-radius: 4px;
        background: ${themeColor};
        border-color: ${themeColor};
        color: ${white};
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

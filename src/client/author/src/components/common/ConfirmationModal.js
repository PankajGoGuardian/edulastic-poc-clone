import { Modal } from "antd";
import { white, themeColor, title, titleColor, lightGreySecondary, mediumDesktopExactWidth } from "@edulastic/colors";
import styled from "styled-components";

export const ConfirmationModal = styled(Modal)`
  min-width: ${props => (props.modalWidth ? props.modalWidth : "600px")};
  top: ${props => (props.top ? props.top : "100px")};
  .ant-modal-content {
    background: ${lightGreySecondary};
    padding: 20px;
    .ant-modal-close {
      color: ${title};
      svg {
        width: 20px;
        height: 20px;
      }
    }
    .ant-modal-header {
      padding: 0px 0px 25px;
      background: ${lightGreySecondary};
      border: none;
      .ant-modal-title {
        font-size: 16px;
        color: ${title};
        font-weight: 700;
        @media (min-width: ${mediumDesktopExactWidth}) {
          font-size: 22px;
        }
      }
    }
    .ant-modal-body {
      display: ${props => (props.textAlign !== "left" ? "flex" : "block")};
      align-items: center;
      background: ${white};
      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.07);
      border-radius: 4px;
      text-align: ${props => (props.textAlign ? props.textAlign : "center")};
      min-height: ${({ bodyHeight }) => bodyHeight || "180px"};
      p {
        font-size: 14px;
        color: ${titleColor};
        font-weight: 600;
        width: 100%;
      }
      margin-top: ${props => (!props.title ? "30px" : 0)};
    }
    .ant-modal-footer {
      border: none;
      display: flex;
      justify-content: center;
      padding: 25px 16px 0px;
      .ant-btn {
        font-size: 11px;
        padding: 19px 50px;
        border-radius: 4px;
        line-height: 0;
        text-transform: uppercase;
        &[disabled],
        &[disabled]:hover,
        &[disabled]:active {
          background-color: grey;
          border-color: grey;
        }
        &.ant-btn-loading {
          padding: 19px 50px;
          .anticon-loading {
            position: absolute;
            top: 14px;
            left: 40px;
          }
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

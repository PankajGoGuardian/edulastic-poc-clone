
import { CustomModalStyled } from "@edulastic/common";
import { titleColor } from "@edulastic/colors";
import styled from "styled-components";

export const ConfirmationModal = styled(CustomModalStyled)`
  min-width: ${props => (props.modalWidth ? props.modalWidth : "600px")};
  top: ${props => (props.top ? props.top : "100px")};
  .ant-modal-content {
    .ant-modal-body {
      display: ${props => (props.textAlign !== "left" ? "flex" : "block")};
      align-items: center;
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
      padding: 15px 15px 0px;
      .ant-btn {

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
      }
    }
  }
`;

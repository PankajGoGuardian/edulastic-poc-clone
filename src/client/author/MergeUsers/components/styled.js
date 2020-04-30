import styled from "styled-components";

// components
import { Modal } from "antd";

// constants
import { greyThemeDark1, darkGrey2, smallDesktopWidth } from "@edulastic/colors";

export const StyledModal = styled(Modal)`
  min-width: fit-content;
  .ant-modal-content {
    max-width: 80vw;
    width: fit-content;
    border-radius: 10px;
    padding: 30px 45px 45px 50px;
    .ant-modal-close {
      display: none;
    }
    .ant-modal-header {
      padding: 0px;
      margin-bottom: 20px;
      border: none;
      .ant-modal-title {
        > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          span {
            color: ${greyThemeDark1};
            font-size: 22px;
            font-weight: 700;
            line-height: 30px;
          }
        }
        p {
          color: ${darkGrey2};
          font-size: 14px;
          font-weight: 600;
          line-height: 19px;
        }
      }
    }
    .ant-modal-body {
      height: fit-content;
      overflow: scroll;
      border-radius: 10px;
      padding: 0px;
      margin-bottom: 40px;
      .ant-spin {
        padding-top: 65px;
      }
    }
    .ant-modal-footer {
      border: none;
      padding: 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      .ant-btn {
        width: 200px;
        height: 40px;
        border-radius: 4px;
        font-size: ${props => props.theme.linkFontSize};
      }
    }
  }
`;

export const DetailsContainer = styled.div`
  display: inline-flex;
  > div {
    cursor: pointer;
    min-width: 200px;
    margin: 10px 10px;
    span {
      float: right;
    }
  }
  > div:first-child {
    margin-left: 0px;
  }
  > div:last-child {
    margin-right: 0px;
  }
`;

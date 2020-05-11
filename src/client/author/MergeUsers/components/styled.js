import styled from "styled-components";

// components
import { Modal, Table } from "antd";

// constants
import { greyThemeDark1, darkGrey2, smallDesktopWidth, lightGrey11 } from "@edulastic/colors";

export const StyledModal = styled(Modal)`
  min-width: fit-content;
  .ant-modal-content {
    min-width: 70vw;
    max-width: 90vw;
    width: fit-content;
    border-radius: 10px;
    padding: 25px 50px 30px 50px;
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
          margin-bottom: 25px;
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
          margin-bottom: 30px;
        }
      }
    }
    .ant-modal-body {
      border-radius: 10px;
      padding: 0px 20px 0px 5px;
      margin-bottom: 30px;
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
        margin-right: 10px;
        letter-spacing: 0.2px;
        font-size: 11px;
        line-height: 15px;
      }
    }
  }
`;

export const StyledTable = styled(Table)`
  width: 100%;
  .ant-table {
    .ant-table-content {
      height: 365px;
      overflow: auto;
      .ant-table-body {
        min-height: auto;
        table {
          border: none;
          .ant-table-thead {
            tr {
              background: white;
              th {
                border: none;
                background: white;
                padding: 5px 10px 20px 10px;
                .ant-table-column-title {
                  white-space: nowrap;
                  font-size: 12px;
                  line-height: 17px;
                  font-weight: 700;
                  color: ${lightGrey11};
                  text-transform: uppercase;
                }
              }
            }
          }
          .ant-table-tbody {
            border-collapse: collapse;
            tr {
              cursor: pointer;
              td {
                height: 40px;
                padding: 5px 10px;
                font-size: 14px;
                line-height: 19px;
                font-weight: 600;
                color: ${greyThemeDark1};
                .ant-radio {
                  margin-right: 10px;
                }
              }
            }
          }
        }
      }
      .ant-table-placeholder {
        border: none;
      }
    }
  }
`;

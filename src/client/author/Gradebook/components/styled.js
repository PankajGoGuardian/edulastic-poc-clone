import styled from "styled-components";

// components
import { Table } from "antd";
import { Button } from "@edulastic/common";

// constants
import { white, themeColor, lightGrey11, greyThemeDark1 } from "@edulastic/colors";

export const FilterButton = styled(Button)`
  min-width: 35px;
  min-height: 25px;
  padding: 2px;
  padding-top: 5px;
  border-radius: 3px;
  position: fixed;
  z-index: 1;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);
  margin-left: ${props => (props.showFilter ? "240px" : "-23px")};
  background: ${props => (props.showFilter ? themeColor : white)} !important;
  &:focus,
  &:hover {
    outline: unset;
  }
  svg,
  svg:hover {
    fill: ${props => (props.showFilter ? white : themeColor)};
  }
`;

export const TableContainer = styled.div`
  max-height: 100%;
  max-width: ${props => (props.showFilter ? "calc(100% - 220px)" : "100%")};
  padding-left: ${props => (props.showFilter ? "50px" : "0px")};
`;

export const TableFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  justify-content: "space-between";
  li {
    .ant-pagination-item {
      border: none;
    }
    .ant-pagination-options {
      border: none;
    }
  }
`;

export const StyledTableCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  background-color: ${props => props.color || white};
  height: 40px;
  width: 100%;
`;

export const StyledTable = styled(Table)`
  .ant-table {
    .ant-table-content {
      .ant-table-body {
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
              height: 45px;
              td {
                height: 40px;
                padding: 5px 10px;
                font-size: 14px;
                line-height: 19px;
                font-weight: 600;
                color: ${greyThemeDark1};
              }
              td:nth-child(n + 5) {
                padding: 0px;
              }
            }
          }
        }
      }
      .ant-table-placeholder {
        border: none;
      }
      .ant-table-fixed {
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
            height: 45px;
            td {
              height: 40px;
              padding: 5px 10px;
              font-size: 14px;
              line-height: 19px;
              font-weight: 600;
              color: ${greyThemeDark1};
            }
          }
        }
      }
    }
  }
`;

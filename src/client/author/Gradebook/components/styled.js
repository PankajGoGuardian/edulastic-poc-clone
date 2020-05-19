import styled from "styled-components";

// components
import PerfectScrollbar from "react-perfect-scrollbar";
import { Table, Col } from "antd";
import { Button } from "@edulastic/common";
import { IconGraphRightArrow as Arrow } from "@edulastic/icons";

// constants
import { white, themeColor, fadedGrey, lightGrey11, greyThemeDark1 } from "@edulastic/colors";

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

export const ScrollbarContainer = styled(PerfectScrollbar)`
  padding: 0 20px 0 0;
  width: auto;
  height: ${props => props.height}px;
`;

export const TableHeader = styled.div`
  display: flex;
  margin-left: -22px;
`;

export const LeftArrow = styled(Arrow)`
  display: ${props => (props.disabled ? "none" : "block")};
  transform: rotate(180deg);
  position: fixed;
  top: 50%;
  cursor: pointer;
`;

export const RightArrow = styled(Arrow)`
  display: ${props => (props.disabled ? "none" : "block")};
  position: fixed;
  right: 8px;
  top: 50%;
  cursor: pointer;
`;

export const TableContainer = styled.div`
  max-height: 100%;
  max-width: ${props => (props.showFilter ? "calc(100% - 240px)" : "100%")};
  padding-left: ${props => (props.showFilter ? "30px" : "0px")};
`;

export const TableFooter = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-top: 15px;
  justify-content: "space-between";
  li {
    border: none !important;
    box-shadow: 0px 2px 7px #c9d0db80;
  }
`;

export const StyledTableCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  background-color: ${props => props.color};
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
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
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
              max-width: 170px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
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

export const GroupItem = styled(Col)`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: ${props => props.padding};
  svg {
    path {
      fill: ${props => props.isActive && themeColor};
    }
  }
  &:hover,
  &:focus {
    background: ${fadedGrey};
  }
`;

export const GroupItemLabel = styled.span`
  font: ${props => props.fontStyle} Open Sans;
  font-weight: ${props => props.weight || 600};
  padding: ${props => props.padding};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
  max-width: 80%;
  text-transform: uppercase;
  color: ${greyThemeDark1};
`;

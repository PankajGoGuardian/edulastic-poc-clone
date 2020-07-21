import styled from "styled-components";

// components
import PerfectScrollbar from "react-perfect-scrollbar";
import { Table, Col } from "antd";
import { Button } from "@edulastic/common";
import { IconGraphRightArrow as Arrow } from "@edulastic/icons";

// constants
import {
  white,
  themeColor,
  fadedGrey,
  backgroundGrey,
  lightGrey11,
  greyThemeDark1,
  extraDesktopWidthMax,
  themeColorBlue
} from "@edulastic/colors";

export const StudentLabel = styled.div`
  margin: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  border-radius: 3px;
  font-weight: 600;
  height: 48px;
  background-color: ${backgroundGrey};
`;

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
  background: ${props => (props.showFilter ? themeColorBlue : white)} !important;
  border: 1px solid ${themeColorBlue} !important;
  &:focus,
  &:hover {
    outline: unset;
    color: ${props => (props.isShowFilter ? white : themeColorBlue)};
  }
  svg,
  svg:hover {
    fill: ${props => (props.showFilter ? white : themeColorBlue)};
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
  right: 15px;
  top: 50%;
  cursor: pointer;
`;

export const TableContainer = styled.div`
  max-height: 100%;
  width: ${props => (props.showFilter ? "calc(100% - 240px)" : "100%")};
  padding-left: ${props => (props.showFilter ? "30px" : "0px")};
  .ant-spin {
    position: relative;
  }
  > .ant-pagination {
    position: absolute;
    bottom: 30px;
    right: 30px;
  }
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

export const StyledTag = styled.div`
  padding: 0 10px;
  margin: 0px;
  background: ${props => props.bgColor || themeColor};
  height: 28px;
  width: auto;
  font-size: 9px;
  color: ${props => props.textColor || "#ffffff"};
  font-weight: bold;
  letter-spacing: 0.2px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: ${extraDesktopWidthMax}) {
    height: 24px;
    font-size: 10px;
    line-height: 14px;
  }

  @media print {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }
`;

export const Icon = styled.img`
  margin-left: 10px;
  width: 18px;
  height: 18px;

  @media (min-width: ${extraDesktopWidthMax}) {
    width: 20px;
    height: 20px;
  }
`;

export const TestThumbnail = styled.img`
  border-radius: 4px;
  width: 32px;
  height: 24px;
  margin-right: 5px;

  @media (min-width: ${extraDesktopWidthMax}) {
    width: 50px;
  }
`;

export const TestTypeIcon = styled.span`
  width: 18px;
  height: 18px;
  margin: 0px 10px;
  border-radius: 50%;
  text-align: center;
  text-transform: uppercase;
  color: ${white};
  background: ${props => props.bgColor};
  font-weight: 600;
  font-size: 12px;
  line-height: 17px;
  @media (min-width: ${extraDesktopWidthMax}) {
    width: 20px;
    height: 20px;
    font-size: 14px;
    line-height: 19px;
  }
`;

export const AssignmentTD = styled.div`
  text-align: left;
  padding-left: 0px !important;
  padding-right: 0px !important;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: ${extraDesktopWidthMax}) {
    max-width: 250px;
  }
`;

export const StyledTable = styled(Table)`
  .ant-table {
    .ant-table-content {
      .ant-table-body {
        table {
          border: none;
          .ant-table-thead {
            & .ant-table-header-column .ant-table-column-sorters:hover::before {
              background: white;
            }
            tr {
              background: white;
              th {
                border: none;
                background: white;
                padding: 8px;
                .ant-table-column-sorters {
                  display: inline;
                }
                .ant-table-column-title {
                  font-size: 10px;
                  font-weight: 700;
                  color: ${lightGrey11};
                  text-transform: uppercase;
                  @media (min-width: ${extraDesktopWidthMax}) {
                    font-size: 12px;
                  }
                }
              }
            }
          }
          .ant-table-tbody {
            border-collapse: collapse;
            tr {
              padding-top: 5px;
              td {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                padding: 10px 10px 5px 10px;
                font-size: 12px;
                font-weight: 600;
                color: ${greyThemeDark1};
                @media (min-width: ${extraDesktopWidthMax}) {
                  font-size: 14px;
                }
              }
              td:nth-child(n + 5) {
                padding: 5px 0 0 0;
              }
              &.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td,
              &.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td,
              &:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td,
              &:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
                background-color: ${backgroundGrey};
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
          & .ant-table-header-column .ant-table-column-sorters:hover::before {
            background: white;
          }
          tr {
            background: white;
            th {
              border: none;
              background: white;
              padding: 8px;
              .ant-table-column-sorters {
                display: inline;
              }
              .ant-table-column-title {
                font-size: 10px;
                font-weight: 700;
                color: ${lightGrey11};
                text-transform: uppercase;
                @media (min-width: ${extraDesktopWidthMax}) {
                  font-size: 12px;
                }
              }
            }
          }
        }
        .ant-table-tbody {
          border-collapse: collapse;
          tr {
            td {
              max-width: 200px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              padding: 10px 10px 5px 10px;
              font-size: 12px;
              font-weight: 600;
              color: ${greyThemeDark1};
              @media (min-width: ${extraDesktopWidthMax}) {
                font-size: 14px;
              }
            }
            td:nth-child(n + 5) {
              padding: 5px 0 0 0;
            }
            &.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td,
            &.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td,
            &:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td,
            &:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
              background-color: ${backgroundGrey};
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

import styled from "styled-components";
import { Card } from "@edulastic/common";
import { Table } from "antd";
import { darkGrey, grey, fadedGrey } from "@edulastic/colors";

export const StyledCard = styled(Card)`
  // when u change this u have to change "StyledCard" in "src/client/author/Reports/common/styled.js" to make every css in sync
  // DO NOT ADD USE CASE SPECIFIC CSS HERE, ONLY ADD GENERIC CSS
  // Import this and add USE CASE SPECIFIC CSS
  margin: ${props => (props.margin ? props.margin : "8px")};

  .ant-card-body {
    padding: 18px;
  }

  @media only screen and (min-width: 1px) and (max-width: 600px) {
    .ant-card-body {
      padding: 12px;
    }
  }

  @media only screen and (min-width: 601px) and (max-width: 767px) {
    .ant-card-body {
      padding: 15px;
    }
  }

  @media only screen and (min-width: 768px) and (max-width: 991px) {
    .ant-card-body {
      padding: 18px;
    }
  }

  @media only screen and (min-width: 992px) and (max-width: 1199px) {
    .ant-card-body {
      padding: 18px;
    }
  }

  @media only screen and (min-width: 1200px) {
    .ant-card-body {
      padding: 18px;
    }
  }

  @media print {
    box-shadow: none !important;

    .ant-card-body {
      padding: 0px !important;
    }
  }
`;

export const StyledTable = styled(Table)`
  // when u change this u have to change "StyledTable" in "src/client/author/Reports/common/styled.js" to make every css in sync
  // DO NOT ADD USE CASE SPECIFIC CSS HERE, ONLY ADD GENERIC CSS
  // Import this and add USE CASE SPECIFIC CSS
  .ant-table-body {
    overflow: auto;
    table {
      thead {
        tr {
          th {
            padding: 8px;
            text-align: left;
            font-weight: 900;
            font-size: 12px;

            .ant-table-column-sorters {
              display: inline;
            }
          }
          th.ant-table-column-has-actions.ant-table-column-has-sorters {
            padding: 8px !important;

            .ant-table-column-sorter {
              right: 3px;
            }
          }

          th:nth-last-child(-n + ${props => props.rightAligned || 0}) {
            text-align: right;
          }

          @media only screen and (min-width: 1px) and (max-width: 600px) {
            th {
              padding: 4px;
              font-size: 8px;
            }
          }

          @media only screen and (min-width: 601px) and (max-width: 767px) {
            th {
              padding: 5px;
              font-size: 9px;
            }
          }

          @media only screen and (min-width: 768px) and (max-width: 991px) {
            th {
              padding: 6px;
              font-size: 10px;
            }
          }

          @media only screen and (min-width: 992px) and (max-width: 1199px) {
            th {
              padding: 7px;
              font-size: 11px;
            }
          }

          @media only screen and (min-width: 1200px) {
            th {
              padding: 8px;
              font-size: 12px;
            }
          }
        }
      }

      tbody {
        tr {
          border-bottom: solid 1px ${fadedGrey};

          td:nth-last-child(-n + ${props => props.centerAligned || 0}) {
            text-align: center;
          }

          td:nth-last-child(-n + ${props => props.rightAligned || 0}) {
            text-align: right;
          }

          td {
            height: 50px;
            padding: 10px;
            text-align: left;
            font-size: 12px;

            &:nth-last-child(-n + ${props => props.colouredCellsNo}) {
              padding: 0px;
              div {
                height: 100%;
                width: 100%;
                padding: 10px;
              }
            }
          }
        }
      }
    }
  }

  .ant-table-body::-webkit-scrollbar {
    height: 10px;
    width: 10px;
  }

  .ant-table-body::-webkit-scrollbar-track {
    background: ${grey};
  }

  .ant-table-body::-webkit-scrollbar-thumb {
    background: ${darkGrey};
  }

  .ant-pagination.ant-table-pagination {
    .ant-pagination-disabled {
      display: none;
    }
  }
`;

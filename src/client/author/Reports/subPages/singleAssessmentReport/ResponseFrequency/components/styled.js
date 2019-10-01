import styled from "styled-components";
import { Row, Col, Button } from "antd";
import { themeColor, fadedBlack } from "@edulastic/colors";
import { StyledTable as Table, StyledCard as Card } from "../../../../common/styled";

export const StyledCard = Card;

export const StyledContainer = styled(Row)`
  flex-flow: column nowrap;

  @media print {
    .recharts-wrapper {
      transform: translate(-150px);
    }

    .recharts-responsive-container {
      transform: scale(0.8);
    }

    .ant-card-body {
      padding: 0px;
      box-shadow: none;
    }

    .ant-card {
      box-shadow: none !important;
      margin: 0px !important;
    }
  }

  .question-area {
    min-height: 110px;
    padding: 10px;

    .question-container {
      flex: 1 1 300px;
      p {
        margin: 4px 0;
        color: ${fadedBlack};
      }

      p:nth-child(1) {
        font-weight: 900;
      }

      p:nth-child(2) {
        font-size: 12px;
      }

      .answer-slider-percentage {
        flex: 0 0 50px;
        text-align: left;
        span {
          color: ${themeColor};
          font-weight: 600;
        }
      }

      .answer-slider {
        margin: 0 60px 0px 15px;
        flex: 1;
      }
    }
  }
`;

export const StyledTable = styled(Table)`
  @media print {
    table,
    th,
    td {
      border: 1px solid #e6e6e6;
      font-size: 9px;
    }

    th.ant-table-column-has-sorters {
      padding-top: 13px !important;
    }

    .ant-table-column-sorter {
      display: none !important;
    }
  }
  .ant-table-body {
    table {
      thead {
        tr {
          th {
            white-space: nowrap;
            color: ${fadedBlack};
          }
          th:nth-child(n + 4) {
            text-align: right;
          }
        }
      }

      tbody {
        tr {
          td:nth-child(5) {
            padding: 0;

            .response-frequency-table-correct-td {
              padding: 0;
              height: 100%;
              width: 100%;
              display: flex;
              justify-content: flex-end;
              align-items: center;
              padding: 10px;
              -webkit-print-color-adjust: exact;
            }
          }

          td:nth-child(n + 4) {
            text-align: right;
          }
        }
      }
    }

    @media print {
      .ant-row-flex {
        justify-content: flex-end;
      }
    }
  }
`;

export const StyledResponseTagContainer = styled(Col)`
  flex-grow: 1;
  @media print {
    margin-bottom: 10px;
    flex: none;
  }
`;

export const StyledSimpleBarChartContainer = styled(StyledCard)`
  padding: 10px;
  overflow: hidden;

  .navigator-left {
    left: 5px;
    top: 50%;
  }

  .navigator-right {
    right: 5px;
    top: 50%;
  }

  .recharts-wrapper .recharts-cartesian-grid-horizontal line:first-child,
  .recharts-wrapper .recharts-cartesian-grid-horizontal line:last-child {
    stroke-opacity: 0;
  }
`;

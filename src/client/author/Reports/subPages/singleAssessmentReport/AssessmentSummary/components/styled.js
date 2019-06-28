import styled from "styled-components";
import { Row } from "antd";
import { fadedBlack } from "@edulastic/colors";
import { StyledTable as Table, StyledCustomChartTooltip as CustomChartTooltip } from "../../../../common/styled";
import { AssessmentStatisticTable } from "./table/assessmentStatisticTable";

export const UpperContainer = styled(Row)`
  @media print {
    flex-direction: column-reverse;
  }

  .sub-container {
    .ant-card-body {
      min-height: 350px;
      display: flex;
      flex-direction: column;

      .recharts-responsive-container {
        flex: 1;
      }
    }
  }

  .district-statistics {
  }

  .chart-container {
  }
`;

export const TableContainer = styled(Row)``;

export const StyledAssessmentStatisticTable = styled(AssessmentStatisticTable)`
  .top-area {
    min-height: 50px;
    font-weight: 700;
    font-size: 14px;
    color: ${fadedBlack};
    align-content: center;

    .top-area-col {
      flex: 1 1 50%;
      .stats-grouped-by {
        text-transform: capitalize;
      }
    }

    .table-title {
      align-self: center;
    }

    .control-area {
      text-align: right;
    }
  }
`;

export const StyledTable = styled(Table)`
  .ant-table-body {
    table {
      thead {
        tr {
          th {
            white-space: nowrap;
            color: ${fadedBlack};
          }
          th:nth-child(n + 2) {
            text-align: right;
          }
        }
      }

      tbody {
        tr {
          td:nth-child(n + 2) {
            text-align: right;
          }
        }
      }

      @media print {
        table,
        th,
        td {
          border: 1px solid #e6e6e6;
          font-size: 9px;
        }

        thead {
          tr {
            th {
              text-align: center !important;
              vertical-align: top;
              padding: 0px !important;
            }

            th:nth-child(1),
            th:nth-child(2) {
              &.ant-table-column-has-actions.ant-table-column-has-sorters {
                padding: 0px !important;
              }
            }

            th:nth-child(2),
            th:nth-child(3),
            th:nth-child(4),
            th:nth-child(5) {
              .ant-table-header-column {
                word-break: keep-all;
                white-space: normal;
              }
            }

            th:nth-child(6) {
              .ant-table-header-column {
                width: 85px;
              }
            }

            th:last-child {
              .ant-table-header-column {
                width: 70px;
              }
            }
          }
        }
        .ant-table-header-column {
          word-break: break-word;
          white-space: normal;
          padding: 0px 5px !important;

          .ant-table-column-sorter {
            display: none;
          }
        }
      }
    }
  }
`;

export const StyledCustomChartTooltip = styled(CustomChartTooltip)`
  min-width: 70px;
  min-height: auto;
`;

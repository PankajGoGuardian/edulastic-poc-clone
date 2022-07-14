import styled from 'styled-components'
import React from 'react'
import { Row } from 'antd'
import { FlexContainer } from '@edulastic/common'
import { fadedBlack, extraDesktopWidthMax } from '@edulastic/colors'
import {
  StyledTable as Table,
  StyledCustomChartTooltip as CustomChartTooltip,
} from '../../../../common/styled'
import AssessmentStatisticTable from './table/assessmentStatisticTable'

export const UpperContainer = styled(FlexContainer)`
  @media print {
    /* flex-direction: column-reverse; */
    /* print view is 1024 resolution */
    .district-statistics {
      width: 724px;
    }

    .chart-container {
      width: 250px;
    }
  }

  .district-statistics {
    width: calc(100% - 280px);
  }

  .chart-container {
    width: 250px;
    margin-left: 30px;
  }

  .sub-container {
    .ant-card-body {
      min-height: 270px;
      display: flex;
      flex-direction: column;

      .recharts-responsive-container {
        flex: 1;
      }
    }
  }
`

export const TableContainer = styled(Row)``

export const StyledAssessmentStatisticTable = styled((props) => (
  <AssessmentStatisticTable {...props} />
))`
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
`

export const StyledTable = styled(Table)`
  .ant-table-layout-fixed {
    .ant-table-scroll {
      table tbody tr td {
        border-bottom: 1px solid #e9e9e9;
      }
      .ant-table-thead {
        th {
          word-break: break-word;
        }
      }
      .ant-table-body {
        overflow-x: auto !important;
      }
      @media print {
        .ant-table-body {
          overflow-x: hidden !important;
        }
      }
    }
    .ant-table-fixed-left {
      .ant-table-thead {
        th {
          padding: 8px;
          color: #aaafb5;
          font-weight: 900;
          text-transform: uppercase;
          font-size: 10px;
          border: 0px;
          .ant-table-column-sorter {
            vertical-align: top;
          }
        }
      }
      .ant-table-tbody {
        td {
          padding: 10px 0px 10px 8px;
          font-size: 11px;
          color: #434b5d;
          font-weight: 600;
          @media (min-width: ${extraDesktopWidthMax}) {
            font-size: 14px;
          }
        }
      }
    }
  }

  .ant-table-body {
    table {
      tbody {
        td .assessmentDate {
          white-space: nowrap;
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
            th:nth-child(2),
            th:nth-child(3) {
              &.ant-table-column-has-actions.ant-table-column-has-sorters {
                padding: 0px !important;
              }
            }

            th:nth-child(2),
            th:nth-child(3),
            th:nth-child(4),
            th:nth-child(5),
            th:nth-child(6) {
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
`

export const StyledCustomChartTooltip = styled(CustomChartTooltip)`
  min-width: 70px;
  min-height: auto;
`

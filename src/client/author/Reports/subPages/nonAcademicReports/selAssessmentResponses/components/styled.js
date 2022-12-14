import styled from 'styled-components'
import { Row, Col } from 'antd'
import { themeColor, fadedBlack, extraDesktopWidthMax } from '@edulastic/colors'
import {
  StyledTable as Table,
  StyledCard as Card,
} from '../../../../common/styled'

export const StyledCard = Card

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
`

export const StyledTable = styled(Table)`
  .ant-table-layout-fixed {
    .ant-table-scroll {
      table tbody tr td {
        border-bottom: 1px solid #e9e9e9;
      }
      .ant-table-thead {
        th {
          white-space: nowrap;
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

    .ant-row-flex {
      justify-content: flex-end;
    }
  }
  .ant-table-body {
    table {
      thead {
        tr {
          th {
            white-space: nowrap;
          }
        }
      }

      tbody {
        tr {
          td:nth-child(5) {
            .response-frequency-table-correct-td {
              padding: 0;
              height: 100%;
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 10px 8px;
              -webkit-print-color-adjust: exact;
            }
          }
        }
      }
    }
  }
`

export const StyledResponseTagContainer = styled(Col)`
  flex-basis: 20%;
  @media print {
    margin-bottom: 10px;
  }
`

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
`

export const StyledSpan = styled.span`
  font-size: ${(props) => props.font};
  color: ${(props) => props.color};
  width: ${(props) => props.width}
  font-weight: 600;
`

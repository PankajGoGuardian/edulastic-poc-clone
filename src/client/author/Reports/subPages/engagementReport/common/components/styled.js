import styled from 'styled-components'
import { extraDesktopWidthMax } from '@edulastic/colors'
import { StyledTable as Table } from '../../../../common/styled'

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
          td {
            &:nth-last-child(-n + ${(props) => props.colouredCellsNo}) {
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
`

export const TooltipDiv = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  @media print {
    white-space: normal;
  }
`

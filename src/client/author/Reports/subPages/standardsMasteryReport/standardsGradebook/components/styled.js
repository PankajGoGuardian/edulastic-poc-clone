import styled from 'styled-components'
import { Col } from 'antd'
import { extraDesktopWidthMax } from '@edulastic/colors'
import { StyledTable as Table } from '../../../../common/styled'

export const UpperContainer = styled.div`
  .dropdown-container {
    text-align: left;
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
`

export const TableContainer = styled.div`
  .control-dropdown-row {
    display: flex;
    justify-content: flex-end;
  }
`

export const StyledTable = styled(Table)`
  .ant-table-body {
    table {
      thead {
        tr {
          th {
            text-align: left;
          }
          th:nth-child(2) {
            text-align: center;
          }
        }
      }

      tbody {
        tr {
          td:nth-child(1) {
            text-align: left;
          }

          td:nth-child(2) {
            text-align: center;
          }

          td:nth-child(n + 3) {
            padding: 0;
            div {
              height: 100%;
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 10px;
            }
          }
        }
      }
    }
  }
`

export const GradebookTable = styled(StyledTable)`
  .ant-table-layout-fixed {
    .ant-table-scroll {
      table tbody tr td {
        border-bottom: 1px solid #e9e9e9;
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
`

export const StyledDropDownContainer = styled(Col)`
  .ant-btn.ant-dropdown-trigger {
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
    width: 100%;
    margin-bottom: 25px;
  }
`

export const OnClick = styled.span`
  cursor: pointer;
  font-weight: 400;
  &:hover {
    font-weight: 700;
  }
`

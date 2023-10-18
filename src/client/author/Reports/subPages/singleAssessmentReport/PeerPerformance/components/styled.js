import styled from 'styled-components'
import { Icon } from 'antd'
import { fadedGrey } from '@edulastic/colors'
import { IconInfo } from '@edulastic/icons'
import { StyledTable as Table } from '../../../../common/styled'
import { FilterDropDownWithDropDown } from '../../../../common/components/widgets/filterDropDownWithDropDown'

export const UpperContainer = styled.div`
  .dropdown-container {
    text-align: left;
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
`

export const TableContainer = styled.div``

export const StyledFilterDropDownWithDropDown = styled(
  FilterDropDownWithDropDown
)`
  button {
  }
`

export const StyledTable = styled(Table)`
  .ant-table-layout-fixed {
    .ant-table-scroll {
      table thead tr th {
        .custom-column-title {
          display: flex;
        }
      }
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
        tr:first-child {
          background: ${fadedGrey};
          td {
            font-weight: bold;
            text-transform: uppercase;
            font-size 12px;
          }
        }
        td {
          padding: 10px 0px 10px 8px;
          font-size: 11px;
          color: #434b5d;
          font-weight: 600;
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
        tr:first-child {
          background: ${fadedGrey};
          td {
            font-weight: bold;
            text-transform: uppercase;
            font-size 12px;
          }
        }
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
export const StyledInfoIcon = styled(IconInfo)`
  margin-left: ${({ $marginLeft }) => $marginLeft || '0'};
`
export const StyledIcon = styled(Icon)`
  font-size: ${({ $fontSize }) => $fontSize || '12px'};
  margin-right: ${({ $marginRight }) => $marginRight || '0'};
`

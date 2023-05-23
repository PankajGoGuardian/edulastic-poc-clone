import { darkGrey, grey } from '@edulastic/colors'
import { Table } from 'antd'
import styled from 'styled-components'

export const StyledTable = styled(Table)`
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
  .ant-table-body {
    font-weight: 600 !important;
  }
  th {
    background: white !important;
    border: none !important;
    .ant-table-column-sorters
      > .ant-table-column-sorter
      > .ant-table-column-sorter-inner {
      margin-top: -0.4em;
    }
  }
  th .ant-table-column-title {
    text-transform: uppercase;
    color: ${darkGrey} !important;
    font-weight: bold !important;
    font-size: 12px;
  }
  td {
    font-weight: 500;
    font-size: 12px;
    .ant-dropdown-trigger {
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        width: 5px;
        height: 5px;
        margin-left: 10px;
        fill: #11a084;
      }
    }
  }

  .ant-pagination-total-text {
    border: none !important;
  }
`

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
  }
  th .ant-table-column-title {
    text-transform: uppercase;
    color: ${darkGrey} !important;
    font-weight: bold !important;
  }

  .ant-pagination-total-text {
    border: none !important;
  }
`

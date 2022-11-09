import styled from 'styled-components'
import { lightGrey9, extraDesktopWidthMax } from '@edulastic/colors'
import { StyledTable } from '../../../../common/styled'

export const TableContainer = styled.div`
  margin-top: 20px;
`
export const CustomStyledTable = styled(StyledTable)`
  table {
    tbody {
      tr {
        td {
          font-weight: bold;
          color: ${lightGrey9};
        }
      }
    }
  }
  .ant-table-column-title {
    white-space: nowrap !important;
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
  .ant-table-body {
    overflow-x: scroll;
  }
`
export const TableTooltipWrapper = styled.div`
  .ant-tooltip-inner {
    min-height: 50px;
    width: 200px;
    background-color: #4b4b4b;
    border-radius: 10px;
    box-shadow: 0 0 20px #c0c0c0;
    padding: 20px;
    font-size: 12px;
    font-weight: 600;
  }
`
export const AssessmentNameContainer = styled.div`
  .test-name-container {
    font-weight: bold;
    width: 121px;
    padding: 0;
    overflow: hidden;
    position: relative;
    display: inline-block;
    text-align: center;
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`
export const StyledH4 = styled.h4`
  font-size: 12px;
  font-weight: bold;
`

import styled from 'styled-components'
import { Tag } from 'antd'
import { lightGrey9, extraDesktopWidthMax } from '@edulastic/colors'
import { StyledTable } from '../../../common/styled'

export const StyledTag = styled(Tag)`
  text-tranform: uppercase;
  border-radius: 20px;
  font-size: 0.6rem;
  font-weight: bold;
`

/** @type {typeof import('antd').Table} */
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
`
export const AssessmentName = styled.div`
  color: ${(props) => props.color} !important;
`
export const TableContainer = styled.div`
  margin-top: 20px;
`

export const TableTooltipWrapper = styled.div`
  .ant-tooltip-inner {
    min-height: 75px;
    width: 200px;
    background-color: #4b4b4b;
    border-radius: 10px;
    box-shadow: 0 0 20px #c0c0c0;
    padding: 20px;
    font-size: 12px;
    font-weight: 600;
  }
`

export const DashedLine = styled.div`
  overflow: hidden;
  position: relative;
  flex-grow: 1;
  height: ${(props) => props.height ?? '0.5px'};
  margin: 0 24px;
  &:before {
    content: '';
    position: absolute;
    border: ${(props) => props.dashWidth ?? '5px'} dashed
      ${(props) => props.dashColor ?? '#707070'};
    inset: 0;
  }
`

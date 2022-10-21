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

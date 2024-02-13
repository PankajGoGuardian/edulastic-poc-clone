import { themeColor } from '@edulastic/colors'
import { Table } from 'antd'
import styled from 'styled-components'

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`

export const TableHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

// export const RightContainer = styled(LeftContainer)

export const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const ActionContainer = styled.div`
  display: flex;
  cursor: pointer;
  width: fit-content;
`

export const StyledTable = styled(Table)`
  .ant-table-thead th {
    font-weight: 700;
    font-size: 12px;
    color: #999999;
    text-transform: uppercase;
  }
  .ant-table-tbody > tr {
    > td {
      &.absent {
        background-color: #d8d8d8;
      }
      &:not(.absent) {
        color: ${themeColor};
      }
    }
  }
`

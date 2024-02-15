import { greyThemeDark4, themeColor, white } from '@edulastic/colors'
import { Table } from 'antd'
import styled from 'styled-components'

export const TableContainer = styled.div`
  display: flex;
  height: 521px;
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
    background-color: ${white};
    color: #999999;
    text-transform: uppercase;
  }
  .ant-table-tbody > tr {
    &.overall-row {
      background-color: #f9f9f9;
      > td:first-child {
        color: ${greyThemeDark4};
      }
    }

    > td {
      font-size: 12px;
      font-weight: 600;
      &.absent {
        background-color: #cee4ff;
      }
      &:not(.absent) {
        color: ${themeColor};
      }
      div > a > .dimension-name {
        margin: 0;
      }
    }
  }
`

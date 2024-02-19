import {
  extraDesktopWidthMax,
  greyThemeDark4,
  themeColor,
} from '@edulastic/colors'
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

export const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const ActionContainer = styled.div`
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`

export const StyledTable = styled(Table)`
  .ant-table-thead th {
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
  .ant-table-tbody > tr {
    &.overall-row {
      background-color: #f9f9f9;
      td:first-child > div > a {
        color: ${greyThemeDark4};
      }
    }

    > td {
      padding: 8px;
      font-size: 11px;
      font-weight: 600;
      @media (min-width: ${extraDesktopWidthMax}) {
        font-size: 14px;
      }
      &.absent {
        background-color: #ff00000d;
      }
      color: ${themeColor};
      div > a > .dimension-name {
        margin: 0;
        -webkit-line-clamp: 1;
      }
      div > .ant-typography-copy {
        display: flex !important;
        justify-content: center !important;
      }
    }
  }
`

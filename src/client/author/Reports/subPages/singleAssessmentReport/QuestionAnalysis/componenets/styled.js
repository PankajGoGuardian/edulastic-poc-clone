import styled from 'styled-components'
import { extraDesktopWidthMax, themeColor } from '@edulastic/colors'
import { Col, Switch } from 'antd'
import {
  StyledTable as Table,
  StyledCard as Card,
} from '../../../../common/styled'

export const StyledCard = styled(Card)``

export const StyledTable = styled(Table)`
  .ant-table-layout-fixed {
    .ant-table-scroll {
      table tbody tr td {
        border-bottom: 1px solid #e9e9e9;
      }
      .ant-table-thead {
        th {
          white-space: nowrap;
        }
      }
      .ant-table-thead > tr:nth-child(2) > th {
        background-color: #e5e5e5;
        color: black;
        font-size: 11px;
      }
      .ant-table-body {
        overflow-x: auto !important;
        overflow-y: auto !important;
        max-height: 200px;
      }
      .ant-table-body::-webkit-scrollbar {
        display: none;
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
  .ant-table-body {
    table {
      thead {
        tr th {
          white-space: nowrap;
        }
      }

      tbody {
        tr {
          td:nth-child(n + ${(props) => props.colorCellStart}) {
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
  @media print {
    table thead tr, table tbody tr{
      display: flex;
      flex-direction: row;
      padding: 0px;
    }
    .ant-table-thead > tr > th:first-child{
      width : 85px !important;
    }
    .ant-table-tbody > tr > td:first-child{
      width : 85px !important;
    }
    table thead tr th, table tbody tr td{
      width: 80px;
      font-size: 11px !important;
      font-weight: 600 ;
    }
    table tbody tr td:before, table tbody tr td:after{
      height : 0px ;
    }
    tr, td , thead, tfoot {
      margin: 0 ;
    }

`

export const UpperContainer = styled.div``

export const BottomRow = styled.div`
  .parent-row {
    flex-direction: column;
    .top-row-container {
      .top-row {
        min-height: 50px;
      }
    }
    .bottom-table-container {
      width: 100%;
    }
  }
`
export const StyledP = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #7c848e;
  text-align: center;
`

export const QLabelSpan = styled.span`
  color: ${themeColor};
  margin-bottom: 10px;
  display: inline-block;
  font-size: 12px;
`
export const StyledSwitch = styled(Switch)`
  margin-left: 10px;
  margin-right: 10px;
  width: 35px;
  display: inline-block;
  &.ant-switch-checked,
  &.ant-switch {
    background-color: #1890ff;
  }
`
export const StyledDiv = styled.div`
  font-size: 12px;
  color: black;
  opacity: ${(props) => props.opacity || 1};
  font-weight: ${(props) => props.fontWeight || 400};
  margin-right: ${(props) => props.marginRight || '0'};
`

export const StyledCol = styled(Col)`
  display: flex;
  flex-direction: row;
  align-items: center;
`
export const StyledSpan = styled.span`
  opacity: 0.65;
`
export const StyledHeadDiv = styled.div`
  display: flex;
  flex-direction: column;
`

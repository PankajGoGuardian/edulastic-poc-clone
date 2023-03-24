import styled from 'styled-components'
import {
  borderGrey3,
  fadedGrey,
  lightGrey11,
  themeColor,
  white,
} from '@edulastic/colors'
import { Col, Switch } from 'antd'
import {
  StyledTable as Table,
  StyledCard as Card,
} from '../../../../common/styled'

export const StyledCard = styled(Card)``

export const StyledTable = styled(Table)`
  table tbody tr td {
    border-bottom: 1px solid ${borderGrey3};
    padding: 10px;
    text-align: center;
    font-size: 12px;
    font-weight: bold;
  }
  .ant-table-thead {
    th {
      color: ${lightGrey11};
      background: ${white};
      text-transform: uppercase;
      font-size: 10px;
    }
    tr:first-child {
      th.ant-table-column-sort,
      th.ant-table-column-sort:hover {
        background: ${white} !important;
      }
      th:first-child span:first-child {
        margin-top: 6px;
        display: inline-block;
      }
    }
  }
  .ant-table-thead > tr:nth-child(2) > th {
    background-color: ${fadedGrey};
    color: black;
    font-size: 12px;
    font-weight: 600;
  }
  .ant-table-body {
    table {
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
  table thead tr {
    th {
      border-bottom: 1px solid ${borderGrey3};
      padding: 10px;
      text-align: center;
    }
  }

  @media print {
    table tbody tr td {
      padding: 0;
    }
    table tbody tr td:before,
    table tbody tr td:after {
      height: 0px;
    }
    table thead tr:first-child th:first-child {
      min-width: 150px;
    }
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
  text-transform: initial;
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

export const FlexWrap = styled.div`
  display: flex;
  justify-content: center;
`

import {
  borderGrey3,
  fadedGrey,
  greyLight1,
  lightGrey11,
  lightGrey9,
  secondaryTextColor,
  themeColor,
  white,
} from '@edulastic/colors'
import { Switch, Button, Table } from 'antd'
import styled from 'styled-components'
import { EduButton } from '@edulastic/common'
import { IconQuestionCircle } from '@edulastic/icons'
import { ResponsiveContainer } from 'recharts'
import { getFGColor } from '../../../../src/utils/util'

export const ChartWrapper = styled.div`
  border: 1px solid #dedede;
  width: ${({ width }) => width || '100%'};
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 16px;
  min-height: 400px;
  position: relative;
`

export const Title = styled.div`
  font-size: 16px;
  color: ${secondaryTextColor};
  font-weight: bold;
  flex: 1;
`

export const LegendWrap = styled.div`
  display: flex;
  gap: 0 15px;
  border-right: 1px solid ${greyLight1};
  margin-right: 15px;
`

export const CustomLegend = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
`

export const LegendSymbol = styled.span`
  width: 10px;
  height: 10px;
  background: ${(props) => props.color};
  ${({ color }) => (color ? `color: ${getFGColor(color)};` : '')}
  display: flex;
  border-radius: 50%;
  margin-right: 10px;
`

export const LegendName = styled.span`
  font-size: 11px;
  color: #4b4b4b;
`

export const CheckBoxWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  .ant-checkbox-inner::after {
    left: 22% !important;
  }
`

export const CheckboxText = styled.span`
  font: normal normal normal 11px/22px Open Sans;
  letter-spacing: 0.2px;
  color: ${lightGrey9};
`

export const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex: ${({ flex }) => flex};
  margin-bottom: 15px;
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
export const StyledSpan = styled.span`
  opacity: 0.65;
`

export const TardiesTitle = styled.div`
  font-size: 16px;
  color: #434b5d;
  width: 100%;
  font-weight: bold;
  margin-bottom: 15px;
`
export const TardiesWrapper = styled.div`
  border: 1px solid #dedede;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  height: 386px;
  border-radius: 10px;
  padding: 24px;
  .navigator-left {
    left: 10px;
  }
  .navigator-right {
    right: 10px;
  }
`
export const StyledEduButton = styled(EduButton)`
  &.ant-btn {
    height: 32px;
    padding: 0 15px 0 10px;
    margin-right: 10px;
  }
`
export const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  height: 22px;
  margin: 0 20px 0 20px;
  padding: 4px;
`
export const StyledIconQuestionCircle = styled(IconQuestionCircle)`
  margin-right: 5px;
  height: 14px;
  width: 14px;
  path {
    fill: ${themeColor};
  }
`
export const StyledTextSpan = styled.span`
  color: ${themeColor};
  font-size: 12px;
`
export const StyledResponsiveContainer = styled(ResponsiveContainer)`
  @media print {
    .recharts-surface {
      width: 100% !important ;
      height: ${(props) => props.printHeight || '100%'} !important;
    }
  }
`

export const StyledTable = styled(Table)`
  table tbody tr td {
    border-bottom: 1px solid ${borderGrey3};
    padding: 10px;
    text-align: center;
    font-size: 14px;
  }
  .ant-table-thead {
    th {
      color: ${lightGrey11};
      background: ${white};
      text-transform: uppercase;
      font-size: 10px;
      font-weight: bold;
    }
    tr:first-child {
      th.ant-table-column-sort,
      th.ant-table-column-sort:hover {
        background: ${white} !important;
      }
      th span:first-child {
        margin-top: 6px;
        display: inline-block;
      }
    }
  }
  .ant-table-thead > tr:nth-child(2) > th {
    background-color: ${fadedGrey};
    color: black;
    font-size: 12px;
    font-weight: bold;
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
          .dimension-name {
            margin: 0;
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

  table tbody tr td:first-child {
    max-width: 250px;
    min-width: 150px;
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
      min-width: 200px;
    }
    table thead tr th:first-child {
      padding-left: 0;
    }
  }
`

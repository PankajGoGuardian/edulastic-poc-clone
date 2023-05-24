import {
  greyThemeLighter,
  darkGrey5,
  lightGrey17,
  green,
  dashBorderColor,
  dashBorderColor1,
} from '@edulastic/colors'
import { Divider } from 'antd'
import styled from 'styled-components'
import { CustomStyledTable } from '../../../common/components/styledComponents'

export const TableContainer = styled.div`
  background-color: ${greyThemeLighter};
  min-height: 300px;
  justify-content: center;
  margin-top: 60px;
  padding: 20px 15px;
  border-radius: 25px;
`
export const CustomStyledCell = styled.div`
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(p) => p.width || '90px'};
  aspect-ratio: 8 / 3;
  color: black;
  font-size: ${(p) => p.fontSize || '13px'};
  font-weight: 800;
  box-shadow: ${(p) => (p.showBoxShadow ? '0px 10px 11px #0000000f' : '')};
  background-color: ${(p) => p.color};
`
export const StyledEarlyWarningTable = styled(CustomStyledTable)`
  .ant-table-bordered .ant-table-tbody > tr > td {
    border-right: 1px dashed ${dashBorderColor1};
    font-size: 15px;
  }
  .ant-table-bordered .ant-table-thead > tr > th {
    border-right: 1px dashed ${dashBorderColor1};
  }
  .ant-table-thead {
    .risk {
      span > div {
        margin: 10px 0 0 -50px;
      }
    }
    .dimension {
      span {
        margin-inline: 8px;
      }
    }
    .risk-distribution {
      .ant-table-header-column {
        margin-left: 16px;
      }
      span > div {
        margin-right: 220px;
        margin-top: 15px;
      }
    }
  }
  .ant-table-tbody {
    .risk-distribution > div {
      text-align: center;
    }
    .risk > div {
      font-size: 12px;
      .left-text {
        margin-left: 65px;
      }
      .right-text {
        margin-right: -40px;
        font-weight: 600;
      }
    }
  }
`
export const StyledStudentTable = styled(StyledEarlyWarningTable)`
  .ant-table-scroll .ant-table-thead {
    th {
      background-color: ${dashBorderColor};
    }
    .nested {
      border-bottom: 1px solid ${dashBorderColor1};
      padding: 15px;
    }
    .risk-name {
      padding-inline: 10px;
    }
  }
  .ant-table-scroll .ant-table-tbody {
    .risk-name {
      padding-inline: 60px;
    }
  }
  .ant-table-fixed-left .ant-table-thead {
    th {
      background-color: ${dashBorderColor};
    }
  }
`

export const StyledDivider = styled(Divider)`
  height: 100%;
  background: ${lightGrey17};
`

export const CheckboxContainer = styled.div`
  span {
    color: ${darkGrey5};
    font-size: 0.8rem;
    font-weight: bold;
  }
`

export const TimeframeSwitchContainer = styled.div`
  button {
    width: 20px;
    background: ${green} !important;
  }
`

export const TimeframeText = styled.span`
  padding: 0px 10px;
  font-size: 0.8rem;
  font-weight: bold;
  color: ${({ checked }) => (checked ? green : darkGrey5)};
`
export const ColoredText = styled.div`
  font-weight: bold;
  color: ${(p) => p.color};
`

import styled from 'styled-components'
import Row from "antd/es/row";
import Col from "antd/es/col";
import Icon from "antd/es/icon";
import {
  cardTitleColor,
  white,
  sectionBorder,
  themeColorLighter,
} from '@edulastic/colors'
import { ThemeButton } from '../../../src/components/common/ThemeButton'

export const StyledTableContainer = styled.div`
  display: flex;
  flex-direction: column;

  .ant-table-thead {
    & > tr {
      border: 1px solid ${sectionBorder};
      & > th {
        text-align: center;
        text-transform: uppercase;
        background-color: ${white};
        font-size: 11px;
        font-weight: bold;
        color: ${cardTitleColor};
        height: 45px;
        padding: 5px 10px;
        &:nth-child(1) {
          text-align: left;
        }
      }
    }
  }
  .ant-table-tbody {
    tr {
      & > td:first-child div {
        white-space: nowrap;
      }
      & > td {
        padding: 10px;
        border: 0;
      }
      &:hover > td {
        background-color: ${white};
      }
    }
  }
`

export const StyledRow = styled(Row)`
  padding-top: 10px;
  padding-bottom: 10px;
`

export const StyledCol = styled(Col)`
  text-align: center;
`

export const StyledBottomDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 20px;
`

export const StyledSaveButton = styled(ThemeButton)`
  margin-bottom: 15px;
  text-transform: uppercase;
  font-size: 12px;
  border-radius: 4px;
  color: ${white};
`

export const StyledColFromTo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  margin: 0px auto;
`

export const PercentText = styled(Col)`
  color: ${themeColorLighter};
  margin-right: 15px;
  margin-top: -2px;
`

export const StyledButton = styled.a`
  display: flex;
  align-items: center;
  height: 32px;
  color: #1890ff;
  user-select: none;
  cursor: pointer;
`

export const StyledProP = styled.p`
  margin-left: 10px;
  margin-right: 10px;
  pointer-events: none;
  user-select: none;
  text-align: center;
  line-height: 32px;
  width: 100px;
`

export const StyledIcon = styled(Icon)`
  font-size: 16px;
  font-weight: bold;
`

export const StyledDivCenter = styled.div`
  text-align: center;
`

export const StyledEnableContainer = styled.div`
  display: flex;
  justify-content: space-around;

  .ant-input {
    width: 80px;
    min-width: 80px;
    text-align: center;
  }

  .ant-form-item-children {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`

export const SaveAlert = styled.p`
  color: #f9ac59;
  text-align: right;
  margin-right: 20px;
  line-height: 32px;
`

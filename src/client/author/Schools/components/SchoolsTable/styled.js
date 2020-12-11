import styled from 'styled-components'
import Icon from "antd/es/Icon";
import Button from "antd/es/Button";
import { StyledTable } from '../../../../common/styled'

export const StyledSchoolTable = styled(StyledTable)`
  .ant-table-tbody > tr > td:nth-last-of-type(-n + 4) {
    text-align: center;
  }
`

export const StyledCreateSchoolButton = styled(Button)`
  margin-right: 10px;
  text-transform: uppercase;
  font-size: ${(props) => props.theme.manageDistrict.createButtonFontSize};
  background: ${(props) => props.theme.manageDistrict.createButtonBgColor};
  color: ${(props) => props.theme.manageDistrict.createButtonTextColor};
  font-weight: ${(props) => props.theme.manageDistrict.createButtonFontWeight};
`

export const StyledHeaderColumn = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`

export const StyledSortIconDiv = styled.div`
  position: relative;
  margin-left: 8px;
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
`

export const StyledSortIcon = styled(Icon)`
  display: block;
  height: 6px;
  line-height: 0.5em;
  cursor: pointer;
  position: relative;
  font-size: 11px;
  margin-top: 0.125em;
  color: ${(props) => (props.colorValue ? '#1890ff' : '#bfbfbf')};
`

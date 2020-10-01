import { Checkbox } from 'antd'
import styled from 'styled-components'
import { themes } from '../../../../../theme'

const classBoardTheme = themes.default.classboard

export const StyledCheckbox = styled(Checkbox)`
  font-size: 0.7em;
  color: ${classBoardTheme.headerCheckboxColor};
  align-self: flex-start;
  margin-left: auto;
  .ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner,
  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: ${(props) => props.theme.checkbox.checkboxCheckedColor};
  }
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${(props) => props.theme.checkbox.checkboxCheckedColor};
    border-color: ${(props) => props.theme.checkbox.checkboxCheckedColor};
  }
  .ant-checkbox-inner::after {
    left: 24%;
  }
`

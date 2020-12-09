import { TextField } from '@edulastic/common'
import styled from 'styled-components'
import Select from "antd/es/select";
import Input from "antd/es/input";
import Checkbox from "antd/es/checkbox";
import { createStandardTextStyle } from '../../utils/helpers'

export const StyledTextField = styled(TextField)`
  ${(props) => createStandardTextStyle(props)}
`

export const StyledSelect = styled(Select)`
  .ant-select-selection-selected-value {
    ${(props) => createStandardTextStyle(props)}
  }
`

export const StyledInput = styled(Input)`
  ${(props) => createStandardTextStyle(props)}
`

export const StyledCheckbox = styled(Checkbox)`
  ${(props) => createStandardTextStyle(props)}
`

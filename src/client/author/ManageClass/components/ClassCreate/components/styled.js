import styled from 'styled-components'
import { darkGrey } from '@edulastic/colors'
import { FieldLabel } from '@edulastic/common'

export const Field = styled.fieldset`
  width: 100%;
  padding: 0px;

  &:first-child {
    margin-top: 0px;
  }
  .ant-calendar-picker,
  .ant-select {
    width: 100%;
  }
`

export const Label = styled(FieldLabel)`
  font-size: 12px !important;
`

export const Optional = styled.span`
  font-size: ${(props) => props.theme.smallFontSize};
  color: ${darkGrey};
  margin-left: 10px;
  text-transform: lowercase;
`

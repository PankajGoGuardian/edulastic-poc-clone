import { SelectInputStyled } from '@edulastic/common'
import styled from 'styled-components'

export const CalculatorDropdown = styled(SelectInputStyled)`
  .ant-select-selection--multiple {
    padding-bottom: 0px;
  }
`

export const Label = styled.span`
  font-size: ${(props) => props.theme.linkFontSize};
  font-weight: 600;
  text-transform: uppercase;
  align-items: center;
`

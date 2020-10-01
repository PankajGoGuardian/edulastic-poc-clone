import styled from 'styled-components'
import { MathFormulaDisplay } from '@edulastic/common'

export const AnswerBox = styled(MathFormulaDisplay)`
  padding: ${({ checked }) => (checked ? '0px 6px' : '0px')};
  text-align: left;
`

import styled from 'styled-components'
import { WithMathFormula } from '@edulastic/common'
import { mainTextColor } from '@edulastic/colors'

export const InlineLabel = WithMathFormula(styled.div`
  color: ${mainTextColor};
`)

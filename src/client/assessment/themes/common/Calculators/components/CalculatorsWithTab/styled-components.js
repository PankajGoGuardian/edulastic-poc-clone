import styled from 'styled-components'
import { Rnd } from 'react-rnd'
import { boxShadowDefault, white } from '@edulastic/colors'

export const CalcContainer = styled.div`
  position: absolute;
  /* froala editor z-index is 997 or 996
   * @see: https://snapwiz.atlassian.net/browse/EV-19515
   */
  z-index: 1000;
  left: 50%;
  top: 80px;

  .calculator-tab-container {
    height: ${({ hasOnlySingleCalculator }) =>
      hasOnlySingleCalculator ? 'calc(100% - 40px)' : 'calc(100% - 77px)'};
  }
`

export const RndWrapper = styled(Rnd)`
  box-shadow: ${boxShadowDefault};
  background: ${white};
`

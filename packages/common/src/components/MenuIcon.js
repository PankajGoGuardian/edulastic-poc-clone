import styled from 'styled-components'
import { IconMatrixDot } from '@edulastic/icons'
import { mobileWidthLarge, greyThemeDark4 } from '@edulastic/colors'

export const MenuIcon = styled(IconMatrixDot).attrs({
  color: greyThemeDark4,
})`
  display: none;
  width: 18px;
  pointer-events: all;

  @media (max-width: ${mobileWidthLarge}) {
    display: block;
    position: absolute;
    left: 12px;
  }
`

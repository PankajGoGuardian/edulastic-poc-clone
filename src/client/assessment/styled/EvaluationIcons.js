import styled from 'styled-components'
import { IconCheck, IconClose } from '@edulastic/icons'
import { themeColor, darkRed } from '@edulastic/colors'

export const RightIcon = styled(IconCheck)`
  width: 10px;
  height: 10px;
  fill: ${themeColor};
  &:hover {
    fill: ${themeColor};
  }
`

export const WrongIcon = styled(IconClose)`
  width: 8px;
  height: 8px;
  fill: ${darkRed};
  &:hover {
    fill: ${darkRed};
  }
`

export const PartialIcon = styled(RightIcon)`
  fill: #dfd82c;
  &:hover {
    fill: #dfd82c;
  }
`

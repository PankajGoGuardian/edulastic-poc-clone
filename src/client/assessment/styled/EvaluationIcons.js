import styled from 'styled-components'
import { IconCheck, IconClose } from '@edulastic/icons'
import { correctIconColor, wrongIconColor } from '@edulastic/colors'

export const RightIcon = styled(IconCheck)`
  width: 10px;
  height: 10px;
  fill: ${correctIconColor};
  &:hover {
    fill: ${correctIconColor};
  }
`

export const WrongIcon = styled(IconClose)`
  width: 8px;
  height: 8px;
  fill: ${wrongIconColor};
  &:hover {
    fill: ${wrongIconColor};
  }
`

export const PartialIcon = styled(RightIcon)`
  fill: #dfd82c;
  &:hover {
    fill: #dfd82c;
  }
`

import styled from 'styled-components'
import { IconCheck, IconClose } from '@edulastic/icons'

export const RightIcon = styled(IconCheck)`
  width: 10px;
  height: 10px;
  fill: ${({ theme }) => theme.checkColor};
  &:hover {
    fill: ${({ theme }) => theme.checkColor};
  }
`

export const WrongIcon = styled(IconClose)`
  width: 8px;
  height: 8px;
  fill: ${({ theme }) => theme.wrongIconColor};
  &:hover {
    fill: ${({ theme }) => theme.wrongIconColor};
  }
`

export const PartialIcon = styled(RightIcon)`
  fill: #dfd82c;
  &:hover {
    fill: #dfd82c;
  }
`

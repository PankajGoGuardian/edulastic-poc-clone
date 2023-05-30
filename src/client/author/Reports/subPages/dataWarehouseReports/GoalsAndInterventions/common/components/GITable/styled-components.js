import styled from 'styled-components'
import { black, themeColor } from '@edulastic/colors'
import { IconCharInfo } from '@edulastic/icons'

export const StyledInfoIcon = styled(IconCharInfo)`
  width: 6px;
  height: 10px;
  position: relative;
  top: -7px;
  left: -2px;
  cursor: pointer;
  & path {
    fill: ${black};
  }
`
export const StyledViewButton = styled.div`
  color: ${themeColor};
  cursor: pointer;
`

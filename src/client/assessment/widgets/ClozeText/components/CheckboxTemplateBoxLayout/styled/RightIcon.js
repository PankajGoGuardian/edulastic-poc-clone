import styled from 'styled-components'
import { IconCheck } from '@edulastic/icons'

export const RightIcon = styled(IconCheck)`
  width: 10px;
  height: 10px;
  fill: ${(props) => props.theme.themeColor};
  &:hover {
    fill: ${(props) => props.theme.themeColor};
  }
`

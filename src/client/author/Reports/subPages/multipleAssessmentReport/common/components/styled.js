import styled from 'styled-components'
import { trendTypes } from '../utils/constants'

export const StyledTrendIcon = styled.i`
  transform: rotate(${(props) => trendTypes[props.type].rotation}deg);
`

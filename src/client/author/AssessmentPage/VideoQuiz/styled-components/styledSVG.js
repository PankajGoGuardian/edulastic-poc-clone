import styled from 'styled-components'
import { themeColor, white } from '@edulastic/colors'

export const Circle = styled.circle`
  fill: ${themeColor};
`

export const G = styled.g`
  polyline {
    stroke: ${white};
    fill: none;
  }
  rect {
    fill: ${white};
  }
`

export const Polygon = styled.polygon`
  fill: ${white};
`

export const Path = styled.path`
  fill: ${white};
`

export const Svg = styled.svg`
  cursor: pointer;
`

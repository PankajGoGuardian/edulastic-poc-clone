import React from 'react'
import { map } from 'lodash'
import { ColorCircle } from '../../../../../common/styled'
import {
  LegendWrapper,
  StyledLegendContainer,
} from '../../common/styledComponents'

const PreVsPostLegend = ({ selectedPerformanceBand }) => {
  const legend = map(selectedPerformanceBand, (pb) => {
    const { name, color } = pb
    return (
      <StyledLegendContainer>
        <ColorCircle color={color} />
        <span>{name}</span>
      </StyledLegendContainer>
    )
  })
  return <LegendWrapper>{legend}</LegendWrapper>
}

export default PreVsPostLegend

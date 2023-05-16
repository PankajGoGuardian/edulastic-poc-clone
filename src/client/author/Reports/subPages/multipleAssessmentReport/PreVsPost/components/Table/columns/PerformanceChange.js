import React from 'react'
import { StyledDiv } from '../../../common/styledComponents'
import IconArrow from '../../common/IconArrow'

const PerformanceChange = ({ record }) => {
  const { preAvgScorePercentage, postAvgScorePercentage } = record
  const value = postAvgScorePercentage - preAvgScorePercentage
  return (
    <StyledDiv>
      {Math.abs(value)}%
      <IconArrow value={value} size="small" />
    </StyledDiv>
  )
}

export default PerformanceChange

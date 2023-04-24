import React from 'react'
import { isNaN } from 'lodash'
import { StyledDiv } from '../../../../../multipleAssessmentReport/PreVsPost/common/styledComponents'
import IconArrow from '../../../../../multipleAssessmentReport/PreVsPost/components/common/IconArrow'

const PerformanceChange = ({ data }) => {
  const { preTestData, postTestData } = data
  const value = preTestData.avgScorePercentage - postTestData.avgScorePercentage
  const valueToShow = isNaN(value) ? 'N/A' : `${Math.abs(value)}%`
  return (
    <StyledDiv>
      {valueToShow}
      <IconArrow value={value} size="small" />
    </StyledDiv>
  )
}

export default PerformanceChange

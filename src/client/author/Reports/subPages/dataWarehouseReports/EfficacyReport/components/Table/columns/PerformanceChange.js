import React from 'react'
import { StyledDiv } from '../../../../../multipleAssessmentReport/PreVsPost/common/styledComponents'
import IconArrow from '../../../../../multipleAssessmentReport/PreVsPost/components/common/IconArrow'

const PerformanceChange = ({ data, testInfo }) => {
  const { preTestData, postTestData } = data
  const { preTestInfo, postTestInfo } = testInfo
  let change = 'N/A'
  let changeSuffix = ''
  const areBothExternalOrInternal =
    preTestInfo.isExternal === postTestInfo.isExternal
  if (areBothExternalOrInternal) {
    if (
      preTestInfo.isExternal &&
      preTestInfo.testCategory === postTestInfo.testCategory
    ) {
      change = postTestData.avgScore - preTestData.avgScore
    } else if (!preTestInfo.isExternal) {
      change = postTestData.avgScorePercentage - preTestData.avgScorePercentage
      changeSuffix = '%'
    }
  }
  const changeText =
    typeof change === 'number' ? `${Math.abs(change)} ${changeSuffix}` : 'N/A'
  return (
    <StyledDiv>
      {changeText}
      <IconArrow value={change} size="small" />
    </StyledDiv>
  )
}

export default PerformanceChange

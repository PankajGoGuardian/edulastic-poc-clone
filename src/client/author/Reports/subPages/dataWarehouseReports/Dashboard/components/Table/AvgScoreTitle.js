import { EduIf } from '@edulastic/common'
import React from 'react'
import { StyledTag } from '../../../common/styled'

const AvgScoreTitle = ({ testType }) => {
  const isEdulastic = testType === 'Edulastic'
  return (
    <>
      <EduIf condition={isEdulastic}>
        <StyledTag border="1.5px solid black" font="bold" marginBlock="5px">
          {testType}
        </StyledTag>
      </EduIf>
      <EduIf condition={!isEdulastic}>
        <StyledTag color="black" marginBlock="5px">
          {testType.key}
        </StyledTag>
      </EduIf>
      <div>AVG. SCORE</div>
    </>
  )
}

export default AvgScoreTitle

import { EduElse, EduIf, EduThen } from '@edulastic/common'
import React from 'react'
import { StyledTag } from '../../../common/components/styledComponents'

const TestColumnTitle = ({ testType, isExternal }) => {
  return (
    <>
      <EduIf condition={isExternal}>
        <EduThen>
          <StyledTag color="black" marginBlock="5px">
            {testType}
          </StyledTag>
        </EduThen>
        <EduElse>
          <StyledTag border="1.5px solid black" font="bold" marginBlock="5px">
            {testType}
          </StyledTag>
        </EduElse>
      </EduIf>
    </>
  )
}

export default TestColumnTitle

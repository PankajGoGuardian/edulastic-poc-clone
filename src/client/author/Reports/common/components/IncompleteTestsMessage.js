import React from 'react'
import { EduIf } from '@edulastic/common'
import { StyledH3 } from '../styled'

const IncompleteTestsMessage = ({
  hasIncompleteTests,
  incompleteTestsMessageMargin = '0',
}) => {
  return (
    <EduIf condition={hasIncompleteTests}>
      <StyledH3
        fontSize="10px"
        fontWeight="normal"
        margin={incompleteTestsMessageMargin}
      >
        * Some assignment(s) for this test are still in progress and hence the
        results may not be complete
      </StyledH3>
    </EduIf>
  )
}

export default IncompleteTestsMessage

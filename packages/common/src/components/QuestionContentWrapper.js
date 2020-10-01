import React from 'react'
import { FlexContainer } from '@edulastic/common'

const QuestionContentWrapper = ({ children }) => (
  <FlexContainer
    alignItems="flex-start"
    flexDirection="column"
    width="calc(100% - 51px)" // current question label width
    marginLeft="auto"
    className="question-content-wrapper __print_question-content-wrapper"
  >
    {children}
  </FlexContainer>
)

export default QuestionContentWrapper

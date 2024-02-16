import React, { useState } from 'react'
import {
  FormLabel,
  StyledStimulusContainer,
} from '../../../../styled-components/QuestionForm'
import QuestionTextArea from '../../../../../../../assessment/components/QuestionTextArea'

const VideoQuizStimulus = ({ stimulus, onUpdate }) => {
  const [isQuestionInputActive, setIsQuestionInputActive] = useState(false)
  const handleStimulusChange = (value) => {
    const updateData = {
      stimulus: value,
    }
    onUpdate(updateData)
  }

  const handleFocusBlurEvent = (event) => {
    setIsQuestionInputActive(event === 'focus')
  }

  return (
    <>
      <FormLabel>Question</FormLabel>
      <StyledStimulusContainer
        onFocus={() => handleFocusBlurEvent('focus')}
        onBlur={() => handleFocusBlurEvent('blur')}
        isQuestionInputActive={isQuestionInputActive}
        data-cy="questionInputArea"
      >
        <QuestionTextArea
          onChange={(value) => handleStimulusChange(value || '')}
          value={stimulus}
          border="border"
          toolbarId="compose-video-quiz-question"
          backgroundColor
        />
      </StyledStimulusContainer>
    </>
  )
}

export default VideoQuizStimulus

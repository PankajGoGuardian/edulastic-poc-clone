import React, { useState } from 'react'
import {
  FormLabel,
  StyledStimulusContainer,
} from '../../../../styled-components/QuestionForm'
import QuestionTextArea from '../../../../../../../assessment/components/QuestionTextArea'

const VideoQuizStimulus = ({ stimulus, onUpdate }) => {
  const [isStimulusFocussed, setIsStimulusFocussed] = useState(false)
  const handleStimulusChange = (value) => {
    const updateData = {
      stimulus: value,
    }
    onUpdate(updateData)
  }

  const handleFocusBlurEvent = (event) => {
    setIsStimulusFocussed(event === 'focus')
  }

  return (
    <>
      <FormLabel>Stimulus</FormLabel>
      <StyledStimulusContainer
        onFocus={() => handleFocusBlurEvent('focus')}
        onBlur={() => handleFocusBlurEvent('blur')}
        isStimulusFocussed={isStimulusFocussed}
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

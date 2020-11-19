import { EduButton, FlexContainer } from '@edulastic/common'
import React, { useState } from 'react'

import {
  RadioLabel,
  RadioLabelGroup,
} from '../../../../assessment/styled/RadioWithLabel'
import { SubtitleText } from '../../../../assessment/styled/Subtitle'
import { CloneOptionsWrapper } from './styled'

function CloneOptions({ hideOptions, onDuplicate }) {
  const [cloneOption, toggleCloneOption] = useState('no')

  function handleChange(event) {
    toggleCloneOption(event.target.value)
  }

  function handleCancel() {
    hideOptions()
  }

  function proceedToClone() {
    const shouldClone = cloneOption === 'yes'
    onDuplicate(shouldClone)
  }

  return (
    <CloneOptionsWrapper>
      <SubtitleText>How would you like to clone the test?</SubtitleText>
      <FlexContainer flexDirection="column" mt="10px">
        <RadioLabelGroup value={cloneOption} onChange={handleChange}>
          <RadioLabel value="no">
            Keep references to the original items - you can clone them
            individually later on
          </RadioLabel>
          <RadioLabel value="yes">
            Create a clone of all the items in the test upfront
          </RadioLabel>
        </RadioLabelGroup>
      </FlexContainer>
      <FlexContainer justifyContent="flex-end" mt="10px">
        <EduButton isGhost onClick={handleCancel}>
          Cancel
        </EduButton>
        <EduButton onClick={proceedToClone}>Continue to clone</EduButton>
      </FlexContainer>
    </CloneOptionsWrapper>
  )
}

export default CloneOptions

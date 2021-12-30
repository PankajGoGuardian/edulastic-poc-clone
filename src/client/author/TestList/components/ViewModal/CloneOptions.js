import { EduButton, FlexContainer } from '@edulastic/common'
import { Tooltip } from 'antd'
import React, { useState } from 'react'

import {
  RadioLabel,
  RadioLabelGroup,
} from '../../../../assessment/styled/RadioWithLabel'
import { SubtitleText } from '../../../../assessment/styled/Subtitle'
import { CloneOptionsWrapper } from './styled'

function CloneOptions({ hideOptions, onDuplicate, status }) {
  const defaultCloneOption = status === 'draft' ? 'yes' : 'no'
  const [cloneOption, toggleCloneOption] = useState(defaultCloneOption)

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
          <Tooltip
            title={
              status === 'draft'
                ? 'Test cloning with keeping reference to original items is allowed only for published tests'
                : ''
            }
          >
            <RadioLabel
              data-cy="with-original-item"
              value="no"
              disabled={status === 'draft'}
            >
              Keep references to the original items you can clone them
              individually later on
            </RadioLabel>
          </Tooltip>
          <RadioLabel data-cy="with-new-item" value="yes">
            Create a clone of all the items in the test upfront
          </RadioLabel>
        </RadioLabelGroup>
      </FlexContainer>
      <FlexContainer justifyContent="flex-end" mt="10px">
        <EduButton isGhost onClick={handleCancel}>
          Cancel
        </EduButton>
        <EduButton onClick={proceedToClone} data-cy="continueToClone">
          Continue to clone
        </EduButton>
      </FlexContainer>
    </CloneOptionsWrapper>
  )
}

export default CloneOptions

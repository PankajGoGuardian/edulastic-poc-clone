import { EduButton } from '@edulastic/common'
import React, { useState } from 'react'

import {
  RadioLabel,
  RadioLabelGroup,
} from '../../../../assessment/styled/RadioWithLabel'
import { CloneModal, FullHeightContainer } from './styled'

const title = 'How would you like to clone the test?'

function Modal({ visible, toggleVisibility, handleDuplicateTest }) {
  const [cloneOption, toggleCloneOption] = useState('no')

  function handleChange(event) {
    toggleCloneOption(event.target.value)
  }

  function handleClose() {
    toggleVisibility(false)
    toggleCloneOption('no')
  }

  function handleOk() {
    const shouldClone = cloneOption === 'yes'
    handleDuplicateTest(shouldClone)
  }

  const footer = [
    <EduButton isGhost onClick={handleClose}>
      Close
    </EduButton>,
    <EduButton onClick={handleOk}>Continue to clone</EduButton>,
  ]

  return (
    <CloneModal
      onCancel={handleClose}
      title={title}
      visible={visible}
      centered
      textAlign="left"
      footer={footer}
    >
      <FullHeightContainer>
        <RadioLabelGroup value={cloneOption} onChange={handleChange}>
          <RadioLabel data-cy="with-original-item" value="no">
            Keep references to the original items - you can clone them
            individually later on
          </RadioLabel>
          <RadioLabel data-cy="with-new-item" value="yes">
            Create a clone of all the items in the test upfront
          </RadioLabel>
        </RadioLabelGroup>
      </FullHeightContainer>
    </CloneModal>
  )
}

export default Modal

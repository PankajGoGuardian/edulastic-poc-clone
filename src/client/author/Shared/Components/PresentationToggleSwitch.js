import React from 'react'
import { notification, EduButton } from '@edulastic/common'
import { connect } from 'react-redux'
import { get } from 'lodash'
import FeaturesSwitch from '../../../features/components/FeaturesSwitch'
import { togglePresentationModeAction } from '../../src/actions/testActivity'

const PresentationToggleSwitch = ({
  isPresentationMode,
  togglePresentationMode,
  groupId,
}) => {
  const toggleCurrentMode = () => {
    togglePresentationMode()
    if (!isPresentationMode)
      notification({ type: 'info', messageKey: 'presentationMode' })
  }

  const title = !isPresentationMode
    ? 'Presentation Mode will anonymize the names of students'
    : 'Disable Presentation Mode'
  return (
    <FeaturesSwitch
      inputFeatures="presentationMode"
      actionOnInaccessible="hidden"
      groupId={groupId}
    >
      <EduButton
        isGhost
        title={title}
        onClick={toggleCurrentMode}
        height="24px"
        width="108px"
      >
        {isPresentationMode ? 'RESET' : 'PRESENT'}
      </EduButton>
    </FeaturesSwitch>
  )
}

export default connect(
  (state) => ({
    isPresentationMode: get(
      state,
      ['author_classboard_testActivity', 'presentationMode'],
      false
    ),
  }),
  {
    togglePresentationMode: togglePresentationModeAction,
  }
)(PresentationToggleSwitch)

import { EduButton } from '@edulastic/common'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { ConfirmationModal } from '../../../src/components/common/ConfirmationModal'
import {
  getHasDuplicateAssignmentsSelector,
  saveAssignmentAction,
  saveV2AssignmentAction,
  toggleHasDuplicateAssignmentPopupAction,
} from '../../../TestPage/components/Assign/ducks'
import { getPlaylistSelector, getTestSelector } from '../../../TestPage/ducks'
import { Paragraph } from './styled'

const MultipleAssignConfirmation = ({
  hasDuplicateAssignments,
  toggleHasDuplicateAssignmentPopup,
  entity,
  saveAssignment,
  saveV2Assignment,
  assignment,
  moduleTitle,
}) => {
  const [saving, setSavingState] = useState(false)

  const onProceed = () => {
    setSavingState(true)
    // allowCommonStudents has to be true for the second time as we have to avoid
    // saveAssignment({
    //   ...assignment,
    //   allowCommonStudents: true,
    //   allowDuplicates: true,
    // })
    saveV2Assignment({
      ...assignment,
      allowCommonStudents: true,
      allowDuplicates: true,
    })
  }

  const onRemoveDuplicates = () => {
    setSavingState(true)
    // saveAssignment({
    //   ...assignment,
    //   allowCommonStudents: true,
    //   removeDuplicates: true,
    // })
    saveV2Assignment({
      ...assignment,
      allowCommonStudents: true,
      removeDuplicates: true,
    })
  }

  const onCancel = () => {
    toggleHasDuplicateAssignmentPopup(false)
  }

  const Footer = [
    <EduButton
      isGhost
      data-cy="duplicate"
      onClick={onProceed}
      disabled={saving}
    >
      Proceed with duplicate
    </EduButton>,
    <EduButton
      disabled={saving}
      data-cy="noDuplicate"
      onClick={onRemoveDuplicates}
    >
      Remove duplicates
    </EduButton>,
  ]

  return (
    <ConfirmationModal
      maskClosable={false}
      textAlign="left"
      title="Warning"
      centered
      visible={hasDuplicateAssignments}
      footer={Footer}
      onCancel={onCancel}
      afterClose={() => setSavingState(false)}
    >
      <Paragraph>
        <b>{moduleTitle || entity.title}</b> has already been assigned to one or
        more of the selected students. Those students will receive a duplicate
        copy of this assessment.
      </Paragraph>
      <Paragraph>
        Please select if the student(s) should receive a duplicate assessment.
      </Paragraph>
    </ConfirmationModal>
  )
}

export default connect(
  (state, ownProps) => ({
    hasDuplicateAssignments: getHasDuplicateAssignmentsSelector(state),
    entity: ownProps.isPlaylist
      ? getPlaylistSelector(state)
      : getTestSelector(state),
  }),
  {
    saveAssignment: saveAssignmentAction,
    saveV2Assignment: saveV2AssignmentAction,
    toggleHasDuplicateAssignmentPopup: toggleHasDuplicateAssignmentPopupAction,
  }
)(MultipleAssignConfirmation)

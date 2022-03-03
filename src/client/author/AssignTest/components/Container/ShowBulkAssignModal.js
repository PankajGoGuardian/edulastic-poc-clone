import { EduButton } from '@edulastic/common'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { ConfirmationModal } from '../../../src/components/common/ConfirmationModal'
import {
  getSearchTermsFilterSelector,
  saveBulkAssignmentAction,
} from '../../../TestPage/components/Assign/ducks'
import {
  getPlaylistSelector,
  getTestSelector,
  getTestIdSelector,
} from '../../../TestPage/ducks'
import { Paragraph } from './styled'

const ShowBulkAssignModal = ({
  closeModal,
  assignmentSettings,
  moduleTitle,
  entity,
  saveBulkAssignment,
  searchTerms,
  testId,
  excludeSchools,
}) => {
  const [saving, setSavingState] = useState(false)

  const handleCloseBulkAssign = () => {
    setSavingState(false)
    closeModal()
  }

  const handleProceedBulkAssign = () => {
    setSavingState(true)
    const { institutionIds, grades, subjects } = searchTerms
    const payload = {
      grades,
      subjects,
      testId,
      assignmentSettings,
      schoolIds: institutionIds,
      excludeSchools,
    }

    saveBulkAssignment(payload)
    handleCloseBulkAssign()
  }

  const Footer = [
    <EduButton
      key="submit"
      onClick={handleProceedBulkAssign}
      data-cy="ProceedBulkAssign"
      disabled={saving}
    >
      Proceed
    </EduButton>,
    <EduButton
      isGhost
      key="cancel"
      data-cy="CancelBulkAssign"
      onClick={handleCloseBulkAssign}
    >
      Cancel
    </EduButton>,
  ]

  const testName = moduleTitle || entity.title
  return (
    <ConfirmationModal
      maskClosable={false}
      textAlign="left"
      title="Bulk Assign"
      centered
      visible
      onCancel={handleCloseBulkAssign}
      footer={Footer}
      modalWidth="500px"
      bodyHeight="75px"
    >
      <Paragraph data-cy="BulkAssignBody">
        You are about to assign <b>{testName.toUpperCase()}</b> to ALL the
        classes matching the filter criteria. NOT just the ones selected in the
        assign page. Are you sure you are ready to assign?
      </Paragraph>
    </ConfirmationModal>
  )
}

export default connect(
  (state, ownProps) => ({
    entity: ownProps.isPlaylist
      ? getPlaylistSelector(state)
      : getTestSelector(state),
    searchTerms: getSearchTermsFilterSelector(state),
    testId: getTestIdSelector(state),
    excludeSchools: get(state, 'authorTestAssignments.excludeSchools', false),
  }),
  {
    saveBulkAssignment: saveBulkAssignmentAction,
  }
)(ShowBulkAssignModal)

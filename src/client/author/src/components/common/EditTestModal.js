import React from 'react'
import { EduButton } from '@edulastic/common'
import { ConfirmationModal } from './ConfirmationModal'

const EditTestModal = ({ visible, onCancel, onOk, isUsed = false }) => (
  <ConfirmationModal
    centered
    visible={visible}
    onCancel={onCancel}
    title="Edit Test"
    footer={[
      <EduButton isGhost data-cy="CANCEL" height="40px" onClick={onCancel}>
        CANCEL
      </EduButton>,
      <EduButton height="40px" data-cy="PROCEED" onClick={onOk}>
        PROCEED
      </EduButton>,
    ]}
  >
    {isUsed
      ? `You are editing an assigned test.   After making corrections, you will need to select Regrade.  
      Be sure to 1) select the correct option for rescoring any already submitted tests and 2) select 
      Publish and Regrade to initiate rescoring and allow students to resume the revised test.`
      : `You are about to edit a test that has already been published. If you wish to edit this test,
     we will move this test to draft status. Do you want to proceed?`}
  </ConfirmationModal>
)

export default EditTestModal

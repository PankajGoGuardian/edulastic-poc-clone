import React from 'react'
import { EduButton, CustomModalStyled } from '@edulastic/common'
import { IconPlusCircle } from '@edulastic/icons'

const CreateNewAssignmentModal = ({ visible, onCancel, onConfirm }) => (
  <CustomModalStyled
    title="Create Assignment"
    visible={visible}
    modalWidth="400px"
    footer={[
      <EduButton
        data-cy="assignButton"
        height="40px"
        key="newAssignmentButton"
        onClick={onConfirm}
      >
        <IconPlusCircle /> NEW ASSIGNMENT
      </EduButton>,
    ]}
    data-cy="createAssignmentModal"
    onCancel={onCancel}
    centered
  >
    <p>Class created! Next, assign a test to your newly created class.</p>
  </CustomModalStyled>
)

export default CreateNewAssignmentModal

import React from 'react'
import { CustomModalStyled, EduButton } from '@edulastic/common'
import {
  GradingSkipCountContainer,
  GradingSkipWarningContainer,
} from './styled'

const MarkAsDoneConfirmationModal = ({
  visible,
  notGradedStudentsCount,
  onCancel,
  onMarkAsDone,
}) => {
  return (
    <CustomModalStyled
      centered
      title="Mark as Done"
      closable
      visible={visible}
      onCancel={onCancel}
      footer={
        <>
          <EduButton isGhost onClick={onCancel}>
            NO, CANCEL
          </EduButton>
          <EduButton onClick={onMarkAsDone}>YES, DONE</EduButton>
        </>
      }
    >
      <GradingSkipCountContainer>
        {notGradedStudentsCount} STUDENT(S) HAVE NOT YET GRADED
      </GradingSkipCountContainer>
      <GradingSkipWarningContainer>
        Are you sure you want to Mark as Done? Once Done, non-graded students
        will be marked as skipped.
      </GradingSkipWarningContainer>
    </CustomModalStyled>
  )
}

export default MarkAsDoneConfirmationModal

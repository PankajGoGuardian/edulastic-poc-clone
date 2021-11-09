import React from 'react'
import { Link } from 'react-router-dom'
import { CustomModalStyled, EduButton } from '@edulastic/common'

const UploadAgainConfirmationModal = ({
  assignmentId,
  groupId,
  setShowConfirmationModal,
}) => {
  const closeModal = () => {
    setShowConfirmationModal(false)
  }
  return (
    <CustomModalStyled
      visible
      title=""
      onCancel={closeModal}
      footer={[
        <EduButton data-cy="cancel" isGhost key="back" onClick={closeModal}>
          CANCEL
        </EduButton>,
        <EduButton data-cy="submit">
          <Link
            data-cy="uploadAgainButton"
            className="upload-again-link"
            to={{
              pathname: '/uploadAnswerSheets',
              search: `?assignmentId=${assignmentId}&groupId=${groupId}`,
            }}
          >
            PROCEED
          </Link>
        </EduButton>,
      ]}
    >
      <p style={{ textAlign: 'center' }}>Click Proceed To Continue</p>
    </CustomModalStyled>
  )
}

export default UploadAgainConfirmationModal

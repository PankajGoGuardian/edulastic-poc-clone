import { CustomModalStyled } from '@edulastic/common'
import React from 'react'

const TrialConfirmationModal = ({
  visible,
  showTrialSubsConfirmationAction,
  showTrialConfirmationMessage,
}) => {
  const handleCloseModal = () => {
    showTrialSubsConfirmationAction(false)
  }
  return (
    <CustomModalStyled
      visible={visible}
      title="Purchase Confirmation"
      onCancel={handleCloseModal}
      footer={null}
      centered
    >
      <p>{showTrialConfirmationMessage}</p>
    </CustomModalStyled>
  )
}

export default TrialConfirmationModal

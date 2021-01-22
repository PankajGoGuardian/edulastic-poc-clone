import { CustomModalStyled } from '@edulastic/common'
import React from 'react'

const TrialConfirmationModal = ({
  visible,
  isPremiumUser,
  subEndDate,
  showTrialSubsConfirmationAction,
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
      {isPremiumUser ? (
        <p>
          Thanks for trying premium Spark assessments and practice. Your trial
          will expire on {subEndDate}. After your trial ends, continue to use
          additional Spark content for a full calendar year for just $100.
        </p>
      ) : (
        <p>
          Thanks for trying Teacher Premium and additional Spark content. Your
          subscription will expire on {subEndDate}. After your trial ends
          upgrade for a full calendar year for just $100 plus optional Spark
          premium content that you choose to add on.
        </p>
      )}
    </CustomModalStyled>
  )
}

export default TrialConfirmationModal

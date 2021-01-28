import { CustomModalStyled } from '@edulastic/common'
import React from 'react'

const TrialConfirmationModal = ({
  visible,
  isPremiumUser,
  isPremiumTrialUsed,
  subEndDate,
  showTrialSubsConfirmationAction,
  usedTrialItemBankId,
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
      {(isPremiumUser || isPremiumTrialUsed) && usedTrialItemBankId ? (
        <p>
          Thanks for trying Teacher Premium and additional Spark content. Your
          subscription will expire on {subEndDate}. After your trial ends
          upgrade for a full calendar year for just $100 plus optional Spark
          premium content that you choose to add on.
        </p>
      ) : (
        <p>
          Thanks for trying teacher premium. Your trial will expire on{' '}
          {subEndDate}. After your trial ends, continue to use teacher premium
          for a full calendar year for just $100.
        </p>
      )}
    </CustomModalStyled>
  )
}

export default TrialConfirmationModal

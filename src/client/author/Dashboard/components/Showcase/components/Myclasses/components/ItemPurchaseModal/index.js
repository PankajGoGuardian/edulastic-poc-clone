import React from 'react'
import PropTypes from 'prop-types'
import { CustomModalStyled, EduButton, FlexContainer } from '@edulastic/common'
import { Link } from 'react-router-dom'

const Footer = ({
  hasItemBankTrial,
  isPremiumTrialUsed,
  premiumUser,
  handleTrial,
}) => {
  const hasTrialBtn = hasItemBankTrial && (!isPremiumTrialUsed || premiumUser)
  return (
    hasTrialBtn && <EduButton onClick={handleTrial}>Try for free</EduButton>
  )
}

const ItemPurchaseModal = ({
  title,
  description,
  isVisible,
  toggleModal,
  toggleTrialModal,
  hasTrial,
  premiumUser,
  isPremiumTrialUsed,
}) => {
  const handleProceed = () => {}

  const closeModal = () => toggleModal(false)
  const handleTrial = () => {
    closeModal()
    toggleTrialModal(true)
  }

  return (
    <CustomModalStyled
      centered
      title={title}
      footer={
        <Footer
          hasItemBankTrial={hasTrial}
          isPremiumTrialUsed={isPremiumTrialUsed}
          premiumUser={premiumUser}
          handleTrial={handleTrial}
        />
      }
      visible={isVisible}
      onCancel={closeModal}
    >
      <div>{description}</div>
      {isPremiumTrialUsed && !premiumUser && (
        <p>
          You have already tried premium features, kindly upgrade to start free
          trial of {title}.{' '}
          <Link to="/author/subscription"> Click to upgrade</Link>
        </p>
      )}
    </CustomModalStyled>
  )
}

ItemPurchaseModal.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  premiumUser: PropTypes.bool.isRequired,
  hasTrial: PropTypes.bool,
}

ItemPurchaseModal.defaultProps = {
  hasTrial: false,
}

export default ItemPurchaseModal

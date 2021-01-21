import React from 'react'
import PropTypes from 'prop-types'
import { CustomModalStyled, EduButton } from '@edulastic/common'
import { Link } from 'react-router-dom'

const Footer = ({
  hasItemBankTrial,
  isPremiumTrialUsed,
  isPremiumUser,
  handleTrial,
  handlePurchaseFlow,
}) => {
  const hasTrialBtn = hasItemBankTrial && (!isPremiumTrialUsed || isPremiumUser)
  return (
    <>
      {hasTrialBtn && (
        <EduButton isGhost isBlue onClick={handleTrial}>
          Try for free
        </EduButton>
      )}
      {!isPremiumUser && (
        <EduButton isBlue onClick={handlePurchaseFlow}>
          Purchase
        </EduButton>
      )}
    </>
  )
}

const ItemPurchaseModal = ({
  title,
  description,
  isVisible,
  toggleModal,
  toggleTrialModal,
  hasTrial,
  isPremiumUser,
  isPremiumTrialUsed,
  handlePurchaseFlow,
}) => {
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
          isPremiumUser={isPremiumUser}
          handleTrial={handleTrial}
          handlePurchaseFlow={handlePurchaseFlow}
        />
      }
      visible={isVisible}
      onCancel={closeModal}
    >
      <div>{description}</div>
      {isPremiumTrialUsed && !isPremiumUser && (
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
  isPremiumUser: PropTypes.bool.isRequired,
  hasTrial: PropTypes.bool,
}

ItemPurchaseModal.defaultProps = {
  hasTrial: false,
}

export default ItemPurchaseModal

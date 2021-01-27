import React from 'react'
import PropTypes from 'prop-types'
import { CustomModalStyled, EduButton } from '@edulastic/common'

const Footer = ({ handleTrial, handlePurchaseFlow, showTrialButton }) => {
  return (
    <>
      {showTrialButton && (
        <EduButton data-cy="trialPurchase" isGhost isBlue onClick={handleTrial}>
          Try for free
        </EduButton>
      )}
      <EduButton data-cy="Purchase" isBlue onClick={handlePurchaseFlow}>
        Purchase
      </EduButton>
    </>
  )
}

const ItemPurchaseModal = ({
  title,
  description,
  isVisible,
  toggleModal,
  toggleTrialModal,
  handlePurchaseFlow,
  showTrialButton,
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
          handleTrial={handleTrial}
          handlePurchaseFlow={handlePurchaseFlow}
          showTrialButton={showTrialButton}
        />
      }
      visible={isVisible}
      onCancel={closeModal}
    >
      <div dangerouslySetInnerHTML={{ __html: description }} />
    </CustomModalStyled>
  )
}

ItemPurchaseModal.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
}

export default ItemPurchaseModal

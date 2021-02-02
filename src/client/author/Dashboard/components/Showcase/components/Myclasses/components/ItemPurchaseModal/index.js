import React from 'react'
import PropTypes from 'prop-types'
import { CustomModalStyled, EduButton } from '@edulastic/common'
import AuthorCompleteSignupButton from '../../../../../../../../common/components/AuthorCompleteSignupButton'

const Footer = ({ handleTrial, handlePurchaseFlow }) => {
  return (
    <>
      <AuthorCompleteSignupButton
        renderButton={(handleClick) => (
          <EduButton
            data-cy="trialPurchase"
            isGhost
            isBlue
            onClick={handleClick}
          >
            Try for free
          </EduButton>
        )}
        onClick={handleTrial}
      />
      <AuthorCompleteSignupButton
        renderButton={(handleClick) => (
          <EduButton data-cy="Purchase" isBlue onClick={handleClick}>
            Purchase
          </EduButton>
        )}
        onClick={handlePurchaseFlow}
      />
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

import React from 'react'
import PropTypes from 'prop-types'
import { CustomModalStyled, EduButton } from '@edulastic/common'

const ItemPurchaseModal = ({
  title,
  productId,
  description,
  hasTrial,
  isVisible,
  toggleModal,
}) => {
  const handlePurchase = () => {
    console.log(productId)
  }

  const handleTrial = () => {
    console.log(productId)
  }

  const Footer = (
    <>
      {hasTrial !== false && (
        <EduButton isGhost onClick={handleTrial}>
          Try for free
        </EduButton>
      )}
      <EduButton onClick={handlePurchase}>Purchase</EduButton>
    </>
  )

  const closeModal = () => toggleModal(false)

  return (
    <CustomModalStyled
      centered
      title={title}
      footer={Footer}
      visible={isVisible}
      onCancel={closeModal}
    >
      {description}
    </CustomModalStyled>
  )
}

ItemPurchaseModal.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  hasTrial: PropTypes.bool.isRequired,
  productId: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
}

export default ItemPurchaseModal

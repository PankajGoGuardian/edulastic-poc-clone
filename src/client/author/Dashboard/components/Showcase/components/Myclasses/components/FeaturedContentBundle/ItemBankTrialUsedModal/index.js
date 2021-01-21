import React from 'react'
import PropTypes from 'prop-types'
import { CustomModalStyled, EduButton } from '@edulastic/common'

const Footer = ({ handleCloseModal, handlePurchaseFlow }) => {
  return (
    <>
      <EduButton isGhost isBlue onClick={handleCloseModal}>
        Cancel
      </EduButton>
      <EduButton isBlue onClick={handlePurchaseFlow}>
        Purchase
      </EduButton>
    </>
  )
}

const ItemBankTrialUsedModal = ({
  title,
  isVisible,
  handleCloseModal,
  handlePurchaseFlow,
}) => {
  return (
    <CustomModalStyled
      centered
      title=""
      footer={
        <Footer
          handleCloseModal={handleCloseModal}
          handlePurchaseFlow={handlePurchaseFlow}
        />
      }
      visible={isVisible}
      onCancel={handleCloseModal}
    >
      <p>
        Free trail for <b> {title} </b> is already utilized. Kindly purchase to
        access the content.
      </p>
    </CustomModalStyled>
  )
}

ItemBankTrialUsedModal.propTypes = {
  title: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
}

export default ItemBankTrialUsedModal

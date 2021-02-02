import React from 'react'
import PropTypes from 'prop-types'
import { CustomModalStyled, EduButton } from '@edulastic/common'

const Footer = ({
  isCurrentItemBankUsed,
  handleCloseModal,
  handlePurchaseFlow,
}) => {
  return (
    <>
      <EduButton data-cy="closeModal" isGhost isBlue onClick={handleCloseModal}>
        Cancel
      </EduButton>
      <EduButton data-cy="Purchase" isBlue onClick={handlePurchaseFlow}>
        {isCurrentItemBankUsed ? 'Purchase' : 'Upgrade'}
      </EduButton>
    </>
  )
}

const ItemBankTrialUsedModal = ({
  title,
  isVisible,
  handleCloseModal,
  handlePurchaseFlow,
  isCurrentItemBankUsed,
}) => {
  return (
    <CustomModalStyled
      centered
      title=""
      footer={
        <Footer
          handleCloseModal={handleCloseModal}
          handlePurchaseFlow={handlePurchaseFlow}
          isCurrentItemBankUsed={isCurrentItemBankUsed}
        />
      }
      visible={isVisible}
      onCancel={handleCloseModal}
    >
      {!isCurrentItemBankUsed ? (
        <p>
          Kindly Upgrade to premium version of app for trying any other item
          bank.
        </p>
      ) : (
        <p>
          Free trail for <b> {title} </b> is already utilized. Kindly purchase
          to access the content.
        </p>
      )}
    </CustomModalStyled>
  )
}

ItemBankTrialUsedModal.propTypes = {
  title: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
}

export default ItemBankTrialUsedModal

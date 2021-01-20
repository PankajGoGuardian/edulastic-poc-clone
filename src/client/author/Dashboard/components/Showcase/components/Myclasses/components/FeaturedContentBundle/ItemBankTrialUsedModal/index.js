import React from 'react'
import PropTypes from 'prop-types'
import { CustomModalStyled, EduButton } from '@edulastic/common'

const Footer = ({ itemBankNotUsed, handleCloseModal }) => {
  return (
    <>
      {itemBankNotUsed ? (
        <>
          <EduButton isGhost isBlue onClick={handleCloseModal}>
            Cancel
          </EduButton>
          <EduButton isBlue>Upgrade</EduButton>
        </>
      ) : (
        <>
          <EduButton isGhost isBlue onClick={handleCloseModal}>
            Cancel
          </EduButton>
          <EduButton isBlue>Purchase</EduButton>
        </>
      )}
    </>
  )
}

const ItemBankTrialUsedModal = ({
  title,
  isVisible,
  handleCloseModal,
  itemBankNotUsed,
}) => {
  return (
    <CustomModalStyled
      centered
      title=""
      footer={
        <Footer
          itemBankNotUsed={itemBankNotUsed}
          handleCloseModal={handleCloseModal}
        />
      }
      visible={isVisible}
      onCancel={handleCloseModal}
    >
      {itemBankNotUsed ? (
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

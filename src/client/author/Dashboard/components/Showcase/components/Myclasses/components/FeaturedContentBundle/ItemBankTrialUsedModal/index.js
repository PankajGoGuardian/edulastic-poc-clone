import React from 'react'
import PropTypes from 'prop-types'
import { CustomModalStyled, EduButton } from '@edulastic/common'

const Footer = ({ handleCloseModal }) => {
  return (
    <>
      <EduButton isGhost isBlue onClick={handleCloseModal}>
        Cancel
      </EduButton>
      <EduButton isBlue>Purchase</EduButton>
    </>
  )
}

const ItemBankTrialUsedModal = ({ title, isVisible, handleCloseModal }) => {
  return (
    <CustomModalStyled
      centered
      title=""
      footer={<Footer handleCloseModal={handleCloseModal} />}
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

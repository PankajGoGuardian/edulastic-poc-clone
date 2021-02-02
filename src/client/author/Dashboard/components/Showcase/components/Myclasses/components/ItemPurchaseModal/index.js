import React from 'react'
import PropTypes from 'prop-types'
import { CustomModalStyled, EduButton } from '@edulastic/common'
import styled from 'styled-components'
import { darkGrey2 } from '@edulastic/colors'
import AuthorCompleteSignupButton from '../../../../../../../../common/components/AuthorCompleteSignupButton'

const Footer = ({ handleTrial, handlePurchaseFlow }) => {
  return (
    <>
      <AuthorCompleteSignupButton
        renderButton={(handleClick) => (
          <EduButton
            data-cy="trialPurchase"
            isGhost
            width="180px"
            height="45px"
            onClick={handleClick}
          >
            Try for free
          </EduButton>
        )}
        onClick={handleTrial}
      />
      <AuthorCompleteSignupButton
        renderButton={(handleClick) => (
          <EduButton
            data-cy="Purchase"
            width="180px"
            height="45px"
            onClick={handleClick}
          >
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
      title={`${title} + Teacher Premium`}
      footer={
        <Footer
          handleTrial={handleTrial}
          handlePurchaseFlow={handlePurchaseFlow}
        />
      }
      visible={isVisible}
      onCancel={closeModal}
      width="665px"
    >
      <ModalBody>
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </ModalBody>
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

const ModalBody = styled.div`
  p {
    font-size: 14px;
    color: ${darkGrey2};
    font-weight: normal !important;
    margin-bottom: 20px !important;
  }
  img {
    height: 30px;
    width: auto;
    margin: 0px 8px;
  }
`

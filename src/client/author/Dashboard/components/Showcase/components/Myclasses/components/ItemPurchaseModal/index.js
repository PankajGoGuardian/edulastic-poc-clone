import React from 'react'
import PropTypes from 'prop-types'
import { CustomModalStyled, EduButton } from '@edulastic/common'
import styled from 'styled-components'
import { darkGrey2 } from '@edulastic/colors'
import AuthorCompleteSignupButton from '../../../../../../../../common/components/AuthorCompleteSignupButton'

const Footer = ({
  handleTrial,
  handlePurchaseFlow,
  hasTrial = false,
  blockInAppPurchase = false,
}) => {
  return (
    <>
      <AuthorCompleteSignupButton
        renderButton={(handleClick) =>
          hasTrial ? (
            <EduButton
              data-cy="trialPurchase"
              isGhost
              width="180px"
              height="45px"
              onClick={handleClick}
            >
              Try for free
            </EduButton>
          ) : null
        }
        onClick={handleTrial}
      />
      <AuthorCompleteSignupButton
        renderButton={(handleClick) =>
          blockInAppPurchase ? null : (
            <EduButton
              data-cy="Purchase"
              width="180px"
              height="45px"
              onClick={handleClick}
            >
              Purchase
            </EduButton>
          )
        }
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
  isPremiumUser,
  hasTrial = false,
  blockInAppPurchase = false,
  hideTitle = false,
}) => {
  const closeModal = () => toggleModal(false)
  const handleTrial = () => {
    closeModal()
    toggleTrialModal(true)
  }

  const modalTitle = hideTitle
    ? ''
    : `${title} ${!isPremiumUser ? '+ Teacher Premium' : ''}`

  return (
    <CustomModalStyled
      centered
      title={modalTitle}
      footer={
        <Footer
          handleTrial={handleTrial}
          handlePurchaseFlow={handlePurchaseFlow}
          hasTrial={hasTrial}
          blockInAppPurchase={blockInAppPurchase}
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

import React from 'react'
import PropTypes from 'prop-types'
import { CustomModalStyled, EduButton, FlexContainer } from '@edulastic/common'
import { Label } from '@edulastic/common/src/components/MathKeyboard/components/styled'

const ItemPurchaseModal = ({
  title,
  description,
  isVisible,
  toggleModal,
  toggleTrialModal,
  hasTrial,
  premiumUser,
}) => {
  const handleProceed = () => {}

  const closeModal = () => toggleModal(false)
  const handleTrial = () => {
    closeModal()
    toggleTrialModal(true)
  }

  const Footer = (
    <>
      {hasTrial && (
        <EduButton isGhost onClick={handleTrial}>
          Try for free
        </EduButton>
      )}
      <EduButton onClick={handleProceed}>Proceed</EduButton>
    </>
  )

  return (
    <CustomModalStyled
      centered
      title={title}
      footer={Footer}
      visible={isVisible}
      onCancel={closeModal}
    >
      <div>{description}</div>
      <FlexContainer
        flexDirection="column"
        marginLeft="40px"
        mr="40px"
        mt="20px"
      >
        {!premiumUser && <Label fontWeight="600">Premium Trial</Label>}
        <Label fontWeight="600">{description}</Label>
      </FlexContainer>
    </CustomModalStyled>
  )
}

ItemPurchaseModal.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  premiumUser: PropTypes.bool.isRequired,
  hasTrial: PropTypes.bool,
}

ItemPurchaseModal.defaultProps = {
  hasTrial: false,
}

export default ItemPurchaseModal

import React from 'react'
import PropTypes from 'prop-types'
import { CustomModalStyled, EduButton, FlexContainer } from '@edulastic/common'
import { Label } from '@edulastic/common/src/components/MathKeyboard/components/styled'

const ItemPurchaseModal = ({
  title,
  productId,
  description,
  hasTrial,
  isVisible,
  toggleModal,
  premiumUser,
}) => {
  const handleProceed = () => {
    // Handle Itembank Trial
    console.log(productId)
  }

  const handleCancel = () => toggleModal(false)

  const Footer = (
    <>
      {hasTrial !== false && (
        <EduButton isGhost onClick={handleCancel}>
          Cancel
        </EduButton>
      )}
      <EduButton onClick={handleProceed}>Proceed</EduButton>
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
      <div>{description}</div>
      <FlexContainer
        flexDirection="column"
        marginLeft="40px"
        mr="40px"
        mt="20px"
      >
        {!premiumUser && !hasTrial && (
          <Label fontWeight="600">Premium Trial</Label>
        )}
        <Label fontWeight="600">{productId} Trial</Label>
      </FlexContainer>
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

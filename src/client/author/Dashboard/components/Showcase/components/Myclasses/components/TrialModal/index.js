import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Checkbox } from 'antd'
import styled from 'styled-components'
import { CustomModalStyled, EduButton, FlexContainer } from '@edulastic/common'

const TrialModal = ({
  productId,
  productName,
  description,
  isVisible,
  toggleModal,
  premiumUser,
  isPremiumTrialUsed,
  startPremiumTrial,
  premiumProductId,
}) => {
  const [isSparkChecked, setIsSparkChecked] = useState()

  const closeModal = () => toggleModal(false)
  const onProceed = () => {
    const productIds = [productId]
    if (!premiumUser && !isPremiumTrialUsed) {
      productIds.push(premiumProductId)
      startPremiumTrial({ productIds })
    } else {
      startPremiumTrial({ productIds })
    }
    closeModal()
  }
  const handleOnChange = (ele) => {
    const checked = ele.checked
    setIsSparkChecked(checked)
  }

  const Footer = (
    <>
      <EduButton data-cy="cancelButton" isGhost onClick={closeModal}>
        Cancel
      </EduButton>
      <EduButton data-cy="proceedButton" onClick={onProceed}>
        Proceed
      </EduButton>
    </>
  )
  const nonPremium = (
    <>
      <StyledCheckbox data-cy="teacherPremiumCheckbox" checked>
        Teacher Premium $100 ($0 today)
        <p>Get even more out of your trial by adding Spark premium content</p>
      </StyledCheckbox>
      ,
      <StyledCheckbox
        data-cy="sparkPremiumCheckbox"
        defaultChecked
        onChange={(e) => handleOnChange(e.target)}
      >
        {productName} $100 ($0 today)
        <p>Curriculum-aligned differentiated math practice</p>
      </StyledCheckbox>
    </>
  )
  const Premium = (
    <StyledCheckbox style={{ textAlign: 'left' }}>
      {productName} $100 ($100 today)
      <p>Curriculum-aligned differentiated math practice</p>
    </StyledCheckbox>
  )

  const modalContent = () => {
    if (!premiumUser && !isPremiumTrialUsed) {
      return nonPremium
    }
    return Premium
  }

  return (
    <CustomModalStyled
      centered
      title="Start Your Free Trial!"
      footer={Footer}
      visible={isVisible}
      onCancel={closeModal}
    >
      <p>
        Experience the additional features of Edulastic Teacher Premium for 14
        days: read-aloud for students, extra test security settings, easier
        collaboration, in-depth reports and more.
      </p>

      <FlexContainer flexDirection="column" justifyContent="left" mt="20px">
        {modalContent()}
      </FlexContainer>
      <p style={{ fontFamily: 'bold' }}>No credit card required now!</p>
    </CustomModalStyled>
  )
}

TrialModal.propTypes = {
  productName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  productId: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
}

export default TrialModal

const StyledCheckbox = styled(Checkbox)`
  margin: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: unset;
  }
`

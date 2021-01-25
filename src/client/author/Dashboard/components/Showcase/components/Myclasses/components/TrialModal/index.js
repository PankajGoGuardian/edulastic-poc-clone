import {
  CheckboxLabel,
  CustomModalStyled,
  EduButton,
  FlexContainer,
} from '@edulastic/common'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styled from 'styled-components'

const TrialModal = ({
  productId,
  productName,
  isVisible,
  toggleModal,
  isPremiumUser,
  isPremiumTrialUsed,
  startPremiumTrial,
  premiumProductId,
}) => {
  const [isSparkChecked, setIsSparkChecked] = useState(true)

  const closeModal = () => toggleModal(false)
  const isDisableProceed = !isSparkChecked && isPremiumUser
  const onProceed = () => {
    const productIds = []
    if (isSparkChecked) {
      productIds.push(productId)
    }
    if (!isPremiumUser && !isPremiumTrialUsed) {
      productIds.push(premiumProductId)
      startPremiumTrial({ productIds })
      toggleModal(false)
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
      <EduButton
        disabled={isDisableProceed}
        data-cy="proceedButton"
        onClick={onProceed}
      >
        Proceed
      </EduButton>
    </>
  )
  const nonPremium = (
    <>
      <StyledCheckbox data-cy="teacherPremiumCheckbox" checked>
        <ListValue>
          <span>Teacher Premium</span> <span>$100 ($0 today)</span>
        </ListValue>
        <Description>
          Get even more out of your trial by adding Spark premium content
        </Description>
      </StyledCheckbox>
      <StyledCheckbox
        data-cy="sparkPremiumCheckbox"
        defaultChecked
        onChange={(e) => handleOnChange(e.target)}
      >
        <ListValue>
          <span>{productName}</span> <span>$100 ($0 today)</span>
        </ListValue>
        <Description>
          Curriculum-aligned differentiated math practice
        </Description>
      </StyledCheckbox>
    </>
  )
  const Premium = (
    <StyledCheckbox
      data-cy="sparkPremiumCheckbox"
      defaultChecked
      onChange={(e) => handleOnChange(e.target)}
    >
      <ListValue>
        <span>{productName}</span> <span>$100 ($0 today)</span>
      </ListValue>
      <Description>Curriculum-aligned differentiated math practice</Description>
    </StyledCheckbox>
  )

  const modalContent = () => {
    if (!isPremiumUser && !isPremiumTrialUsed) {
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
      {!isPremiumUser && !isPremiumTrialUsed ? (
        <p>
          Experience the additional features of Edulastic Teacher Premium for 14
          days: read-aloud for students, extra test security settings, easier
          collaboration, in-depth reports and more.
        </p>
      ) : (
        <p>
          Access premium assessments and practice for the subjects you teach for
          the next 14 days.
        </p>
      )}

      <FlexContainer flexDirection="column" justifyContent="left" mt="20px">
        {modalContent()}
      </FlexContainer>
      <p>
        <b>No credit card required now!</b>
      </p>
    </CustomModalStyled>
  )
}

TrialModal.propTypes = {
  productName: PropTypes.string.isRequired,
  productId: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
}

export default TrialModal

const StyledCheckbox = styled(CheckboxLabel)`
  margin: 10px 0px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: unset;
  display: flex;
  align-items: flex-start;
  .ant-checkbox {
    margin-top: 5px;
    & + span {
      width: 100%;
    }
  }
`
const ListValue = styled.span`
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Description = styled.span`
  display: block;
  color: #666666;
  text-transform: initial;
`

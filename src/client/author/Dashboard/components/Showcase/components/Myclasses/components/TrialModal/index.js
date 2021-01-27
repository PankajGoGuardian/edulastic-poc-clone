import {
  CheckboxLabel,
  CustomModalStyled,
  EduButton,
  FlexContainer,
} from '@edulastic/common'
import { Tooltip } from 'antd'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
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
<<<<<<< Updated upstream
      <TrialContainer>
        <Tooltip title="Premium subscription is mandatory for Spark content">
          <StyledCheckbox data-cy="teacherPremiumTrialCheckbox" checked />
        </Tooltip>
        <div>
          <ListValue>Teacher Premium Trial</ListValue>
          <Description>
            Get even more out of your trial by adding Spark premium content
          </Description>
        </div>
        <span>$100 ($0 today)</span>
      </TrialContainer>
      <TrialContainer>
        <StyledCheckbox
          data-cy="itemBankTrialCheckbox"
          defaultChecked
          onChange={(e) => handleOnChange(e.target)}
        />
        <div>
          <ListValue>Item Bank Trial</ListValue>
          <Description>
            Curriculum-aligned differentiated math practice
          </Description>
        </div>
        <span>$100 ($0 today)</span>
      </TrialContainer>
    </>
  )
  const Premium = (
    <StyledCheckbox
      data-cy="itemBankTrialCheckbox"
      defaultChecked
      onChange={(e) => handleOnChange(e.target)}
    >
      <ListValue>
        <span>Item Bank Trial</span> <span>$100 ($0 today)</span>
      </ListValue>
      <Description>Curriculum-aligned differentiated math practice</Description>
    </StyledCheckbox>
=======
      {itemBankPremium.map((item) => (
        <TrialContainer>
          <StyledCheckbox
            data-cy="sparkPremiumCheckbox"
            defaultChecked
            onChange={handleOnChange}
          />
          <div>
            <p>{item.name} TRIAL </p>{' '}
            <Description>{item.description}</Description>
          </div>
          <Description>{`$${item.price} ($0 today)`}</Description>
        </TrialContainer>
      ))}
    </>
  )

  const NonPremium = (
    <>
      <TrialContainer>
        <Tooltip title="Premium subscription is mandatory for Spark content">
          <StyledCheckbox data-cy="teacherPremiumTrialCheckbox" checked />
        </Tooltip>
        <div>
          <p>{teacherPremium.name} TRIAL </p>
          <Description>{teacherPremium.description}</Description>
        </div>
        <Description>{`$${teacherPremium.price} ($0 today)`}</Description>
      </TrialContainer>
      <span>{Premium}</span>
    </>
>>>>>>> Stashed changes
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
      data-cy="startTrialModal"
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
      <FooterText>
        <b>No credit card required now!</b>
      </FooterText>
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
  .ant-checkbox {
    margin-top: 5px;
  }
`
<<<<<<< Updated upstream
const ListValue = styled.span`
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  font-weight: bold;
`
=======
>>>>>>> Stashed changes
const Description = styled.span`
  color: #666666;
  text-transform: initial;
  font-weight: 550;
`

const TrialContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  & > div {
    width: 75%;
    margin-left: 15px;
  }
  & > span {
    font-weight: bold;
    white-space: nowrap;
  }
`
const FooterText = styled.p`
  margin-top: 30px;
`
const TrialContainer = styled.div`
  display: flex;
  justify-content:space-between;
  margin-top:10px;
  & > div {
    width:75%;
    margin-top: 10px;
    margin-left:15px;
    font-size: 12px;
    color: #666666;
    font-weight::bold;
  }
  & > span {
    font-weight: bold;
    white-space: nowrap;
    color: #666666;
  }
`
const FooterText = styled.p`
  margin-top: 30px;
`

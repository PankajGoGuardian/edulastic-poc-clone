import React, { useState, useMemo } from 'react'
import {
  CheckboxLabel,
  CustomModalStyled,
  EduButton,
  FlexContainer,
} from '@edulastic/common'
import { Tooltip } from 'antd'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const TrialModal = ({
  productId,
  isVisible,
  toggleModal,
  isPremiumUser,
  isPremiumTrialUsed,
  startPremiumTrial,
  premiumProductId,
  products = [],
}) => {
  const [isSparkChecked, setIsSparkChecked] = useState(true)

  const isTrial = useMemo(() => !isPremiumUser && !isPremiumTrialUsed, [
    isPremiumUser,
    isPremiumTrialUsed,
  ])

  const { teacherPremium = {}, itemBankPremium = [] } = useMemo(() => {
    const result = products.map((item) => ({
      ...item,
      price: 100,
      period: 14,
    }))
    return {
      teacherPremium: result[0],
      itemBankPremium: result.slice(1),
    }
  }, [products])

  const isDisableProceed = !isSparkChecked && isPremiumUser

  const closeModal = () => toggleModal(false)

  const onProceed = () => {
    const productIds = []
    if (isSparkChecked) {
      productIds.push(productId)
    }
    if (isTrial) {
      productIds.push(premiumProductId)
      startPremiumTrial({ productIds })
      toggleModal(false)
    } else {
      startPremiumTrial({ productIds })
    }
    closeModal()
  }
  const handleOnChange = (e) => setIsSparkChecked(e.target.checked)

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

  const Premium = (
    <>
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
      {Premium}
    </>
  )

  const modalContent = () => {
    if (isTrial) {
      return NonPremium
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
      {isTrial ? (
        <p>
          {`Experience the additional features of Edulastic Teacher Premium for 14
          days: read-aloud for students, extra test security settings, easier
          collaboration, in-depth reports and more.`}
        </p>
      ) : (
        <p>
          {`Access premium assessments and practice for the subjects you teach for
          the next 14 days.`}
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
const Description = styled.span`
  display: block;
  color: #666666;
  text-transform: initial;
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

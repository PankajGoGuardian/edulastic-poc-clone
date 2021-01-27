import React, { useState, useMemo } from 'react'
import {
  CheckboxLabel,
  CustomModalStyled,
  EduButton,
  FlexContainer,
} from '@edulastic/common'
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
  subEndDate,
  usedTrialItemBankId,
  products = [],
}) => {
  const [isSparkChecked, setIsSparkChecked] = useState(true)

  const isTrial = useMemo(() => !isPremiumUser && !isPremiumTrialUsed, [
    isPremiumUser,
    isPremiumTrialUsed,
  ])

  const { teacherPremium = {}, itemBankPremium = [] } = useMemo(() => {
    const result = products.map((item) => {
      if (!subEndDate || item.id === premiumProductId) {
        return {
          ...item,
          price: 100,
          period: 14,
        }
      }
      const itembankPrice = 100
      const period = 14
      let currentDate = new Date()
      const itemBankSubEndDate = new Date(
        currentDate.setDate(currentDate.getDate() + period)
      ).valueOf()
      const computedEndDate = Math.min(itemBankSubEndDate, subEndDate)
      currentDate = Date.now()
      const amountFactor =
        (computedEndDate - currentDate) / (itemBankSubEndDate - currentDate)
      const dynamicPrice = Math.round(amountFactor * itembankPrice)
      const dynamicDays = Math.round(amountFactor * period)

      return {
        ...item,
        price: dynamicPrice,
        period: dynamicDays,
      }
    })
    return {
      teacherPremium: result[0],
      itemBankPremium: result.slice(1),
    }
  }, [subEndDate, isPremiumTrialUsed, usedTrialItemBankId, productId, products])

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
        <StyledCheckbox
          data-cy="sparkPremiumCheckbox"
          defaultChecked
          onChange={handleOnChange}
        >
          <ListValue>
            <span>{item.name}</span> <span>{`$${item.price} ($0 today)`}</span>
          </ListValue>
          <Description>{item.description}</Description>
        </StyledCheckbox>
      ))}
    </>
  )

  const NonPremium = (
    <>
      <StyledCheckbox data-cy="teacherPremiumCheckbox" checked>
        <ListValue>
          <span>{teacherPremium.name}</span>{' '}
          <span>{`$${teacherPremium.price} ($0 today)`}</span>
        </ListValue>
        <Description>{teacherPremium.description}</Description>
      </StyledCheckbox>
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
      <p>
        <b>No credit card required now!</b>
      </p>
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

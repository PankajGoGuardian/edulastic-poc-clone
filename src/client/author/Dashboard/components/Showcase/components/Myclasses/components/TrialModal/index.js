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
import { groupBy, map, camelCase } from 'lodash'

const TrialModal = ({
  addOnProductIds = [],
  isVisible,
  toggleModal,
  isPremiumUser,
  isPremiumTrialUsed,
  startPremiumTrial,
  products = [],
}) => {
  const hasPremiumTrialIncluded = useMemo(
    () => !isPremiumUser && !isPremiumTrialUsed,
    [isPremiumUser, isPremiumTrialUsed]
  )

  const productsToShow = products.filter(
    (product) =>
      (product.type === 'PREMIUM' && hasPremiumTrialIncluded) ||
      addOnProductIds.includes(product.id)
  )
  const [productIds, setProductIds] = useState(map(productsToShow, 'id'))

  const {
    PREMIUM: teacherPremium = [],
    ITEM_BANK: itemBankPremium = [],
  } = useMemo(() => {
    return groupBy(productsToShow, 'type')
  }, [products])

  const isProceedDisabled = productIds.length === 0

  const closeModal = () => toggleModal(false)

  const handleOnChange = (value) => (e) => {
    if (e.target.checked) {
      return setProductIds((ids) => [...ids, value])
    }

    return setProductIds((ids) => ids.filter((id) => id !== value))
  }

  const onProceed = () => {
    startPremiumTrial({ productIds })
    closeModal()
  }

  const Footer = (
    <>
      <EduButton data-cy="cancelButton" isGhost onClick={closeModal}>
        Cancel
      </EduButton>
      <EduButton
        disabled={isProceedDisabled}
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
            data-cy={`${camelCase(item.name)}TrialCheckbox`}
            defaultChecked
            onChange={handleOnChange(item.id)}
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

  const NonPremium = teacherPremium.length && (
    <>
      <TrialContainer>
        <Tooltip title="Premium subscription is mandatory for Spark content">
          <StyledCheckbox
            data-cy="teacherPremiumTrialCheckbox"
            checked
            disabled
          />
        </Tooltip>
        <div>
          <p>{teacherPremium[0].name} TRIAL </p>
          <Description>{teacherPremium[0].description}</Description>
        </div>
        <Description>{`$${teacherPremium[0].price} ($0 today)`}</Description>
      </TrialContainer>
      {Premium}
    </>
  )

  const modalContent = () => {
    if (hasPremiumTrialIncluded) {
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
      {hasPremiumTrialIncluded ? (
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
  addOnProductIds: PropTypes.array.isRequired,
  isVisible: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  isPremiumUser: PropTypes.bool.isRequired,
  isPremiumTrialUsed: PropTypes.bool.isRequired,
  startPremiumTrial: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
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

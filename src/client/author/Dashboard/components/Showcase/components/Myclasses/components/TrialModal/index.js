import React, { useState, useMemo } from 'react'
import { CustomModalStyled, EduButton, FlexContainer } from '@edulastic/common'
import { Tooltip } from 'antd'
import PropTypes from 'prop-types'
import { groupBy, map, camelCase } from 'lodash'
import {
  Description,
  FlexRow,
  FooterText,
  ModalBody,
  Price,
  StyledCheckbox,
  TrialContainer,
} from './styled'

const TrialModal = ({
  addOnProductIds = [],
  isVisible,
  toggleModal,
  isPremiumUser,
  isPremiumTrialUsed,
  startPremiumTrial,
  products = [],
  setShowHeaderTrialModal,
  setShowTrialSubsConfirmation,
  setTrialAddOnProductIds = () => {},
  hasAllTrialProducts = false,
  setIsTabShouldSwitch = () => {},
  trialPeriod,
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

  const [productIds, setProductIds] = useState(
    map(
      productsToShow.filter((product) => {
        return (
          (product.type === 'PREMIUM' && hasPremiumTrialIncluded) ||
          !hasAllTrialProducts
        )
      }),
      'id'
    )
  )

  const { PREMIUM: teacherPremium = [], ...ITEM_BANKS } = useMemo(() => {
    return groupBy(productsToShow, 'type')
  }, [products])

  const itemBankPremium = Object.values(ITEM_BANKS).flatMap((x) => x)
  const isProceedDisabled = productIds.length === 0

  const closeModal = () => {
    toggleModal(false)
    setShowHeaderTrialModal(false)
  }

  const handleOnChange = (value) => (e) => {
    if (e.target.checked) {
      return setProductIds((ids) => [...ids, value])
    }

    return setProductIds((ids) => ids.filter((id) => id !== value))
  }

  const onProceed = () => {
    setIsTabShouldSwitch(false)
    setTrialAddOnProductIds([...productIds])
    startPremiumTrial({ productIds, setShowTrialSubsConfirmation })
    closeModal()
  }

  const Footer = (
    <>
      <EduButton
        width="180px"
        height="45px"
        data-cy="cancelButton"
        isGhost
        onClick={closeModal}
      >
        Cancel
      </EduButton>
      <EduButton
        disabled={isProceedDisabled}
        data-cy="proceedButton"
        onClick={onProceed}
        width="180px"
        height="45px"
      >
        Proceed
      </EduButton>
    </>
  )

  const Premium = (
    <>
      {itemBankPremium.map((item) => (
        <TrialContainer>
          <FlexRow>
            <StyledCheckbox
              data-cy={`${camelCase(item.name)}TrialCheckbox`}
              defaultChecked={!hasAllTrialProducts}
              onChange={handleOnChange(item.id)}
            >
              {item.name} TRIAL
            </StyledCheckbox>
            <Price>{`$${item.price} ($0 today)`}</Price>
          </FlexRow>
          <Description>{item.description}</Description>
        </TrialContainer>
      ))}
    </>
  )

  const NonPremium = teacherPremium.length && (
    <>
      <TrialContainer>
        <FlexRow>
          <Tooltip title="Premium subscription is mandatory for Spark content">
            <StyledCheckbox
              data-cy="teacherPremiumTrialCheckbox"
              checked
              disabled
            >
              {teacherPremium[0].name} TRIAL
            </StyledCheckbox>
          </Tooltip>
          <Price>{`$${teacherPremium[0].price} ($0 today)`}</Price>
        </FlexRow>
        <Description>{teacherPremium[0].description}</Description>
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
      modalWidth="510px"
      width="510px"
    >
      <ModalBody>
        {hasPremiumTrialIncluded ? (
          <p>
            Experience the additional features of Edulastic Teacher Premium for{' '}
            {trialPeriod} days: OMR exams, read-loud for students, extra test
            security settings, easier collaboration, in-depth reports and more.
          </p>
        ) : (
          <p>
            Access premium assessments and practice for the subjects you teach
            for the next {trialPeriod} days.
          </p>
        )}
      </ModalBody>

      <FlexContainer flexDirection="column" justifyContent="left" mt="20px">
        {modalContent()}
      </FlexContainer>
      <FooterText>No credit card required now!</FooterText>
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
  setShowHeaderTrialModal: PropTypes.func,
}

TrialModal.defaultProps = {
  setShowHeaderTrialModal: () => {},
}

export default TrialModal

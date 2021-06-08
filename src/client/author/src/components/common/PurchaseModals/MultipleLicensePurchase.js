import React, { useEffect, useState } from 'react'
import {
  EduButton,
  FieldLabel,
  notification,
  TextInputStyled,
} from '@edulastic/common'
import SubscriptionAddonModal from './SubscriptionAddonModal'
import ProductsList from './ProductsList'
import { EmailWrapper } from './styled'
import { emailRegex } from '../../../../../common/utils/helpers'

const MultipleLicensePurchase = ({
  isVisible,
  handleCloseModal,
  products,
  handleClick,
  setTotalAmount,
  teacherPremium,
  setQuantities,
  quantities,
  setSelectedProductIds,
  selectedProductIds,
  bulkInviteBookKeepers,
  districtId,
  isBookKeepersInviteSuccess,
  setBookKeepersInviteSuccess,
}) => {
  const [emailValues, setEmailValues] = useState('')

  useEffect(() => {
    if (!selectedProductIds.includes(teacherPremium.id)) {
      setSelectedProductIds((x) => (x || []).concat(teacherPremium.id))
    }
  }, [])

  useEffect(() => {
    return () => {
      setSelectedProductIds([])
      setQuantities({})
    }
  }, [])

  useEffect(() => {
    if (isBookKeepersInviteSuccess) {
      const emails = emailValues
        .split(',')
        .map((x) => x.replace(/\s/g, ''))
        .filter((x) => x)

      handleClick({
        emails,
      })
    }
    return () => {
      if (isBookKeepersInviteSuccess) {
        setBookKeepersInviteSuccess(false)
      }
    }
  }, [emailValues, isBookKeepersInviteSuccess])

  const handleInputEmailAddress = (ele) => {
    const value = ele.target.value
    setEmailValues(value)
  }

  const handleProceed = () => {
    const emails = emailValues
      .split(',')
      .map((x) => x.replace(/\s/g, ''))
      .filter((x) => x)

    for (const email of emails) {
      if (!emailRegex.test(email)) {
        return notification({
          type: 'warn',
          msg: `${email} is invalid email!`,
        })
      }
    }

    bulkInviteBookKeepers({
      districtId,
      userDetails: emails,
    })
  }

  const footer = [
    <EduButton
      onClick={handleProceed}
      data-cy="proceedPayment"
      width="220px"
      height="45px"
      disabled={!quantities[teacherPremium.id]}
    >
      PROCEED WITH PAYMENT
    </EduButton>,
  ]

  return (
    <SubscriptionAddonModal
      isVisible={isVisible}
      title="Upgrade Multiple Accounts"
      handleCloseModal={handleCloseModal}
      footer={footer}
    >
      <ProductsList
        showMultiplePurchaseModal
        productsToshow={products}
        setTotalPurchaseAmount={setTotalAmount}
        teacherPremium={teacherPremium}
        setQuantities={setQuantities}
        quantities={quantities}
        setSelectedProductIds={setSelectedProductIds}
        selectedProductIds={selectedProductIds}
      />

      <EmailWrapper>
        <FieldLabel>Bookkeeper Email</FieldLabel>
        <TextInputStyled
          value={emailValues}
          onChange={handleInputEmailAddress}
          placeholder="Type the emails"
          height="40px"
          data-cy="bookKeeperEmailField"
        />
      </EmailWrapper>
    </SubscriptionAddonModal>
  )
}

export default MultipleLicensePurchase

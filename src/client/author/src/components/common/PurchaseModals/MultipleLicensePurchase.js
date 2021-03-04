import React, { useEffect, useState } from 'react'
import { EduButton, FieldLabel, TextInputStyled } from '@edulastic/common'
import SubscriptionAddonModal from './SubscriptionAddonModal'
import ProductsList from './ProductsList'

import { EmailWrapper } from './styled'

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
}) => {
  const [emailValues, setEmailValues] = useState('')

  useEffect(() => {
    if (!selectedProductIds.includes(teacherPremium.id)) {
      setSelectedProductIds((x) => (x || []).concat(teacherPremium.id))
    }
  }, [])

  const handleInputEmailAddress = (ele) => {
    const value = ele.target.value
    setEmailValues(value)
  }

  const handleProceed = () => {
    const emails = emailValues
      .split(',')
      .map((x) => x.replace(/\s/g, ''))
      .filter((x) => x)
    handleClick({
      emails,
    })
  }

  const footer = [
    <EduButton
      onClick={handleProceed}
      data-cy="proceedPayment"
      width="220px"
      height="45px"
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
        />
      </EmailWrapper>
    </SubscriptionAddonModal>
  )
}

export default MultipleLicensePurchase

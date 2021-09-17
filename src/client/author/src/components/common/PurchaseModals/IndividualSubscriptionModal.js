import { EduButton } from '@edulastic/common'
import React, { useMemo, useEffect } from 'react'
import ProductsList from './ProductsList'
import SubscriptionAddonModal from './SubscriptionAddonModal'

const IndividualSubscriptionModal = ({
  isVisible,
  handleCloseModal,
  handleClick,
  isPaidPremium,
  setTotalAmount,
  teacherPremium,
  showRenewalOptions,
  setQuantities,
  quantities,
  setSelectedProductIds,
  selectedProductIds,
  itemBankProducts,
  showMultiplePurchaseModal,
  totalAmount,
  shouldProrate,
  subEndDate,
  isEnterprise,
  isCpm = false,
}) => {
  const productsToshow = useMemo(() => {
    if (
      isPaidPremium &&
      !showRenewalOptions &&
      (shouldProrate || isEnterprise)
    ) {
      return itemBankProducts
    }
    return [teacherPremium, ...itemBankProducts]
  }, [itemBankProducts, isPaidPremium, showRenewalOptions, shouldProrate])

  useEffect(() => {
    if (
      (!isPaidPremium || showRenewalOptions || !shouldProrate) &&
      !selectedProductIds.includes(teacherPremium.id)
    ) {
      setSelectedProductIds((ids) => [teacherPremium.id, ...ids])
    }
  }, [isPaidPremium, showRenewalOptions, shouldProrate])

  useEffect(() => {
    return () => {
      setSelectedProductIds([])
      setQuantities({})
    }
  }, [])

  const Footer = [
    <EduButton
      onClick={handleClick}
      data-cy="proceedPayment"
      width="220px"
      height="45px"
      disabled={!totalAmount}
    >
      PROCEED WITH PAYMENT
    </EduButton>,
  ]

  return (
    <SubscriptionAddonModal
      isVisible={isVisible}
      title={showRenewalOptions ? 'Renew Subscription' : 'Select Add-ons'}
      handleCloseModal={handleCloseModal}
      footer={Footer}
      shouldProrate={shouldProrate}
      subEndDate={subEndDate}
      isCpm={isCpm}
    >
      <ProductsList
        showMultiplePurchaseModal={showMultiplePurchaseModal}
        productsToshow={productsToshow}
        setTotalPurchaseAmount={setTotalAmount}
        teacherPremium={teacherPremium}
        setQuantities={setQuantities}
        quantities={quantities}
        setSelectedProductIds={setSelectedProductIds}
        selectedProductIds={selectedProductIds}
      />
    </SubscriptionAddonModal>
  )
}

export default IndividualSubscriptionModal

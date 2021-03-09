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
}) => {
  const productsToshow = useMemo(() => {
    if (isPaidPremium && !showRenewalOptions) {
      return itemBankProducts
    }
    return [teacherPremium, ...itemBankProducts]
  }, [itemBankProducts, isPaidPremium, showRenewalOptions])

  useEffect(() => {
    if (
      (!isPaidPremium || showRenewalOptions) &&
      !selectedProductIds.includes(teacherPremium.id)
    ) {
      setSelectedProductIds((ids) => [teacherPremium.id, ...ids])
    }
  }, [isPaidPremium, showRenewalOptions])

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

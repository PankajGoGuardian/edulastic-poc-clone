import { EduButton } from '@edulastic/common'
import React, { useMemo } from 'react'
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
}) => {
  const productsToshow = useMemo(() => {
    if (isPaidPremium && !showRenewalOptions) {
      return itemBankProducts
    }
    return [teacherPremium, ...itemBankProducts]
  }, [itemBankProducts, isPaidPremium, showRenewalOptions])

  const Footer = [
    <EduButton
      onClick={handleClick}
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

import React, { useEffect, useMemo } from 'react'
import { EduButton } from '@edulastic/common'
import SubscriptionAddonModal from './SubscriptionAddonModal'
import ProductsList from './ProductsList'

const BuyMoreLicensesModal = ({
  isVisible,
  handleCloseModal,
  products,
  handleClick,
  setTotalAmount,
  setQuantities,
  quantities,
  setSelectedProductIds,
  selectedProductIds,
  currentItemId,
  totalAmount,
}) => {
  useEffect(() => {
    return () => {
      setSelectedProductIds([])
      setQuantities({})
    }
  }, [])
  useEffect(() => setSelectedProductIds([currentItemId]), [])

  const productsToshow = useMemo(
    () => products.filter(({ id }) => id === currentItemId),
    [products]
  )

  const handleProceed = () => handleClick({ productsToshow })

  const Footer = [
    <EduButton isGhost height="38px" onClick={handleCloseModal}>
      No, Cancel
    </EduButton>,
    <EduButton height="38px" onClick={handleProceed} disabled={!totalAmount}>
      Yes, Proceed
    </EduButton>,
  ]

  return (
    <SubscriptionAddonModal
      isVisible={isVisible}
      title="Buy More"
      modalDescription={`Please enter the number of ${
        productsToshow?.[0]?.name || ''
      } license you need to buy.`}
      handleCloseModal={handleCloseModal}
      footer={Footer}
    >
      <ProductsList
        isBuyMore
        showRenewalOptions={false}
        showMultiplePurchaseModal={false}
        productsToshow={productsToshow}
        setTotalPurchaseAmount={setTotalAmount}
        setQuantities={setQuantities}
        quantities={quantities}
        setSelectedProductIds={setSelectedProductIds}
        selectedProductIds={selectedProductIds}
        currentItemId={currentItemId}
      />
    </SubscriptionAddonModal>
  )
}

export default BuyMoreLicensesModal

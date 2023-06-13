import React, { useEffect, useMemo } from 'react'
import { EduButton } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { connect } from 'react-redux'
import { compose } from 'redux'
import SubscriptionAddonModal from './SubscriptionAddonModal'
import ProductsList from './ProductsList'
import { getSubsLicensesSelector } from '../../../../ManageSubscription/ducks'

const RenewLicenseModal = ({
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
  subsLicenses,
  teacherPremium,
  selectedLicenseId,
  t: i18Translate,
}) => {
  useEffect(() => {
    return () => {
      setSelectedProductIds([])
    }
  }, [])
  useEffect(() => setSelectedProductIds([currentItemId]), [currentItemId])

  const productsToshow = useMemo(
    () => products.filter(({ id }) => id === currentItemId),
    [currentItemId, products]
  )

  const handleProceed = () => handleClick({ productsToshow })

  const Footer = [
    <EduButton
      data-cy="cancelBuyMoreLicense"
      isGhost
      height="38px"
      onClick={handleCloseModal}
    >
      No, Cancel
    </EduButton>,
    <EduButton
      data-cy="proceedBuyMoreLicense"
      height="38px"
      onClick={handleProceed}
      disabled={!totalAmount}
    >
      Yes, Proceed
    </EduButton>,
  ]

  return (
    <SubscriptionAddonModal
      isVisible={isVisible}
      title="Renew Licenses"
      modalDescription={`Please enter the number of ${
        productsToshow?.[0]?.name || ''
      } license you need to renew.`}
      handleCloseModal={handleCloseModal}
      footer={Footer}
    >
      <ProductsList
        isRenewLicense
        showRenewalOptions={false}
        showMultiplePurchaseModal={false}
        productsToshow={productsToshow}
        setTotalPurchaseAmount={setTotalAmount}
        setQuantities={setQuantities}
        quantities={quantities}
        setSelectedProductIds={setSelectedProductIds}
        selectedProductIds={selectedProductIds}
        currentItemId={currentItemId}
        subsLicenses={subsLicenses}
        teacherPremium={teacherPremium}
        selectedLicenseId={selectedLicenseId}
        i18Translate={i18Translate}
      />
    </SubscriptionAddonModal>
  )
}

const enhance = compose(
  withNamespaces('manageDistrict'),
  connect(
    (state) => ({
      subsLicenses: getSubsLicensesSelector(state),
    }),
    {}
  )
)

export default enhance(RenewLicenseModal)

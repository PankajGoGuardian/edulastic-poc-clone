import { segmentApi } from '@edulastic/api'
import React, { useEffect, useMemo, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import loadable from '@loadable/component'
import { compose } from 'redux'
import { uniq, compact } from 'lodash'
import {
  getItemBankSubscriptions,
  getProducts,
  getSubscriptionSelector,
  getIsPaymentServiceModalVisible,
  getPremiumProductId,
  getIsVerificationPending,
  getAddOnProductIds,
  getBookKeepersInviteSuccessStatus,
  slice,
} from '../../../../Subscription/ducks'
import IndividualSubscriptionModal from './IndividualSubscriptionModal'
import { getUserOrgId } from '../../../selectors/user'

const MultipleLicensePurchase = loadable(() =>
  import('./MultipleLicensePurchase')
)
const UpgradeModal = loadable(() => import('./UpgradeModal'))
const PaymentServiceModal = loadable(() => import('./PaymentServiceModal'))
const PayWithPoModal = loadable(() => import('./PayWithPoModal'))
const BuyMoreLicensesModal = loadable(() => import('./BuyMoreLicensesModal'))

const getInitialSelectedProductIds = ({
  defaultSelectedProductIds,
  isPaidPremium,
  premiumProductId,
}) => {
  const productIds = [...defaultSelectedProductIds]
  if (!isPaidPremium) {
    productIds.push(premiumProductId)
  }
  return uniq(compact(productIds))
}

const PurchaseFlowModals = (props) => {
  const {
    verificationPending,
    handleStripePayment,
    handleStripeMultiplePayment,
    subscription: { subEndDate, subType } = {},
    user,
    fetchUserSubscriptionStatus,
    itemBankSubscriptions = [],
    premiumProductId,
    products,
    isPaymentServiceModalVisible,
    setPaymentServiceModal,
    showSubscriptionAddonModal,
    setShowSubscriptionAddonModal,
    setProductData,
    defaultSelectedProductIds = [],
    showMultiplePurchaseModal,
    setShowMultiplePurchaseModal,
    showBuyMoreModal,
    setShowBuyMoreModal,
    licenseIds,
    selectedLicenseId,
    setSelectedLicenseId,
    isEdulasticAdminView = false,
    handleEdulasticAdminProductLicense,
    showRenewalOptions = false,
    currentItemId,
    licenseOwnerId,
    addOnProductIds,
    setAddOnProductIds,
    userOrgId,
    bulkInviteBookKeepers,
    isBookKeepersInviteSuccess,
    setBookKeepersInviteSuccess,
  } = props

  const [payWithPoModal, setPayWithPoModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [productsCart, setProductsCart] = useState([])
  const [emailIds, setEmailIds] = useState([])
  const [totalAmount, setTotalAmount] = useState(100)
  const [quantities, setQuantities] = useState({})

  /**
   *  a user is paid premium user if
   *  - subType exists and
   *  - premium is not through trial ie, only - (enterprise, premium, partial_premium) and
   *  - is partial premium user & premium is true
   *
   * TODO: refactor and define this at the top level
   */
  const isPaidPremium = !(
    !subType ||
    subType === 'TRIAL_PREMIUM' ||
    (subType === 'partial_premium' && !user?.features?.premium)
  )
  const [selectedProductIds, setSelectedProductIds] = useState(
    getInitialSelectedProductIds({
      defaultSelectedProductIds,
      isPaidPremium,
      premiumProductId,
    })
  )

  const defaultSelectedProductIdsRef = useRef()

  useEffect(() => {
    // getSubscription on mount
    fetchUserSubscriptionStatus()
  }, [])

  const shouldProrate = useMemo(() => {
    const oneDay = 1000 * 60 * 60 * 24
    if (subEndDate) {
      const remainingDaysForPremiumExpiry = Math.round(
        (new Date(subEndDate).getTime() - new Date().getTime()) / oneDay
      )

      return remainingDaysForPremiumExpiry > 90
    }
    return true
  }, [subEndDate])

  const { teacherPremium = {}, itemBankPremium = [] } = useMemo(() => {
    const boughtPremiumBankIds = itemBankSubscriptions
      .filter((x) => !x.isTrial)
      .map((x) => x.itemBankId)
    const purchasableProducts = products.filter(
      (x) => !boughtPremiumBankIds.includes(x.linkedProductId)
    )

    const result = purchasableProducts.map((product) => {
      const { id: currentProductId } = product
      if (
        !subEndDate ||
        currentProductId === premiumProductId ||
        (subEndDate && !isPaidPremium) ||
        ['enterprise', 'partial_premium'].includes(subType)
      ) {
        return {
          ...product,
          period: product.period,
          price: product.price,
        }
      }

      let dynamicPrice = product.price
      let dynamicPeriodInDays = product.period

      if (shouldProrate) {
        let currentDate = new Date()
        const itemBankSubEndDate = new Date(
          currentDate.setDate(currentDate.getDate() + product.period)
        ).valueOf()
        const computedEndDate = Math.min(itemBankSubEndDate, subEndDate)
        currentDate = Date.now()
        const amountFactor = Math.min(
          (computedEndDate - currentDate) / (itemBankSubEndDate - currentDate),
          1
        )
        dynamicPrice = Math.ceil(amountFactor * product.price)
        dynamicPeriodInDays = Math.ceil(amountFactor * product.period)
      }

      return {
        ...product,
        period: dynamicPeriodInDays,
        price: dynamicPrice,
      }
    })
    return {
      teacherPremium: result[0],
      itemBankPremium: result.slice(1),
    }
  }, [subEndDate, products])

  useEffect(() => {
    if (
      defaultSelectedProductIdsRef.current === undefined ||
      JSON.stringify(defaultSelectedProductIdsRef.current) !==
        JSON.stringify(defaultSelectedProductIds)
    ) {
      setSelectedProductIds(
        getInitialSelectedProductIds({
          defaultSelectedProductIds,
          isPaidPremium,
          premiumProductId,
        })
      )
      defaultSelectedProductIdsRef.current = [...defaultSelectedProductIds]
    }
  }, [defaultSelectedProductIds, isPaidPremium, premiumProductId])

  const openPaymentServiceModal = () => {
    setPaymentServiceModal(true)
    segmentApi.trackTeacherClickOnUpgradeSubscription({ user })
  }
  const openPoServiceModal = () => {
    setPayWithPoModal(true)
  }
  const closePaymentServiceModal = () => {
    setPaymentServiceModal(false)
  }
  const handleSubscriptionAddonModalClose = () => {
    setProductData({})
    setShowSubscriptionAddonModal(false)
    setShowMultiplePurchaseModal(false)
    setShowBuyMoreModal(false)
  }

  const stripePaymentActionHandler = (data) => {
    if (addOnProductIds?.length) {
      handleStripePayment({ ...data, productIds: [...addOnProductIds] })
    } else {
      handleStripeMultiplePayment({
        ...data,
        productIds: [...productsCart],
        emailIds,
        licenseIds: selectedLicenseId ? [selectedLicenseId] : licenseIds,
        licenseOwnerId,
      })
      if (selectedLicenseId) {
        setSelectedLicenseId(null)
      }
      if (!isPaymentServiceModalVisible) {
        setProductsCart([])
      }
    }
  }

  const handleClick = ({ emails = [], productsToshow = products }) => {
    if (showMultiplePurchaseModal) {
      const productQuantities = products.map((product) => ({
        ...product,
        quantity: quantities[product.id],
      }))
      setProductsCart(productQuantities)
      setEmailIds(emails)
    } else if (showBuyMoreModal) {
      const productQuantities = productsToshow.map((product) => ({
        ...product,
        quantity: quantities[product.id],
      }))
      if (isEdulasticAdminView) {
        handleEdulasticAdminProductLicense({
          products: productQuantities,
          emailIds,
          licenseIds: [selectedLicenseId],
          licenseOwnerId,
        })
        handleSubscriptionAddonModalClose()
        setSelectedLicenseId(null)
        return
      }
      setProductsCart(productQuantities)
    } else {
      setAddOnProductIds(selectedProductIds)
    }
    handleSubscriptionAddonModalClose()
    setShowUpgradeModal(true)
    setTotalAmount(totalAmount)
  }

  return (
    <>
      {showSubscriptionAddonModal && (
        <IndividualSubscriptionModal
          isVisible={showSubscriptionAddonModal}
          handleCloseModal={handleSubscriptionAddonModalClose}
          showMultiplePurchaseModal={showMultiplePurchaseModal}
          handleClick={handleClick}
          itemBankProducts={itemBankPremium}
          isPaidPremium={isPaidPremium}
          premiumProductId={premiumProductId}
          setTotalAmount={setTotalAmount}
          teacherPremium={teacherPremium}
          showRenewalOptions={showRenewalOptions}
          setQuantities={setQuantities}
          quantities={quantities}
          setSelectedProductIds={setSelectedProductIds}
          selectedProductIds={selectedProductIds}
          totalAmount={totalAmount}
          shouldProrate={shouldProrate}
        />
      )}
      {showMultiplePurchaseModal && (
        <MultipleLicensePurchase
          isVisible={showMultiplePurchaseModal}
          handleCloseModal={handleSubscriptionAddonModalClose}
          products={products}
          handleClick={handleClick}
          setTotalAmount={setTotalAmount}
          teacherPremium={teacherPremium}
          setQuantities={setQuantities}
          quantities={quantities}
          setSelectedProductIds={setSelectedProductIds}
          selectedProductIds={selectedProductIds}
          bulkInviteBookKeepers={bulkInviteBookKeepers}
          districtId={userOrgId}
          isBookKeepersInviteSuccess={isBookKeepersInviteSuccess}
          setBookKeepersInviteSuccess={setBookKeepersInviteSuccess}
        />
      )}
      {showUpgradeModal && (
        <UpgradeModal
          visible={showUpgradeModal}
          setShowModal={setShowUpgradeModal}
          openPaymentServiceModal={openPaymentServiceModal}
          openPoServiceModal={openPoServiceModal}
        />
      )}
      {isPaymentServiceModalVisible && (
        <PaymentServiceModal
          visible={isPaymentServiceModalVisible}
          closeModal={closePaymentServiceModal}
          verificationPending={verificationPending}
          stripePaymentAction={stripePaymentActionHandler}
          user={user}
          reason="Premium Upgrade"
          totalPurchaseAmount={totalAmount}
        />
      )}
      {payWithPoModal && (
        <PayWithPoModal
          visible={payWithPoModal}
          setShowModal={setPayWithPoModal}
        />
      )}
      {showBuyMoreModal && (
        <BuyMoreLicensesModal
          isVisible={showBuyMoreModal}
          handleCloseModal={handleSubscriptionAddonModalClose}
          handleClick={handleClick}
          products={products}
          currentItemId={currentItemId}
          setTotalAmount={setTotalAmount}
          setQuantities={setQuantities}
          quantities={quantities}
          setSelectedProductIds={setSelectedProductIds}
          selectedProductIds={selectedProductIds}
          totalAmount={totalAmount}
          isEdulasticAdminView={isEdulasticAdminView}
          teacherPremium={teacherPremium}
        />
      )}
    </>
  )
}

PurchaseFlowModals.defaultProps = {
  setShowMultiplePurchaseModal: () => {},
  setShowSubscriptionAddonModal: () => {},
  setShowBuyMoreModal: () => {},
  setSelectedLicenseId: () => {},
  setProductData: () => {},
}

export default compose(
  withRouter,
  connect(
    (state) => ({
      subscription: getSubscriptionSelector(state),
      itemBankSubscriptions: getItemBankSubscriptions(state),
      products: getProducts(state),
      verificationPending: getIsVerificationPending(state),
      premiumProductId: getPremiumProductId(state),
      isPaymentServiceModalVisible: getIsPaymentServiceModalVisible(state),
      user: state.user.user,
      addOnProductIds: getAddOnProductIds(state),
      userOrgId: getUserOrgId(state),
      isBookKeepersInviteSuccess: getBookKeepersInviteSuccessStatus(state),
    }),
    {
      handleStripePayment: slice.actions.stripePaymentAction,
      handleStripeMultiplePayment: slice.actions.stripeMultiplePaymentAction,
      handleEdulasticAdminProductLicense:
        slice.actions.edulasticAdminProductLicenseAction,
      fetchUserSubscriptionStatus: slice.actions.fetchUserSubscriptionStatus,
      setPaymentServiceModal: slice.actions.setPaymentServiceModal,
      setAddOnProductIds: slice.actions.setAddOnProductIds,
      bulkInviteBookKeepers: slice.actions.bulkInviteBookKeepersAction,
      setBookKeepersInviteSuccess: slice.actions.setBookKeepersInviteSuccess,
    }
  )
)(PurchaseFlowModals)

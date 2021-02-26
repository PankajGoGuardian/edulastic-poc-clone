import { segmentApi } from '@edulastic/api'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import loadable from '@loadable/component'
import { compose } from 'redux'
import {
  getItemBankSubscriptions,
  getProducts,
  getSubscriptionSelector,
  getIsPaymentServiceModalVisible,
  getPremiumProductId,
  getIsVerificationPending,
  slice,
} from '../../../../Subscription/ducks'

const SubscriptionAddonModal = loadable(() =>
  import('./SubscriptionAddonModal')
)
const UpgradeModal = loadable(() => import('./UpgradeModal'))
const PaymentServiceModal = loadable(() => import('./PaymentServiceModal'))
const PayWithPoModal = loadable(() => import('./PayWithPoModal'))
const MultiplePurchaseModal = loadable(() => import('./MultiplePurchaseModal'))
const BuyMoreLicensesModal = loadable(() => import('./BuyMoreLicensesModal'))

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
    defaultSelectedProductIds,
    showMultiplePurchaseModal,
    setShowMultiplePurchaseModal,
    showBuyMoreModal,
    setShowBuyMoreModal,
    isBuyMoreModalOpened,
    licenseIds,
    isEdulasticAdminView = false,
    handleEdulasticAdminProductLicense,
  } = props

  const [payWithPoModal, setPayWithPoModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [addOnProductIds, setAddOnProductIds] = useState([])
  const [productsCart, setProductsCart] = useState({})
  const [emailIds, setEmailIds] = useState([])
  const [totalAmount, setTotalAmount] = useState(100)
  const [buyCount, setBuyCount] = useState()

  useEffect(() => {
    // getSubscription on mount
    fetchUserSubscriptionStatus()
  }, [])

  const closeMultiplePurchaseModal = () => setShowMultiplePurchaseModal(false)

  const isPaidPremium = !(!subType || subType === 'TRIAL_PREMIUM')

  const { teacherPremium = {}, itemBankPremium = [] } = useMemo(() => {
    const DEFAULT_ITEMBANK_PRICE = 100
    const DEFAULT_PERIOD = 365
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
          period: DEFAULT_PERIOD,
          price: DEFAULT_ITEMBANK_PRICE,
        }
      }
      let currentDate = new Date()
      const itemBankSubEndDate = new Date(
        currentDate.setDate(currentDate.getDate() + DEFAULT_PERIOD)
      ).valueOf()
      const computedEndDate = Math.min(itemBankSubEndDate, subEndDate)
      currentDate = Date.now()
      const amountFactor =
        (computedEndDate - currentDate) / (itemBankSubEndDate - currentDate)
      const dynamicPrice = Math.round(amountFactor * DEFAULT_ITEMBANK_PRICE)
      const dynamicPeriodInDays = Math.round(amountFactor * DEFAULT_PERIOD)

      return {
        ...product,
        price: dynamicPrice,
        period: dynamicPeriodInDays,
      }
    })
    return {
      teacherPremium: result[0],
      itemBankPremium: result.slice(1),
    }
  }, [subEndDate, products])

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
  }

  const closeBuyMoreModal = () => setShowBuyMoreModal(false)

  const stripePaymentActionHandler = (data) => {
    if (addOnProductIds?.length) {
      handleStripePayment({ ...data, productIds: [...addOnProductIds] })
      setAddOnProductIds([])
    } else {
      handleStripeMultiplePayment({
        ...data,
        productIds: [...productsCart],
        emailIds,
        licenseIds,
      })
      setProductsCart({})
    }
  }

  return (
    <>
      {showSubscriptionAddonModal && (
        <SubscriptionAddonModal
          isVisible={showSubscriptionAddonModal}
          handleCloseModal={handleSubscriptionAddonModalClose}
          isPaidPremium={isPaidPremium}
          setShowUpgradeModal={setShowUpgradeModal}
          premiumProductId={premiumProductId}
          setTotalPurchaseAmount={setTotalAmount}
          setAddOnProductIds={setAddOnProductIds}
          defaultSelectedProductIds={defaultSelectedProductIds}
          teacherPremium={teacherPremium}
          itemBankPremium={itemBankPremium}
        />
      )}
      {showUpgradeModal && (
        <UpgradeModal
          visible={showUpgradeModal}
          setShowModal={setShowUpgradeModal}
          setShowBuyMoreModal={setShowBuyMoreModal}
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
      {showMultiplePurchaseModal && (
        <MultiplePurchaseModal
          isVisible={showMultiplePurchaseModal}
          onCancel={closeMultiplePurchaseModal}
          setShowUpgradeModal={setShowUpgradeModal}
          setTotalAmount={setTotalAmount}
          totalAmount={totalAmount}
          setProductsCart={setProductsCart}
          setEmailIds={setEmailIds}
          products={products}
        />
      )}
      {showBuyMoreModal && (
        <BuyMoreLicensesModal
          isVisible={showBuyMoreModal}
          onCancel={closeBuyMoreModal}
          isBuyMoreModalOpened={isBuyMoreModalOpened}
          setBuyCount={setBuyCount}
          buyCount={buyCount}
          setProductsCart={setProductsCart}
          setShowUpgradeModal={setShowUpgradeModal}
          products={products}
          setTotalAmount={setTotalAmount}
          isEdulasticAdminView={isEdulasticAdminView}
          handlePayment={handleEdulasticAdminProductLicense}
          licenseIds={licenseIds}
          userEmailIds={emailIds}
        />
      )}
    </>
  )
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
    }),
    {
      handleStripePayment: slice.actions.stripePaymentAction,
      handleStripeMultiplePayment: slice.actions.stripeMultiplePaymentAction,
      handleEdulasticAdminProductLicense:
        slice.actions.edulasticAdminProductLicenseAction,
      fetchUserSubscriptionStatus: slice.actions.fetchUserSubscriptionStatus,
      setPaymentServiceModal: slice.actions.setPaymentServiceModal,
    }
  )
)(PurchaseFlowModals)

import { segmentApi } from '@edulastic/api'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import loadable from '@loadable/component'
import { compose } from 'redux'
import { slice } from '../../../../Subscription/ducks'

const SubscriptionAddonModal = loadable(() =>
  import('./SubscriptionAddonModal')
)
const UpgradeModal = loadable(() => import('./UpgradeModal'))
const PaymentServiceModal = loadable(() => import('./PaymentServiceModal'))
const PayWithPoModal = loadable(() => import('./PayWithPoModal'))
const MultiplePurchaseModal = loadable(() => import('./MultiplePurchaseModal'))

const PurchaseFlowModals = (props) => {
  const {
    verificationPending,
    stripePaymentAction,
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
  } = props

  const [payWithPoModal, setPayWithPoModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [addOnProductIds, setAddOnProductIds] = useState([])
  const [totalAmount, setTotalAmount] = useState(100)

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
          openPaymentServiceModal={openPaymentServiceModal}
          openPoServiceModal={openPoServiceModal}
        />
      )}
      {isPaymentServiceModalVisible && (
        <PaymentServiceModal
          visible={isPaymentServiceModalVisible}
          closeModal={closePaymentServiceModal}
          verificationPending={verificationPending}
          stripePaymentAction={stripePaymentAction}
          user={user}
          reason="Premium Upgrade"
          totalPurchaseAmount={totalAmount}
          addOnProductIds={addOnProductIds}
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
        />
      )}
    </>
  )
}

export default compose(
  withRouter,
  connect(
    (state) => ({
      verificationPending: state?.subscription?.verificationPending,
      subscription: state?.subscription?.subscriptionData?.subscription,
      user: state.user.user,
      itemBankSubscriptions:
        state?.subscription?.subscriptionData?.itemBankSubscriptions,
      premiumProductId: state?.subscription?.subscriptionData?.premiumProductId,
      products: state?.subscription?.products,
      isPaymentServiceModalVisible:
        state.subscription?.isPaymentServiceModalVisible,
    }),
    {
      stripePaymentAction: slice.actions.stripePaymentAction,
      fetchUserSubscriptionStatus: slice.actions.fetchUserSubscriptionStatus,
      setPaymentServiceModal: slice.actions.setPaymentServiceModal,
    }
  )
)(PurchaseFlowModals)

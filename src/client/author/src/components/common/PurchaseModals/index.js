import { segmentApi } from '@edulastic/api'
import React, { useEffect, useMemo, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import loadable from '@loadable/component'
import { compose } from 'redux'
import { notification } from '@edulastic/common'
import { uniq, compact } from 'lodash'
import {
  getItemBankSubscriptions,
  getProducts,
  getSubscriptionSelector,
  getIsPaymentServiceModalVisible,
  getPremiumProductId,
  getIsVerificationPending,
  slice,
} from '../../../../Subscription/ducks'
import IndividualSubscriptionModal from './IndividualSubscriptionModal'

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
    defaultSelectedProductIds,
    showMultiplePurchaseModal,
    setShowMultiplePurchaseModal,
    showBuyMoreModal,
    setShowBuyMoreModal,
    licenseIds,
    isEdulasticAdminView = false,
    handleEdulasticAdminProductLicense,
    showRenewalOptions = false,
    currentItemId,
    licenseOwnerId,
  } = props

  const [payWithPoModal, setPayWithPoModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [addOnProductIds, setAddOnProductIds] = useState([])
  const [productsCart, setProductsCart] = useState([])
  const [emailIds, setEmailIds] = useState([])
  const [totalAmount, setTotalAmount] = useState(100)
  const [quantities, setQuantities] = useState({})

  const isPaidPremium = !(!subType || subType === 'TRIAL_PREMIUM')
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
      setAddOnProductIds([])
    } else {
      handleStripeMultiplePayment({
        ...data,
        productIds: [...productsCart],
        emailIds,
        licenseIds,
        licenseOwnerId,
      })
      if (!isPaymentServiceModalVisible) {
        setProductsCart([])
      }
    }
  }

  const handleClick = ({ emails = [], productsToshow = products }) => {
    if (showMultiplePurchaseModal) {
      if (emails.length > quantities[premiumProductId]) {
        return notification({
          type: 'warn',
          msg: 'Email count(s) can not be more than Premium count(s)',
        })
      }
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
          licenseIds,
          licenseOwnerId,
        })
        handleSubscriptionAddonModalClose()
        return
      }
      setProductsCart(productQuantities)
    } else {
      setAddOnProductIds(selectedProductIds)
    }

    setTotalAmount(totalAmount)
    handleSubscriptionAddonModalClose()
    setShowUpgradeModal(true)
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
        />
      )}
    </>
  )
}

PurchaseFlowModals.defaultProps = {
  setShowMultiplePurchaseModal: () => {},
  setShowSubscriptionAddonModal: () => {},
  setShowBuyMoreModal: () => {},
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

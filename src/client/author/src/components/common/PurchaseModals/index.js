import { segmentApi } from '@edulastic/api'
import React, { useEffect, useMemo, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import loadable from '@loadable/component'
import { compose } from 'redux'
import { uniq, compact, keyBy } from 'lodash'
import moment from 'moment'
import { roleuser } from '@edulastic/constants'
import {
  getItemBankSubscriptions,
  getProducts,
  getSubscriptionSelector,
  getPremiumProductId,
  getIsVerificationPending,
  getAddOnProductIds,
  getBookKeepersInviteSuccessStatus,
  slice,
  getShowTrialConfirmationMessageSelector,
} from '../../../../Subscription/ducks'
import {
  getCollectionsSelector,
  getInterestedGradesSelector,
  getUserOrgId,
} from '../../../selectors/user'
import {
  fetchPlaylistsAction,
  getDashboardPlaylists,
} from '../../../../Dashboard/ducks'
import { useThisPlayListAction } from '../../../../CurriculumSequence/ducks'
import CartModal from '../../../../Subscription/components/CartModal'

const MultipleLicensePurchase = loadable(() =>
  import('./MultipleLicensePurchase')
)
const IndividualSubscriptionModal = loadable(() =>
  import('./IndividualSubscriptionModal')
)
const TrialConfirmationModal = loadable(() => import('./TrialConfimationModal'))
const UpgradeModal = loadable(() => import('./UpgradeModal'))
const PaymentServiceModal = loadable(() => import('./PaymentServiceModal'))
const PayWithPoModal = loadable(() => import('./PayWithPoModal'))
const BuyMoreLicensesModal = loadable(() => import('./BuyMoreLicensesModal'))
const SubmitPOModal = loadable(() =>
  import('../../../../Subscription/components/SubmitPOModal')
)

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
    itemBankSubscriptions = [],
    premiumProductId,
    products,
    showSubscriptionAddonModal,
    setShowSubscriptionAddonModal,
    setProductData,
    defaultSelectedProductIds,
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
    subsLicenses = [],
    isConfirmationModalVisible,
    setShowTrialSubsConfirmation,
    showTrialConfirmationMessage,
    trialAddOnProductIds,
    collections,
    fetchPlaylists,
    playlists,
    history,
    useThisPlayList,
    interestedGrades,
    clickedBundleId,
    setClickedBundleId,
    cartVisible,
    setCartVisible,
    cartQuantities,
    fromSideMenu,
    openRequestInvoiceModal,
    isExternalSubmitPOModalVisible = false,
    toggleSubmitPOModal,
    setCartQuantities,
    setProratedProducts,
  } = props

  const [payWithPoModal, setPayWithPoModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [productsCart, setProductsCart] = useState([])
  const [emailIds, setEmailIds] = useState([])
  const [totalAmount, setTotalAmount] = useState(100)
  const userId = user?._id
  const [quantities, setQuantities] = useState(
    JSON.parse(localStorage[`cartQunatities:${userId}`] || '{}')
  )
  const [isPaymentServiceModalVisible, setPaymentServiceModal] = useState(false)
  const [isSubmitPOModalVisible, setSubmitPOModal] = useState(false)

  const trialConfirmationMessage = showTrialConfirmationMessage.subEndDate
    ? showTrialConfirmationMessage
    : { subEndDate: moment(subEndDate).format('DD MMM, YYYY') }
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

  const getShouldProrate = (endDate) => {
    const oneDay = 1000 * 60 * 60 * 24
    const remainingDaysForPremiumExpiry = Math.round(
      (new Date(endDate).getTime() - new Date().getTime()) / oneDay
    )
    return remainingDaysForPremiumExpiry > 90
  }
  const shouldProrateMultiplePurchase = useMemo(() => {
    if (
      (showMultiplePurchaseModal || showBuyMoreModal) &&
      subsLicenses.length
    ) {
      // taking the first licesne end data because all the licesnes will have the same end date
      const endDate = subsLicenses[0]?.expiresOn
      return getShouldProrate(endDate)
    }
    return false
  }, [subsLicenses, showMultiplePurchaseModal, showBuyMoreModal])

  const shouldProrate = useMemo(() => {
    if (showMultiplePurchaseModal || showBuyMoreModal) {
      return false
    }
    if (Object.keys(cartQuantities).find((x) => cartQuantities[x] > 1)) {
      return false
    }
    if (subEndDate) {
      return getShouldProrate(subEndDate)
    }
    return false
  }, [subEndDate, showMultiplePurchaseModal, showBuyMoreModal, cartQuantities])

  const { teacherPremium = {}, itemBankPremium = [] } = useMemo(() => {
    const boughtPremiumBankIds = itemBankSubscriptions
      .filter((x) => !x.isTrial)
      .map((x) => x.itemBankId)
    // for individual purchase have to filttered products
    // for multiples or renew show all products
    const purchasableProducts = shouldProrate
      ? products.filter(
          (x) => !boughtPremiumBankIds.includes(x.linkedProductId)
        )
      : products
    const result = purchasableProducts.map((product) => {
      const { id: currentProductId } = product

      if (!shouldProrateMultiplePurchase) {
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
      }

      let dynamicPrice = product.price
      let dynamicPeriodInDays = product.period
      let endDate = subEndDate
      if (shouldProrateMultiplePurchase) {
        // taking the first licesne end data because all the licesnes will have the same end date
        endDate = subsLicenses[0]?.expiresOn
      }
      if (shouldProrate || shouldProrateMultiplePurchase) {
        let currentDate = new Date()
        const itemBankSubEndDate = new Date(
          currentDate.setDate(currentDate.getDate() + product.period)
        ).valueOf()
        const computedEndDate = endDate
          ? Math.min(itemBankSubEndDate, new Date(endDate).getTime())
          : itemBankSubEndDate
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
  }, [subEndDate, products, subsLicenses, shouldProrateMultiplePurchase])
  const proratedItemBankPremiumKeyed = keyBy(itemBankPremium, 'id')
  const proratedProducts = products.map((p) => {
    if (proratedItemBankPremiumKeyed[p.id]) {
      return { ...p, ...proratedItemBankPremiumKeyed[p.id] }
    } else {
      return p
    }
  })
  useEffect(() => {
    setCartQuantities(quantities)
  }, [quantities])

  useEffect(() => {
    setProratedProducts(proratedProducts)
  }, [products?.length, itemBankPremium?.length])
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
      handleStripePayment({
        ...data,
        productIds: [...addOnProductIds],
        setPaymentServiceModal,
        setShowTrialSubsConfirmation,
      })
    } else {
      handleStripeMultiplePayment({
        ...data,
        productIds: [...productsCart],
        emailIds,
        licenseIds: selectedLicenseId ? [selectedLicenseId] : licenseIds,
        licenseOwnerId,
        setPaymentServiceModal,
      })
      if (selectedLicenseId) {
        setSelectedLicenseId(null)
      }
      if (!isPaymentServiceModalVisible) {
        setProductsCart([])
      }
    }
  }

  const isEnterprise = ['partial_premium', 'enterprise'].includes(subType)

  const handleClick = ({
    emails = [],
    productsToshow = products,
    shouldPayWithCC = false,
  }) => {
    if (showMultiplePurchaseModal) {
      const productQuantities = products.map((product) => ({
        ...product,
        quantity: quantities[product.id],
      }))
      setProductsCart(productQuantities)
      setEmailIds(emails)
    } else if (cartVisible) {
      /**
       * If atleast one cart quantity is greater than 1 or
       * atleast one of the added product is already purchased
       * then proceed with multiple license purchase flow
       * else individual purchase
       */
      if (
        Object.keys(cartQuantities).some(
          (x) =>
            cartQuantities[x] > 1 ||
            itemBankSubscriptions.some((permission) => {
              return (
                permission.itemBankId ===
                  products.find((p) => p.id === x)?.linkedProductId &&
                !permission.isTrial
              )
            })
        ) ||
        user?.role !== roleuser.TEACHER ||
        isEnterprise
      ) {
        const productQuantities = products.map((product) => ({
          ...product,
          quantity: cartQuantities[product.id],
        }))
        setProductsCart(productQuantities)
        setEmailIds(emails)
      } else {
        setAddOnProductIds(Object.keys(cartQuantities))
      }
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
        setCartVisible(false)
        setSelectedLicenseId(null)
        return
      }
      setProductsCart(productQuantities)
    } else {
      setAddOnProductIds(selectedProductIds)
    }

    setTotalAmount(totalAmount)
    handleSubscriptionAddonModalClose()
    setCartVisible(false)
    if (shouldPayWithCC) {
      openPaymentServiceModal(true)
    } else {
      setShowUpgradeModal(true)
    }
  }

  const handleOpenSubmitPOModal = () => setSubmitPOModal(true)
  const handleCloseSubmitPOModal = () => {
    toggleSubmitPOModal(false)
    setSubmitPOModal(false)
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
          subEndDate={subEndDate}
        />
      )}
      {showMultiplePurchaseModal && (
        <MultipleLicensePurchase
          isVisible={showMultiplePurchaseModal}
          handleCloseModal={handleSubscriptionAddonModalClose}
          products={[teacherPremium, ...itemBankPremium]}
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
          handleOpenRequestInvoiceModal={openRequestInvoiceModal}
        />
      )}
      {cartVisible && !fromSideMenu && (
        <CartModal
          visible={cartVisible}
          products={proratedProducts}
          teacherPremium={teacherPremium}
          setTotalAmount={setTotalAmount}
          bulkInviteBookKeepers={bulkInviteBookKeepers}
          districtId={userOrgId}
          isBookKeepersInviteSuccess={isBookKeepersInviteSuccess}
          setBookKeepersInviteSuccess={setBookKeepersInviteSuccess}
          handleClick={handleClick}
          closeModal={() => setCartVisible(false)}
          userId={user?._id}
          user={user}
          handleOpenRequestInvoiceModal={openRequestInvoiceModal}
          subsLicenses={subsLicenses}
          itemBankSubscriptions={itemBankSubscriptions}
          subType={subType}
        />
      )}
      {showUpgradeModal && (
        <UpgradeModal
          visible={showUpgradeModal}
          setShowModal={setShowUpgradeModal}
          openPaymentServiceModal={openPaymentServiceModal}
          openPoServiceModal={openPoServiceModal}
          openSubmitPOModal={handleOpenSubmitPOModal}
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
          products={[teacherPremium, ...itemBankPremium]}
          currentItemId={currentItemId}
          setTotalAmount={setTotalAmount}
          setQuantities={setQuantities}
          quantities={quantities}
          setSelectedProductIds={setSelectedProductIds}
          selectedProductIds={selectedProductIds}
          totalAmount={totalAmount}
          isEdulasticAdminView={isEdulasticAdminView}
          teacherPremium={teacherPremium}
          setSelectedLicenseId={setSelectedLicenseId}
        />
      )}
      {isConfirmationModalVisible && (
        <TrialConfirmationModal
          visible={isConfirmationModalVisible}
          showTrialSubsConfirmationAction={setShowTrialSubsConfirmation}
          showTrialConfirmationMessage={trialConfirmationMessage}
          trialAddOnProductIds={trialAddOnProductIds}
          collections={collections}
          history={history}
          products={products}
          fetchPlaylists={fetchPlaylists}
          playlists={playlists}
          subType={subType}
          useThisPlayList={useThisPlayList}
          interestedGrades={interestedGrades}
          clickedBundleId={clickedBundleId}
          setClickedBundleId={setClickedBundleId}
        />
      )}

      {(isSubmitPOModalVisible || isExternalSubmitPOModalVisible) && (
        <SubmitPOModal
          visible={isSubmitPOModalVisible || isExternalSubmitPOModalVisible}
          onCancel={handleCloseSubmitPOModal}
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
  setClickedBundleId: () => {},
  openRequestInvoiceModal: () => {},
  toggleSubmitPOModal: () => {},
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
      user: state.user.user,
      addOnProductIds: getAddOnProductIds(state),
      userOrgId: getUserOrgId(state),
      isBookKeepersInviteSuccess: getBookKeepersInviteSuccessStatus(state),
      collections: getCollectionsSelector(state),
      playlists: getDashboardPlaylists(state),
      showTrialConfirmationMessage: getShowTrialConfirmationMessageSelector(
        state
      ),
      interestedGrades: getInterestedGradesSelector(state),
      cartVisible: state?.subscription?.cartVisible,
      cartQuantities: state?.subscription?.cartQuantities,
    }),
    {
      handleStripePayment: slice.actions.stripePaymentAction,
      handleStripeMultiplePayment: slice.actions.stripeMultiplePaymentAction,
      handleEdulasticAdminProductLicense:
        slice.actions.edulasticAdminProductLicenseAction,
      setAddOnProductIds: slice.actions.setAddOnProductIds,
      bulkInviteBookKeepers: slice.actions.bulkInviteBookKeepersAction,
      setBookKeepersInviteSuccess: slice.actions.setBookKeepersInviteSuccess,
      fetchPlaylists: fetchPlaylistsAction,
      useThisPlayList: useThisPlayListAction,
      setCartVisible: slice.actions.setCartVisible,
      setCartQuantities: slice.actions.setCartQuantities,
      setProratedProducts: slice.actions.setProratedProducts,
    }
  )
)(PurchaseFlowModals)

import { segmentApi } from '@edulastic/api'
import loadable from '@loadable/component'
import React, { useEffect, useMemo, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
// import { withNamespaces } from '@edulastic/localization' // TODO: Need i18n support
import { roleuser, signUpState } from '@edulastic/constants'
import { connect } from 'react-redux'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'
import ItemBankTrialUsedModal from '../../../Dashboard/components/Showcase/components/Myclasses/components/FeaturedContentBundle/ItemBankTrialUsedModal'
import {
  fetchMultipleSubscriptionsAction,
  getLoadingStateSelector,
  getSubsLicensesSelector,
} from '../../../ManageSubscription/ducks'
import { clearPlaylistFiltersAction } from '../../../Playlist/ducks'
import { resetTestFiltersAction } from '../../../TestList/ducks'
import PurchaseFlowModals from '../../../src/components/common/PurchaseModals'
import { slice, trialPeriodTextSelector } from '../../ducks'
import HasLicenseKeyModal from '../HasLicenseKeyModal'
import PurchaseLicenseModal from '../PurchaseLicenseModal'
import SubscriptionHeader from '../SubscriptionHeader'
import SubscriptionMain from '../SubscriptionMain'
import DataStudioTab from '../SubscriptionMain/DataStudioTab'
import EnterpriseTab from '../SubscriptionMain/EnterpriseTab'
import { Wrapper } from '../styled/commonStyled'
import {
  CompareModal,
  PlanCard,
  PlanContent,
  PlanDescription,
  PlanHeader,
  PlanTitle,
  SubscriptionContentWrapper,
} from './styled'
import { getUserFeatures } from '../../../src/selectors/user'
import { comparePlansData } from '../../constants/subscription'
import { navigationState } from '../../../src/constants/navigation'

const RequestInvoiceModal = loadable(() => import('../RequestInvoviceModal'))

const PlanDetailsComponent = ({ title, description = '' }) => (
  <>
    <PlanTitle>{title}</PlanTitle>
    <PlanDescription>{description}</PlanDescription>
  </>
)

const Plans = ({ cardTitle, subTitle, data, color, bgImg }) => (
  <PlanCard>
    <PlanHeader bgImg={bgImg} color={color}>
      <h2>{cardTitle}</h2>
      <span>{subTitle}</span>
    </PlanHeader>
    <PlanContent>
      {data.map((item) => (
        <PlanDetailsComponent {...item} />
      ))}
    </PlanContent>
  </PlanCard>
)

function formatDate(subEndDate) {
  if (!subEndDate) return null
  const date = new Date(subEndDate).toString().split(' ')
  return `${date[2]} ${date[1]}, ${date[3]}`
}

const ONE_MONTH = 30 * 24 * 60 * 60 * 1000
const TEN_DAYS = 10 * 24 * 60 * 60 * 1000

const Subscription = (props) => {
  const {
    history,
    verificationPending,
    isSubscriptionExpired,
    verifyAndUpgradeLicense,
    isSuccess = false,
    subscription = {},
    user,
    isPremiumTrialUsed,
    itemBankSubscriptions = [],
    startTrialAction,
    products,
    usedTrialItemBankIds = [],
    setPaymentServiceModal,
    dashboardTiles,
    resetTestFilters,
    resetPlaylistFilters,
    fetchMultipleSubscriptions,
    subsLicenses,
    setCartVisible,
    cartQuantities,
    setCartQuantities,
    setRequestQuoteModal,
    proratedProducts,
    isLoading,
    displayText,
    features,
  } = props

  const { subEndDate, subType, schoolId = '' } = subscription

  const [comparePlan, setComparePlan] = useState(false)
  const [hasLicenseKeyModal, setHasLicenseKeyModal] = useState(false)
  const [purchaseLicenseModal, setpurchaseLicenseModal] = useState(false)
  const [showSubscriptionAddonModal, setShowSubscriptionAddonModal] = useState(
    false
  )
  const [showMultiplePurchaseModal, setShowMultiplePurchaseModal] = useState(
    false
  )
  const [trialAddOnProductIds, setTrialAddOnProductIds] = useState([])
  const [
    showFeatureNotAvailableModal,
    setShowFeatureNotAvailableModal,
  ] = useState(false)
  const [productData, setProductData] = useState({})
  const [showItemBankTrialUsedModal, setShowItemBankTrialUsedModal] = useState(
    false
  )
  const [showTrialSubsConfirmation, setShowTrialSubsConfirmation] = useState(
    false
  )
  const [isRequestInvoiceModalVisible, setRequestInvoiceModal] = useState(false)
  const [showEnterpriseTab, setShowEnterpriseTab] = useState(false)
  const [showDataStudioTab, setShowDataStudioTab] = useState(false)
  const [isSubmitPOModalVisible, setSubmitPOModal] = useState(false)
  const [showCompleteSignupModal, setShowCompleteSignupModal] = useState(false)
  const [callFunctionAfterSignup, setCallFunctionAfterSignup] = useState(null)
  const [isTabShouldSwitch, setIsTabShouldSwitch] = useState(true)

  useEffect(() => {
    // getSubscription on mount
    // fetchUserSubscriptionStatus() // fetching already happening from sidemenu mount
    fetchMultipleSubscriptions({})
  }, [])

  const isPremiumUser = user?.features?.premium && subscription?._id

  const isFreeAdmin = [roleuser.DISTRICT_ADMIN, roleuser.SCHOOL_ADMIN].includes(
    user.role
  )

  const isPlanEnterprise =
    ['partial_premium', 'enterprise'].includes(subType) && isPremiumUser

  useEffect(() => {
    if (
      ((['partial_premium', 'enterprise'].includes(subType) && isPremiumUser) ||
        isFreeAdmin) &&
      isTabShouldSwitch
    ) {
      setShowEnterpriseTab(true)
      setShowDataStudioTab(false)
    }
  }, [subType, isPremiumUser, isFreeAdmin, isTabShouldSwitch])

  useEffect(() => {
    if (
      history?.location?.state?.view ===
      navigationState.SUBSCRIPTION.view.DATA_STUDIO
    ) {
      setShowEnterpriseTab(false)
      setShowDataStudioTab(true)
      history.push({
        pathname: history.location.pathname,
        state: undefined,
      })
    }
  }, [history.location.state])

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
    (subType === 'partial_premium' && !isPremiumUser)
  )

  const openComparePlanModal = () => setComparePlan(true)
  const closeComparePlansModal = () => setComparePlan(false)
  const openPaymentServiceModal = () => {
    setPaymentServiceModal(true)
    segmentApi.trackTeacherClickOnUpgradeSubscription({ user })
  }

  const openHasLicenseKeyModal = () => setHasLicenseKeyModal(true)
  const closeHasLicenseKeyModal = () => setHasLicenseKeyModal(false)
  const openPurchaseLicenseModal = () => setpurchaseLicenseModal(true)
  const closePurchaseLicenseModal = () => setpurchaseLicenseModal(false)

  const openRequestInvoiceModal = () => {
    setRequestInvoiceModal(true)
    setCartVisible(false)
  }
  const closeRequestInvoiceModal = () => {
    setRequestInvoiceModal(false)
    setShowMultiplePurchaseModal(false)
  }
  const openRequestQuoteModal = () => setRequestQuoteModal(true)
  const openSubmitPOModal = () => setSubmitPOModal(true)

  const productNamesAndPriceById = useMemo(
    () =>
      products?.reduce(
        (a, c) => ({ ...a, [c.id]: { name: c.name, price: c.price } }),
        {}
      ) || {},
    [products]
  )

  const isSubscribed =
    subType === 'premium' ||
    subType === 'enterprise' ||
    isSuccess ||
    subType === 'TRIAL_PREMIUM'

  const isAboutToExpire = subEndDate
    ? Date.now() + ONE_MONTH > subEndDate && Date.now() < subEndDate + TEN_DAYS
    : false

  const showRenewalOptions =
    ((isPaidPremium && isAboutToExpire) ||
      (!isPaidPremium && isSubscriptionExpired)) &&
    !['enterprise', 'partial_premium'].includes(subType)

  const itemBankProductIds = products
    .filter((prod) => prod.type && prod.type.startsWith('ITEM_BANK_'))
    .map((prod) => prod.linkedProductId)

  const totalPaidProducts = itemBankSubscriptions.reduce(
    (a, c) => {
      if (itemBankProductIds.includes(c.itemBankId)) {
        if (c.isTrial) return a
        return a + 1
      }
      return a
    },
    isPaidPremium ? 1 : 0
  )
  const hasAllPremiumProductAccess =
    isPaidPremium && totalPaidProducts === products.length

  const setShowSubscriptionAddonModalWithId = () => {
    setShowSubscriptionAddonModal(true)
  }

  const handlePurchaseFlow = () => {
    setShowSubscriptionAddonModal(true)
    setShowItemBankTrialUsedModal(false)
  }

  const handleCloseItemTrialModal = () => setShowItemBankTrialUsedModal(false)

  const isCurrentItemBankUsed = usedTrialItemBankIds.includes(
    productData?.itemBankId
  )
  const showMultipleSubscriptions = user?.features?.showMultipleSubscriptions

  const defaultSelectedProductIds = productData.productId
    ? [productData.productId]
    : []

  const isPremium = subType && subType !== 'FREE' && isPremiumUser // here user can be premium, trial premium, or partial premium

  const isCliUser = user.openIdProvider === 'CLI'
  const handleCloseFeatureNotAvailableModal = () =>
    setShowFeatureNotAvailableModal(false)

  const { currentSignUpState: signupStatus } = user
  const isSignupCompleted = signupStatus === signUpState.DONE

  const signUpFlowModalHandler = (afterSignup) => {
    if (!isSignupCompleted) {
      setIsTabShouldSwitch(false)
      setShowCompleteSignupModal(true)
      setCallFunctionAfterSignup(() => afterSignup)
    } else {
      setShowCompleteSignupModal(false)
      setCallFunctionAfterSignup(() => null)
      afterSignup()
    }
  }

  return (
    <Wrapper>
      <SubscriptionHeader
        openComparePlanModal={openComparePlanModal}
        showRenewalOptions={showRenewalOptions}
        isSubscribed={isSubscribed}
        subType={subType}
        subEndDate={subEndDate}
        isPaidPremium={isPaidPremium}
        isPremiumUser={isPremiumUser}
        setShowSubscriptionAddonModal={setShowSubscriptionAddonModal}
        hasAllPremiumProductAccess={hasAllPremiumProductAccess}
        setShowMultiplePurchaseModal={setShowMultiplePurchaseModal}
        showMultipleSubscriptions={showMultipleSubscriptions}
        isFreeAdmin={isFreeAdmin}
        toggleShowFeatureNotAvailableModal={setShowFeatureNotAvailableModal}
        orgData={user.orgData}
        userRole={user.role}
        history={history}
        isCliUser={isCliUser}
        showEnterpriseTab={showEnterpriseTab}
        setShowEnterpriseTab={setShowEnterpriseTab}
        showDataStudioTab={showDataStudioTab}
        setShowDataStudioTab={setShowDataStudioTab}
        uploadPO={openSubmitPOModal}
        schoolId={schoolId}
        setCartVisible={setCartVisible}
        cartQuantities={cartQuantities}
        setIsTabShouldSwitch={setIsTabShouldSwitch}
        features={features}
      />
      <SubscriptionContentWrapper>
        {showEnterpriseTab ? (
          <EnterpriseTab
            features={features}
            isPremium={isPremium}
            subType={subType}
            requestQuote={openRequestQuoteModal}
            subEndDate={subEndDate}
            isPremiumUser={isPremiumUser}
            signUpFlowModalHandler={signUpFlowModalHandler}
            user={user}
          />
        ) : showDataStudioTab ? (
          <DataStudioTab
            features={features}
            isPremium={isPremium}
            subType={subType}
            requestQuote={openRequestQuoteModal}
            subEndDate={subEndDate}
            isPremiumUser={isPremiumUser}
            signUpFlowModalHandler={signUpFlowModalHandler}
            user={user}
          />
        ) : (
          <SubscriptionMain
            isLoading={isLoading}
            isSubscribed={isSubscribed}
            openPaymentServiceModal={openPaymentServiceModal}
            openHasLicenseKeyModal={openHasLicenseKeyModal}
            openPurchaseLicenseModal={openPurchaseLicenseModal}
            subEndDate={subEndDate}
            subType={subType}
            isPremiumTrialUsed={isPremiumTrialUsed}
            startTrialAction={startTrialAction}
            isPaidPremium={isPaidPremium}
            showRenewalOptions={showRenewalOptions}
            usedTrialItemBankIds={usedTrialItemBankIds}
            isPremiumUser={isPremiumUser}
            setShowSubscriptionAddonModalWithId={
              setShowSubscriptionAddonModalWithId
            }
            hasAllPremiumProductAccess={hasAllPremiumProductAccess}
            itemBankSubscriptions={itemBankSubscriptions}
            setProductData={setProductData}
            setShowItemBankTrialUsedModal={setShowItemBankTrialUsedModal}
            handleCloseFeatureNotAvailableModal={
              handleCloseFeatureNotAvailableModal
            }
            showFeatureNotAvailableModal={showFeatureNotAvailableModal}
            isFreeAdmin={isFreeAdmin}
            dashboardTiles={dashboardTiles}
            resetTestFilters={resetTestFilters}
            resetPlaylistFilters={resetPlaylistFilters}
            history={history}
            productData={productData}
            products={products}
            setTrialAddOnProductIds={setTrialAddOnProductIds}
            setShowTrialSubsConfirmation={setShowTrialSubsConfirmation}
            showMultipleSubscriptions={showMultipleSubscriptions}
            setShowEnterpriseTab={setShowEnterpriseTab}
            setShowMultiplePurchaseModal={setShowMultiplePurchaseModal}
            cartQuantities={cartQuantities}
            setCartQuantities={setCartQuantities}
            subscription={subscription}
            subsLicenses={subsLicenses}
            user={user}
            requestQuote={openRequestQuoteModal}
            isPlanEnterprise={isPlanEnterprise}
            proratedProducts={proratedProducts}
            signUpFlowModalHandler={signUpFlowModalHandler}
            setIsTabShouldSwitch={setIsTabShouldSwitch}
            displayText={displayText}
          />
        )}
      </SubscriptionContentWrapper>
      <CompareModal
        title="Compare Plans"
        visible={comparePlan}
        onCancel={closeComparePlansModal}
        footer={[]}
        style={{ top: 25 }}
      >
        {comparePlansData.map((plan) => (
          <Plans {...plan} />
        ))}
      </CompareModal>

      <PurchaseFlowModals
        showSubscriptionAddonModal={showSubscriptionAddonModal}
        setShowSubscriptionAddonModal={setShowSubscriptionAddonModal}
        defaultSelectedProductIds={defaultSelectedProductIds}
        showMultiplePurchaseModal={showMultiplePurchaseModal}
        setShowMultiplePurchaseModal={setShowMultiplePurchaseModal}
        isConfirmationModalVisible={showTrialSubsConfirmation}
        setShowTrialSubsConfirmation={setShowTrialSubsConfirmation}
        showRenewalOptions={showRenewalOptions}
        subsLicenses={subsLicenses}
        setProductData={setProductData}
        trialAddOnProductIds={trialAddOnProductIds}
        openRequestInvoiceModal={openRequestInvoiceModal}
        isExternalSubmitPOModalVisible={isSubmitPOModalVisible}
        toggleSubmitPOModal={setSubmitPOModal}
        setIsTabShouldSwitch={setIsTabShouldSwitch}
      />

      {showCompleteSignupModal && (
        <AuthorCompleteSignupButton
          isOpenSignupModal={showCompleteSignupModal}
          onClick={callFunctionAfterSignup}
          setShowCompleteSignupModal={setShowCompleteSignupModal}
          setCallFunctionAfterSignup={setCallFunctionAfterSignup}
          subType={subType}
        />
      )}

      <HasLicenseKeyModal
        visible={hasLicenseKeyModal}
        closeModal={closeHasLicenseKeyModal}
        expDate={formatDate(subEndDate)}
        isSubscribed={isSubscribed}
        verificationPending={verificationPending}
        verifyAndUpgradeLicense={verifyAndUpgradeLicense}
        isPaidPremium={isPaidPremium}
        subType={subType}
      />

      <PurchaseLicenseModal
        visible={purchaseLicenseModal}
        closeModal={closePurchaseLicenseModal}
        openPaymentServiceModal={openPaymentServiceModal}
        verificationPending={verificationPending}
      />
      {showItemBankTrialUsedModal && (
        <ItemBankTrialUsedModal
          title={productData?.productName}
          isVisible={showItemBankTrialUsedModal}
          handleCloseModal={handleCloseItemTrialModal}
          handlePurchaseFlow={handlePurchaseFlow}
          isCurrentItemBankUsed={isCurrentItemBankUsed}
        />
      )}

      {isRequestInvoiceModalVisible && (
        <RequestInvoiceModal
          cartProducts={cartQuantities}
          productNamesAndPriceById={productNamesAndPriceById}
          visible={isRequestInvoiceModalVisible}
          onCancel={closeRequestInvoiceModal}
        />
      )}
    </Wrapper>
  )
}

export default compose(
  withRouter,
  connect(
    (state) => ({
      verificationPending: state?.subscription?.verificationPending,
      subscription: state?.subscription?.subscriptionData?.subscription,
      isSubscriptionExpired: state?.subscription?.isSubscriptionExpired,
      isSuccess: state?.subscription?.subscriptionData?.success,
      user: state.user.user,
      isPremiumTrialUsed:
        state?.subscription?.subscriptionData?.isPremiumTrialUsed,
      itemBankSubscriptions:
        state?.subscription?.subscriptionData?.itemBankSubscriptions,
      products: state?.subscription?.products,
      usedTrialItemBankIds:
        state?.subscription?.subscriptionData?.usedTrialItemBankIds,
      dashboardTiles: state.dashboardTeacher.configurableTiles,
      subsLicenses: getSubsLicensesSelector(state),
      cartQuantities: state.subscription?.cartQuantities,
      proratedProducts: state.subscription?.proratedProducts,
      isLoading: getLoadingStateSelector(state),
      displayText: trialPeriodTextSelector(state),
      features: getUserFeatures(state),
    }),
    {
      verifyAndUpgradeLicense: slice.actions.upgradeLicenseKeyPending,
      startTrialAction: slice.actions.startTrialAction,
      setPaymentServiceModal: slice.actions.setPaymentServiceModal,
      resetTestFilters: resetTestFiltersAction,
      resetPlaylistFilters: clearPlaylistFiltersAction,
      fetchMultipleSubscriptions: fetchMultipleSubscriptionsAction,

      setCartVisible: slice.actions.setCartVisible,
      setCartQuantities: slice.actions.setCartQuantities,
      setRequestQuoteModal: slice.actions.setRequestQuoteModal,
    }
  )
)(Subscription)

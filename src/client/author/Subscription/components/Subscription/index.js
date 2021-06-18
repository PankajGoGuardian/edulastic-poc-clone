import { segmentApi } from '@edulastic/api'
import React, { useEffect, useMemo, useState } from 'react'
import loadable from '@loadable/component'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
// import { withNamespaces } from '@edulastic/localization' // TODO: Need i18n support
import { connect } from 'react-redux'
import { roleuser, signUpState } from '@edulastic/constants'
import { slice } from '../../ducks'
import HasLicenseKeyModal from '../HasLicenseKeyModal'
import PurchaseLicenseModal from '../PurchaseLicenseModal'
import { Wrapper } from '../styled/commonStyled'
import SubscriptionHeader from '../SubscriptionHeader'
import SubscriptionMain from '../SubscriptionMain'
import PurchaseFlowModals from '../../../src/components/common/PurchaseModals'
import {
  CompareModal,
  PlanCard,
  PlanContent,
  PlanDescription,
  PlanHeader,
  PlanTitle,
  SubscriptionContentWrapper,
} from './styled'
import { resetTestFiltersAction } from '../../../TestList/ducks'
import { clearPlaylistFiltersAction } from '../../../Playlist/ducks'
import ItemBankTrialUsedModal from '../../../Dashboard/components/Showcase/components/Myclasses/components/FeaturedContentBundle/ItemBankTrialUsedModal'
import {
  fetchMultipleSubscriptionsAction,
  getSubsLicensesSelector,
} from '../../../ManageSubscription/ducks'
import EnterpriseTab from '../SubscriptionMain/EnterpriseTab'
import FREEIMG from '../../static/free-forever-bg.png'
import PREMIUMIMG from '../../static/premium-teacher-bg.png'
import ENTERPRISEIMG from '../../static/enterprise-bg.png'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'

const RequestInvoiceModal = loadable(() => import('../RequestInvoviceModal'))

const comparePlansData = [
  {
    cardTitle: 'Free Forever',
    subTitle: '$0 / MONTH',
    cardLabel: 'FREE FOREVER',
    color: '#5EB500',
    bgImg: FREEIMG,
    data: [
      {
        title: 'Unlimited Assesments',
        description: 'Create as many classes & students as you need.',
      },
      {
        title: '80K & Growing Item Bank',
        description: 'Edulastic CERTIFIED for Grades K-12.',
      },
      {
        title: '30+ Technology-Enhanced Question Types',
        description: 'Create your own or mix and match.',
      },
      {
        title: 'Immediate Perfomance Data',
        description: 'Real-time reports by student and class.',
      },
      {
        title: 'Standards Mastery Tracking',
        description: 'Reports by standard for students and classes.',
      },
      {
        title: 'Standards Mastery Tracking',
        description: 'Reports by standard for students and classes.',
      },
      {
        title: 'Assessment Sharing',
        description: 'Share assessments or keep them private. Your choice.',
      },
      {
        title: 'Works with Google Apps',
        description: 'Google single sign-on and sync with Google Classroom.',
      },
    ],
  },
  {
    cardTitle: 'Premium Teacher',
    subTitle: '$100 / YEAR',
    cardLabel: 'PER TEACHER PRICING',
    color: '#4E95F3',
    bgImg: PREMIUMIMG,
    data: [
      {
        title: 'All Free Teacher Features, PLUS:',
        description: '',
      },
      {
        title: 'In-depth Reporting',
        description:
          'Show student growth over time. Analyze answer distractor. See complete student mastery profile.',
      },
      {
        title: 'Advanced Assessment Options',
        description:
          'Shuffle question order for each student. Show student scores but hide correct answers.',
      },
      {
        title: 'Read Aloud',
        description:
          'Choose students to have questions and answer choices read to them.',
      },
      {
        title: 'Rubric Scoring',
        description: 'Create and share rubrics school or district wide.',
      },
      {
        title: 'Collaboration',
        description: "Work on assessment as a team before they're published.",
      },
      {
        title: 'Presentation Mode',
        description:
          'Review answers and common mistakes with the class without showing names.',
      },
    ],
  },
  {
    cardTitle: 'Enterprise',
    subTitle: 'REQUEST A QUOTE',
    cardLabel: 'PER STUDENT PRICING',
    color: '#FFA200',
    bgImg: ENTERPRISEIMG,
    data: [
      {
        title: 'Premium Teacher for All Teachers, PLUS:',
        description: '',
      },
      {
        title: 'Common Assessment',
        description:
          'Administer common assessments and control access by teachers and students.',
      },
      {
        title: 'Immediate School or District-Wide Reports',
        description:
          'See performance, growth and standards mastery by building, grade, teacher and student.',
      },
      {
        title: 'SIS & LMS Integration',
        description:
          'Automatic roster sync and gradebook integration (where available).',
      },
      {
        title: 'Additional Item Banks',
        description:
          'Choose from third-party item banks, such as Inspect, Carnegie Learning or Progress Testing.',
      },
      {
        title: 'Expedited Technical Support',
        description: 'On-call support during assessment by phone or online.',
      },
      {
        title: 'Custom Professional Development',
        description:
          'Live or online workshops to get you and your teacher up and running.',
      },
    ],
  },
]

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
    }
  }, [subType, isPremiumUser, isFreeAdmin, isTabShouldSwitch])

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
        uploadPO={openSubmitPOModal}
        schoolId={schoolId}
        setCartVisible={setCartVisible}
        cartQuantities={cartQuantities}
        setIsTabShouldSwitch={setIsTabShouldSwitch}
      />
      <SubscriptionContentWrapper>
        {showEnterpriseTab ? (
          <EnterpriseTab
            isPremium={isPremium}
            subType={subType}
            requestQuote={openRequestQuoteModal}
            subEndDate={subEndDate}
            isPremiumUser={isPremiumUser}
            signUpFlowModalHandler={signUpFlowModalHandler}
          />
        ) : (
          <SubscriptionMain
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

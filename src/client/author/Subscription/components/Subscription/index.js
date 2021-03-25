import { segmentApi } from '@edulastic/api'
import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
// import { withNamespaces } from '@edulastic/localization' // TODO: Need i18n support
import { connect } from 'react-redux'
import { roleuser } from '@edulastic/constants'
import { slice } from '../../ducks'
import HasLicenseKeyModal from '../HasLicenseKeyModal'
import PurchaseLicenseModal from '../PurchaseLicenseModal'
import { Wrapper } from '../styled/commonStyled'
import SubscriptionHeader from '../SubscriptionHeader'
import SubscriptionMain from '../SubscriptionMain'
import PurchaseFlowModals from '../../../src/components/common/PurchaseModals'
import { getCollectionsSelector } from '../../../src/selectors/user'
import {
  CompareModal,
  PlanCard,
  PlanContent,
  PlanDescription,
  PlanHeader,
  PlanLabel,
  PlanTitle,
} from './styled'
import { resetTestFiltersAction } from '../../../TestList/ducks'
import { clearPlaylistFiltersAction } from '../../../Playlist/ducks'
import ItemBankTrialUsedModal from '../../../Dashboard/components/Showcase/components/Myclasses/components/FeaturedContentBundle/ItemBankTrialUsedModal'

const comparePlansData = [
  {
    cardTitle: 'Free Teacher',
    cardLabel: 'FREE FOREVER',
    color: '#5EB500',
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
    cardLabel: 'PER TEACHER PRICING',
    color: '#4E95F3',
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
    cardLabel: 'PER STUDENT PRICING',
    color: '#FFA200',
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

const Plans = ({ cardTitle, cardLabel, data, color }) => (
  <PlanCard>
    <PlanHeader color={color}>{cardTitle}</PlanHeader>
    <PlanLabel color={color}>{cardLabel}</PlanLabel>
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
    subscription: { subEndDate, subType } = {},
    user,
    fetchUserSubscriptionStatus,
    isPremiumTrialUsed,
    itemBankSubscriptions = [],
    startTrialAction,
    isConfirmationModalVisible,
    showTrialSubsConfirmationAction,
    products,
    usedTrialItemBankIds = [],
    setPaymentServiceModal,
    showTrialConfirmationMessage,
    dashboardTiles,
    resetTestFilters,
    resetPlaylistFilters,
    collections,
  } = props

  const [comparePlan, setComparePlan] = useState(false)
  const [hasLicenseKeyModal, setHasLicenseKeyModal] = useState(false)
  const [purchaseLicenseModal, setpurchaseLicenseModal] = useState(false)
  const [showSubscriptionAddonModal, setShowSubscriptionAddonModal] = useState(
    false
  )
  const [showMultiplePurchaseModal, setShowMultiplePurchaseModal] = useState(
    false
  )
  const [
    showFeatureNotAvailableModal,
    setShowFeatureNotAvailableModal,
  ] = useState(false)
  const [productData, setProductData] = useState({})
  const [showItemBankTrialUsedModal, setShowItemBankTrialUsedModal] = useState(
    false
  )

  useEffect(() => {
    // getSubscription on mount
    fetchUserSubscriptionStatus()
  }, [])

  const isPremiumUser = user?.features?.premium

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

  const isPremium = subType && subType !== 'FREE' // here user can be premium, trial premium, or partial premium

  const isFreeAdmin = [roleuser.DISTRICT_ADMIN, roleuser.SCHOOL_ADMIN].includes(
    user.role
  )

  const isCliUser = user.openIdProvider === 'CLI'
  const handleCloseFeatureNotAvailableModal = () =>
    setShowFeatureNotAvailableModal(false)

  return (
    <Wrapper>
      <SubscriptionHeader
        openComparePlanModal={openComparePlanModal}
        showRenewalOptions={showRenewalOptions}
        isSubscribed={isSubscribed}
        subType={subType}
        subEndDate={subEndDate}
        isPaidPremium={isPaidPremium}
        isPremium={isPremium}
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
      />

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
        isPremium={isPremium}
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
        showTrialSubsConfirmationAction={showTrialSubsConfirmationAction}
        showTrialConfirmationMessage={showTrialConfirmationMessage}
        dashboardTiles={dashboardTiles}
        resetTestFilters={resetTestFilters}
        resetPlaylistFilters={resetPlaylistFilters}
        isConfirmationModalVisible={isConfirmationModalVisible}
        collections={collections}
        history={history}
        productData={productData}
      />
      <CompareModal
        title=""
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
        setProductData={setProductData}
        showRenewalOptions={showRenewalOptions}
      />

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
      isConfirmationModalVisible:
        state?.subscription?.showTrialSubsConfirmation,
      products: state?.subscription?.products,
      usedTrialItemBankIds:
        state?.subscription?.subscriptionData?.usedTrialItemBankIds,
      showTrialConfirmationMessage:
        state?.subscription?.showTrialConfirmationMessage,
      dashboardTiles: state.dashboardTeacher.configurableTiles,
      collections: getCollectionsSelector(state),
    }),
    {
      verifyAndUpgradeLicense: slice.actions.upgradeLicenseKeyPending,
      fetchUserSubscriptionStatus: slice.actions.fetchUserSubscriptionStatus,
      startTrialAction: slice.actions.startTrialAction,
      showTrialSubsConfirmationAction:
        slice.actions.trialSubsConfirmationAction,
      setPaymentServiceModal: slice.actions.setPaymentServiceModal,
      resetTestFilters: resetTestFiltersAction,
      resetPlaylistFilters: clearPlaylistFiltersAction,
    }
  )
)(Subscription)

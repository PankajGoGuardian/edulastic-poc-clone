import { segmentApi } from '@edulastic/api'
import React, { useEffect, useState, useMemo } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import qs from 'qs'
// import { withNamespaces } from '@edulastic/localization' // TODO: Need i18n support
import { connect } from 'react-redux'
import { groupBy } from 'lodash'
import SubscriptionAddonModal from '../../../Dashboard/components/Showcase/components/Myclasses/components/SubscriptionAddonModal'
import { slice } from '../../ducks'
import HasLicenseKeyModal from '../HasLicenseKeyModal'
import PaymentServiceModal from '../PaymentServiceModal'
import PurchaseLicenseModal from '../PurchaseLicenseModal'
import { Wrapper } from '../styled/commonStyled'
import SubscriptionHeader from '../SubscriptionHeader'
import PayWithPoModal from '../SubscriptionHeader/PayWithPoModal'
import UpgradeModal from '../SubscriptionHeader/UpgradeModal'
import SubscriptionMain from '../SubscriptionMain'
import {
  CompareModal,
  PlanCard,
  PlanContent,
  PlanDescription,
  PlanHeader,
  PlanLabel,
  PlanTitle,
} from './styled'
import TrialConfirmationModal from '../../../Dashboard/components/Showcase/components/Myclasses/components/FeaturedContentBundle/TrialConfimationModal'
import { resetTestFiltersAction } from '../../../TestList/ducks'
import { clearPlaylistFiltersAction } from '../../../Playlist/ducks'

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
          'Showstudent growth over time. Analyze answer distractor. See coplete student mastery profile.',
      },
      {
        title: 'Advanced Assessment Optons',
        description:
          'Shuffle qustion order for each student. Show student scoes but hide correct answers.',
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
          'Review answers and common mistake with the class without showing names.',
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

const Subscription = (props) => {
  const {
    history,
    verificationPending,
    isSubscriptionExpired,
    verifyAndUpgradeLicense,
    stripePaymentAction,
    isSuccess = false,
    subscription: { subEndDate, subType } = {},
    user,
    fetchUserSubscriptionStatus,
    isPremiumTrialUsed,
    itemBankSubscriptions = [],
    startTrialAction,
    premiumProductId,
    isConfirmationModalVisible,
    showTrialSubsConfirmationAction,
    products,
    usedTrialItemBankId,
    isPaymentServiceModalVisible,
    setPaymentServiceModal,
    showTrialConfirmationMessage,
    dashboardTiles,
    resetTestFilters,
    resetPlaylistFilters,
  } = props

  const {
    id: sparkMathProductId,
    linkedProductId: sparkMathItemBankId,
  } = useMemo(
    () => products.find((product) => product.name === 'Spark Math') || {},
    [products]
  )

  const [comparePlan, setComparePlan] = useState(false)
  const [hasLicenseKeyModal, setHasLicenseKeyModal] = useState(false)
  const [purchaseLicenseModal, setpurchaseLicenseModal] = useState(false)
  const [payWithPoModal, setPayWithPoModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showSubscriptionAddonModal, setShowSubscriptionAddonModal] = useState(
    false
  )
  const [addOnProductIds, setAddOnProductIds] = useState([])
  const [totalAmount, setTotalAmount] = useState(100)
  const [selectedProductId, setSelectedProcductId] = useState(null)
  const [productData, setProductData] = useState({})

  useEffect(() => {
    // getSubscription on mount
    fetchUserSubscriptionStatus()
  }, [])

  const isPaidPremium = !(!subType || subType === 'TRIAL_PREMIUM')

  const isPremiumUser = user.features.premium

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

  const openComparePlanModal = () => setComparePlan(true)
  const closeComparePlansModal = () => setComparePlan(false)
  const openPaymentServiceModal = () => {
    setPaymentServiceModal(true)
    segmentApi.trackTeacherClickOnUpgradeSubscription({ user })
  }
  const openPoServiceModal = () => {
    setPayWithPoModal(true)
  }
  const closePaymentServiceModal = () => {
    if (selectedProductId) {
      setSelectedProcductId(null)
    }
    setPaymentServiceModal(false)
  }
  const openHasLicenseKeyModal = () => setHasLicenseKeyModal(true)
  const closeHasLicenseKeyModal = () => setHasLicenseKeyModal(false)
  const openPurchaseLicenseModal = () => setpurchaseLicenseModal(true)
  const closePurchaseLicenseModal = () => setpurchaseLicenseModal(false)

  const { FEATURED } = groupBy(dashboardTiles, 'type')
  const featuredBundles = FEATURED || []

  const currentItemBank =
    featuredBundles &&
    featuredBundles.find(
      (bundle) =>
        bundle?.config?.subscriptionData?.productId === sparkMathProductId
    )

  const settingProductData = () => {
    const { config = {} } = currentItemBank
    const { subscriptionData } = config

    setProductData({
      productId: subscriptionData.productId,
      productName: subscriptionData.productName,
      description: subscriptionData.description,
      hasTrial: subscriptionData.hasTrial,
      itemBankId: subscriptionData.itemBankId,
    })
  }

  const handleGoToCollectionClick = () => {
    const { config = {} } = currentItemBank
    const { filters, contentType } = config

    const content = contentType?.toLowerCase() || 'tests'

    const entries = filters.reduce((a, c) => ({ ...a, ...c }), {
      removeInterestedFilters: true,
    })
    const filter = qs.stringify(entries)

    if (content === 'tests') {
      resetTestFilters()
    } else {
      resetPlaylistFilters()
    }
    history.push(`/author/${content}?${filter}`)
    showTrialSubsConfirmationAction(false)
  }

  const isSubscribed =
    subType === 'premium' ||
    subType === 'enterprise' ||
    isSuccess ||
    subType === 'TRIAL_PREMIUM'

  const isAboutToExpire = subEndDate
    ? Date.now() + ONE_MONTH > subEndDate
    : false

  const totalPaidProducts = itemBankSubscriptions.reduce(
    (a, c) => {
      if (c.isTrial) return a
      return a + 1
    },
    isPaidPremium ? 1 : 0
  )
  const hasAllPremiumProductAccess = totalPaidProducts === products.length
  const showRenewalOptions =
    ((isPaidPremium && isAboutToExpire) ||
      (!isPaidPremium && isSubscriptionExpired)) &&
    !['enterprise', 'partial_premium'].includes(subType)

  const showUpgradeOptions = !isSubscribed

  const isTrialItemBank =
    itemBankSubscriptions &&
    itemBankSubscriptions?.length > 0 &&
    itemBankSubscriptions?.filter((x) => {
      return x.itemBankId === productData?.itemBankId && x.isTrial
    })?.length > 0

  const setShowSubscriptionAddonModalWithId = (id) => {
    if (id) {
      setSelectedProcductId(id)
    }
    setShowSubscriptionAddonModal(true)
  }

  return (
    <Wrapper>
      <SubscriptionHeader
        openComparePlanModal={openComparePlanModal}
        openPaymentServiceModal={openPaymentServiceModal}
        showUpgradeOptions={showUpgradeOptions}
        showRenewalOptions={showRenewalOptions}
        isSubscribed={isSubscribed}
        subType={subType}
        subEndDate={subEndDate}
        isPaidPremium={isPaidPremium}
        setShowSubscriptionAddonModal={setShowSubscriptionAddonModal}
        hasAllPremiumProductAccess={hasAllPremiumProductAccess}
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
        usedTrialItemBankId={usedTrialItemBankId}
        premiumUser={isPremiumUser}
        user={user}
        setShowSubscriptionAddonModalWithId={
          setShowSubscriptionAddonModalWithId
        }
        hasAllPremiumProductAccess={hasAllPremiumProductAccess}
        itemBankSubscriptions={itemBankSubscriptions}
        settingProductData={settingProductData}
        sparkMathItemBankId={sparkMathItemBankId}
        sparkMathProductId={sparkMathProductId}
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

      {showSubscriptionAddonModal && (
        <SubscriptionAddonModal
          isVisible={showSubscriptionAddonModal}
          handleCloseModal={setShowSubscriptionAddonModal}
          isPaidPremium={isPaidPremium}
          setShowUpgradeModal={setShowUpgradeModal}
          usedTrialItemBankId={usedTrialItemBankId}
          premiumProductId={premiumProductId}
          setTotalPurchaseAmount={setTotalAmount}
          setAddOnProductIds={setAddOnProductIds}
          defaultSelectedProductIds={
            selectedProductId ? [selectedProductId] : null
          }
          teacherPremium={teacherPremium}
          itemBankPremium={itemBankPremium}
        />
      )}

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

      <PayWithPoModal
        visible={payWithPoModal}
        setShowModal={setPayWithPoModal}
      />

      <UpgradeModal
        visible={showUpgradeModal}
        setShowModal={setShowUpgradeModal}
        openPaymentServiceModal={openPaymentServiceModal}
        openPoServiceModal={openPoServiceModal}
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
      {isConfirmationModalVisible && (
        <TrialConfirmationModal
          visible={isConfirmationModalVisible}
          showTrialSubsConfirmationAction={showTrialSubsConfirmationAction}
          showTrialConfirmationMessage={showTrialConfirmationMessage}
          isTrialItemBank={isTrialItemBank}
          isBlocked={currentItemBank?.isBlocked}
          title={productData?.productName}
          handleGoToCollectionClick={handleGoToCollectionClick}
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
      premiumProductId: state?.subscription?.subscriptionData?.premiumProductId,
      isConfirmationModalVisible:
        state?.subscription?.showTrialSubsConfirmation,
      products: state?.subscription?.products,
      usedTrialItemBankId:
        state?.subscription?.subscriptionData?.usedTrialItemBankId,
      isPaymentServiceModalVisible:
        state.subscription?.isPaymentServiceModalVisible,
      showTrialConfirmationMessage:
        state?.subscription?.showTrialConfirmationMessage,
      dashboardTiles: state.dashboardTeacher.configurableTiles,
    }),
    {
      verifyAndUpgradeLicense: slice.actions.upgradeLicenseKeyPending,
      stripePaymentAction: slice.actions.stripePaymentAction,
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

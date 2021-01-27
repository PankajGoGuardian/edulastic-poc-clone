import { segmentApi } from '@edulastic/api'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
// import { withNamespaces } from '@edulastic/localization' // TODO: Need i18n support
import { connect } from 'react-redux'
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
import { addPermissionRequestAction } from '../../../ContentCollections/ducks'
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
    verificationPending,
    isSubscriptionExpired,
    verifyAndUpgradeLicense,
    stripePaymentAction,
    isSuccess = false,
    subscription: { subEndDate, subType } = {},
    user,
    fetchUserSubscriptionStatus,
    isPremiumTrialUsed,
    startTrialAction,
    premiumProductId,
    addPermissionRequest,
    isConfirmationModalVisible,
    showTrialSubsConfirmationAction,
    products,
    usedTrialItemBankId,
  } = props

  const [comparePlan, setComparePlan] = useState(false)
  const [paymentServiceModal, setPaymentServiceModal] = useState(false)
  const [hasLicenseKeyModal, setHasLicenseKeyModal] = useState(false)
  const [purchaseLicenseModal, setpurchaseLicenseModal] = useState(false)
  const [payWithPoModal, setPayWithPoModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showSubscriptionAddonModal, setShowSubscriptionAddonModal] = useState(
    false
  )
  const [addOnProductIds, setAddOnProductIds] = useState([])
  const [totalAmount, setTotalAmount] = useState(100)

  useEffect(() => {
    // getSubscription on mount
    fetchUserSubscriptionStatus()
  }, [])

  const openComparePlanModal = () => setComparePlan(true)
  const closeComparePlansModal = () => setComparePlan(false)
  const openPaymentServiceModal = () => {
    setPaymentServiceModal(true)
    segmentApi.trackTeacherClickOnUpgradeSubscription({ user })
  }
  const openPoServiceModal = () => {
    setPayWithPoModal(true)
  }
  const closePaymentServiceModal = () => setPaymentServiceModal(false)
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
    ? Date.now() + ONE_MONTH > subEndDate
    : false

  const isPremiumUser = user.features.premium

  const isPaidPremium = !(!subType || subType === 'TRIAL_PREMIUM')

  const showRenewalOptions =
    ((isPaidPremium && isAboutToExpire) ||
      (!isPaidPremium && isSubscriptionExpired)) &&
    !['enterprise', 'partial_premium'].includes(subType)

  const showUpgradeOptions = !isSubscribed

  const formatTrialEndDate = moment(subEndDate).format('DD MMM, YYYY')

  const isTrialItemBank = usedTrialItemBankId && usedTrialItemBankId !== ''

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
        isTrialItemBank={isTrialItemBank}
        showRenewalOptions={showRenewalOptions}
        addPermissionRequest={addPermissionRequest}
        premiumUser={isPremiumUser}
        user={user}
        setShowSubscriptionAddonModal={setShowSubscriptionAddonModal}
        premiumProductId={premiumProductId}
        showTrialSubsConfirmationAction={showTrialSubsConfirmationAction}
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

      <SubscriptionAddonModal
        isVisible={showSubscriptionAddonModal}
        handleCloseModal={setShowSubscriptionAddonModal}
        isPaidPremium={isPaidPremium}
        setShowUpgradeModal={setShowUpgradeModal}
        subEndDate={subEndDate}
        usedTrialItemBankId={usedTrialItemBankId}
        products={products}
        isPremiumUser={isPremiumUser}
        premiumProductId={premiumProductId}
        setTotalPurchaseAmount={setTotalAmount}
        setAddOnProductIds={setAddOnProductIds}
      />

      <PaymentServiceModal
        visible={paymentServiceModal && (isAboutToExpire || !isSuccess)}
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
      {formatTrialEndDate && (
        <TrialConfirmationModal
          visible={isConfirmationModalVisible}
          showTrialSubsConfirmationAction={showTrialSubsConfirmationAction}
          isPremiumUser={isPremiumUser}
          subEndDate={formatTrialEndDate}
        />
      )}
    </Wrapper>
  )
}

export default connect(
  (state) => ({
    verificationPending: state?.subscription?.verificationPending,
    subscription: state?.subscription?.subscriptionData?.subscription,
    isSubscriptionExpired: state?.subscription?.isSubscriptionExpired,
    isSuccess: state?.subscription?.subscriptionData?.success,
    user: state.user.user,
    isPremiumTrialUsed:
      state?.subscription?.subscriptionData?.isPremiumTrialUsed,
    premiumProductId: state?.subscription?.subscriptionData?.premiumProductId,
    isConfirmationModalVisible: state?.subscription?.showTrialSubsConfirmation,
    products: state?.subscription?.products,
    usedTrialItemBankId:
      state?.subscription?.subscriptionData?.usedTrialItemBankId,
  }),
  {
    verifyAndUpgradeLicense: slice.actions.upgradeLicenseKeyPending,
    stripePaymentAction: slice.actions.stripePaymentAction,
    fetchUserSubscriptionStatus: slice.actions.fetchUserSubscriptionStatus,
    startTrialAction: slice.actions.startTrialAction,
    addPermissionRequest: addPermissionRequestAction,
    showTrialSubsConfirmationAction: slice.actions.trialSubsConfirmationAction,
  }
)(Subscription)

import React, { useState, useEffect } from "react";
import { withNamespaces } from "@edulastic/localization"; // TODO: Need i18n support
import { connect } from "react-redux";
import { slice } from "../../ducks";

import SubscriptionHeader from "../SubscriptionHeader";
import SubscriptionMain from "../SubscriptionMain";
import { Wrapper } from "../styled/commonStyled";
import PurchaseLicenseModal from "../PurchaseLicenseModal";
import PaymentServiceModal from "../PaymentServiceModal";
import HasLicenseKeyModal from "../HasLicenseKeyModal";
import { CompareModal, PlanCard, PlanHeader, PlanLabel, PlanContent, PlanTitle, PlanDescription } from "./styled";

const comparePlansData = [
  {
    cardTitle: "Free Teacher",
    cardLabel: "FREE FOREVER",
    color: "#5EB500",
    data: [
      {
        title: "Unlimited Assesments",
        description: "Create as many classes & students as you need."
      },
      {
        title: "80K & Growing Item Bank",
        description: "Edulastic CERTIFIED for Grades K-12."
      },
      {
        title: "30+ Technology-Enhanced Question Types",
        description: "Create your own or mix and match."
      },
      {
        title: "Immediate Perfomance Data",
        description: "Real-time reports by student and class."
      },
      {
        title: "Standards Mastery Tracking",
        description: "Reports by standard for students and classes."
      },
      {
        title: "Standards Mastery Tracking",
        description: "Reports by standard for students and classes."
      },
      {
        title: "Assessment Sharing",
        description: "Share assessments or keep them private. Your choice."
      },
      {
        title: "Works with Google Apps",
        description: "Google single sign-on and sync with Google Classroom."
      }
    ]
  },
  {
    cardTitle: "Premium Teacher",
    cardLabel: "PER TEACHER PRICING",
    color: "#4E95F3",
    data: [
      {
        title: "All Free Teacher Features, PLUS:",
        description: ""
      },
      {
        title: "In-depth Reporting",
        description: "Showstudent growth over time. Analyze answer distractor. See coplete student mastery profile."
      },
      {
        title: "Advanced Assessment Optons",
        description: "Shuffle qustion order for each student. Show student scoes but hide correct answers."
      },
      {
        title: "Read Aloud",
        description: "Choose students to have questions and answer choices read to them."
      },
      {
        title: "Rubric Scoring",
        description: "Create and share rubrics school or district wide."
      },
      {
        title: "Collaboration",
        description: "Work on assessment as a team before they're published."
      },
      {
        title: "Presentation Mode",
        description: "Review answers and common mistake with the class without showing names."
      }
    ]
  },
  {
    cardTitle: "Enterprise",
    cardLabel: "PER STUDENT PRICING",
    color: "#FFA200",
    data: [
      {
        title: "Premium Teacher for All Teachers, PLUS:",
        description: ""
      },
      {
        title: "Common Assessment",
        description: "Administer common assessments and control access by teachers and students."
      },
      {
        title: "Immediate School or District-Wide Reports",
        description: "See performance, growth and standards mastery by building, grade, teacher and student."
      },
      {
        title: "SIS & LMS Integration",
        description: "Automatic roster sync and gradebook integration (where available)."
      },
      {
        title: "Additional Item Banks",
        description: "Choose from third-party item banks, such as Inspect, Carnegie Learning or Progress Testing."
      },
      {
        title: "Expedited Technical Support",
        description: "On-call support during assessment by phone or online."
      },
      {
        title: "Custom Professional Development",
        description: "Live or online workshops to get you and your teacher up and running."
      }
    ]
  }
];

const PlanDetailsComponent = ({ title, description = "" }) => (
  <>
    <PlanTitle>{title}</PlanTitle>
    <PlanDescription>{description}</PlanDescription>
  </>
);

const Plans = ({ cardTitle, cardLabel, data, color }) => (
  <PlanCard>
    <PlanHeader color={color}>{cardTitle}</PlanHeader>
    <PlanLabel color={color}>{cardLabel}</PlanLabel>
    <PlanContent>
      {data.map(item => (
        <PlanDetailsComponent {...item} />
      ))}
    </PlanContent>
  </PlanCard>
);

function formatDate(subEndDate) {
  if (!subEndDate) return null;
  const date = new Date(subEndDate).toString().split(" ");
  return `${date[2]} ${date[1]}, ${date[3]}`;
}

const Subscription = props => {
  const {
    t,
    verificationPending,
    subscription,
    isPremiumAccount,
    isSubscriptionExpired,
    verifyAndUpgradeLicense,
    stripePaymentAction,
    isSuccess = false,
    subscription: { subEndDate, subType } = {},
    user,
    fetchUserSubscriptionStatus
  } = props;

  useEffect(() => {
    // getSubscription on mount
    fetchUserSubscriptionStatus();
  }, []);

  const [comparePlan, setComparePlan] = useState(false);
  const [paymentServiceModal, setPaymentServiceModal] = useState(false);
  const [hasLicenseKeyModal, setHasLicenseKeyModal] = useState(false);
  const [purchaseLicenseModal, setpurchaseLicenseModal] = useState(false);

  const openComparePlanModal = () => setComparePlan(true);
  const closeComparePlansModal = () => setComparePlan(false);
  const openPaymentServiceModal = () => setPaymentServiceModal(true);
  const closePaymentServiceModal = () => setPaymentServiceModal(false);
  const openHasLicenseKeyModal = () => setHasLicenseKeyModal(true);
  const closeHasLicenseKeyModal = () => setHasLicenseKeyModal(false);
  const openPurchaseLicenseModal = () => setpurchaseLicenseModal(true);
  const closePurchaseLicenseModal = () => setpurchaseLicenseModal(false);

  const isSubscribed = subType === "premium" || subType === "enterprise" || isSuccess;

  const THIRTY_DAYS = 2592000000;
  const isAboutToExpire = subEndDate ? ((Date.now() + THIRTY_DAYS) > subEndDate) : false;

  const showRenewalOptions = (isPremiumAccount && isAboutToExpire) || (!isPremiumAccount && isSubscriptionExpired);
  const showUpgradeOptions = !isSubscribed;

  return (
    <Wrapper>
      <SubscriptionHeader
        openComparePlanModal={openComparePlanModal}
        openPaymentServiceModal={openPaymentServiceModal}
        showUpgradeOptions={showUpgradeOptions}
        showRenewalOptions={showRenewalOptions}
      />

      <SubscriptionMain
        isSubscribed={isSubscribed}
        openPaymentServiceModal={openPaymentServiceModal}
        openHasLicenseKeyModal={openHasLicenseKeyModal}
        openPurchaseLicenseModal={openPurchaseLicenseModal}
        subEndDate={subEndDate}
        subType={subType}
      />

      <CompareModal title="" visible={comparePlan} onCancel={closeComparePlansModal} footer={[]} style={{ top: 25 }}>
        {comparePlansData.map(plan => (
          <Plans {...plan} />
        ))}
      </CompareModal>

      <PaymentServiceModal
        visible={paymentServiceModal && (isAboutToExpire || !isSuccess)}
        closeModal={closePaymentServiceModal}
        verificationPending={verificationPending}
        stripePaymentAction={stripePaymentAction}
        user={user}
        reason="Premium Upgrade"
      />

      <HasLicenseKeyModal
        visible={hasLicenseKeyModal}
        closeModal={closeHasLicenseKeyModal}
        expDate={formatDate(subEndDate)}
        isSubscribed={isSubscribed}
        verificationPending={verificationPending}
        verifyAndUpgradeLicense={verifyAndUpgradeLicense}
      />

      <PurchaseLicenseModal
        visible={purchaseLicenseModal}
        closeModal={closePurchaseLicenseModal}
        openPaymentServiceModal={openPaymentServiceModal}
        verificationPending={verificationPending}
      />
    </Wrapper>
  );
};

export default connect(
  state => ({
    verificationPending: state?.subscription?.verificationPending,
    subscription: state?.subscription?.subscriptionData?.subscription,
    isSubscriptionExpired: state?.subscription?.isSubscriptionExpired,
    isSuccess: state?.subscription?.subscriptionData?.success,
    isPremiumAccount: state?.user?.user?.features?.premium,
    user: state.user.user
  }),
  {
    verifyAndUpgradeLicense: slice.actions.upgradeLicenseKeyPending,
    stripePaymentAction: slice.actions.stripePaymentAction,
    fetchUserSubscriptionStatus: slice.actions.fetchUserSubscriptionStatus
  }
)(Subscription);

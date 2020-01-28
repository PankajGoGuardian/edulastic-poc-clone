import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { slice } from "../../ducks";

import {
  SubscriptionMainWrapper,
  CurrentPlanContainer,
  AvailablePlansContainer,
  PlansContainer,
  ContentWrapper,
  PlanImage,
  PlanDetails,
  PlanStatus
} from "./styled";
import { Title, Description, Container, ThemeButton, ActionsWrapper } from "../styled/commonStyled";

// TODO: Update SVG imports here
import IMG1 from "../../static/1.png";
import IMG2 from "../../static/2.png";
import IMG3 from "../../static/3.png";

import PurchaseLicenseModal from "../PurchaseLicenseModal";
import PaymentServiceModal from "../PaymentServiceModal";
import HasLicenseKeyModal from "../HasLicenseKeyModal";

const getUpgradeToTeacherPlanActions = ({ openPaymentServiceModal, openHasLicenseKeyModal }) => (
  <ActionsWrapper>
    <ThemeButton onClick={openPaymentServiceModal} inverse>
      UPGRADE NOW FOR $100/YEAR
    </ThemeButton>
    <ThemeButton onClick={openHasLicenseKeyModal}>ALREADY HAVE A LICENSE KEY</ThemeButton>
  </ActionsWrapper>
);

const getUpgradeToMultipleUsersPlanAction = ({ openPurchaseLicenseModal }) => (
  <ActionsWrapper>
    <ThemeButton onClick={openPurchaseLicenseModal}>PURCHASE LICENSE</ThemeButton>
    <Link to="/author/subscription/manage-licenses">
      <ThemeButton>MANAGE LICENSE</ThemeButton>
    </Link>
  </ActionsWrapper>
);

const getEnterprisePlanActions = () => (
  <ActionsWrapper>
    <ThemeButton
      onClick={() => {
        console.log("Open link G-Form Link in new tab");
      }}
    >
      REQUEST A QUOTE
    </ThemeButton>
  </ActionsWrapper>
);

const availablePlans = [
  {
    imgSrc: IMG1,
    title: "Upgrade to Teacher Premium",
    description:
      "Get Additional reports, options to assist students collaborate with collegues, anti-cheating tools and more.",
    getActionsComp: getUpgradeToTeacherPlanActions
  },
  {
    imgSrc: IMG2,
    title: "Upgrade Multiple Users to Premium",
    description:
      "Administer common assesement, get immediate school or district-wide reports, and enable premium access for all teachers in your school or district.",
    getActionsComp: getUpgradeToMultipleUsersPlanAction
  },
  {
    imgSrc: IMG3,
    title: "Edulastic Enterprise",
    description:
      "Administer common assesement, get immediate school or district-wide reports, and enable premium access for all teachers in your school or district.",
    getActionsComp: getEnterprisePlanActions
  }
];

const PlansComponent = ({
  imgSrc,
  title,
  description,
  getActionsComp,
  isEnterprise,
  openPurchaseLicenseModal,
  openPaymentServiceModal,
  openHasLicenseKeyModal
}) => (
  <PlansContainer isEnterprise={isEnterprise}>
    <ContentWrapper>
      <PlanImage>
        <img src={imgSrc} />
      </PlanImage>
      <PlanDetails>
        <Title margin="0 0 8px 0">{title}</Title>
        <Description>{description}</Description>
      </PlanDetails>
    </ContentWrapper>
    {getActionsComp({ openPurchaseLicenseModal, openPaymentServiceModal, openHasLicenseKeyModal })}
  </PlansContainer>
);

const SubscriptionMain = props => {
  const { subscription: { subEndDate, subType } = {}, verificationPending, verifyAndUpgradeLicense } = props;
  const [purchaseLicenseModal, setpurchaseLicenseModal] = useState(false);
  const [paymentServiceModal, setPaymentServiceModal] = useState(false);
  const [hasLicenseKeyModal, setHasLicenseKeyModal] = useState(false);

  const isSubscribed = subType === "premium" || subType === "enterprise";

  return (
    <>
      <SubscriptionMainWrapper>
        <CurrentPlanContainer>
          <Container>
            <Title padding="0 30px 0 0">Current Plan</Title>
            <Description>{isSubscribed ? "Premium Version" : "Free Plan"}</Description>
          </Container>
          <PlanStatus>{isSubscribed ? Date(subEndDate).substring(0, 15) : "Free Forever"}</PlanStatus>
        </CurrentPlanContainer>
        <AvailablePlansContainer>
          {availablePlans.map((plan, index) => (
            <PlansComponent
              key={index}
              isEnterprise={subType === "enterprise" && index !== 2}
              openPaymentServiceModal={() => setPaymentServiceModal(true)}
              openHasLicenseKeyModal={() => setHasLicenseKeyModal(true)}
              openPurchaseLicenseModal={() => setpurchaseLicenseModal(true)}
              {...plan}
            />
          ))}
        </AvailablePlansContainer>
      </SubscriptionMainWrapper>

      <PaymentServiceModal
        visible={paymentServiceModal}
        closeModal={() => setPaymentServiceModal(false)}
        verificationPending={verificationPending}
      />

      <HasLicenseKeyModal
        visible={hasLicenseKeyModal}
        closeModal={() => setHasLicenseKeyModal(false)}
        expDate={Date(subEndDate).substring(0, 15)}
        isSubscribed={isSubscribed}
        verificationPending={verificationPending}
        verifyAndUpgradeLicense={verifyAndUpgradeLicense}
      />

      <PurchaseLicenseModal
        visible={purchaseLicenseModal}
        closeModal={() => setpurchaseLicenseModal(false)}
        openPaymentServiceModal={() => setPaymentServiceModal(true)}
        verificationPending={verificationPending}
      />
    </>
  );
};

export default connect(
  state => ({
    verificationPending: state.subscription.verificationPending,
    subscription: state.subscription.subscriptionData
  }),
  {
    verifyAndUpgradeLicense: slice.actions.upgradeLicenseKeyPending
  }
)(SubscriptionMain);

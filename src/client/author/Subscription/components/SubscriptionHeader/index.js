import { MainHeader , EduButton } from "@edulastic/common";
import PropTypes from "prop-types";
import React, { memo } from "react";
import { ActionBtnWrapper, HeaderActionBtn } from "./styled";


const SubscriptionHeader = ({ openComparePlanModal, openPaymentServiceModal, isSubscribed }) => (
  <MainHeader headingText="common.subscriptionTitle">
    {!isSubscribed && (
      <ActionBtnWrapper>
        <EduButton isGhost width="195px" onClick={openComparePlanModal}>
          COMPARE PLANS
        </EduButton>
        <EduButton width="215px" onClick={openPaymentServiceModal}>
          UPGRADE NOW FOR $100/YEAR
        </EduButton>
      </ActionBtnWrapper>
    )}
  </MainHeader>
);

SubscriptionHeader.propTypes = {
  openComparePlanModal: PropTypes.func.isRequired,
  openPaymentServiceModal: PropTypes.func.isRequired,
  isSubscribed: PropTypes.bool.isRequired
};

export default memo(SubscriptionHeader);

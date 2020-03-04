import { EduButton, MainHeader } from "@edulastic/common";
import { IconSubscriptionHighlight } from "@edulastic/icons";
import PropTypes from "prop-types";
import React, { memo } from "react";
import { ActionBtnWrapper } from "./styled";

const SubscriptionHeader = ({ openComparePlanModal, openPaymentServiceModal, isSubscribed }) => (
  <MainHeader Icon={IconSubscriptionHighlight} headingText="common.subscriptionTitle">
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

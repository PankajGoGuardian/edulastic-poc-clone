import { MainHeader } from "@edulastic/common";
import PropTypes from "prop-types";
import React, { memo } from "react";
import { ActionBtnWrapper, HeaderActionBtn } from "./styled";

const SubscriptionHeader = ({ openComparePlanModal, openPaymentServiceModal, isSubscribed }) => (
  <MainHeader headingText="common.subscriptionTitle">
    {!isSubscribed && (
      <ActionBtnWrapper>
        <HeaderActionBtn onClick={openComparePlanModal} width="195px">
          COMPARE PLANS
        </HeaderActionBtn>
        <HeaderActionBtn onClick={openPaymentServiceModal} width="215px">
          UPGRADE NOW FOR $100/YEAR
        </HeaderActionBtn>
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

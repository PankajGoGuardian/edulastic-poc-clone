import { EduButton, MainHeader } from "@edulastic/common";
import { IconSubscriptionHighlight } from "@edulastic/icons";
import PropTypes from "prop-types";
import React, { memo } from "react";
import { withNamespaces } from "react-i18next";
import { ActionBtnWrapper } from "./styled";

const SubscriptionHeader = ({ openComparePlanModal, openPaymentServiceModal, isSubscribed, t }) => (
  <MainHeader Icon={IconSubscriptionHighlight} headingText={t("common.subscriptionTitle")}>
    {!isSubscribed && (
      <ActionBtnWrapper>
        <EduButton isBlue isGhost width="195px" onClick={openComparePlanModal}>
          COMPARE PLANS
        </EduButton>
        <EduButton isBlue width="215px" onClick={openPaymentServiceModal}>
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

export default memo(withNamespaces("header")(SubscriptionHeader));

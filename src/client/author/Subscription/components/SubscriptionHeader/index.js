import { EduButton, MainHeader } from "@edulastic/common";
import { IconSubscriptionHighlight } from "@edulastic/icons";
import { darkOrange1 } from "@edulastic/colors";
import PropTypes from "prop-types";
import React, { memo } from "react";
import { withNamespaces } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { ActionBtnWrapper } from "./styled";

const SubscriptionHeader = ({
  openComparePlanModal,
  openPaymentServiceModal,
  showUpgradeOptions,
  showRenewalOptions,
  t
}) => (
  <MainHeader Icon={IconSubscriptionHighlight} headingText={t("common.subscriptionTitle")}>
    <ActionBtnWrapper>
      {showUpgradeOptions && (
        <EduButton isBlue isGhost width="195px" onClick={openComparePlanModal}>
          COMPARE PLANS
        </EduButton>
      )}
      {showUpgradeOptions ? (
        <EduButton isBlue width="215px" onClick={openPaymentServiceModal}>
          UPGRADE NOW FOR $100/YEAR
        </EduButton>
      ) : showRenewalOptions ? (
        <EduButton
          onClick={openPaymentServiceModal}
          type="primary"
          isBlue
          style={{ marginLeft: "5px", backgroundColor: darkOrange1, border: "none" }}
          data-cy="manageClass"
        >
          <FontAwesomeIcon icon={faExclamationTriangle} aria-hidden="true" />
          <span>RENEW SUBSCRIPTION</span>
        </EduButton>
      ) : null}
    </ActionBtnWrapper>
  </MainHeader>
);

SubscriptionHeader.propTypes = {
  openComparePlanModal: PropTypes.func.isRequired,
  openPaymentServiceModal: PropTypes.func.isRequired,
  showUpgradeOptions: PropTypes.bool.isRequired
};

export default memo(withNamespaces("header")(SubscriptionHeader));

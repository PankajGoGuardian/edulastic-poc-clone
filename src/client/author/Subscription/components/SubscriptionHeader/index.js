import React, { memo } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { compose } from "redux";
import { connect } from "react-redux";

import { MenuIcon } from "@edulastic/common";
import { toggleSideBarAction } from "../../../src/actions/toggleMenu";

import { HeaderWrapper, Title, ActionBtnWrapper, HeaderActionBtn } from "./styled";

const SubscriptionHeader = ({ t, toggleSideBar, openComparePlanModal, openPaymentServiceModal, isSubscribed }) => (
  <HeaderWrapper borderBottom="none">
    <MenuIcon className="hamburger" onClick={() => toggleSideBar()} />
    <Title>{t("common.subscriptionTitle")}</Title>
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
  </HeaderWrapper>
);

SubscriptionHeader.propTypes = {
  t: PropTypes.func.isRequired,
  toggleSideBar: PropTypes.func.isRequired,
  openComparePlanModal: PropTypes.func.isRequired
};

const enhance = compose(
  memo,
  withNamespaces("header"),
  connect(
    null,
    { toggleSideBar: toggleSideBarAction }
  )
);

export default enhance(SubscriptionHeader);

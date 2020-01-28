import React, { memo } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { compose } from "redux";
import { connect } from "react-redux";

import { MenuIcon } from "@edulastic/common";
import { toggleSideBarAction } from "../../../src/actions/toggleMenu";

import { HeaderWrapper, Title, CompareActionBtn } from "./styled";

const SubscriptionHeader = ({ t, toggleSideBar, openComparePlanModal }) => (
  <HeaderWrapper borderBottom="none">
    <MenuIcon className="hamburger" onClick={() => toggleSideBar()} />
    <Title>{t("common.subscriptionTitle")}</Title>
    <CompareActionBtn onClick={openComparePlanModal}>COMPARE PLANS</CompareActionBtn>
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

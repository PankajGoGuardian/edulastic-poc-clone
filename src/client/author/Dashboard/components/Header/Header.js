import React, { useState, useEffect } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { green, red } from "@edulastic/colors";
import { FlexContainer, MenuIcon } from "@edulastic/common";
import {
  TitleWrapper,
  ManageClassButton,
  IconPlus,
  ButtonText,
  PopoverWrapper,
  PopoverTitle,
  PopoverDetail,
  PopoverCancel,
  UpgradeBtn
} from "./styled";
import { toggleSideBarAction } from "../../../src/actions/toggleMenu";
import HeaderWrapper from "../../../src/mainContent/headerWrapper";
import { Popover } from "antd";
import { slice } from "../../../Subscription/ducks.js";

// TODO: Change to SVG
import IMG from "../../../Subscription/static/6.png";

const getContent = ({ setvisible, isSubscriptionExpired }) => (
  <FlexContainer width="475px" alignItems="flex-start">
    <img src={IMG} width="165" height="135" />
    <FlexContainer flexDirection="column" width="280px" padding="15px 0 0 6px">
      <PopoverTitle>Get Started!</PopoverTitle>
      <PopoverDetail>
        Get additional reports, options to assist students, collaborate with colleagues, anti-cheating tools and more.
      </PopoverDetail>
      <FlexContainer padding="15px 0 15px 0" width="100%">
        <PopoverCancel onClick={() => setvisible(false)}> NO, THANKS</PopoverCancel>
        <Link to="/author/subscription">
          <UpgradeBtn>{isSubscriptionExpired ? "Renew Now" : "UPGRADE NOW"}</UpgradeBtn>
        </Link>
      </FlexContainer>
    </FlexContainer>
  </FlexContainer>
);

const HeaderSection = ({ toggleSideBar, premium, isSubscriptionExpired = false, fetchUserSubscriptionStatus }) => {
  useEffect(() => {
    fetchUserSubscriptionStatus();
  }, []);

  const [visible, setvisible] = useState(false);

  return (
    <HeaderWrapper>
      <FlexContainer style={{ pointerEvents: "none" }}>
        <MenuIcon className="hamburger" onClick={() => toggleSideBar()} />
        <TitleWrapper>Dashboard</TitleWrapper>
      </FlexContainer>
      <FlexContainer>
        {!premium && (
          <PopoverWrapper>
            <Popover
              getPopupContainer={triggerNode => triggerNode.parentNode}
              trigger="click"
              placement="bottomRight"
              content={getContent({ setvisible, isSubscriptionExpired })}
              onClick={() => setvisible(true)}
              visible={visible}
            >
              <ManageClassButton data-cy="manageClass">
                <i class={isSubscriptionExpired ? "fa fa-exclamation-circle" : "fa fa-unlock-alt"} aria-hidden="true" />
                <ButtonText>
                  {isSubscriptionExpired ? (
                    <span style={{ color: red }}>RENEW SUBSCRIPTION</span>
                  ) : (
                    "UNLOCK MORE FEATURES"
                  )}
                </ButtonText>
              </ManageClassButton>
            </Popover>
          </PopoverWrapper>
        )}
        <Link to="/author/manageClass">
          <ManageClassButton data-cy="manageClass">
            <IconPlus color={green} />
            <ButtonText>MANAGE CLASS</ButtonText>
          </ManageClassButton>
        </Link>
      </FlexContainer>
    </HeaderWrapper>
  );
};

HeaderSection.propTypes = {
  toggleSideBar: PropTypes.func.isRequired
};

export default connect(
  state => ({
    premium: state?.user?.user?.features?.premium,
    isSubscriptionExpired: state?.subscription?.isSubscriptionExpired
  }),
  {
    toggleSideBar: toggleSideBarAction,
    fetchUserSubscriptionStatus: slice?.actions?.fetchUserSubscriptionStatus
  }
)(HeaderSection);

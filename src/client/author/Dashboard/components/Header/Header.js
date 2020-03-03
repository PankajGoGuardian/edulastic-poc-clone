import { red } from "@edulastic/colors";
import { EduButton, FlexContainer, MainHeader } from "@edulastic/common";
import { IconClockDashboard } from "@edulastic/icons";
import { Popover } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { slice } from "../../../Subscription/ducks";
// TODO: Change to SVG
import IMG from "../../../Subscription/static/6.png";
import { IconPlus, PopoverCancel, PopoverDetail, PopoverTitle, PopoverWrapper, UpgradeBtn } from "./styled";

const getContent = ({ setvisible, isSubscriptionExpired }) => (
  <FlexContainer width="475px" alignItems="flex-start">
    <img src={IMG} width="165" height="135" alt="" />
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

const HeaderSection = ({ premium, isSubscriptionExpired = false, fetchUserSubscriptionStatus }) => {
  useEffect(() => {
    fetchUserSubscriptionStatus();
  }, []);

  const [visible, setvisible] = useState(false);

  return (
    <MainHeader Icon={IconClockDashboard} headingText="common.dashboard">
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
              <EduButton btnType="primary" isGhost data-cy="manageClass">
                <i
                  className={isSubscriptionExpired ? "fa fa-exclamation-circle" : "fa fa-unlock-alt"}
                  aria-hidden="true"
                />
                {isSubscriptionExpired ? (
                  <span style={{ color: red }}>RENEW SUBSCRIPTION</span>
                ) : (
                  "UNLOCK MORE FEATURES"
                )}
              </EduButton>
            </Popover>
          </PopoverWrapper>
        )}
        <Link to="/author/manageClass">
          <EduButton data-cy="manageClass">
            <IconPlus />
            MANAGE CLASS
          </EduButton>
        </Link>
      </FlexContainer>
    </MainHeader>
  );
};

HeaderSection.propTypes = {
  premium: PropTypes.any.isRequired,
  isSubscriptionExpired: PropTypes.bool.isRequired,
  fetchUserSubscriptionStatus: PropTypes.func.isRequired
};

export default connect(
  state => ({
    premium: state?.user?.user?.features?.premium,
    isSubscriptionExpired: state?.subscription?.isSubscriptionExpired
  }),
  {
    fetchUserSubscriptionStatus: slice?.actions?.fetchUserSubscriptionStatus
  }
)(HeaderSection);

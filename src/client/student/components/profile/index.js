import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Header from "../../styled/header";
import ProfileContent from "./maincontent";
import MainContainer from "../commonStyle/mainContainer";

const ProfileContainer = ({ flag }) => (
  <React.Fragment>
    <MainContainer flag={flag}>
      <Header titleText="common.profileTitle" classSelect={false} />
      <ProfileContent />
    </MainContainer>
  </React.Fragment>
);

export default React.memo(
  connect(({ ui }) => ({ flag: ui.flag }))(ProfileContainer)
);

ProfileContainer.propTypes = {
  flag: PropTypes.bool.isRequired
};

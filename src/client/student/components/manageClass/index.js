import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Header from "../../styled/header";
import ManageClassContent from "./maincontent";
import MainContainer from "../commonStyle/mainContainer";

const ManageClassContainer = ({ flag }) => (
  <React.Fragment>
    <MainContainer flag={flag}>
      <Header
        flag={flag}
        classSelect={false}
        tittleText="common.manageClassTitle"
      />
      <ManageClassContent />
    </MainContainer>
  </React.Fragment>
);

export default React.memo(
  connect(({ ui }) => ({ flag: ui.flag }))(ManageClassContainer)
);

ManageClassContainer.propTypes = {
  flag: PropTypes.bool.isRequired
};

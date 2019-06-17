import React, { useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import Header from "./Header";
import JoinSchool from "./JoinSchool";
import SignupForm from "./SignupForm";
import SubjectGradeForm from "./SubjectGrade";
import teacherBg from "../../../assets/bg-teacher.png";

import { logoutAction } from "../../../Login/ducks";
import { getDistrictByShortNameAndOrgTypeAction } from "../../duck";

const Container = ({ user, generalSettings, logout, getDistrictByShortNameAndOrgTypeAction, match }) => {
  const { isAuthenticated, signupStatus } = user;
  const { districtShortName } = match.params;

  useEffect(() => {
    if (districtShortName) {
      getDistrictByShortNameAndOrgTypeAction({ shortName: districtShortName, orgType: "district" });
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <>
        <SignupForm
          image={
            generalSettings && districtShortName ? generalSettings.pageBackground : districtShortName ? "" : teacherBg
          }
        />
      </>
    );
  }
  const userInfo = get(user, "user");

  return (
    <>
      <Header userInfo={userInfo} logout={logout} />
      {signupStatus === 1 && (
        <JoinSchool userInfo={userInfo} districtId={districtShortName ? generalSettings : false} />
      )}
      {signupStatus === 2 && (
        <SubjectGradeForm userInfo={userInfo} districtId={districtShortName ? generalSettings : false} />
      )}
    </>
  );
};

Container.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func
};

Container.defaultProps = {
  user: null,
  logout: () => null
};

const enhance = compose(
  withRouter,
  connect(
    state => ({ user: state.user, generalSettings: get(state, "signup.generalSettings", null) }),
    {
      logout: logoutAction,
      getDistrictByShortNameAndOrgTypeAction: getDistrictByShortNameAndOrgTypeAction
    }
  )
);

export default enhance(Container);

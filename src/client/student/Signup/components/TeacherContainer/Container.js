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
import { getPartnerKeyFromUrl } from "../../../../common/utils/helpers";
import { Partners } from "../../../../common/utils/static/partnerData";

import { logoutAction } from "../../../Login/ducks";

const Container = ({ user, isSignupUsingDaURL, generalSettings, districtPolicy, districtShortName, logout, match }) => {
  const { isAuthenticated, signupStatus } = user;

  const partnerKey = getPartnerKeyFromUrl(location.pathname);
  const partner = Partners[partnerKey];

  if (!isAuthenticated) {
    return (
      <>
        <SignupForm
          image={
            generalSettings && isSignupUsingDaURL
              ? generalSettings.pageBackground
              : isSignupUsingDaURL
              ? ""
              : partner.keyName === "login"
              ? teacherBg
              : partner.background
          }
          isSignupUsingDaURL={isSignupUsingDaURL}
          generalSettings={generalSettings}
          districtPolicy={districtPolicy}
          districtShortName={districtShortName}
        />
      </>
    );
  }
  const userInfo = get(user, "user");

  return (
    <>
      <Header userInfo={userInfo} logout={logout} />
      {signupStatus === 1 && (
        <JoinSchool
          userInfo={userInfo}
          districtId={isSignupUsingDaURL ? generalSettings.orgId : false}
          isSignupUsingDaURL={isSignupUsingDaURL}
          generalSettings={generalSettings}
          districtPolicy={districtPolicy}
          districtShortName={districtShortName}
        />
      )}
      {signupStatus === 2 && (
        <SubjectGradeForm userInfo={userInfo} districtId={isSignupUsingDaURL ? generalSettings.orgId : false} />
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
    state => ({
      user: state.user
    }),
    {
      logout: logoutAction
    }
  )
);

export default enhance(Container);

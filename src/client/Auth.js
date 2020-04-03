import React, { lazy } from "react";
import PropTypes from "prop-types";
import { withRouter, Redirect } from "react-router";
import { get } from "lodash";
import { compose } from "redux";
import { connect } from "react-redux";
import { removeFromLocalStorage } from "@edulastic/api/src/utils/Storage";
import { roleuser } from "@edulastic/constants";
import { SelectRolePopup } from "./student/SsoLogin/selectRolePopup";
import { CleverUnauthorizedPopup } from "./student/SsoLogin/CleverUnauthorizedPopup";

import { isLoggedInForPrivateRoute } from "./common/utils/helpers";

const GetStarted = lazy(() =>
  import(/* webpackChunkName: "getStarted" */ "./student/Signup/components/GetStartedContainer")
);
const Login = lazy(() => import(/* webpackChunkName: "login" */ "./student/Login/components"));

const SsoLogin = lazy(() => import(/* webpackChunkName:"SSo Login" */ "./student/SsoLogin"));

const Auth = ({ user, location, isSignupUsingDaURL, generalSettings, districtPolicy, orgShortName, orgType }) => {
  if (location.hash !== "#signup" && location.hash !== "#login") {
    window.location.hash = "#login";
  }

  if (
    isLoggedInForPrivateRoute(user) &&
    (user.user.role === roleuser.TEACHER ||
      user.user.role === roleuser.SCHOOL_ADMIN ||
      user.user.role === roleuser.DISTRICT_ADMIN)
  ) {
    return <Redirect exact to="/author/dashboard" />;
  }
  if (isLoggedInForPrivateRoute(user) && user.user.role === "student") {
    return <Redirect exact to="/home/assignments" />;
  }
  if (location?.state?.showCleverUnauthorized) {
    return (
      <>
        <Login
          isSignupUsingDaURL={isSignupUsingDaURL}
          generalSettings={generalSettings}
          districtPolicy={districtPolicy}
          orgShortName={orgShortName}
          orgType={orgType}
        />
        <CleverUnauthorizedPopup visible footer={null} />
      </>
    );
  }
  if (location.pathname.toLocaleLowerCase().includes("auth")) {
    return (
      <>
        {!user || (user && !user.isAuthenticated) ? (
          <>
            <SsoLogin />
          </>
        ) : (
          <>
            <Login
              isSignupUsingDaURL={isSignupUsingDaURL}
              generalSettings={generalSettings}
              districtPolicy={districtPolicy}
              orgShortName={orgShortName}
              orgType={orgType}
            />
            <SelectRolePopup visible footer={null} />
          </>
        )}
      </>
    );
  }

  removeFromLocalStorage("defaultGrades");
  removeFromLocalStorage("defaultSubject");

  return location.hash === "#signup" ? (
    <GetStarted
      isSignupUsingDaURL={isSignupUsingDaURL}
      generalSettings={generalSettings}
      districtPolicy={districtPolicy}
      orgShortName={orgShortName}
      orgType={orgType}
    />
  ) : (
    <Login
      isSignupUsingDaURL={isSignupUsingDaURL}
      generalSettings={generalSettings}
      districtPolicy={districtPolicy}
      orgShortName={orgShortName}
      orgType={orgType}
    />
  );
};
Auth.propTypes = {
  location: PropTypes.object.isRequired
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      user: get(state, "user", null)
    }),
    {}
  )
);
export default enhance(Auth);

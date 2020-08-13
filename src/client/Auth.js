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
import  StudentSignup from "./student/Signup/components/StudentContainer";
import AdminSignup  from "./student/Signup/components/AdminContainer/Container";
import TeacherSignup from "./student/Signup/components/TeacherContainer/Container"

import { isLoggedInForPrivateRoute } from "./common/utils/helpers";

const GetStarted = lazy(() =>
  import(/* webpackChunkName: "getStarted" */ "./student/Signup/components/GetStartedContainer")
);
const Login = lazy(() => import(/* webpackChunkName: "login" */ "./student/Login/components"));

const SsoLogin = lazy(() => import(/* webpackChunkName:"SSo Login" */ "./student/SsoLogin"));

const Auth = ({ user, location, isSignupUsingDaURL, generalSettings, districtPolicy, orgShortName, orgType }) => {
  if (!["#signup", "#login", "#register/close/student", "#register/close/teacher", "#register/close/admin"].includes(location.hash)) {
    window.location.hash = "#login";
  }

  if (isLoggedInForPrivateRoute(user)) {
    switch (user.user.role) {
      case roleuser.EDULASTIC_ADMIN:
        return <Redirect exact to="/admin/search" />;
      case roleuser.DISTRICT_ADMIN:
      case roleuser.SCHOOL_ADMIN:
        return <Redirect exact to="/author/assignments" />;
      case roleuser.TEACHER:
        return <Redirect exact to="/author/dashboard" />;
      case roleuser.STUDENT:
        return <Redirect exact to="/home/assignments" />;
    }
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
  switch (location.hash) {
    case "#signup":
      return (
        <GetStarted
          isSignupUsingDaURL={isSignupUsingDaURL}
          generalSettings={generalSettings}
          districtPolicy={districtPolicy}
          orgShortName={orgShortName}
          orgType={orgType}
        />
      );
    case "#register/close/student":
      return <StudentSignup />;
    case "#register/close/admin":
      return <AdminSignup />;
    case "#register/close/teacher":
      return <TeacherSignup />;
    default:
      return (
        <Login
          isSignupUsingDaURL={isSignupUsingDaURL}
          generalSettings={generalSettings}
          districtPolicy={districtPolicy}
          orgShortName={orgShortName}
          orgType={orgType}
        />
      );
  }
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

import React, { lazy } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import styled from "styled-components";
import { get } from "lodash";
import { compose } from "redux";
import { connect } from "react-redux";
import { Modal, Button } from "antd";
import { SelectRolePopup } from "./student/SsoLogin/selectRolePopup";
import { white, blue } from "@edulastic/colors";

const GetStarted = lazy(() =>
  import(/* webpackChunkName: "getStarted" */ "./student/Signup/components/GetStartedContainer")
);
const Login = lazy(() => import(/* webpackChunkName: "login" */ "./student/Login/components"));

const SsoLogin = lazy(() => import(/* webpackChunkName:"SSo Login" */ "./student/SsoLogin"));
const Auth = ({ user, location, isSignupUsingDaURL, generalSettings, districtPolicy, districtShortName }) => {
  if (location.hash !== "#signup") {
    window.location.hash = "#login";
  }

  if (
    location.pathname === "/auth/mso" ||
    location.pathname === "/auth/clever" ||
    location.pathname === "/auth/google"
  ) {
    return (
      <>
        {!user ? (
          <>
            <SsoLogin />
          </>
        ) : (
          <>
            <Login
              isSignupUsingDaURL={isSignupUsingDaURL}
              generalSettings={generalSettings}
              districtPolicy={districtPolicy}
              districtShortName={districtShortName}
            />

            <SelectRolePopup visible={true} footer={null} />
          </>
        )}
      </>
    );
  }

  return location.hash === "#signup" ? (
    <GetStarted
      isSignupUsingDaURL={isSignupUsingDaURL}
      generalSettings={generalSettings}
      districtPolicy={districtPolicy}
      districtShortName={districtShortName}
    />
  ) : (
    <Login
      isSignupUsingDaURL={isSignupUsingDaURL}
      generalSettings={generalSettings}
      districtPolicy={districtPolicy}
      districtShortName={districtShortName}
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
      user: get(state, "user.user", null)
    }),
    {}
  )
);
export default enhance(Auth);

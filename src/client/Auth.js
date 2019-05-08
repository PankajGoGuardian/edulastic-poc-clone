import React, { lazy } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

const GetStarted = lazy(() =>
  import(/* webpackChunkName: "getStarted" */ "./student/Signup/components/GetStartedContainer")
);
const Login = lazy(() => import(/* webpackChunkName: "login" */ "./student/Login/components"));

const Auth = ({ location }) => {
  if (location.hash !== "#signup") {
    window.location.hash = "#login";
  }

  return location.hash === "#signup" ? <GetStarted /> : <Login />;
};
Auth.propTypes = {
  location: PropTypes.object.isRequired
};
export default withRouter(Auth);

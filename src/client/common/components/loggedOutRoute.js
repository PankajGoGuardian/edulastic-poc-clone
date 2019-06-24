import { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { get } from "lodash";
import { isLoggedInForLoggedOutRoute } from "../utils/helpers";

const LoggedOutRoute = ({ component: Component, user, redirectPath, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        !isLoggedInForLoggedOutRoute(user) ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: redirectPath, state: { from: props.location } }} />
        )
      }
    />
  );
};

export default connect(state => ({
  user: get(state, "user", {})
}))(LoggedOutRoute);

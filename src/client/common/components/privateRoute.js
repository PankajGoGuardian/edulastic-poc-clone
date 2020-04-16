import { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { get } from "lodash";
import { isLoggedInForPrivateRoute } from "../utils/helpers";

const PrivateRoute = ({ component: Component, notification: Notification, user, redirectPath, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        isLoggedInForPrivateRoute(user) ? (
          [<Component {...props} />, Notification ? <Notification /> : null]
        ) : (
          <Redirect to={{ pathname: redirectPath, state: { from: props.location } }} />
        )
      }
    />
  );
};

export default connect(state => ({
  user: get(state, "user", {})
}))(PrivateRoute);

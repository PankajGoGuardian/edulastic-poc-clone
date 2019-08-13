import React, { lazy, useEffect, useState } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router";
import { get, isEmpty } from "lodash";
import qs from "qs";

import { isLoggedInForPrivateRoute } from "../common/utils/helpers";
import { roleuser } from "@edulastic/constants";

import { getInviteDetailsAction } from "../student/Login/ducks";

const TeacherSignup = lazy(() => import("../student/Signup/components/TeacherContainer/Container"));

const Invite = ({ user, location, history, getInviteDetailsAction }) => {
  useEffect(() => {
    const queryParams = qs.parse(location.search.substring(1));
    const params = {
      uid: queryParams.uid
    };
    getInviteDetailsAction(params);
  }, []);

  if (
    isLoggedInForPrivateRoute(user) &&
    (user.user.role === roleuser.TEACHER ||
      user.user.role === roleuser.SCHOOL_ADMIN ||
      user.user.role === roleuser.DISTRICT_ADMIN)
  ) {
    return <Redirect exact to="/author/dashboard" />;
  } else if (isLoggedInForPrivateRoute(user) && user.user.role === "student") {
    return <Redirect exact to="/home/assignments" />;
  } else if (location.pathname.toLocaleLowerCase().includes("invite")) {
    if (user && user.invitedUserDetails && !isEmpty(user.invitedUserDetails)) {
      return <TeacherSignup invitedUser invitedUserDetails={user.invitedUserDetails} />;
    } else {
      return "Please Wait...";
    }
  }
};

export default compose(
  withRouter,
  connect(
    state => ({
      user: get(state, "user", null)
    }),
    {
      getInviteDetailsAction
    }
  )
)(Invite);

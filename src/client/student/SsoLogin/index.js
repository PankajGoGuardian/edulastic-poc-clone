import React from "react";
import { withRouter } from "react-router";
import { compose } from "redux";
import { connect } from "react-redux";
import qs from "qs";
import { get } from "lodash";

import { googleSSOLoginAction, cleverSSOLoginAction, msoSSOLoginAction, classlinkSSOLoginAction } from "../Login/ducks";

class SsoLogin extends React.Component {
  componentDidMount() {
    const { location, googleSSOLogin, cleverSSOLogin, msoSSOLogin, classlinkSSOLogin } = this.props;
    const { addAccount, addAccountTo } = JSON.parse(sessionStorage.getItem("addAccountDetails") || "{}");

    const path = location.pathname.split("/");

    const payload = {
      code: qs.parse(location.search)["?code"],
      edulasticRole: localStorage.getItem("thirdPartySignOnRole") || undefined,
      addAccountTo: addAccount ? addAccountTo : undefined
    };

    if (path.includes("mso")) {
      msoSSOLogin(payload);
    } else if (path.includes("google")) {
      googleSSOLogin(payload);
    } else if (path.includes("clever")) {
      cleverSSOLogin({ ...payload, state: qs.parse(location.search).state });
    } else if (path.includes("atlas")) {
      classlinkSSOLogin({ ...payload, state: JSON.parse(qs.parse(location.search).state) });
    }
  }

  render() {
    return <>Authenticating...</>;
  }
}

const enhance = compose(
  withRouter,
  connect(
    state => ({
      user: get(state, "user.user", null)
    }),
    {
      googleSSOLogin: googleSSOLoginAction,
      cleverSSOLogin: cleverSSOLoginAction,
      msoSSOLogin: msoSSOLoginAction,
      classlinkSSOLogin: classlinkSSOLoginAction
    }
  )
);
export default enhance(SsoLogin);

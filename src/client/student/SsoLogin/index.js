import React from "react";
import { withRouter } from "react-router";
import { compose } from "redux";
import { connect } from "react-redux";
import { googleSSOLoginAction, cleverSSOLoginAction, msoSSOLoginAction } from "../Login/ducks";
import qs from "qs";
import { get } from "lodash";

class SsoLogin extends React.Component {
  componentDidMount() {
    const { location, googleSSOLogin, cleverSSOLogin, msoSSOLogin } = this.props;

    const path = location.pathname.split("/");
    if (path.includes("mso")) {
      let role = localStorage.getItem("thirdPartySignOnRole");
      role = role || undefined;
      msoSSOLogin({ code: qs.parse(location.search)["?code"], edulasticRole: role });
    } else if (path.includes("google")) {
      let role = localStorage.getItem("thirdPartySignOnRole");
      role = role || undefined;
      googleSSOLogin({ code: qs.parse(location.search)["?code"], edulasticRole: role });
    } else if (path.includes("clever")) {
      let role = localStorage.getItem("thirdPartySignOnRole");
      role = role || undefined;
      cleverSSOLogin({
        code: qs.parse(location.search)["?code"],
        state: qs.parse(location.search)["state"],
        edulasticRole: role
      });
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
      msoSSOLogin: msoSSOLoginAction
    }
  )
);
export default enhance(SsoLogin);

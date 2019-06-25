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
    let role = localStorage.getItem("thirdPartySignOnRole") || undefined;
    if (path.includes("mso")) {
      msoSSOLogin({ code: qs.parse(location.search)["?code"], edulasticRole: role });
    } else if (path.includes("google")) {
      googleSSOLogin({ code: qs.parse(location.search)["?code"], edulasticRole: role });
    } else if (path.includes("clever")) {
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

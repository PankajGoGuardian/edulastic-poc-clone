import React from "react";
import { withRouter } from "react-router";
import { compose } from "redux";
import { connect } from "react-redux";
import { googleSSOLoginAction, cleverSSOLoginAction, msoSSOLoginAction } from "../Login/ducks";
import qs from "qs";

class SsoLogin extends React.Component {
  componentDidMount() {
    const { location, googleSSOLogin, cleverSSOLogin, msoSSOLogin } = this.props;
    const path = location.pathname.split("/");
    if (path.includes("mso")) {
      msoSSOLogin(qs.parse(location.search)["?code"]);
    } else if (path.includes("google")) {
      googleSSOLogin(qs.parse(location.search)["?code"]);
    } else if (path.includes("clever")) {
      cleverSSOLogin({ code: qs.parse(location.search)["?code"], state: qs.parse(location.search)["state"] });
    }
  }
  render() {
    return <></>;
  }
}

const enhance = compose(
  withRouter,
  connect(
    null,
    {
      googleSSOLogin: googleSSOLoginAction,
      cleverSSOLogin: cleverSSOLoginAction,
      msoSSOLogin: msoSSOLoginAction
    }
  )
);
export default enhance(SsoLogin);

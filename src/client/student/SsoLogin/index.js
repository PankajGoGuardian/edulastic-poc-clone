import React from "react";
import { withRouter } from "react-router";
import { compose } from "redux";
import { connect } from "react-redux";
import qs from "qs";
import { get } from "lodash";
import styled from "styled-components";

import { Modal, Row, Col } from "antd";

import { EduButton } from "@edulastic/common";
import { darkGrey2 } from "@edulastic/colors";

import {
  googleSSOLoginAction,
  cleverSSOLoginAction,
  msoSSOLoginAction,
  classlinkSSOLoginAction,
  googleLoginAction,
  getUserDataAction
} from "../Login/ducks";

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

    const _payloadForUserData = localStorage.getItem("payloadForUserData");
    if (_payloadForUserData) {
      this.payloadForUserData = JSON.parse(_payloadForUserData);
      localStorage.removeItem("payloadForUserData");
    }

    if (path.includes("mso")) {
      msoSSOLogin(payload);
    } else if (path.includes("google")) {
      if (!this.payloadForUserData) {
        googleSSOLogin(payload);
      }
    } else if (path.includes("clever")) {
      cleverSSOLogin({ ...payload, state: qs.parse(location.search).state });
    } else if (path.includes("atlas")) {
      classlinkSSOLogin({ ...payload, state: JSON.parse(qs.parse(location.search).state) });
    }
  }

  render() {
    const { getUserData, googleLogin } = this.props;
    const reAuthenticate = () => googleLogin({ prompt: true });
    return (
      <div>
        <p>Authenticating...</p>
        {this.payloadForUserData && (
          <StyledModal
            onCancel={() => getUserData(this.payloadForUserData)}
            visible={!!this.payloadForUserData}
            footer={null}
            centered
          >
            <Row type="flex" align="middle" gutter={[20, 20]}>
              <StyledCol span={24}>
                <div style={{ color: darkGrey2, fontWeight: 600, fontSize: "14px" }}>
                  Re-authenticate for Google Classroom
                </div>
              </StyledCol>
              <StyledCol span={24}>
                <EduButton height="40px" width="180px" onClick={reAuthenticate}>
                  Re-authenticate
                </EduButton>
              </StyledCol>
            </Row>
          </StyledModal>
        )}
      </div>
    );
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
      classlinkSSOLogin: classlinkSSOLoginAction,
      googleLogin: googleLoginAction,
      getUserData: getUserDataAction
    }
  )
);
export default enhance(SsoLogin);

const StyledModal = styled(Modal)`
  .ant-modal-content {
    width: 500px;
    .ant-modal-close {
      display: none;
    }
    .ant-modal-header {
      display: none;
    }
    .ant-modal-body {
      padding: 24px 46px 32px;
    }
  }
`;

const StyledCol = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

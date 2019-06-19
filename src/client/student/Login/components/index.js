import React from "react";
import styled from "styled-components";
import { Layout } from "antd";

// components
import Header from "./Header";
import LoginContainer from "./Container";

import loginBg from "../../assets/bg-login.png";
const readicheckBg = "//cdn.edulastic.com/default/readicheck_home-page-bg-1.png";
const greatMindkBg = "//cdn.edulastic.com/default/Affirm_Background_Image.jpg";

const Wrapper = styled(Layout)`
  width: 100%;
`;

const urlParams = location.pathname.split("/");
const Partners = {
  login: {
    name: "login",
    headerLogo: "//cdn.edulastic.com/JS/webresources/images/as/as-dashboard-logo.png",
    boxTitle: "Login",
    background: loginBg,
    position: "start"
  },
  readicheck: {
    name: "readicheck",
    headerLogo: "//cdn.edulastic.com/default/ReadiCheckItemBank.png",
    boxTitle: "//cdn.edulastic.com/default/readicheck_logo.png",
    background: readicheckBg,
    colorFilter: "brightness(100)",
    position: "center"
  },
  greatminds: {
    name: "greatMind",
    headerLogo: "//cdn.edulastic.com/default/GM_Horizontal.JPG",
    boxTitle: "Login",
    background: greatMindkBg,
    colorFilter: "brightness(1)",
    position: "center"
  }
};

const Login = ({ isSignupUsingDaURL, generalSettings, districtPolicy, districtShortName }) => {
  let partnerCheck = "login";
  Object.keys(Partners).map(key => {
    if (key === urlParams[urlParams.length - 1]) {
      partnerCheck = key;
    }
  });

  if (partnerCheck === "login" && isSignupUsingDaURL) {
    Partners.login.background = generalSettings ? generalSettings.pageBackground : "";
  }

  return (
    <Wrapper>
      <LoginWrapper Partners={Partners[partnerCheck]}>
        {Partners[partnerCheck].name !== "login" && <Backdrop />}
        <Header
          Partners={Partners[partnerCheck]}
          isSignupUsingDaURL={isSignupUsingDaURL}
          districtPolicy={districtPolicy}
          districtShortName={districtShortName}
        />
        <LoginContainer
          Partners={Partners[partnerCheck]}
          isSignupUsingDaURL={isSignupUsingDaURL}
          districtPolicy={districtPolicy}
          districtShortName={districtShortName}
        />
      </LoginWrapper>
    </Wrapper>
  );
};

export default Login;

const LoginWrapper = styled.div`
  background: ${props => `#999999 url(${props.Partners.background})`};
  background-position: top center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  margin: 0px;
  padding: 0px;
  min-height: 100vh;
  height: 100%;
  width: 100%;
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  background: rgba(0, 0, 0, 0.5);
`;

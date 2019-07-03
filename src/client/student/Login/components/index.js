import React from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { Layout } from "antd";

// components
import Header from "./Header";
import LoginContainer from "./Container";
import { Partners } from "../../../common/utils/static/partnerData";
import { validatePartnerUrl, getPartnerKeyFromUrl } from "../../../common/utils/helpers";

const Wrapper = styled(Layout)`
  width: 100%;
`;

const Login = ({ isSignupUsingDaURL, generalSettings, districtPolicy, districtShortName }) => {
  let partnerCheck = getPartnerKeyFromUrl(location.pathname);
  return (
    <Wrapper>
      {!isSignupUsingDaURL && !validatePartnerUrl(Partners[partnerCheck]) ? <Redirect exact to="/login" /> : null}
      <LoginWrapper
        Partners={Partners[partnerCheck]}
        image={
          isSignupUsingDaURL
            ? generalSettings && generalSettings.pageBackground
              ? generalSettings.pageBackground
              : ""
            : Partners[partnerCheck].background
        }
      >
        {Partners[partnerCheck].name !== "login" && <Backdrop Partners={Partners[partnerCheck]} />}
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
  background: ${props => `#999999 url(${props.image})`};
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
  background: rgba(0, 0, 0, ${props => props.Partners.opacity});
`;

import React from "react";
import styled from "styled-components";
import { loginBg } from "../common/utils/static/partnerData";
import { ResetPasswordPopup } from "./components/resetPasswordPopup";

const ResetPassword = props => {
  const { history } = props;
  return (
    <ResetPasswordContainer image={loginBg}>
      <ResetPasswordPopup history={history} />
    </ResetPasswordContainer>
  );
};

export default ResetPassword;

const ResetPasswordContainer = styled.div`
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

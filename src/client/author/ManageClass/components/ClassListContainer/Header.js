import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { white, themeColor, extraDesktopWidthMax } from "@edulastic/colors";
import { GoogleLogin } from "react-google-login";
import { get } from "lodash";
// components
import HeaderWrapper from "../../../src/mainContent/headerWrapper";
import { Title, IconManageClass, SyncButtons, CreateIcon, ButtonsWrapper } from "./styled";
// ducks
import { fetchClassListAction } from "../../ducks";
import { IconGoogleClassroom } from "@edulastic/icons";
import styled from "styled-components";
import { scopes } from "./ClassCreatePage";

const Header = ({ classHeader, fetchClassList, allowGoogleLogin, isUserGoogleLoggedIn }) => {
  const handleLoginSucess = data => {
    fetchClassList({ data });
  };

  const handleError = err => {
    console.log("error", err);
  };
  return (
    <HeaderWrapper>
      <Title>
        <IconManageClass color={white} width={20} height={20} /> <span>Manage Class</span>
      </Title>
      <ButtonsWrapper>
        {classHeader}
        {allowGoogleLogin !== false && (
          <GoogleLogin
            clientId={process.env.POI_APP_GOOGLE_CLIENT_ID}
            buttonText="Sync with Google Classroom"
            render={renderProps => (
              <SyncButtons onClick={renderProps.onClick}>
                <IconGoogleClassroom width={20} height={20} />
                <p>SYNC WITH GOOGLE CLASSROOM</p>
              </SyncButtons>
            )}
            scope={scopes}
            onSuccess={handleLoginSucess}
            onFailure={handleError}
            prompt={isUserGoogleLoggedIn ? "" : "consent"}
            responseType="code"
          />
        )}
        <StyledLink to={`/author/manageClass/createClass`} data-cy="createClass">
          <CreateIcon color={themeColor} />
          <p>Create Class</p>
        </StyledLink>
      </ButtonsWrapper>
    </HeaderWrapper>
  );
};

Header.propTypes = {
  fetchClassList: PropTypes.func.isRequired
};

const enhance = compose(
  connect(
    state => ({
      isUserGoogleLoggedIn: get(state, "user.user.isUserGoogleLoggedIn")
    }),
    { fetchClassList: fetchClassListAction }
  )
);

export default enhance(Header);

const StyledLink = styled(Link)`
  padding: 5px 20px;
  border: none;
  text-transform: uppercase;
  color: ${themeColor};
  background: ${white};
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 11px;
  border-radius: 4px;
  @media (min-width: ${extraDesktopWidthMax}) {
    height: 45px;
  }
`;

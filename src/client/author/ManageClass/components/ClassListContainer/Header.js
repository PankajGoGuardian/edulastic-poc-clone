import { extraDesktopWidthMax, themeColor, white } from "@edulastic/colors";
import { MainHeader } from "@edulastic/common";
import { IconGoogleClassroom } from "@edulastic/icons";
import { get } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { GoogleLogin } from "react-google-login";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { compose } from "redux";
import styled from "styled-components";
// ducks
import { fetchClassListAction } from "../../ducks";
import { scopes } from "./ClassCreatePage";
import { ButtonsWrapper, CreateIcon, IconManageClass, SyncButtons } from "./styled";

const Header = ({ fetchClassList, allowGoogleLogin, isUserGoogleLoggedIn }) => {
  const handleLoginSucess = data => {
    fetchClassList({ data });
  };

  const handleError = err => {
    console.log("error", err);
  };
  return (
    <MainHeader Icon={IconManageClass} headingText="common.manageClassTitle">
      <ButtonsWrapper>
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
        <StyledLink to="/author/manageClass/createClass" data-cy="createClass">
          <CreateIcon color={themeColor} />
          <p>Create Class</p>
        </StyledLink>
      </ButtonsWrapper>
    </MainHeader>
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
  &:hover,
  &:focus {
    background: ${white};
    color: ${themeColor};
  }

  @media (min-width: ${extraDesktopWidthMax}) {
    height: 45px;
  }
`;

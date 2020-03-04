import { EduButton, MainHeader } from "@edulastic/common";
import { IconGoogleClassroom, IconManage, IconPlusCircle } from "@edulastic/icons";
import { get } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { GoogleLogin } from "react-google-login";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { compose } from "redux";
// ducks
import { fetchClassListAction } from "../../ducks";
import { scopes } from "./ClassCreatePage";
import { ButtonsWrapper } from "./styled";

const Header = ({ fetchClassList, allowGoogleLogin, isUserGoogleLoggedIn }) => {
  const handleLoginSucess = data => {
    fetchClassList({ data });
  };

  const handleError = err => {
    console.log("error", err);
  };
  return (
    <MainHeader Icon={IconManage} headingText="common.manageClassTitle">
      <ButtonsWrapper>
        {allowGoogleLogin !== false && (
          <GoogleLogin
            clientId={process.env.POI_APP_GOOGLE_CLIENT_ID}
            buttonText="Sync with Google Classroom"
            render={renderProps => (
              <EduButton isGhost onClick={renderProps.onClick}>
                <IconGoogleClassroom />
                <span>SYNC WITH GOOGLE CLASSROOM</span>
              </EduButton>
            )}
            scope={scopes}
            onSuccess={handleLoginSucess}
            onFailure={handleError}
            prompt={isUserGoogleLoggedIn ? "" : "consent"}
            responseType="code"
          />
        )}
        <Link to="/author/manageClass/createClass" data-cy="createClass">
          <EduButton>
            <IconPlusCircle />
            <span>Create Class</span>
          </EduButton>
        </Link>
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
      isUserGoogleLoggedIn: get(state, "user.user.isUserGoogleLoggedIn"),
      allowGoogleLogin: get(state, "user.user.orgData.allowGoogleClassroom")
    }),
    { fetchClassList: fetchClassListAction }
  )
);

export default enhance(Header);

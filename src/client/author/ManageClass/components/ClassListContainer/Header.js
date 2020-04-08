import { EduButton, MainHeader, HeaderTabs } from "@edulastic/common";
import { IconGoogleClassroom, IconManage, IconPlusCircle } from "@edulastic/icons";
import { StyledTabs } from "@edulastic/common/src/components/HeaderTabs";
import { get } from "lodash";
import { withNamespaces } from "react-i18next";
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
import { getGoogleAllowedInstitionPoliciesSelector } from "../../../src/selectors/user";

const Header = ({ fetchClassList, googleAllowedInstitutions, isUserGoogleLoggedIn, t, currentTab, onClickHandler }) => {
  const handleLoginSucess = data => {
    fetchClassList({ data });
  };

  const handleError = err => {
    console.log("error", err);
  };

  const pageNavButtons = [
    {
      icon: null,
      value: "class",
      text: "Classes"
    },
    {
      icon: null,
      value: "group",
      text: "Groups"
    }
  ];

  return (
    <MainHeader Icon={IconManage} headingText={t("common.manageClassTitle")}>
      <StyledTabs>
        {pageNavButtons.map(({ value, text }, index) => {
          return (
            <HeaderTabs
              style={currentTab === value ? { cursor: "not-allowed" } : { cursor: "pointer" }}
              dataCy={value}
              isActive={currentTab === value}
              linkLabel={text}
              key={value}
              onClickHandler={() => onClickHandler(value)}
            />
          );
        })}
      </StyledTabs>
      <ButtonsWrapper>
        {googleAllowedInstitutions.length > 0 && (
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
        <Link to={{ pathname: "/author/manageClass/createClass", state: { type: currentTab } }} data-cy="createClass">
          <EduButton>
            <IconPlusCircle />
            <span>Create {currentTab}</span>
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
  withNamespaces("header"),
  connect(
    state => ({
      isUserGoogleLoggedIn: get(state, "user.user.isUserGoogleLoggedIn"),
      googleAllowedInstitutions: getGoogleAllowedInstitionPoliciesSelector(state)
    }),
    { fetchClassList: fetchClassListAction }
  )
);

export default enhance(Header);

import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withNamespaces } from "react-i18next";
import { GoogleLogin } from "react-google-login";

// components
import { EduButton, MainHeader, HeaderTabs } from "@edulastic/common";
import { IconGoogleClassroom, IconManage, IconPlusCircle, IconClass, IconGroup, IconClever } from "@edulastic/icons";
import { StyledTabs } from "@edulastic/common/src/components/HeaderTabs";
import { ButtonsWrapper } from "./styled";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";

import { scopes } from "./ClassCreatePage";

const Header = ({
  fetchGoogleClassList,
  googleAllowedInstitutions,
  isUserGoogleLoggedIn,
  setShowCleverSyncModal,
  t,
  currentTab,
  onClickHandler,
  enableCleverSync,
  isCleverDistrictUser
}) => {
  const handleLoginSucess = data => {
    fetchGoogleClassList({ data });
  };

  const handleError = err => {
    console.log("error", err);
  };

  const pageNavButtons = [
    {
      icon: <IconClass width="15px" height="15px" />,
      value: "class",
      text: "Classes"
    },
    {
      icon: <IconGroup width="20px" height="15px" />,
      value: "group",
      text: "Groups"
    }
  ];

  return (
    <MainHeader Icon={IconManage} headingText={t("common.manageClassTitle")}>
      <FeaturesSwitch inputFeatures="studentGroups" actionOnInaccessible="hidden">
        <StyledTabs>
          {pageNavButtons.map(({ value, text, icon }) => (
            <HeaderTabs
              style={currentTab === value ? { cursor: "not-allowed" } : { cursor: "pointer" }}
              dataCy={value}
              isActive={currentTab === value}
              linkLabel={text}
              key={value}
              icon={icon}
              onClickHandler={() => onClickHandler(value)}
            />
          ))}
        </StyledTabs>
      </FeaturesSwitch>
      <ButtonsWrapper>
        {enableCleverSync && (
          <EduButton isGhost onClick={() => setShowCleverSyncModal(true)}>
            <IconClever width={18} height={18} />
            <span>SYNC NOW WITH CLEVER</span>
          </EduButton>
        )}
        {googleAllowedInstitutions.length > 0 && !(enableCleverSync || isCleverDistrictUser) && (
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
  fetchGoogleClassList: PropTypes.func.isRequired
};

export default withNamespaces("header")(Header);

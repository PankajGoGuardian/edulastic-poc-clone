import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withNamespaces } from "react-i18next";
import { GoogleLogin } from "react-google-login";
import * as Sentry from "@sentry/browser";
import { Select } from "antd";

// components
import { EduButton, MainHeader, HeaderTabs, notification } from "@edulastic/common";
import { canvasApi } from "@edulastic/api";
import { IconGoogleClassroom, IconManage, IconPlusCircle, IconClass, IconGroup, IconClever } from "@edulastic/icons";
import { StyledTabs } from "@edulastic/common/src/components/HeaderTabs";
import { ButtonsWrapper, SelectStyled, OptionWrapper } from "./styled";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";
import authorizeCanvas from "../../../../common/utils/CanavsAuthorizationModule";
import { scopes } from "./ClassCreatePage";

const Option = Select.Option;

const CANVAS = "canvas";
const GOOGLE = "google";
const CLEVER = "clever";

const Header = ({
  fetchGoogleClassList,
  googleAllowedInstitutions,
  isUserGoogleLoggedIn,
  setShowCleverSyncModal,
  t,
  currentTab,
  onClickHandler,
  enableCleverSync,
  canvasAllowedInstitution,
  user,
  handleCanvasBulkSync
}) => {
  const { orgData } = user;
  const { isCleverDistrict } = orgData;

  const handleLoginSucess = data => {
    fetchGoogleClassList({ data });
  };

  const handleError = err => {
    console.log("error", err);
  };

  const handleSyncWithCanvas = async () => {
    try {
      const result = await canvasApi.getCanvasAuthURI(canvasAllowedInstitution?.[0]?.institutionId);
      if (!result.userAuthenticated) {
        const subscriptionTopic = `canvas:${user.districtId}_${user._id}_${user.username || user.email || ""}`;
        authorizeCanvas(result.canvasAuthURL, subscriptionTopic)
          .then(res => {
            handleCanvasBulkSync(res);
          })
          .catch(err => {
            console.error("Error while authorizing", err);
            Sentry.captureException(err);
            notification({ messageKey: "errorOccuredWhileAuthorizing" });
          });
      } else {
        handleCanvasBulkSync();
      }
    } catch (err) {
      Sentry.captureException(err);
      notification(
        err.status === 403 && err.response.data?.message
          ? {
              msg: err.response.data?.message
            }
          : { messageKey: "errorWhileGettingAuthUri" }
      );
    }
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

  const enableGoogleSync = googleAllowedInstitutions.length > 0;
  const enableCanvasSync = canvasAllowedInstitution.length > 0;

  const options = {
    [CLEVER]: enableCleverSync,
    [GOOGLE]: enableGoogleSync,
    [CANVAS]: enableCanvasSync
  };

  Object.keys(options).forEach(o => {
    if (!options[o]) delete options[o];
  });

  const showDropDown = Object.values(options).filter(o => o).length > 1;

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
        {showDropDown ? (
          <SelectStyled
            data-cy="sync-options-dropdown"
            minWidth="200px"
            dropdownStyle={{ zIndex: 1000 }}
            value="Bulk Sync Classes"
          >
            {Object.keys(options).map((option, index) => {
              if (option === CLEVER) {
                return (
                  <Option key={index} data-cy={`sync-option-${index}`} onClick={() => setShowCleverSyncModal(true)}>
                    <span>Sync with Clever</span>
                    <IconClever width={18} height={18} />
                  </Option>
                );
              }
              if (option === GOOGLE) {
                return (
                  <Option key={index} data-cy={`sync-option-${index}`}>
                    <GoogleLogin
                      clientId={process.env.POI_APP_GOOGLE_CLIENT_ID}
                      buttonText="Sync with Google Classroom"
                      render={renderProps => (
                        <OptionWrapper onClick={renderProps.onClick}>
                          <span>Sync with Google Classroom</span>
                          <IconGoogleClassroom />
                        </OptionWrapper>
                      )}
                      scope={scopes}
                      onSuccess={handleLoginSucess}
                      onFailure={handleError}
                      prompt={isUserGoogleLoggedIn ? "" : "consent"}
                      responseType="code"
                    />
                  </Option>
                );
              }
              if (option === CANVAS) {
                return (
                  <Option key={index} data-cy={`sync-option-${index}`} onClick={handleSyncWithCanvas}>
                    <span>Sync with Canvas</span>
                    <img
                      alt="Canvas"
                      src="https://cdn.edulastic.com/JS/webresources/images/as/canvas.png"
                      width={18}
                      height={18}
                    />
                  </Option>
                );
              }
              return null;
            })}
          </SelectStyled>
        ) : (
          <>
            {enableCleverSync && (
              <EduButton isBlue isGhost onClick={() => setShowCleverSyncModal(true)}>
                <IconClever width={18} height={18} />
                <span>SYNC NOW WITH CLEVER</span>
              </EduButton>
            )}
            {googleAllowedInstitutions?.length > 0 && !isCleverDistrict && (
              <GoogleLogin
                clientId={process.env.POI_APP_GOOGLE_CLIENT_ID}
                buttonText="Sync with Google Classroom"
                render={renderProps => (
                  <EduButton isBlue isGhost onClick={renderProps.onClick}>
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
            {canvasAllowedInstitution?.length > 0 && !isCleverDistrict && (
              <EduButton isBlue isGhost onClick={handleSyncWithCanvas}>
                <img
                  alt="Canvas"
                  src="https://cdn.edulastic.com/JS/webresources/images/as/canvas.png"
                  width={18}
                  height={18}
                />
                <span>SYNC WITH CANVAS</span>
              </EduButton>
            )}
          </>
        )}
        <Link to={{ pathname: "/author/manageClass/createClass", state: { type: currentTab } }} data-cy="createClass">
          <EduButton isBlue>
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

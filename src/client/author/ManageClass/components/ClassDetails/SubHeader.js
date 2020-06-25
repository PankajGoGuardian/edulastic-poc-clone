import React, { useState } from "react";
import withRouter from "react-router-dom/withRouter";
import { compose } from "redux";
import connect from "react-redux/lib/connect/connect";
import PropTypes from "prop-types";
import { canvasApi } from "@edulastic/api";
import GoogleLogin from "react-google-login";
import { IconGoogleClassroom } from "@edulastic/icons";
import { TypeToConfirmModal, SimpleConfirmModal, notification } from "@edulastic/common";
import { LightGreenSpan } from "@edulastic/common/src/components/TypeToConfirmModal/styled";
import { setAssignmentFiltersAction } from "../../../src/actions/assignments";
import { scopes } from "../ClassListContainer/ClassCreatePage";
import { ContainerHeader, RightContent, ClassCode, IconArchiveClass, ClassLink,Studentscount, CodeWrapper } from "./styled";
import { Tooltip } from "../../../../common/utils/helpers";
import authorizeCanvas from "../../../../common/utils/CanavsAuthorizationModule";


const SubHeader = ({
  name,
  code,
  _id,
  type,
  active,
  syncGCModal,
  allowGoogleLogin,
  fetchClassList,
  isUserGoogleLoggedIn,
  cleverId,
  location,
  allowCanvasLogin,
  syncCanvasModal,
  user,
  institutionId,
  unarchiveClass,
  studentCount
}) => {

  const [showModal, setShowModal] = useState(false);
  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false);
  const { exitPath } = location?.state || {};
  const typeText = type !== "class" ? "Group" : "Class";

  const handleLoginSuccess = data => {
    fetchClassList({ data, showModal: false });
  };

  const handleError = err => {
    notification({ messageKey: "googleLoginFailed" });
    console.log("error", err);
  };


  const handleUnarchiveClass = () => {
    unarchiveClass({ groupId: _id, exitPath, isGroup: type !== "class" });
    setShowUnarchiveModal(false);
  };
  const handleUnarchiveClassCancel = () => {
    setShowUnarchiveModal(false);
  };


  const handleSyncWithCanvas = async () => {
    try {
      const result = await canvasApi.getCanvasAuthURI(institutionId);
      if (!result.userAuthenticated) {
        const subscriptionTopic = `canvas:${user?.districtIds?.[0]}_${user._id}_${user.username || user.email || ""}`;
        authorizeCanvas(result.canvasAuthURL, subscriptionTopic)
          .then(res => {
            syncCanvasModal(res);
          })
          .catch(err => {
            console.error("Error while authorizing", err);
            notification({ messageKey: "errorOccuredWhileAuthorizing" });
          });
      } else {
        syncCanvasModal();
      }
    } catch (err) {
      notification({ messageKey: "errorWhileGettingAuthUri" });
    }
  };
  
  return (
    <ContainerHeader>
      {type === "class" && (
        <CodeWrapper>
          <ClassCode lg={6} span={12}>
            Class Code <span>{code}</span>
          </ClassCode>
          <Studentscount lg={6} span={12}>
            TOTAL STUDENTS <span>{studentCount || 0 }</span>
          </Studentscount>
        </CodeWrapper>
      )}
      <RightContent>
        {type === "class" && (
          <>
            {allowGoogleLogin !== false &&
              active === 1 &&
              !cleverId &&
              (isUserGoogleLoggedIn ? (
                <i
                  style={{ cursor: "pointer", marginLeft: "8px", display: "flex" }}
                  title="Sync with Google Classroom"
                  onClick={syncGCModal}
                >
                  <IconGoogleClassroom width={22} height={22} />
                </i>
              ) : (
                <GoogleLogin
                  clientId={process.env.POI_APP_GOOGLE_CLIENT_ID}
                  render={renderProps => (
                    <i
                      style={{ cursor: "pointer", marginLeft: "8px", display: "flex" }}
                      title="Sync with Google Classroom"
                      onClick={renderProps.onClick}
                    >
                      <IconGoogleClassroom width={22} height={22} />
                    </i>
                  )}
                  scope={scopes}
                  onSuccess={handleLoginSuccess}
                  onFailure={handleError}
                  prompt="consent"
                  responseType="code"
                />
              ))}

            {allowCanvasLogin && active === 1 && !cleverId && (
              <i
                style={{ cursor: "pointer", marginLeft: "8px", display: "flex" }}
                title="Sync with Canvas Classroom"
                onClick={handleSyncWithCanvas}
              >
                <img
                  alt="Canvas"
                  src="https://cdn.edulastic.com/JS/webresources/images/as/canvas.png"
                  width={22}
                  height={22}
                />
              </i>
            )}
            {/* hiding icons as of now, after functinality is added these icons will be displayed */}
            {/* <StyledIcon type="user" fill={greenDark} /> */}
          </>
        )}
        {active !== 1 && <ClassLink onClick={() => setShowUnarchiveModal(true)}>UNARCHIVE</ClassLink>}
        {showUnarchiveModal && (
          <SimpleConfirmModal
            visible={showUnarchiveModal}
            title={`Unarchive ${typeText}`}
            description={
              <p style={{ margin: "5px 0" }}>
                Are you sure you want to Unarchive <LightGreenSpan>{name}</LightGreenSpan>?
              </p>
            }
            buttonText="Unarchive"
            onProceed={handleUnarchiveClass}
            onCancel={handleUnarchiveClassCancel}
          />
        )}
        
      </RightContent>
    </ContainerHeader>
  );
};

SubHeader.propTypes = {
  name: PropTypes.string,
  code: PropTypes.string
};

SubHeader.defaultProps = {
  name: "",
  code: ""
};

const enhance = compose(
  withRouter,
  connect(
    state => ({ user: state?.user?.user }),
    {
      setAssignmentFilters: setAssignmentFiltersAction
    }
  )
);

export default enhance(SubHeader);

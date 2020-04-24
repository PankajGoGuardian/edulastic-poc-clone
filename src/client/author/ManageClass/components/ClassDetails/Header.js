import { MainHeader, EduButton } from "@edulastic/common";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
// components
import { message } from "antd";
import GoogleLogin from "react-google-login";
import { IconGoogleClassroom } from "@edulastic/icons";
import { canvasApi } from "@edulastic/api";
import authorizeCanvas from "../../../../common/utils/CanavsAuthorizationModule";
import { scopes } from "../ClassListContainer/ClassCreatePage";

const Header = ({
  user,
  onEdit,
  fetchClassList,
  selectedClass,
  allowCanvasLogin,
  syncCanvasModal,
  allowGoogleLogin,
  syncGCModal,
  isUserGoogleLoggedIn
}) => {
  const { name, type, institutionId, institutionName = "", districtName = "", cleverId, active } = selectedClass;

  const handleLoginSuccess = data => {
    fetchClassList({ data, showModal: false });
  };

  const handleError = err => {
    message.error("Google login failed");
    console.log("error", err);
  };

  const handleSyncWithCanvas = async () => {
    try {
      const result = await canvasApi.getCanvasAuthURI(institutionId);
      if (!result.userAuthenticated) {
        const subscriptionTopic = `canvas:${user.districtId}_${user._id}_${user.username || user.email || ""}`;
        authorizeCanvas(result.canvasAuthURL, subscriptionTopic)
          .then(res => {
            syncCanvasModal(res);
          })
          .catch(err => {
            console.error("Error while authorizing", err);
            message.error("Error occured while authorizing");
          });
      } else {
        syncCanvasModal();
      }
    } catch (err) {
      message.error("Error while getting Auth URI");
    }
  };

  const headingSubContent = (
    <span>
      {districtName ? `${districtName}, ` : ""}
      {institutionName}
    </span>
  );

  return (
    <MainHeader headingText={name} headingSubContent={headingSubContent} flexDirection="column" alignItems="flex-start">
      <div style={{ display: "flex", alignItems: "right" }}>
        {type === "class" &&
          cleverId &&
          active === 1 &&
          allowGoogleLogin !== false &&
          (isUserGoogleLoggedIn ? (
            <EduButton isghost onClick={syncGCModal}>
              <IconGoogleClassroom />
              <span>SYNC WITH GOOGLE CLASSROOM</span>
            </EduButton>
          ) : (
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
              onSuccess={handleLoginSuccess}
              onFailure={handleError}
              prompt="consent"
              responseType="code"
            />
          ))}
        {type === "class" && cleverId && allowCanvasLogin && active === 1 && (
          <EduButton isGhost onClick={handleSyncWithCanvas}>
            <img
              alt="Canvas"
              src="https://cdn.edulastic.com/JS/webresources/images/as/canvas.png"
              width={18}
              height={18}
              style={{ marginRight: "10px" }}
            />
            <span>Sync with Canvas Classroom</span>
          </EduButton>
        )}
        {active === 1 && (
          <EduButton onClick={onEdit} data-cy="editClass">
            Edit {type === "class" ? "Class" : "Group"}
          </EduButton>
        )}
      </div>
    </MainHeader>
  );
};

Header.propTypes = {
  onEdit: PropTypes.func
};

Header.defaultProps = {
  onEdit: () => null
};

const enhance = compose(
  connect(
    state => ({
      user: state?.user?.user
    }),
    {}
  )
);
export default enhance(Header);

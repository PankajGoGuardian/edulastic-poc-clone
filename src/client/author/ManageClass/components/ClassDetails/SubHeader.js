import React, { useState } from "react";
import withRouter from "react-router-dom/withRouter";
import { compose } from "redux";
import connect from "react-redux/lib/connect/connect";
import PropTypes from "prop-types";
import { message } from "antd";
import { canvasApi } from "@edulastic/api";
import GoogleLogin from "react-google-login";
import { IconGoogleClassroom } from "@edulastic/icons";
import { TypeToConfirmModal } from "@edulastic/common";
import { LightGreenSpan } from "@edulastic/common/src/components/TypeToConfirmModal/styled";
import { setAssignmentFiltersAction } from "../../../src/actions/assignments";
import { scopes } from "../ClassListContainer/ClassCreatePage";
import { ContainerHeader, RightContent, ClassCode, IconArchiveClass, ClassLink } from "./styled";
import { Tooltip } from "../../../../common/utils/helpers";
import authorizeCanvas from "../../../../common/utils/CanavsAuthorizationModule";

const SubHeader = ({
  name,
  code,
  _id,
  active,
  districtId,
  syncGCModal,
  allowGoogleLogin,
  fetchClassList,
  isUserGoogleLoggedIn,
  archiveClass,
  cleverId,
  setAssignmentFilters,
  history,
  allowCanvasLogin,
  syncCanvasModal,
  user,
  institutionId
}) => {
  const [showModal, setShowModal] = useState(false);
  const handleLoginSuccess = data => {
    fetchClassList({ data, showModal: false });
  };

  const handleError = err => {
    message.error("Google login failed");
    console.log("error", err);
  };

  const handleArchiveClass = () => {
    archiveClass({ _id, districtId });
    setShowModal(false);
  };
  const handleArchiveClassCancel = () => {
    setShowModal(false);
  };

  // get assignments related to class
  const getAssignmentsByClass = (classId = "") => event => {
    event.stopPropagation();
    const filter = {
      classId,
      testType: "",
      termId: ""
    };
    history.push("/author/assignments");
    setAssignmentFilters(filter);
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

  return (
    <ContainerHeader>
      <RightContent>
        <ClassLink onClick={getAssignmentsByClass(_id)}>VIEW ASSIGNMENT</ClassLink>
        {allowGoogleLogin !== false &&
          active === 1 &&
          (isUserGoogleLoggedIn ? (
            <i
              style={{ cursor: "pointer", marginLeft: "8px", display: "flex" }}
              title="Sync with Google Classroom"
              onClick={syncGCModal}
            >
              <IconGoogleClassroom width={22} height={22} />
            </i>
          ) : !cleverId ? (
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
          ) : null)}

        {allowCanvasLogin && active === 1 && (
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
        {active === 1 && !cleverId && (
          <Tooltip placement="top" title="Archive Class">
            <span onClick={() => setShowModal(true)}>
              <IconArchiveClass width={20} height={20} />
            </span>
          </Tooltip>
        )}

        {showModal && (
          <TypeToConfirmModal
            modalVisible={showModal}
            title="Archive Class"
            handleOnOkClick={handleArchiveClass}
            wordToBeTyped="ARCHIVE"
            primaryLabel="Are you sure want to archive the following class?"
            secondaryLabel={
              <p style={{ margin: "5px 0" }}>
                <LightGreenSpan>{name}</LightGreenSpan>
              </p>
            }
            closeModal={handleArchiveClassCancel}
            okButtonText="Archive"
          />
        )}
      </RightContent>
      <ClassCode>
        Class Code <span>{code}</span>
      </ClassCode>
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

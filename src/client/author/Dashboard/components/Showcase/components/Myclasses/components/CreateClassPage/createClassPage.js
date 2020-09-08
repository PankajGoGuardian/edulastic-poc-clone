import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { canvasApi } from "@edulastic/api";
import { EduButton, notification } from "@edulastic/common";
import * as Sentry from "@sentry/browser";
import GoogleLogin from "react-google-login";
import { IconPlusCircle, IconGoogleClassroom, IconClever } from "@edulastic/icons";
import styled from "styled-components";
import { CreateCardBox, SyncClassDiv } from "./styled";
import { getCanvasAllowedInstitutionPoliciesSelector } from "../../../../../../../src/selectors/user";
import authorizeCanvas from "../../../../../../../../common/utils/CanavsAuthorizationModule";
import { scopes } from "../../../../../../../ManageClass/components/ClassListContainer/ClassCreatePage";

const CreateClassPage = ({
  allowGoogleLogin,
  isUserGoogleLoggedIn,
  fetchClassList,
  enableCleverSync,
  setShowCleverSyncModal,
  canvasAllowedInstitution,
  handleCanvasBulkSync,
  user,
  history
}) => {
  const handleLoginSucess = data => {
    fetchClassList({ data });
    history.push("/author/manageClass");
  };

  const handleError = err => {
    console.log("error", err);
  };

  const CreateNewClass = () => {
    history.push("/author/manageClass/createClass");
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

  return (
    <CreateCardBox>
      <EduButton style={{ width: "207px" }} isBlue onClick={CreateNewClass}>
        <IconPlusCircle width={20} height={20} />
        <p>Create new class</p>
      </EduButton>
      {allowGoogleLogin !== false && (
        <GoogleLogin
          clientId={process.env.POI_APP_GOOGLE_CLIENT_ID}
          render={renderProps => (
            <>
              <StyledP>OR</StyledP>
              <SyncClassDiv onClick={renderProps.onClick}>
                <IconGoogleClassroom />
                <p>Sync With Google Classroom</p>
              </SyncClassDiv>
            </>
          )}
          scope={scopes}
          onSuccess={handleLoginSucess}
          onFailure={handleError}
          prompt={isUserGoogleLoggedIn ? "" : "consent"}
          responseType="code"
        />
      )}
      {canvasAllowedInstitution.length > 0 && (
        <>
          <StyledP>OR</StyledP>
          <SyncClassDiv isBlue isGhost onClick={() => handleSyncWithCanvas()}>
            <img
              alt="Canvas"
              src="https://cdn.edulastic.com/JS/webresources/images/as/canvas.png"
              width={18}
              height={18}
            />
            <p>SYNC WITH CANVAS </p>
          </SyncClassDiv>
        </>
      )}
      {enableCleverSync && (
        <>
          <StyledP>OR</StyledP>
          <SyncClassDiv onClick={() => setShowCleverSyncModal(true)}>
            <IconClever />
            <p>Sync Class Roster from Clever</p>
          </SyncClassDiv>
        </>
      )}
    </CreateCardBox>
  );
};

const enhance = compose(
  withRouter,
  connect(state => ({
    canvasAllowedInstitution: getCanvasAllowedInstitutionPoliciesSelector(state)
  }))
);

export default enhance(CreateClassPage);

const StyledP = styled.p`
  color: #9196a2;
`;

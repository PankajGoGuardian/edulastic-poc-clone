import React from "react";
import { Link } from "react-router-dom";
import { CreateCardBox, CreateClassDiv, SyncClassDiv } from "./styled";
import GoogleLogin from "react-google-login";
import { IconPlusCircle, IconGoogleClassroom, IconClever } from "@edulastic/icons";
import styled from "styled-components";
import { scopes } from "../../../../../../../ManageClass/components/ClassListContainer/ClassCreatePage";
const CreateClassPage = ({
  allowGoogleLogin,
  isUserGoogleLoggedIn,
  fetchClassList,
  enableCleverSync,
  setShowCleverSyncModal,
  history
}) => {
  const handleLoginSucess = data => {
    fetchClassList({ data });
    history.push("/author/manageClass");
  };

  const handleError = err => {
    console.log("error", err);
  };

  return (
    <CreateCardBox>
      <StyledLink to={"/author/manageClass/createClass"}>
        <CreateClassDiv>
          <IconPlusCircle width={20} height={20} />
          <p>Create new class</p>
        </CreateClassDiv>
      </StyledLink>
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
export default CreateClassPage;

const StyledLink = styled(Link)`
  width: 207px;
  height: 40px;
`;
const StyledP = styled.p`
  color: #9196a2;
`;

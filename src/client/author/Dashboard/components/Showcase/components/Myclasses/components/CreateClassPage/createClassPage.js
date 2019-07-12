import React from "react";
import { Icon } from "antd";
import { Link } from "react-router-dom";
import GoogleClassRoomImg from "../../../../../../assets/images/google-classroom.png";
import { CreateCardBox, CreateClassButton, SyncClassDiv, SyncImg } from "./styled";
import GoogleLogin from "react-google-login";
const CreateClassPage = ({ allowGoogleLogin, isUserGoogleLoggedIn, fetchClassList }) => {
  const scopes = [
    "https://www.googleapis.com/auth/classroom.courses",
    "https://www.googleapis.com/auth/classroom.rosters",
    "https://www.googleapis.com/auth/classroom.coursework.me",
    "https://www.googleapis.com/auth/classroom.coursework.students",
    "https://www.googleapis.com/auth/classroom.announcements",
    "https://www.googleapis.com/auth/classroom.guardianlinks.students",
    "https://www.googleapis.com/auth/classroom.guardianlinks.me.readonly",
    "https://www.googleapis.com/auth/classroom.profile.photos",
    "https://www.googleapis.com/auth/classroom.profile.emails",
    "https://www.googleapis.com/auth/userinfo.profile"
  ].join(" ");

  const handleLoginSucess = data => {
    fetchClassList({ data });
  };

  const handleError = err => {
    console.log("error", err);
  };

  return (
    <CreateCardBox>
      <Link to={"/author/manageClass/createClass"}>
        <CreateClassButton>
          <Icon type="plus" />
          <p>create class</p>
        </CreateClassButton>
      </Link>
      {allowGoogleLogin !== false && (
        <GoogleLogin
          clientId={process.env.POI_APP_GOOGLE_CLIENT_ID}
          render={renderProps => (
            <>
              <p>or</p>
              <SyncClassDiv>
                <i
                  style={{ cursor: "pointer", marginLeft: "8px", display: "flex", alignItems: "center" }}
                  title={"Sync with Google Classroom"}
                  onClick={renderProps.onClick}
                >
                  <SyncImg src={GoogleClassRoomImg} width={35} /> Sync With Google Classroom
                </i>
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
    </CreateCardBox>
  );
};
export default CreateClassPage;

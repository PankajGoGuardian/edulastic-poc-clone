import React from "react";
import { Link } from "react-router-dom";
import { ClassCreateContainer, ButtonsContainer, ThemeButton, SyncImg } from "./styled";
import { IconGoogleClassroom } from "@edulastic/icons";
import NoClassNotification from "../NoClassNotification";
import GoogleLogin from "react-google-login";

export const scopes = [
  "https://www.googleapis.com/auth/classroom.courses.readonly",
  "https://www.googleapis.com/auth/classroom.rosters.readonly",
  "https://www.googleapis.com/auth/classroom.coursework.students",
  "https://www.googleapis.com/auth/classroom.coursework.me",
  "https://www.googleapis.com/auth/classroom.profile.emails",
  "https://www.googleapis.com/auth/classroom.profile.photos"
].join(" ");

const ClassCreatePage = ({ filterClass, recentInstitute = {}, user, fetchClassList }) => {
  const { name } = recentInstitute;

  const handleLoginSucess = data => {
    fetchClassList({ data });
  };

  const handleError = err => {
    console.log("error", err);
  };

  const {
    isUserGoogleLoggedIn,
    orgData: { allowGoogleClassroom }
  } = user;
  return (
    <>
      <ClassCreateContainer>
        {filterClass === "Archive Classes" ? (
          <NoClassNotification heading={"No archived classes"} description={"You have no archived classes available"} />
        ) : (
          <>
            <NoClassNotification
              heading={"No active classes"}
              description={`No active classes yet.You are currently a teacher in`}
              data={name}
            />
            <ButtonsContainer>
              <Link to={"/author/manageClass/createClass"}>
                <ThemeButton>create new class</ThemeButton>
              </Link>
              {allowGoogleClassroom !== false && (
                <GoogleLogin
                  clientId={process.env.POI_APP_GOOGLE_CLIENT_ID}
                  render={renderProps => (
                    <ThemeButton onClick={renderProps.onClick}>
                      <IconGoogleClassroom width={20} height={20} />
                      <span>Sync with google classroom</span>
                    </ThemeButton>
                  )}
                  scope={scopes}
                  onSuccess={handleLoginSucess}
                  onFailure={handleError}
                  prompt={isUserGoogleLoggedIn ? "" : "consent"}
                  responseType="code"
                />
              )}
            </ButtonsContainer>
          </>
        )}
      </ClassCreateContainer>
    </>
  );
};
export default ClassCreatePage;

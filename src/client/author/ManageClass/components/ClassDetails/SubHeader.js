import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { greyDarken, greenDark } from "@edulastic/colors";

import { ContainerHeader, LeftContent, RightContent, TitleWarapper, StyledIcon, AnchorLink, ClassCode } from "./styled";
import { message } from "antd";
import GoogleLogin from "react-google-login";
import { IconGoogleClassroom } from "@edulastic/icons";

const SubHeader = ({
  name,
  districtName,
  institutionName,
  code,
  syncGCModal,
  allowGoogleLogin,
  fetchClassList,
  isUserGoogleLoggedIn
}) => {
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

  const handleLoginSuccess = data => {
    fetchClassList({ data, showModal: false });
  };

  const handleError = err => {
    message.error("Google login failed");
    console.log("error", err);
  };
  return (
    <ContainerHeader>
      <LeftContent>
        <Link to={`/author/manageClass`}>
          <StyledIcon type="left" size={30} />
        </Link>
        <TitleWarapper>
          <div>{name}</div>

          <p>
            {districtName},{institutionName}
          </p>
        </TitleWarapper>
      </LeftContent>
      <RightContent>
        <AnchorLink to="/author/assignments">View Assessments</AnchorLink>
        {allowGoogleLogin !== false &&
          (isUserGoogleLoggedIn ? (
            <i
              style={{ cursor: "pointer", marginLeft: "8px", display: "flex" }}
              title={"Sync with Google Classroom"}
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
                  title={"Sync with Google Classroom"}
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
        <StyledIcon type="user" fill={greenDark} />
        <StyledIcon type="delete" fill={greyDarken} />
        <ClassCode>
          Class Code: <span>{code}</span>
        </ClassCode>
      </RightContent>
    </ContainerHeader>
  );
};

SubHeader.propTypes = {
  name: PropTypes.string,
  institutionName: PropTypes.string,
  districtName: PropTypes.string,
  code: PropTypes.string
};

SubHeader.defaultProps = {
  name: "",
  institutionName: "",
  districtName: "",
  code: ""
};

export default SubHeader;

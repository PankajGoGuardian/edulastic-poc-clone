import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { greyDarken, greenDark } from "@edulastic/colors";

import {
  ContainerHeader,
  LeftContent,
  RightContent,
  TitleWarapper,
  StyledIcon,
  AnchorLink,
  ClassCode,
  IconArchiveClass
} from "./styled";
import { message, Tooltip } from "antd";
import GoogleLogin from "react-google-login";
import { IconGoogleClassroom } from "@edulastic/icons";
import { TypeToConfirmModal } from "@edulastic/common";
const SubHeader = ({
  name,
  districtName,
  institutionName,
  code,
  _id,
  active,
  districtId,
  syncGCModal,
  allowGoogleLogin,
  fetchClassList,
  isUserGoogleLoggedIn,
  archiveClass
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalInputVal, setModalInputVal] = useState("");

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

  const handleArchiveClass = () => {
    archiveClass({ _id, districtId });
    setShowModal(false);
  };
  const handleArchiveClassCancel = () => {
    setShowModal(false);
  };
  const handleModalInput = e => {
    setModalInputVal(e.target.value);
  };

  return (
    <ContainerHeader>
      <RightContent>
        <AnchorLink to="/author/assignments">VIEW TEST</AnchorLink>
        {allowGoogleLogin !== false &&
          active === 1 &&
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
        {/* hiding icons as of now, after functinality is added these icons will be displayed */}
        {/* <StyledIcon type="user" fill={greenDark} />*/}
        {active === 1 && (
          <Tooltip placement="top" title={"Archive Class"}>
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
            primaryLabel="Are you sure you want to archive the class ?"
            closeModal={handleArchiveClassCancel}
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

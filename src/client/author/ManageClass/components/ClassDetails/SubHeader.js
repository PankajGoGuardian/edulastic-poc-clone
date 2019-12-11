import React, { useState } from "react";
import PropTypes from "prop-types";
import { message, Tooltip } from "antd";
import GoogleLogin from "react-google-login";
import { IconGoogleClassroom } from "@edulastic/icons";
import { TypeToConfirmModal } from "@edulastic/common";
import { ContainerHeader, RightContent, AnchorLink, ClassCode, IconArchiveClass } from "./styled";
import { scopes } from "../ClassListContainer/ClassCreatePage";

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
  archiveClass,
  cleverId
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalInputVal, setModalInputVal] = useState("");

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
          ) : !cleverId ? (
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
          ) : null)}
        {/* hiding icons as of now, after functinality is added these icons will be displayed */}
        {/* <StyledIcon type="user" fill={greenDark} />*/}
        {active === 1 && !cleverId && (
          <Tooltip placement="top" title={"Archive Class"}>
            <span onClick={() => setShowModal(true)}>
              <IconArchiveClass width={20} height={20} />
            </span>
          </Tooltip>
        )}

        {showModal && (
          <TypeToConfirmModal
            modalVisible={showModal}
            title="Archive Class(es)"
            handleOnOkClick={handleArchiveClass}
            wordToBeTyped="ARCHIVE"
            primaryLabel="Are you sure want to archive the following class(es)?"
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

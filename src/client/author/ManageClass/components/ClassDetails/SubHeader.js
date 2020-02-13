import React, { useState } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import { Tooltip } from "../../../../common/utils/helpers";
import GoogleLogin from "react-google-login";
import { IconGoogleClassroom } from "@edulastic/icons";
import { TypeToConfirmModal } from "@edulastic/common";
import { ContainerHeader, RightContent, AnchorLink, ClassCode, IconArchiveClass, ClassLink } from "./styled";
import { scopes } from "../ClassListContainer/ClassCreatePage";
import connect from "react-redux/lib/connect/connect";
import { setAssignmentFiltersAction } from "../../../src/actions/assignments";
import withRouter from "react-router-dom/withRouter";
import { compose } from "redux";

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
  cleverId,
  setAssignmentFilters,
  history
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

  return (
    <ContainerHeader>
      <RightContent>
        <ClassLink onClick={getAssignmentsByClass(_id)}>VIEW ASSIGNMENT</ClassLink>
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

const enhance = compose(
  withRouter,
  connect(
    null,
    {
      setAssignmentFilters: setAssignmentFiltersAction
    }
  )
);

export default enhance(SubHeader);

import { MainHeader, EduButton, TypeToConfirmModal, notification } from "@edulastic/common";
import { LightGreenSpan } from "@edulastic/common/src/components/TypeToConfirmModal/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import withRouter from "react-router-dom/withRouter";
import React, { useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import * as Sentry from "@sentry/browser";

// components
import { Dropdown } from "antd";

import GoogleLogin from "react-google-login";
import {
  IconGoogleClassroom,
  IconClever,
  IconPlusCircle,
  IconPencilEdit,
  IconAssignment,
  IconManage
} from "@edulastic/icons";
import IconArchive from "@edulastic/icons/src/IconArchive";
import { canvasApi } from "@edulastic/api";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { Institution, DropMenu, MenuItems, CaretUp } from "./styled";

import authorizeCanvas from "../../../../common/utils/CanavsAuthorizationModule";
import { scopes } from "../ClassListContainer/ClassCreatePage";
import AddCoTeacher from "./AddCoTeacher/AddCoTeacher";

const modalStatus = {};

const Header = ({
  user,
  onEdit,
  fetchClassList,
  selectedClass,
  allowCanvasLogin,
  syncCanvasModal,
  allowGoogleLogin,
  syncGCModal,
  isUserGoogleLoggedIn,
  enableCleverSync,
  syncClassesWithClever,
  added,
  archiveClass,
  location,
  history,
  entity
}) => {
  const handleLoginSuccess = data => {
    fetchClassList({ data, showModal: false });
  };

  const handleError = err => {
    notification({ messageKey: "googleLoginFailed" });
    console.log("error", err);
  };

  const { _id, districtId } = entity;
  const [showModal, setShowModal] = useState(false);
  const { name, type, institutionId, institutionName = "", districtName = "", cleverId, active } = selectedClass;
  const { exitPath } = location?.state || {};

  const typeText = type !== "class" ? "Group" : "Class";

  const [isOpen, setModalStatus] = useState(modalStatus);
  const [sentReq, setReqStatus] = useState(false);

  const toggleModal = key => {
    setModalStatus({ [key]: !isOpen[key] });
  };

  if (added && sentReq) {
    setReqStatus(false);
    setModalStatus(false);
  }

  const handleActionMenuClick = () => {
    toggleModal("addCoTeacher");
  };

  const handleArchiveClass = () => {
    archiveClass({ _id, districtId, exitPath, isGroup: type !== "class" });

    setShowModal(false);
  };
  const handleArchiveClassCancel = () => {
    setShowModal(false);
  };

  const handleSyncWithCanvas = async () => {
    try {
      const result = await canvasApi.getCanvasAuthURI(institutionId);
      if (!result.userAuthenticated) {
        const subscriptionTopic = `canvas:${user?.districtIds?.[0]}_${user._id}_${user.username || user.email || ""}`;
        authorizeCanvas(result.canvasAuthURL, subscriptionTopic)
          .then(res => {
            syncCanvasModal(res);
          })
          .catch(err => {
            console.error("Error while authorizing", err);
            notification({ messageKey: "errorOccuredWhileAuthorizing" });
          });
      } else {
        syncCanvasModal();
      }
    } catch (err) {
      Sentry.captureException(err);
      notification(
        err.status === 403 && err.data?.message
          ? {
              msg: err.data?.message
            }
          : { messageKey: "errorWhileGettingAuthUri" }
      );
    }
  };

  const classDetails = (
    <>
      <div>{name}</div>
      <Institution>
        {districtName ? `${districtName}, ` : ""}
        {institutionName}
      </Institution>
    </>
  );

  const handleCleverSync = () => {
    const classList = [{ ...selectedClass, course: selectedClass?.course?.id }];
    syncClassesWithClever({ classList });
  };

  const getAssignmentsByClass = (classId = "") => () => {
    const filter = {
      classId,
      testType: "",
      termId: ""
    };
    sessionStorage.setItem("filters[Assignments]", JSON.stringify(filter));
    history.push("/author/assignments");
  };

  const showSyncButtons = type === "class" && active === 1;
  const showCleverSyncButton = showSyncButtons && enableCleverSync && cleverId;
  const showGoogleSyncButton = showSyncButtons && allowGoogleLogin !== false;
  const showCanvasSyncButton = showSyncButtons && allowCanvasLogin;

  return (
    <MainHeader Icon={IconManage} headingText={classDetails}>
      <div style={{ display: "flex", alignItems: "right" }}>
        {showCleverSyncButton && (
          <EduButton isBlue isGhost onClick={handleCleverSync}>
            <IconClever width={18} height={18} />
            <span>SYNC NOW WITH CLEVER</span>
          </EduButton>
        )}
        {showGoogleSyncButton &&
          (isUserGoogleLoggedIn ? (
            <EduButton isBlue isGhost onClick={syncGCModal}>
              <IconGoogleClassroom />
              <span>SYNC WITH GOOGLE CLASSROOM</span>
            </EduButton>
          ) : (
            <GoogleLogin
              clientId={process.env.POI_APP_GOOGLE_CLIENT_ID}
              buttonText="Sync with Google Classroom"
              render={renderProps => (
                <EduButton isBlue isGhost onClick={renderProps.onClick}>
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
        {showCanvasSyncButton && (
          <EduButton isBlue isGhost onClick={handleSyncWithCanvas}>
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
          <EduButton isBlue onClick={handleActionMenuClick}>
            <IconPlusCircle />
            Add Co-Teacher
          </EduButton>
        )}
        {active === 1 && (
          <Dropdown
            overlay={
              <DropMenu>
                <CaretUp className="fa fa-caret-up" />
                <MenuItems onClick={onEdit}>
                  <IconPencilEdit />
                  <span>{type === "class" ? "Edit Class" : "Edit Group"}</span>
                </MenuItems>
                <MenuItems onClick={() => setShowModal(true)}>
                  <IconArchive />
                  <span>{type === "class" ? "Archive Class" : "Archive Group"}</span>
                </MenuItems>
                <MenuItems onClick={handleActionMenuClick}>
                  <IconPlusCircle />
                  <span>Add a Co-Teacher</span>
                </MenuItems>

                {/*
                <MenuItems>
                  <IconRemove />
                  <span>Remove a Co-Teacher</span>  //Hidden until functionality added
                </MenuItems>
              */}
                <MenuItems onClick={getAssignmentsByClass(_id)}>
                  <IconAssignment />
                  <span>View Assignments</span>
                </MenuItems>
              </DropMenu>
            }
            getPopupContainer={trigger => trigger.parentNode}
            placement="bottomRight"
          >
            <EduButton isBlue data-cy="headerDropDown" IconBtn>
              <FontAwesomeIcon icon={faEllipsisV} />
            </EduButton>
          </Dropdown>
        )}
      </div>
      <AddCoTeacher
        isOpen={isOpen.addCoTeacher}
        type={type}
        selectedClass={selectedClass}
        handleCancel={() => toggleModal("addCoTeacher")}
      />
      {showModal && (
        <TypeToConfirmModal
          modalVisible={showModal}
          title={`Archive ${typeText}`}
          handleOnOkClick={handleArchiveClass}
          wordToBeTyped="ARCHIVE"
          primaryLabel={`Are you sure you want to archive the following ${typeText.toLowerCase()}?`}
          secondaryLabel={
            <p style={{ margin: "5px 0" }}>
              <LightGreenSpan>{name}</LightGreenSpan>
            </p>
          }
          closeModal={handleArchiveClassCancel}
          okButtonText="Archive"
        />
      )}
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
  withRouter,
  connect(state => ({
    user: state?.user?.user
  }))
);
export default enhance(Header);

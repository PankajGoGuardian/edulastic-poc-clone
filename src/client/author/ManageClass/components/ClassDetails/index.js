import { MainContentWrapper } from "@edulastic/common";
import { Input, message, Spin } from "antd";
import { get } from "lodash";
import PropTypes from "prop-types";
import React, { useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import BreadCrumb from "../../../src/components/Breadcrumb";
import { archiveClassAction } from "../../../Classes/ducks";
import {
  fetchClassListAction,
  fetchStudentsByIdAction,
  syncByCodeModalAction,
  syncClassUsingCodeAction,
  getCanvasCourseListRequestAction,
  getCanvasSectionListRequestAction,
  syncClassWithCanvasAction
} from "../../ducks";

import ActionContainer from "./ActionContainer";
import Header from "./Header";
import MainInfo from "./MainInfo";
import StudentsList from "./StudentsList";
import { ButtonWrapper, GoogleClassSyncModal } from "./styled";
import CanvasSyncModal from "./CanvasSyncModal";
import { EduButton } from "@edulastic/common";

const ClassDetails = ({
  selectedClass,
  loadStudents,
  fetchClassList,
  isUserGoogleLoggedIn,
  history,
  syncClassLoading,
  fetchClassListLoading,
  classLoaded,
  match,
  syncClassUsingCode,
  archiveClass,
  getCanvasCourseListRequest,
  getCanvasSectionListRequest,
  canvasCourseList,
  canvasSectionList,
  syncClassWithCanvas,
  user
}) => {
  const { _id, name, type, cleverId, institutionId } = selectedClass;
  const { allowGoogleClassroom: allowGoogleLogin, allowCanvas: allowCanvasLogin, searchAndAddStudents } = useMemo(
    () =>
      user?.orgData?.policies?.institutions?.find(i => i.institutionId === institutionId) ||
      user?.orgData?.policies?.district ||
      {},
    [user?.orgData?.policies, institutionId]
  );
  const [disabled, setDisabled] = useState(selectedClass && !selectedClass.googleCode);
  const [showCanvasSyncModal, setCanvasSyncModalVisibility] = useState(false);
  const googleCode = React.createRef();
  const [openGCModal, setOpenGCModal] = useState(false);
  useEffect(() => {
    if (!fetchClassListLoading) setOpenGCModal(true);
  }, [fetchClassListLoading]);

  useEffect(() => {
    if (!syncClassLoading) {
      if (openGCModal) setOpenGCModal(false);
      if (showCanvasSyncModal) setCanvasSyncModalVisibility(false);
    }
  }, [syncClassLoading]);

  useEffect(() => {
    const { classId } = match.params;
    loadStudents({ classId });
    setOpenGCModal(false);
  }, []);

  const handleEditClick = () => {
    const classId = selectedClass._id || match.params.classId;
    history.push(`/author/manageClass/${classId}/edit`);
  };

  const handleSyncGC = () => {
    if (googleCode.current.state.value) {
      syncClassUsingCode({
        googleCode: googleCode.current.state.value,
        groupId: selectedClass._id,
        institutionId
      });
    } else {
      message.error("Enter valid google classroom code");
    }
  };

  const closeGoogleSyncModal = () => {
    setOpenGCModal(false);
    setDisabled(true);
    googleCode.current.state.value = "";
  };

  const breadCrumbData = [
    {
      title: "MANAGE CLASS",
      to: "/author/manageClass"
    },
    {
      title: "GROUPS",
      to: "/author/manageClass",
      state: { currentTab: "group" }
    }
  ];

  const getBreadCrumbData = () => {
    const classBreadCrumb = {
      title: `${name}`,
      to: `/author/manageClass/${_id}`
    };
    return type === "class" ? [breadCrumbData[0], classBreadCrumb] : [...breadCrumbData, classBreadCrumb];
  };

  const viewAssessmentHandler = () => {};

  const syncCanvasModal = () => {
    setCanvasSyncModalVisibility(true);
  };

  return (
    <>
      {!classLoaded ? (
        <div className="spinContainer">
          <Spin />
        </div>
      ) : (
        <>
          <GoogleClassSyncModal
            visible={openGCModal}
            onCancel={closeGoogleSyncModal}
            title="Enter Google Classroom Code"
            footer={
              <ButtonWrapper>
                <EduButton height="32px" isGhost onClick={() => setDisabled(false)}>
                  CHANGE CLASSROOM
                </EduButton>
                <div style={{ display: "flex" }}>
                  <EduButton height="32px" isGhost onClick={closeGoogleSyncModal}>
                    CANCEL
                  </EduButton>
                  <EduButton height="32px" loading={syncClassLoading} onClick={handleSyncGC}>
                    SYNC
                  </EduButton>
                </div>
              </ButtonWrapper>
            }
          >
            <Input defaultValue={selectedClass.googleCode} ref={googleCode} disabled={disabled} />
          </GoogleClassSyncModal>
          {showCanvasSyncModal && (
            <CanvasSyncModal
              visible={showCanvasSyncModal}
              handleCancel={() => setCanvasSyncModalVisibility(false)}
              syncClassLoading={syncClassLoading}
              getCanvasCourseListRequest={getCanvasCourseListRequest}
              getCanvasSectionListRequest={getCanvasSectionListRequest}
              canvasCourseList={canvasCourseList}
              canvasSectionList={canvasSectionList}
              syncClassWithCanvas={syncClassWithCanvas}
              canvasCode={+selectedClass.canvasCode || null}
              canvasCourseSectionCode={+selectedClass.canvasCourseSectionCode || null}
              user={user}
              groupId={selectedClass._id}
              institutionId={institutionId}
            />
          )}
          <Header
            onEdit={handleEditClick}
            fetchClassList={fetchClassList}
            selectedClass={selectedClass}
            allowCanvasLogin={allowCanvasLogin}
            syncCanvasModal={syncCanvasModal}
            allowGoogleLogin={allowGoogleLogin}
            syncGCModal={() => setOpenGCModal(true)}
            isUserGoogleLoggedIn={isUserGoogleLoggedIn}
          />
          <MainContentWrapper>
            <BreadCrumb ellipsis="calc(100% - 200px)" data={getBreadCrumbData()} style={{ position: "unset" }} />
            <MainInfo
              entity={selectedClass}
              fetchClassList={fetchClassList}
              viewAssessmentHandler={viewAssessmentHandler}
              isUserGoogleLoggedIn={isUserGoogleLoggedIn}
              allowGoogleLogin={allowGoogleLogin}
              syncGCModal={() => setOpenGCModal(true)}
              archiveClass={archiveClass}
              allowCanvasLogin={allowCanvasLogin}
              syncCanvasModal={syncCanvasModal}
            />

            <ActionContainer
              type={type}
              loadStudents={loadStudents}
              history={history}
              cleverId={cleverId}
              searchAndAddStudents={searchAndAddStudents}
            />
            <StudentsList
              selectStudent
              selectedClass={selectedClass}
              allowGoogleLogin={allowGoogleLogin}
              allowCanvasLogin={allowCanvasLogin}
            />
          </MainContentWrapper>
        </>
      )}
    </>
  );
};

ClassDetails.propTypes = {
  selectedClass: PropTypes.object.isRequired,
  loadStudents: PropTypes.func.isRequired,
  classLoaded: PropTypes.bool.isRequired
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      selectedClass: get(state, "manageClass.entity"),
      fetchClassListLoading: state.manageClass.fetchClassListLoading,
      isUserGoogleLoggedIn: get(state, "user.user.isUserGoogleLoggedIn", false),
      allowCanvasLogin: get(state, "user.user.orgData.allowCanvas", false),
      syncClassLoading: get(state, "manageClass.syncClassLoading"),
      classLoaded: get(state, "manageClass.classLoaded"),
      canvasCourseList: get(state, "manageClass.canvasCourseList", []),
      canvasSectionList: get(state, "manageClass.canvasSectionList", []),
      user: get(state, "user.user", {})
    }),
    {
      syncClassUsingCode: syncClassUsingCodeAction,
      fetchClassList: fetchClassListAction,
      syncByCodeModal: syncByCodeModalAction,
      loadStudents: fetchStudentsByIdAction,
      archiveClass: archiveClassAction,
      getCanvasCourseListRequest: getCanvasCourseListRequestAction,
      getCanvasSectionListRequest: getCanvasSectionListRequestAction,
      syncClassWithCanvas: syncClassWithCanvasAction
    }
  )
);

export default enhance(ClassDetails);

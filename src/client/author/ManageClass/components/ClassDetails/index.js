import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { themeColor } from "@edulastic/colors";
import { Spin, Modal, Input, message } from "antd";
import {
  fetchStudentsByIdAction,
  syncClassUsingCodeAction,
  fetchClassListAction,
  syncByCodeModalAction
} from "../../ducks";

import { archiveClassAction } from "../../../Classes/ducks";

import Header from "./Header";
import SubHeader from "./SubHeader";
import ActionContainer from "./ActionContainer";
import StudentsList from "./StudentsList";
import MainInfo from "./MainInfo";
import {
  Container,
  StyledDivider,
  ButtonWrapper,
  ButtonRightWrapper,
  StyledButton,
  GoogleClassSyncModal
} from "./styled";
import BreadCrumb from "../../../../author/src/components/Breadcrumb";

const ClassDetails = ({
  selectedClass,
  dataLoaded,
  loadStudents,
  fetchClassList,
  isUserGoogleLoggedIn,
  history,
  allowGoogleLogin,
  syncClassLoading,
  fetchClassListLoading,
  classLoaded,
  match,
  syncClassUsingCode,
  archiveClass
}) => {
  const { _id, name } = selectedClass;
  const [disabled, setDisabled] = useState(selectedClass && !selectedClass.googleCode);
  let googleCode = React.createRef();
  const [openGCModal, setOpenGCModal] = useState(false);
  useEffect(() => {
    if (!fetchClassListLoading) setOpenGCModal(true);
  }, [fetchClassListLoading]);

  useEffect(() => {
    if (!syncClassLoading && openGCModal) {
      setOpenGCModal(false);
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
      syncClassUsingCode({ googleCode: googleCode.current.state.value, groupId: selectedClass._id });
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
      title: `${name}`,
      to: `/author/manageClass/${_id}`
    }
  ];

  const viewAssessmentHandler = () => {};
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
                <StyledButton
                  style={{ color: themeColor, width: "auto", border: "none" }}
                  onClick={() => setDisabled(false)}
                >
                  Change Classroom
                </StyledButton>
                <div>
                  <StyledButton onClick={closeGoogleSyncModal}>Cancel</StyledButton>
                  <StyledButton loading={syncClassLoading} onClick={handleSyncGC} type={"primary"}>
                    Sync
                  </StyledButton>
                </div>
              </ButtonWrapper>
            }
          >
            <Input defaultValue={selectedClass.googleCode} ref={googleCode} disabled={disabled} />
          </GoogleClassSyncModal>
          <Header onEdit={handleEditClick} activeClass={selectedClass.active} />
          <Container>
            <BreadCrumb
              ellipsis="calc(100% - 200px)"
              data={breadCrumbData}
              style={{ position: "unset", margin: "10px 0px" }}
            />

            <MainInfo
              entity={selectedClass}
              fetchClassList={fetchClassList}
              viewAssessmentHandler={viewAssessmentHandler}
              isUserGoogleLoggedIn={isUserGoogleLoggedIn}
              allowGoogleLogin={allowGoogleLogin}
              syncGCModal={() => setOpenGCModal(true)}
              archiveClass={archiveClass}
            />

            <ActionContainer loadStudents={loadStudents} history={history} />

            <StudentsList selectStudent selectedClass={selectedClass} />
          </Container>
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
      allowGoogleLogin: get(state, "user.user.orgData.allowGoogleClassroom"),
      syncClassLoading: get(state, "manageClass.syncClassLoading"),
      dataLoaded: get(state, "manageClass.dataLoaded"),
      classLoaded: get(state, "manageClass.classLoaded")
    }),
    {
      syncClassUsingCode: syncClassUsingCodeAction,
      fetchClassList: fetchClassListAction,
      syncByCodeModal: syncByCodeModalAction,
      loadStudents: fetchStudentsByIdAction,
      archiveClass: archiveClassAction
    }
  )
);

export default enhance(ClassDetails);

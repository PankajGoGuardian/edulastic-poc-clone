import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import {
  fetchStudentsByIdAction,
  syncClassUsingCodeAction,
  fetchClassListAction,
  syncByCodeModalAction
} from "../../ducks";
import { Spin, Modal, Input, Button, message } from "antd";

import Header from "./Header";
import SubHeader from "./SubHeader";
import ActionContainer from "./ActionContainer";
import StudentsList from "./StudentsList";
import MainInfo from "./MainInfo";
import { Container, StyledDivider, ButtonWrapper, ButtonRightWrapper, StyledButton } from "./styled";
import { themeColorLight } from "@edulastic/colors";

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
  syncClassUsingCode
}) => {
  const [disabled, setDisabled] = useState(selectedClass && !!selectedClass.googleCode);
  let googleCode = React.createRef();
  const [openGCModal, setOpenGCModal] = useState(false);
  useEffect(() => {
    if (!fetchClassListLoading) setOpenGCModal(true);
  }, [fetchClassListLoading]);

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
      syncClassUsingCode({ googleCode, groupId: selectedClass._id });
    } else {
      message.error("Enter valid google classroom code");
    }
  };

  const viewAssessmentHandler = () => {};
  if (!classLoaded) return <Spin />;
  return (
    <>
      <Modal
        visible={openGCModal}
        onCancel={() => setOpenGCModal(false)}
        title="Enter Google Classroom Code"
        footer={
          <ButtonWrapper>
            <StyledButton shape={"round"} onClick={() => setDisabled(false)}>
              {" "}
              Change Classroom
            </StyledButton>
            <ButtonRightWrapper>
              <StyledButton shape={"round"} onClick={() => setOpenGCModal(false)}>
                {" "}
                Cancel
              </StyledButton>
              <StyledButton
                style={{ "background-color": themeColorLight, "border-color": themeColorLight }}
                shape={"round"}
                loading={syncClassLoading}
                onClick={handleSyncGC}
                type={"primary"}
              >
                {" "}
                Sync
              </StyledButton>
            </ButtonRightWrapper>
          </ButtonWrapper>
        }
      >
        <Input defaultValue={selectedClass.googleCode} ref={googleCode} disabled={disabled} />
      </Modal>
      <Header onEdit={handleEditClick} />
      <Container>
        <SubHeader
          {...selectedClass}
          fetchClassList={fetchClassList}
          viewAssessmentHandler={viewAssessmentHandler}
          isUserGoogleLoggedIn={isUserGoogleLoggedIn}
          allowGoogleLogin={allowGoogleLogin}
          syncGCModal={() => setOpenGCModal(true)}
        />
        <StyledDivider orientation="left" />
        <MainInfo entity={selectedClass} />

        <ActionContainer loadStudents={loadStudents} />

        <StudentsList selectStudent groupId={selectedClass._id} />
      </Container>
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
      loadStudents: fetchStudentsByIdAction
    }
  )
);

export default enhance(ClassDetails);

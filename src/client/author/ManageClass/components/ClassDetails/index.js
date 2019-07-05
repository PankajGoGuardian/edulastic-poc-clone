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
  syncByCodeModal,
  history,
  allowGoogleLogin,
  openGCModal,
  match,
  syncClassUsingCode
}) => {
  const [googleCode, setGoogleCode] = useState((selectedClass && selectedClass.googleCode) || "");
  const [disabled, setDisabled] = useState(selectedClass && !!selectedClass.googleCode);
  useEffect(() => {
    setGoogleCode((selectedClass && selectedClass.googleCode) || "");
    setDisabled(selectedClass && !!selectedClass.googleCode);
  }, [selectedClass]);

  useEffect(() => {
    if (isEmpty(selectedClass)) {
      const { classId } = match.params;
      loadStudents({ classId });
    }
  }, []);

  const handleEditClick = () => {
    const classId = selectedClass._id || match.params.classId;
    history.push(`/author/manageClass/${classId}/edit`);
  };

  const handleSyncGC = () => {
    if (googleCode) {
      syncClassUsingCode({ googleCode, groupId: selectedClass._id });
    } else {
      message.error("Enter valid google classroom code");
    }
  };

  const viewAssessmentHandler = () => {};
  if (!dataLoaded) return <Spin />;
  return (
    <>
      <Modal
        visible={openGCModal}
        onCancel={() => syncByCodeModal(false)}
        title="Enter Google Classroom Code"
        footer={
          <ButtonWrapper>
            <StyledButton shape={"round"} onClick={() => setDisabled(false)}>
              {" "}
              Change Classroom
            </StyledButton>
            <ButtonRightWrapper>
              <StyledButton shape={"round"} onClick={() => syncByCodeModal(false)}>
                {" "}
                Cancel
              </StyledButton>
              <StyledButton
                style={{ "background-color": themeColorLight, "border-color": themeColorLight }}
                shape={"round"}
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
        <Input value={googleCode} disabled={disabled} onChange={e => setGoogleCode(e.target.value)} />
      </Modal>
      <Header onEdit={handleEditClick} />
      <Container>
        <SubHeader
          {...selectedClass}
          fetchClassList={fetchClassList}
          viewAssessmentHandler={viewAssessmentHandler}
          isUserGoogleLoggedIn={isUserGoogleLoggedIn}
          allowGoogleLogin={allowGoogleLogin}
          syncGCModal={() => syncByCodeModal(true)}
        />
        <StyledDivider orientation="left" />
        <MainInfo entity={selectedClass} />

        <ActionContainer loadStudents={loadStudents} />

        <StudentsList />
      </Container>
    </>
  );
};

ClassDetails.propTypes = {
  selectedClass: PropTypes.object.isRequired,
  loadStudents: PropTypes.func.isRequired,
  dataLoaded: PropTypes.bool.isRequired
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      selectedClass: get(state, "manageClass.entity"),
      openGCModal: get(state, "manageClass.openGCModal", false),
      isUserGoogleLoggedIn: get(state, "user.user.isUserGoogleLoggedIn", false),
      allowGoogleLogin: get(state, "user.user.orgData.allowGoogleClassroom"),
      dataLoaded: get(state, "manageClass.dataLoaded")
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

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { get } from "lodash";

import { fetchStudentsByIdAction } from "../../ducks";

import Header from "./Header";
import SubHeader from "./SubHeader";
import ActionContainer from "./ActionContainer";
import StudentsList from "./StudentsList";
import MainInfo from "./MainInfo";
import { Container, StyledDivider } from "./styled";

const ClassDetails = ({ selctedClass, updateView, loadStudents }) => {
  if (loadStudents) {
    const { _id: classId } = selctedClass;
    loadStudents({ classId });
  }

  const handleEditeClick = () => {
    if (updateView) {
      updateView("update");
    }
  };

  const printPreview = () => {
    if (updateView) {
      updateView("printview");
    }
  };

  const viewAssessmentHandler = () => {};
  return (
    <>
      <Header onEdit={handleEditeClick} />
      <Container>
        <SubHeader {...selctedClass} viewAssessmentHandler={viewAssessmentHandler} backToView={() => updateView("")} />
        <StyledDivider orientation="left" />
        <MainInfo entity={selctedClass} />
        <ActionContainer printPreview={printPreview} />
        <StudentsList selectStudent />
      </Container>
    </>
  );
};

ClassDetails.propTypes = {
  selctedClass: PropTypes.object.isRequired,
  updateView: PropTypes.func.isRequired,
  loadStudents: PropTypes.func.isRequired
};

export default connect(
  state => ({
    selctedClass: get(state, "manageClass.entity")
  }),
  {
    loadStudents: fetchStudentsByIdAction
  }
)(ClassDetails);

import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { get } from "lodash";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { fetchStudentsByIdAction } from "../../ducks";

import Header from "./Header";
import SubHeader from "./SubHeader";
import ActionContainer from "./ActionContainer";
import StudentsList from "./StudentsList";
import MainInfo from "./MainInfo";
import { Container, StyledDivider } from "./styled";

const ClassDetails = ({ selctedClass, changeView, loadStudents, history }) => {
  const { _id: classId } = selctedClass;
  if (loadStudents) {
    loadStudents({ classId });
  }

  const handleEditClick = () => {
    history.push(`/author/manageClass/${classId}/edit`);
  };

  const printPreview = () => {
    if (changeView) {
      changeView("printview");
    }
  };

  const viewAssessmentHandler = () => {};
  return (
    <>
      <Header onEdit={handleEditClick} />
      <Container>
        <SubHeader
          {...selctedClass}
          viewAssessmentHandler={viewAssessmentHandler}
          backToView={() => history.push(`/author/manageClass`)}
        />
        <StyledDivider orientation="left" />
        <MainInfo entity={selctedClass} />

        <ActionContainer printPreview={printPreview} loadStudents={loadStudents} />

        <StudentsList selectStudent />
      </Container>
    </>
  );
};

ClassDetails.propTypes = {
  selctedClass: PropTypes.object.isRequired,
  changeView: PropTypes.func.isRequired,
  loadStudents: PropTypes.func.isRequired
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      selctedClass: get(state, "manageClass.entity")
    }),
    {
      loadStudents: fetchStudentsByIdAction
    }
  )
);

export default enhance(ClassDetails);

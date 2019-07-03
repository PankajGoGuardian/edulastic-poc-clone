import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { fetchStudentsByIdAction } from "../../ducks";
import { Spin } from "antd";

import Header from "./Header";
import SubHeader from "./SubHeader";
import ActionContainer from "./ActionContainer";
import StudentsList from "./StudentsList";
import MainInfo from "./MainInfo";
import { Container, StyledDivider } from "./styled";

const ClassDetails = ({ selectedClass, dataLoaded, loadStudents, history, match }) => {
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

  const viewAssessmentHandler = () => {};
  if (!dataLoaded) return <Spin />;
  return (
    <>
      <Header onEdit={handleEditClick} />
      <Container>
        <SubHeader {...selectedClass} viewAssessmentHandler={viewAssessmentHandler} />
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
      dataLoaded: get(state, "manageClass.dataLoaded")
    }),
    {
      loadStudents: fetchStudentsByIdAction
    }
  )
);

export default enhance(ClassDetails);

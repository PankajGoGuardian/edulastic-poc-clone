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

const ClassDetails = ({ selctedClass, dataLoaded, loadStudents, history, match }) => {
  useEffect(() => {}, [selctedClass]);

  if (!dataLoaded && isEmpty(selctedClass)) {
    const { classId } = match.params;
    loadStudents({ classId });
  }

  const handleEditClick = () => {
    const classId = selctedClass._id || match.params.classId;
    history.push(`/author/manageClass/${classId}/edit`);
  };

  const viewAssessmentHandler = () => {};
  if (isEmpty(selctedClass)) return <Spin />;
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

        <ActionContainer loadStudents={loadStudents} />

        <StudentsList />
      </Container>
    </>
  );
};

ClassDetails.propTypes = {
  selctedClass: PropTypes.object.isRequired,
  loadStudents: PropTypes.func.isRequired
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      selctedClass: get(state, "manageClass.entity"),
      dataLoaded: get(state, "manageClass.dataLoaded")
    }),
    {
      loadStudents: fetchStudentsByIdAction
    }
  )
);

export default enhance(ClassDetails);

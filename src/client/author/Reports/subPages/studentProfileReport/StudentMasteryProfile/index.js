import React, { useEffect } from "react";
import { connect } from "react-redux";
import { StyledCard } from "../../../common/styled";
import {
  getReportsStudentMasteryProfile,
  getReportsStudentMasteryProfileLoader,
  getStudentMasteryProfileRequestAction
} from "./ducks";
import { getReportsStandardsBrowseStandards } from "../../standardsMasteryReport/common/filterDataDucks";

const StudentMasteryProfile = ({
  match,
  settings,
  studentMasteryProfile,
  browseStandards,
  getStudentMasteryProfileRequestAction
}) => {
  useEffect(() => {
    if (settings.selectedStudent.key) {
      const { requestFilters = {}, selectedStudent = {} } = settings;
      getStudentMasteryProfileRequestAction({
        ...requestFilters,
        studentId: selectedStudent.key
      });
    }
  }, [settings]);

  return <StyledCard />;
};

const enhance = connect(
  state => ({
    studentMasteryProfile: getReportsStudentMasteryProfile(state),
    browseStandards: getReportsStandardsBrowseStandards(state),
    loading: getReportsStudentMasteryProfileLoader(state)
  }),
  {
    getStudentMasteryProfileRequestAction
  }
);

export default enhance(StudentMasteryProfile);

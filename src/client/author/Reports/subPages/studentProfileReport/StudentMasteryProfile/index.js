import React, { useEffect } from "react";
import { connect } from "react-redux";
import { get } from "lodash";
import { StyledCard } from "../../../common/styled";
import {
  getReportsStudentMasteryProfile,
  getReportsStudentMasteryProfileLoader,
  getStudentMasteryProfileRequestAction
} from "./ducks";

import { getDomains } from "./utils/transformers";

const StudentMasteryProfile = ({ match, settings, studentMasteryProfile, getStudentMasteryProfileRequestAction }) => {
  const { metricInfo = [], studInfo = [], skillInfo = [] } = get(studentMasteryProfile, "data.result", {});

  const studentDomains = getDomains(metricInfo, skillInfo);

  useEffect(() => {
    const { selectedStudent, requestFilters } = settings;
    if (selectedStudent.key && requestFilters.termId) {
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
    loading: getReportsStudentMasteryProfileLoader(state)
  }),
  {
    getStudentMasteryProfileRequestAction
  }
);

export default enhance(StudentMasteryProfile);

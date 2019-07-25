import React, { useEffect } from "react";
import { connect } from "react-redux";
import { get } from "lodash";
import { StyledCard } from "../../../common/styled";
import {
  getReportsStudentMasteryProfile,
  getReportsStudentMasteryProfileLoader,
  getStudentMasteryProfileRequestAction
} from "./ducks";
import { getReportsStandardsBrowseStandards } from "../../standardsMasteryReport/common/filterDataDucks";

import { getDomains } from "./utils/transformers";

const StudentMasteryProfile = ({
  match,
  settings,
  studentMasteryProfile,
  browseStandards,
  getStudentMasteryProfileRequestAction
}) => {
  const rawDomainData = get(browseStandards, "data.result", []);
  const { metricInfo = [], studInfo = [] } = get(studentMasteryProfile, "data.result", {});

  const studentDomains = getDomains(metricInfo, rawDomainData);

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
    browseStandards: getReportsStandardsBrowseStandards(state),
    loading: getReportsStudentMasteryProfileLoader(state)
  }),
  {
    getStudentMasteryProfileRequestAction
  }
);

export default enhance(StudentMasteryProfile);

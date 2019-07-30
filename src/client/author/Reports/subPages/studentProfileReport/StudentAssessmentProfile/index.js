import React, { useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { get, includes, filter } from "lodash";
import { StyledCard, StyledH3 } from "../../../common/styled";
import AssessmentTable from "./common/components/table/AssessmentTable";
import AssessmentChart from "./common/components/chart/AssessmentChart";
import { getReportsSPRFilterData } from "../common/filterDataDucks";
import {
  getReportsStudentAssessmentProfile,
  getReportsStudentAssessmentProfileLoader,
  getStudentAssessmentProfileRequestAction
} from "./ducks";
import { getData } from "./common/utils/transformers";
import { toggleItem } from "../../../common/util";
import { Placeholder } from "../../../common/components/loader";

const StudentAssessmentProfile = ({
  match,
  loading,
  settings,
  SARFilterData,
  studentAssessmentProfile,
  getStudentAssessmentProfileRequestAction
}) => {
  const { selectedStudent } = settings;

  const [selectedTests, setSelectedTests] = useState([]);

  const rawData = get(studentAssessmentProfile, "data.result", {});
  const { bandInfo = [] } = get(SARFilterData, "data.result", {});
  const data = useMemo(() => getData(rawData, bandInfo), [rawData, bandInfo]);

  const tableData = filter(data, test => {
    return selectedTests.length ? includes(selectedTests, test.uniqId) : true;
  });

  useEffect(() => {
    const { selectedStudent, requestFilters } = settings;
    if (selectedStudent.key && requestFilters.termId) {
      getStudentAssessmentProfileRequestAction({
        ...requestFilters,
        studentId: selectedStudent.key
      });
    }
  }, [settings]);

  const onTestSelect = item => setSelectedTests(toggleItem(selectedTests, item.uniqId));

  if (loading) {
    return (
      <>
        <Placeholder />
        <Placeholder />
      </>
    );
  }

  return (
    <>
      <StyledCard>
        <StyledH3>Assessment Performance Details of {selectedStudent.title}</StyledH3>
        <AssessmentChart
          data={data}
          selectedTests={selectedTests}
          onBarClickCB={onTestSelect}
          onResetClickCB={() => setSelectedTests([])}
        />
      </StyledCard>
      <StyledCard>
        <AssessmentTable data={tableData} studentName={selectedStudent.title} />
      </StyledCard>
    </>
  );
};

const enhance = connect(
  state => ({
    studentAssessmentProfile: getReportsStudentAssessmentProfile(state),
    loading: getReportsStudentAssessmentProfileLoader(state),
    SARFilterData: getReportsSPRFilterData(state)
  }),
  {
    getStudentAssessmentProfileRequestAction
  }
);

export default enhance(StudentAssessmentProfile);

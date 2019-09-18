import React, { useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { get, includes, filter } from "lodash";
import { StyledCard, StyledH3 } from "../../../common/styled";
import AssessmentTable from "./common/components/table/AssessmentTable";
import AssessmentChart from "../common/components/charts/AssessmentChart";
import { getReportsSPRFilterData, getBandInfoSelected } from "../common/filterDataDucks";
import {
  getReportsStudentAssessmentProfile,
  getReportsStudentAssessmentProfileLoader,
  getStudentAssessmentProfileRequestAction
} from "./ducks";
import { getCsvDownloadingState } from "../../../ducks";
import { getData } from "./common/utils/transformers";
import { augementAssessmentChartData } from "../common/utils/transformers";
import { toggleItem, downloadCSV } from "../../../common/util";
import { Placeholder } from "../../../common/components/loader";

const StudentAssessmentProfile = ({
  match,
  loading,
  settings,
  SARFilterData,
  studentAssessmentProfile,
  getStudentAssessmentProfileRequestAction,
  isCsvDownloading,
  bandInfoSelected: bandInfo
}) => {
  const { selectedStudent } = settings;

  const [selectedTests, setSelectedTests] = useState([]);

  const rawData = get(studentAssessmentProfile, "data.result", {});

  const [chartData, tableData] = useMemo(() => {
    const chartData = augementAssessmentChartData(rawData.metricInfo, bandInfo);
    const tableData = getData(rawData, chartData, bandInfo);
    return [chartData, tableData];
  }, [rawData, bandInfo]);

  useEffect(() => {
    const { selectedStudent, requestFilters } = settings;
    if (selectedStudent.key && requestFilters.termId) {
      getStudentAssessmentProfileRequestAction({
        ...requestFilters,
        studentId: selectedStudent.key
      });
    }
  }, [settings]);

  const title = get(settings, "selectedStudent.title", "");

  const onTestSelect = item => setSelectedTests(toggleItem(selectedTests, item.uniqId));
  const onCsvConvert = data => downloadCSV(`Assessment Performance Report-${title}.csv`, data);

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
        <StyledH3>Assessment Performance Details of {title}</StyledH3>
        <AssessmentChart
          data={chartData}
          selectedTests={selectedTests}
          onBarClickCB={onTestSelect}
          onResetClickCB={() => setSelectedTests([])}
        />
      </StyledCard>
      <StyledCard>
        <AssessmentTable
          onCsvConvert={onCsvConvert}
          isCsvDownloading={isCsvDownloading}
          data={tableData}
          studentName={title}
          selectedTests={selectedTests}
        />
      </StyledCard>
    </>
  );
};

const enhance = connect(
  state => ({
    studentAssessmentProfile: getReportsStudentAssessmentProfile(state),
    loading: getReportsStudentAssessmentProfileLoader(state),
    SARFilterData: getReportsSPRFilterData(state),
    isCsvDownloading: getCsvDownloadingState(state),
    bandInfoSelected: getBandInfoSelected(state)
  }),
  {
    getStudentAssessmentProfileRequestAction
  }
);

export default enhance(StudentAssessmentProfile);

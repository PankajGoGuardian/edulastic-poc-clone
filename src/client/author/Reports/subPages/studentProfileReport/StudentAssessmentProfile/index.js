import { SpinLoader } from "@edulastic/common";
import { get, isEmpty } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { NoDataContainer, StyledCard, StyledH3 } from "../../../common/styled";
import { downloadCSV, toggleItem } from "../../../common/util";
import { getCsvDownloadingState } from "../../../ducks";
import AssessmentChart from "../common/components/charts/AssessmentChart";
import { getBandInfoSelected, getReportsSPRFilterData } from "../common/filterDataDucks";
import { augementAssessmentChartData, getStudentName } from "../common/utils/transformers";
import AssessmentTable from "./common/components/table/AssessmentTable";
import { getData } from "./common/utils/transformers";
import {
  getReportsStudentAssessmentProfile,
  getReportsStudentAssessmentProfileLoader,
  getStudentAssessmentProfileRequestAction
} from "./ducks";

const StudentAssessmentProfile = ({
  match,
  loading,
  settings,
  SPRFilterData,
  studentAssessmentProfile,
  getStudentAssessmentProfileRequestAction,
  isCsvDownloading,
  bandInfoSelected: bandInfo,
  location,
  pageTitle,
  history
}) => {
  const { selectedStudent } = settings;

  const studentClassData = SPRFilterData?.data?.result?.studentClassData || [];

  const [selectedTests, setSelectedTests] = useState([]);

  const rawData = get(studentAssessmentProfile, "data.result", {});

  const [chartData, tableData] = useMemo(() => {
    const chartData = augementAssessmentChartData(rawData.metricInfo, bandInfo, studentClassData);
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

  const { districtAvg = [], groupAvg = [], metricInfo = [], schoolAvg = [] } = rawData;
  const studentInformation = studentClassData[0] || {};
  const studentName = getStudentName(selectedStudent, studentInformation);

  const onTestSelect = (item, record) => setSelectedTests(toggleItem(selectedTests, item.uniqId));
  const onCsvConvert = data => downloadCSV(`Assessment Performance Report-${studentName}.csv`, data);

  if (loading) {
    return <SpinLoader position="fixed" />;
  }

  if (
    isEmpty(rawData) ||
    !rawData ||
    isEmpty(districtAvg) ||
    isEmpty(groupAvg) ||
    isEmpty(metricInfo) ||
    isEmpty(schoolAvg)
  ) {
    return <NoDataContainer>No data available currently.</NoDataContainer>;
  }

  return (
    <>
      <StyledCard>
        <StyledH3>Assessment Performance Details of {studentName}</StyledH3>
        <p>
          <b>Subject : {studentInformation.standardSet || "N/A"}</b>
        </p>
        <AssessmentChart
          data={chartData}
          selectedTests={selectedTests}
          onBarClickCB={onTestSelect}
          onResetClickCB={() => setSelectedTests([])}
          studentInformation={studentInformation}
        />
      </StyledCard>
      <StyledCard>
        <AssessmentTable
          onCsvConvert={onCsvConvert}
          isCsvDownloading={isCsvDownloading}
          data={tableData}
          studentName={studentName}
          selectedTests={selectedTests}
          location={location}
          pageTitle={pageTitle}
        />
      </StyledCard>
    </>
  );
};

const enhance = connect(
  state => ({
    studentAssessmentProfile: getReportsStudentAssessmentProfile(state),
    loading: getReportsStudentAssessmentProfileLoader(state),
    SPRFilterData: getReportsSPRFilterData(state),
    isCsvDownloading: getCsvDownloadingState(state),
    bandInfoSelected: getBandInfoSelected(state)
  }),
  {
    getStudentAssessmentProfileRequestAction
  }
);

export default enhance(StudentAssessmentProfile);

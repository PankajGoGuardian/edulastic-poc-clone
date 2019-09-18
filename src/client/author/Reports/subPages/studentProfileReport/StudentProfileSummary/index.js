import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { get } from "lodash";
import { StyledCard, StyledH3 } from "../../../common/styled";
import { Row, Col, Icon } from "antd";
import { getReportsSPRFilterData, getBandInfoSelected } from "../common/filterDataDucks";
import {
  getReportsStudentProfileSummary,
  getReportsStudentProfileSummaryLoader,
  getStudentProfileSummaryRequestAction
} from "./ducks";
import { getCsvDownloadingState } from "../../../ducks";
import { Placeholder } from "../../../common/components/loader";
import { augementAssessmentChartData, augmentStandardMetaInfo } from "../common/utils/transformers";
import { augmentDomainStandardMasteryData } from "./common/utils/transformers";
import { downloadCSV } from "../../../common/util";
import { useGetStudentMasteryData } from "../common/hooks";
import AssessmentChart from "../common/components/charts/AssessmentChart";
import StudentPerformancePie from "../common/components/charts/StudentPerformancePie";
import StandardMasteryDetailsTable from "./common/components/table/StandardMasteryDetailsTable";
import BarTooltipRow from "../../../common/components/tooltip/BarTooltipRow";
import { getGrades } from "../common/utils/transformers";

const getTooltip = payload => {
  if (payload && payload.length) {
    const { masteryName = "", percentage = 0, count = 0, totalCount = 0 } = payload[0].payload;
    return (
      <div>
        <BarTooltipRow title={`${masteryName} : `} value={`${percentage}%`} />
        <p>
          {count} out of {totalCount} standards are in {masteryName} State
        </p>
      </div>
    );
  }
  return false;
};

const StudentProfileSummary = ({
  match,
  loading,
  settings,
  isCsvDownloading,
  SPRFilterData,
  studentProfileSummary,
  getStudentProfileSummaryRequestAction,
  bandInfoSelected
}) => {
  const { selectedStudent } = settings;
  const bandInfo = bandInfoSelected;

  const { asessmentMetricInfo = [], studInfo = [], skillInfo = [], metricInfo = [] } = get(
    studentProfileSummary,
    "data.result",
    {}
  );
  const { scaleInfo = [], studentClassData = [] } = get(SPRFilterData, "data.result", {});
  const data = useMemo(() => augementAssessmentChartData(asessmentMetricInfo, bandInfo), [
    asessmentMetricInfo,
    bandInfo
  ]);
  const [standards, domains] = useGetStudentMasteryData(metricInfo, skillInfo, scaleInfo);
  const domainsWithMastery = augmentDomainStandardMasteryData(domains, scaleInfo);

  useEffect(() => {
    const { selectedStudent, requestFilters } = settings;
    if (selectedStudent.key && requestFilters.termId) {
      getStudentProfileSummaryRequestAction({
        ...requestFilters,
        studentId: selectedStudent.key
      });
    }
  }, [settings]);

  if (loading) {
    return (
      <>
        <Placeholder />
        <Placeholder />
      </>
    );
  }

  const studentInformation = studInfo[0] || {};
  const studentClassInfo = studentClassData[0] || {};
  const onCsvConvert = data =>
    downloadCSV(`Student Profile Report-${selectedStudent.title}-${studentInformation.subject}.csv`, data);

  return (
    <>
      <StyledCard>
        <Row>
          <Col xs={24} sm={24} md={2} lg={2} xl={2}>
            <StyledIcon type="user" />
          </Col>
          <Col xs={24} sm={24} md={3} lg={3} xl={3}>
            <p>
              <b>Name</b>: {selectedStudent.title}
            </p>
            <p>
              <b>Grade</b>: {getGrades(studentInformation.grades)}
            </p>
            <p>
              <b>School</b>: {studentInformation.school || "N/A"}
            </p>
            <p>
              <b>Subject</b>: {studentClassInfo.standardSet || "N/A"}
            </p>
          </Col>
          <Col xs={24} sm={24} md={19} lg={19} xl={19}>
            <AssessmentChart data={data} studentClassInfo={studentClassInfo} />
          </Col>
        </Row>
      </StyledCard>
      <StyledCard>
        <StyledH3>Standard Mastery Detail by Student</StyledH3>
        <Row>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <StudentPerformancePie data={standards} scaleInfo={scaleInfo} getTooltip={getTooltip} title="" />
          </Col>
          <Col xs={24} sm={24} md={16} lg={16} xl={16}>
            <StandardMasteryDetailsTable
              onCsvConvert={onCsvConvert}
              isCsvDownloading={isCsvDownloading}
              data={domainsWithMastery}
            />
          </Col>
        </Row>
      </StyledCard>
    </>
  );
};

const enhance = connect(
  state => ({
    studentProfileSummary: getReportsStudentProfileSummary(state),
    loading: getReportsStudentProfileSummaryLoader(state),
    SPRFilterData: getReportsSPRFilterData(state),
    isCsvDownloading: getCsvDownloadingState(state),
    bandInfoSelected: getBandInfoSelected(state)
  }),
  {
    getStudentProfileSummaryRequestAction
  }
);

export default enhance(StudentProfileSummary);

const StyledIcon = styled(Icon)`
  font-size: 80px;
`;

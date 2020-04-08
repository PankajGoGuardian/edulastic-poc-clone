import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash";
import { StyledCard, StyledH3, NoDataContainer } from "../../../common/styled";
import { Row, Col, Icon } from "antd";
import {
  getReportsSPRFilterData,
  getBandInfoSelected,
  getSelectedStandardProficiency
} from "../common/filterDataDucks";
import {
  getReportsStudentProfileSummary,
  getReportsStudentProfileSummaryLoader,
  getStudentProfileSummaryRequestAction
} from "./ducks";
import { getCsvDownloadingState } from "../../../ducks";
import { Placeholder } from "../../../common/components/loader";
import { augementAssessmentChartData, getStudentName } from "../common/utils/transformers";
import { augmentDomainStandardMasteryData } from "./common/utils/transformers";
import { downloadCSV } from "../../../common/util";
import { useGetStudentMasteryData } from "../common/hooks";
import AssessmentChart from "../common/components/charts/AssessmentChart";
import StudentPerformancePie from "../common/components/charts/StudentPerformancePie";
import StandardMasteryDetailsTable from "./common/components/table/StandardMasteryDetailsTable";
import BarTooltipRow from "../../../common/components/tooltip/BarTooltipRow";
import { getGrades } from "../common/utils/transformers";
import { backgrounds, labelGrey, secondaryTextColor, smallDesktopWidth, tabletWidth } from "@edulastic/colors";

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
  bandInfoSelected,
  selectedStandardProficiency,
  location,
  pageTitle,
  history
}) => {
  const { selectedStudent } = settings;
  const bandInfo = bandInfoSelected;
  const scaleInfo = selectedStandardProficiency;

  const studentProfileSummaryData = get(studentProfileSummary, "data.result", {});

  const { asessmentMetricInfo = [], studInfo = [], skillInfo = [], metricInfo = [] } = studentProfileSummaryData;
  const { studentClassData = [] } = get(SPRFilterData, "data.result", {});
  const studentClassInfo = studentClassData[0] || {};
  const data = useMemo(() => augementAssessmentChartData(asessmentMetricInfo, bandInfo), [
    asessmentMetricInfo,
    bandInfo
  ]);
  const [standards, domains] = useGetStudentMasteryData(
    metricInfo,
    skillInfo,
    scaleInfo,
    studentClassInfo,
    asessmentMetricInfo
  );
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

  const _onBarClickCB = (key, args) => {
    history.push({
      pathname: `/author/classboard/${args.assignmentId}/${args.groupId}/test-activity/${args.testActivityId}`,
      state: { // this will be consumed in /src/client/author/Shared/Components/ClassBreadCrumb.js
        breadCrumb: [
          {
            title: "REPORTS",
            to: "/author/reports"
          },
          {
            title: pageTitle,
            to: `${location.pathname}${location.search}`
          }
        ]
      }
    })
  };

  if (loading) {
    return (
      <>
        <Placeholder />
        <Placeholder />
      </>
    );
  }

  if (
    isEmpty(studentProfileSummaryData) ||
    !studentProfileSummaryData ||
    isEmpty(asessmentMetricInfo) ||
    isEmpty(metricInfo) ||
    isEmpty(skillInfo)
  ) {
    return <NoDataContainer>No data available currently.</NoDataContainer>;
  }

  const studentInformation = studInfo[0] || {};

  const studentName = getStudentName(selectedStudent, studentInformation);

  const onCsvConvert = data =>
    downloadCSV(`Student Profile Report-${studentName}-${studentInformation.subject}.csv`, data);

  return (
    <>
      <StyledCard>
        <Row>
          <StyledCol xs={24} sm={24} md={6} lg={6} xl={5}>
            <IconContainer>
              <StyledIcon type="user" />
            </IconContainer>
            <StudentDetailsContainer>
              <span>NAME</span>
              <p>{studentName}</p>
              <span>GRADE</span>
              <p>{getGrades(studentInformation.grades)}</p>
              <span>SCHOOL</span>
              <p>{studentClassInfo.schoolName || "N/A"}</p>
              <span>SUBJECT</span>
              <p>{studentClassInfo.standardSet || "N/A"}</p>
            </StudentDetailsContainer>
          </StyledCol>
          <Col xs={24} sm={24} md={18} lg={18} xl={19}>
            <AssessmentChart data={data} studentInformation={studentClassInfo} xTickTooltipPosition={400} onBarClickCB={_onBarClickCB} isBarClickable />
          </Col>
        </Row>
      </StyledCard>
      <StyledCard>
        <StyledH3>Standard Mastery Detail by Student</StyledH3>
        <Row>
          <Col xs={24} sm={24} md={8} lg={11} xl={8}>
            <StudentPerformancePie data={standards} scaleInfo={scaleInfo} getTooltip={getTooltip} title="" />
          </Col>
          <Col xs={24} sm={24} md={16} lg={13} xl={16}>
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
    bandInfoSelected: getBandInfoSelected(state),
    selectedStandardProficiency: getSelectedStandardProficiency(state)
  }),
  {
    getStudentProfileSummaryRequestAction
  }
);

export default enhance(StudentProfileSummary);

const StyledIcon = styled(Icon)`
  font-size: 80px;
`;

const IconContainer = styled.div`
  width: 138px;
  height: 138px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 5px;
  background: white;
`;

const StudentDetailsContainer = styled.div`
  width: 251px;
  margin-top: 69px;
  background: ${backgrounds.default};
  border-radius: 10px;
  padding: 69px 10px 10px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  span {
    color: ${labelGrey};
    font-weight: bold;
  }
  p {
    color: ${secondaryTextColor};
    margin-bottom: 15px;
  }
  @media (max-width: ${smallDesktopWidth}) {
    width: 180px;
  }
  @media (max-width: ${tabletWidth}) {
    width: 95%;
  }
`;

const StyledCol = styled(Col)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 15px 46px;
  @media (max-width: ${smallDesktopWidth}) {
    padding: 15px 0px;
  }
`;

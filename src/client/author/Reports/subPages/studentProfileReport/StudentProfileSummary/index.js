import { backgrounds, labelGrey, secondaryTextColor } from "@edulastic/colors";
import { SpinLoader, FlexContainer } from "@edulastic/common";
import { Icon } from "antd";
import { get, isEmpty } from "lodash";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import React, { useEffect, useMemo } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import BarTooltipRow from "../../../common/components/tooltip/BarTooltipRow";
import { NoDataContainer, StyledCard, StyledH3 } from "../../../common/styled";
import { downloadCSV } from "../../../common/util";
import { getCsvDownloadingState } from "../../../ducks";
import AssessmentChart from "../common/components/charts/AssessmentChart";
import StudentPerformancePie from "../common/components/charts/StudentPerformancePie";
import {
  getBandInfoSelected,
  getReportsSPRFilterData,
  getSelectedStandardProficiency,
  getReportsSPRFilterLoadingState
} from "../common/filterDataDucks";
import { useGetStudentMasteryData } from "../common/hooks";
import { augementAssessmentChartData, getGrades, getStudentName } from "../common/utils/transformers";
import StandardMasteryDetailsTable from "./common/components/table/StandardMasteryDetailsTable";
import { augmentDomainStandardMasteryData } from "./common/utils/transformers";
import {
  getReportsStudentProfileSummary,
  getReportsStudentProfileSummaryLoader,
  getStudentProfileSummaryRequestAction
} from "./ducks";

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
  loading,
  settings,
  isCsvDownloading,
  SPRFilterData,
  studentProfileSummary,
  getStudentProfileSummaryRequest,
  bandInfoSelected,
  selectedStandardProficiency,
  location,
  pageTitle,
  history,
  t,
  reportsSPRFilterLoadingState
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
    const { selectedStudent: _selectedStudent, requestFilters } = settings;
    if (_selectedStudent.key && requestFilters.termId) {
      getStudentProfileSummaryRequest({
        ...requestFilters,
        studentId: _selectedStudent.key
      });
    }
  }, [settings]);

  const _onBarClickCB = (key, args) => {
    history.push({
      pathname: `/author/classboard/${args.assignmentId}/${args.groupId}/test-activity/${args.testActivityId}`,
      state: {
        // this will be consumed in /src/client/author/Shared/Components/ClassBreadCrumb.js
        breadCrumb: [
          {
            title: "INSIGHTS",
            to: "/author/reports"
          },
          {
            title: pageTitle,
            to: `${location.pathname}${location.search}`
          }
        ]
      }
    });
  };

  if (loading || reportsSPRFilterLoadingState) {
    return <SpinLoader position="fixed" />;
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
  const anonymousString = t("common.anonymous");

  const onCsvConvert = _data =>
    downloadCSV(`Student Profile Report-${studentName || anonymousString}-${studentInformation.subject}.csv`, _data);

  return (
    <>
      <FlexContainer marginBottom="20px" alignItems="stretch">
        <StudentDetailsCard width="280px" mr="20px">
          <IconContainer>
            <UserIconWrapper>
              <StyledIcon type="user" />
            </UserIconWrapper>
          </IconContainer>
          <StudentDetailsContainer>
            <span>NAME</span>
            <p>{studentName || anonymousString}</p>
            <span>GRADE</span>
            <p>{getGrades(studentInformation.grades)}</p>
            <span>SCHOOL</span>
            <p>{studentClassInfo.schoolName || "N/A"}</p>
            <span>SUBJECT</span>
            <p>{studentClassInfo.standardSet || "N/A"}</p>
          </StudentDetailsContainer>
        </StudentDetailsCard>
        <Card width="calc(100% - 300px)">
          <AssessmentChart
            data={data}
            studentInformation={studentClassInfo}
            xTickTooltipPosition={400}
            onBarClickCB={_onBarClickCB}
            isBarClickable
            printWidth={700}
          />
        </Card>
      </FlexContainer>
      <div>
        <StyledH3>Standard Mastery Detail by Student</StyledH3>
        <FlexContainer alignItems="stretch">
          <Card width="280px" mr="20px">
            <StudentPerformancePie data={standards} scaleInfo={scaleInfo} getTooltip={getTooltip} title="" />
          </Card>
          <Card width="calc(100% - 300px)">
            <StandardMasteryDetailsTable
              onCsvConvert={onCsvConvert}
              isCsvDownloading={isCsvDownloading}
              data={domainsWithMastery}
            />
          </Card>
        </FlexContainer>
      </div>
    </>
  );
};

const withConnect = connect(
  state => ({
    studentProfileSummary: getReportsStudentProfileSummary(state),
    loading: getReportsStudentProfileSummaryLoader(state),
    SPRFilterData: getReportsSPRFilterData(state),
    isCsvDownloading: getCsvDownloadingState(state),
    bandInfoSelected: getBandInfoSelected(state),
    selectedStandardProficiency: getSelectedStandardProficiency(state),
    reportsSPRFilterLoadingState: getReportsSPRFilterLoadingState(state)
  }),
  {
    getStudentProfileSummaryRequest: getStudentProfileSummaryRequestAction
  }
);

export default compose(
  withConnect,
  withNamespaces("student")
)(StudentProfileSummary);

const Card = styled(StyledCard)`
  width: ${({ width }) => width};
  margin-right: ${({ mr }) => mr};
`;

const StyledIcon = styled(Icon)`
  font-size: 80px;
`;

const IconContainer = styled.div`
  width: 100%;
  height: 90px;
  background: white;
  position: relative;
  border-radius: 10px 10px 0px 0px;
`;

const UserIconWrapper = styled.div`
  width: 138px;
  height: 138px;
  background: white;
  border-radius: 50%;
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StudentDetailsCard = styled(Card)`
  background: ${backgrounds.default};
  @media print {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }
`;

const StudentDetailsContainer = styled.div`
  width: 100%;
  border-radius: 10px;
  margin-top: 50px;
  padding: 10px;
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
`;

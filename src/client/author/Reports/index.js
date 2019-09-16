import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import { Row, Col } from "antd";

import { SingleAssessmentReportContainer } from "./subPages/singleAssessmentReport";
import { MultipleAssessmentReportContainer } from "./subPages/multipleAssessmentReport";
import { StandardsMasteryReportContainer } from "./subPages/standardsMasteryReport";
import { StudentProfileReportContainer } from "./subPages/studentProfileReport";

import { StyledContainer, StyledCard, PrintableScreen, StyledReportsContentContainer } from "./common/styled";

import { SingleAssessmentReport } from "./components/singleAssessmentReport";
import { StudentProfileReport } from "./components/studentProfileReport";
import { StandardsMasteryReport } from "./components/standardsMasteryReport";
import { MultipleAssessmentReport } from "./components/multipleAssessmentReport";
import { CustomizedHeaderWrapper } from "./common/components/header";

import navigation from "./common/static/json/navigation.json";
import FeaturesSwitch from "../../features/components/FeaturesSwitch";

import {
  getPrintingState,
  setPrintingStateAction,
  setCsvDownloadingStateAction,
  getCsvDownloadingState
} from "./ducks";

import { resetAssessmentSummaryAction } from "./subPages/singleAssessmentReport/AssessmentSummary/ducks";
import { resetPeerPerformanceAction } from "./subPages/singleAssessmentReport/PeerPerformance/ducks";
import { resetQuestionAnalysisAction } from "./subPages/singleAssessmentReport/QuestionAnalysis/ducks";
import { resetResponseFrequencyAction } from "./subPages/singleAssessmentReport/ResponseFrequency/ducks";
import { resetPerformanceByStandardsAction } from "./subPages/singleAssessmentReport/PerformanceByStandards/ducks";
import { resetPerformanceByStudentsAction } from "./subPages/singleAssessmentReport/PerformanceByStudents/ducks";

import { resetPeerProgressAnalysisAction } from "./subPages/multipleAssessmentReport/PeerProgressAnalysis/ducks";
import { resetPerformanceOverTimeAction } from "./subPages/multipleAssessmentReport/PerformanceOverTime/ducks";
import { resetStudentProgressAction } from "./subPages/multipleAssessmentReport/StudentProgress/ducks";

import { resetStandardsGradebookAction } from "./subPages/standardsMasteryReport/standardsGradebook/ducks";
import { resetStandardsPerformanceSummaryAction } from "./subPages/standardsMasteryReport/standardsPerformance/ducks";

import { resetStudentAssessmentProfileAction } from "./subPages/studentProfileReport/StudentAssessmentProfile/ducks";
import { resetStudentMasteryProfileAction } from "./subPages/studentProfileReport/StudentMasteryProfile/ducks";
import { resetStudentProfileSummaryAction } from "./subPages/studentProfileReport/StudentProfileSummary/ducks";

import { resetSARFiltersAction } from "./subPages/singleAssessmentReport/common/filterDataDucks";
import { resetMARFiltersAction } from "./subPages/multipleAssessmentReport/common/filterDataDucks";
import { resetSMRFiltersAction } from "./subPages/standardsMasteryReport/common/filterDataDucks";
import { resetSPRFiltersAction } from "./subPages/studentProfileReport/common/filterDataDucks";

const Container = props => {
  const [showFilter, setShowFilter] = useState(false);
  const [navigationItems, setNavigationItems] = useState([]);

  // -----|-----|-----|-----|-----| HEADER BUTTON EVENTS BEGIN |-----|-----|-----|-----|----- //

  const onShareClickCB = () => {
    console.log("not implemented yet");
  };

  const onPrintClickCB = () => {
    props.setPrintingStateAction(true);
  };

  const onDownloadCSVClickCB = () => {
    props.setCsvDownloadingStateAction(true);
  };

  const onRefineResultsCB = (event, status) => {
    setShowFilter(status);
  };

  useEffect(() => {
    if (props.isCsvDownloading) {
      props.setCsvDownloadingStateAction(false);
    }
  }, [props.isCsvDownloading]);

  useEffect(() => {
    if (props.isPrinting) {
      window.print();
      props.setPrintingStateAction(false);
    }
  }, [props.isPrinting]);

  // -----|-----|-----|-----|-----| HEADER BUTTON EVENTS ENDED |-----|-----|-----|-----|----- //

  const headerSettings = useMemo(() => {
    let loc = props.match.params.reportType;
    if (loc) {
      return {
        loc: loc,
        group: navigation.locToData[loc].group,
        title: navigation.locToData[loc].title,
        onShareClickCB: onShareClickCB,
        onPrintClickCB: onPrintClickCB,
        onDownloadCSVClickCB: onDownloadCSVClickCB,
        onRefineResultsCB: onRefineResultsCB,
        breadcrumbData: navigation.locToData[loc].breadcrumb,
        navigationItems
      };
    } else {
      return { title: "Reports" };
    }
  });

  const expandFilter = showFilter || props.isPrinting;

  return (
    <PrintableScreen>
      <CustomizedHeaderWrapper
        breadcrumbsData={headerSettings.breadcrumbData}
        title={headerSettings.title}
        onShareClickCB={headerSettings.onShareClickCB}
        onPrintClickCB={headerSettings.onPrintClickCB}
        onDownloadCSVClickCB={headerSettings.onDownloadCSVClickCB}
        onRefineResultsCB={headerSettings.onRefineResultsCB}
        navigationItems={headerSettings.navigationItems}
        activeNavigationKey={props.match.params.reportType}
      />
      <StyledReportsContentContainer>
        {!props.match.params.reportType ? <Route exact path={props.match.path} component={Reports} /> : null}
        <Route
          path={`/author/reports/assessment-summary/test/`}
          render={_props => (
            <SingleAssessmentReportContainer
              {..._props}
              showFilter={expandFilter}
              loc={props.match.params.reportType}
              updateNavigation={setNavigationItems}
            />
          )}
        />
        <Route
          path={`/author/reports/peer-performance/test/`}
          render={_props => (
            <SingleAssessmentReportContainer
              {..._props}
              showFilter={expandFilter}
              loc={props.match.params.reportType}
              updateNavigation={setNavigationItems}
            />
          )}
        />
        <Route
          path={`/author/reports/question-analysis/test/`}
          render={_props => (
            <SingleAssessmentReportContainer
              {..._props}
              showFilter={showFilter}
              loc={props.match.params.reportType}
              updateNavigation={setNavigationItems}
            />
          )}
        />
        <Route
          path={`/author/reports/response-frequency/test/`}
          render={_props => (
            <SingleAssessmentReportContainer
              {..._props}
              showFilter={expandFilter}
              loc={props.match.params.reportType}
              updateNavigation={setNavigationItems}
            />
          )}
        />
        <Route
          path={`/author/reports/performance-by-standards/test/`}
          render={_props => (
            <SingleAssessmentReportContainer
              {..._props}
              showFilter={expandFilter}
              loc={props.match.params.reportType}
              updateNavigation={setNavigationItems}
            />
          )}
        />
        <Route
          path={`/author/reports/performance-by-students/test/`}
          render={_props => (
            <SingleAssessmentReportContainer
              {..._props}
              showFilter={expandFilter}
              loc={props.match.params.reportType}
              updateNavigation={setNavigationItems}
            />
          )}
        />
        <Route
          path={`/author/reports/peer-progress-analysis`}
          render={_props => (
            <MultipleAssessmentReportContainer
              {..._props}
              showFilter={showFilter}
              loc={props.match.params.reportType}
              updateNavigation={setNavigationItems}
            />
          )}
        />
        <Route
          path={`/author/reports/student-progress`}
          render={_props => (
            <MultipleAssessmentReportContainer
              {..._props}
              showFilter={showFilter}
              loc={props.match.params.reportType}
              updateNavigation={setNavigationItems}
            />
          )}
        />
        <Route
          path={`/author/reports/performance-over-time`}
          render={_props => (
            <MultipleAssessmentReportContainer
              {..._props}
              showFilter={showFilter}
              loc={props.match.params.reportType}
              updateNavigation={setNavigationItems}
            />
          )}
        />
        <Route
          path={`/author/reports/standards-gradebook`}
          render={_props => (
            <StandardsMasteryReportContainer
              {..._props}
              showFilter={expandFilter}
              loc={props.match.params.reportType}
              updateNavigation={setNavigationItems}
            />
          )}
        />
        <Route
          path={`/author/reports/standards-performance-summary`}
          render={_props => (
            <StandardsMasteryReportContainer
              {..._props}
              showFilter={showFilter}
              loc={props.match.params.reportType}
              updateNavigation={setNavigationItems}
            />
          )}
        />
        <Route
          path={`/author/reports/student-mastery-profile/student/`}
          render={_props => (
            <StudentProfileReportContainer
              {..._props}
              showFilter={showFilter}
              loc={props.match.params.reportType}
              updateNavigation={setNavigationItems}
            />
          )}
        />
        <Route
          path={`/author/reports/student-assessment-profile/student/`}
          render={_props => (
            <StudentProfileReportContainer
              {..._props}
              showFilter={showFilter}
              loc={props.match.params.reportType}
              updateNavigation={setNavigationItems}
            />
          )}
        />
        <Route
          path={`/author/reports/student-profile-summary/student/`}
          render={_props => (
            <StudentProfileReportContainer
              {..._props}
              showFilter={showFilter}
              loc={props.match.params.reportType}
              updateNavigation={setNavigationItems}
            />
          )}
        />
      </StyledReportsContentContainer>
    </PrintableScreen>
  );
};

const Reports = connect(
  state => {},
  {
    resetSARFiltersAction,
    resetSPRFiltersAction,
    resetMARFiltersAction,
    resetSMRFiltersAction,
    resetAssessmentSummaryAction,
    resetPeerPerformanceAction,
    resetQuestionAnalysisAction,
    resetResponseFrequencyAction,
    resetPerformanceByStandardsAction,
    resetPerformanceByStudentsAction,
    resetStudentAssessmentProfileAction,
    resetStudentMasteryProfileAction,
    resetStudentProfileSummaryAction,
    resetPeerProgressAnalysisAction,
    resetPerformanceOverTimeAction,
    resetStudentProgressAction,
    resetSMRFiltersAction,
    resetStandardsGradebookAction,
    resetStandardsPerformanceSummaryAction
  }
)(props => {
  const onLinkClick = reportType => {
    debugger;
    console.log("reportType", reportType);
    if (reportType === "singleAssessmentReport") {
      console.log("reportType", reportType);
      // console.log("props.resetSARFiltersAction", props.resetSARFiltersAction());
      props.resetSARFiltersAction();
      // props.resetAssessmentSummaryAction();
      // props.resetPeerPerformanceAction();
      // props.resetQuestionAnalysisAction();
      // props.resetResponseFrequencyAction();
      // props.resetPerformanceByStandardsAction();
      // props.resetPerformanceByStudentsAction();
    } else if (reportType === "studentProfileReport") {
      console.log("reportType", reportType);
      props.resetSPRFiltersAction();
      // props.resetStudentAssessmentProfileAction();
      // props.resetStudentMasteryProfileAction();
      // props.resetStudentProfileSummaryAction();
    } else if (reportType === "multipleAssessmentReport") {
      console.log("reportType", reportType);
      props.resetMARFiltersAction();
      // props.resetPeerProgressAnalysisAction();
      // props.resetPerformanceOverTimeAction();
      // props.resetStudentProgressAction();
    } else if (reportType === "standardsMasteryReport") {
      console.log("reportType", reportType);
      props.resetSMRFiltersAction();
      // props.resetStandardsGradebookAction();
      // props.resetStandardsPerformanceSummaryAction();
    }
  };

  return (
    <StyledContainer>
      <Row gutter={20}>
        <FeaturesSwitch
          inputFeatures={["singleAssessmentReport", "studentProfileReport"]}
          operation="OR"
          actionOnInaccessible="hidden"
        >
          <Col md={12} xs={24}>
            <FeaturesSwitch inputFeatures="singleAssessmentReport" actionOnInaccessible="hidden">
              <StyledCard margin="0px 0px 20px" className="single-assessment-reports report">
                <SingleAssessmentReport onClickCB={onLinkClick} />
              </StyledCard>
            </FeaturesSwitch>
            <FeaturesSwitch inputFeatures="studentProfileReport" actionOnInaccessible="hidden">
              <StyledCard margin="0px 0px 20px" className="student-profile-reports report">
                <StudentProfileReport onClickCB={onLinkClick} />
              </StyledCard>
            </FeaturesSwitch>
          </Col>
        </FeaturesSwitch>
        <Col md={12} xs={24}>
          <FeaturesSwitch inputFeatures="multipleAssessmentReport" actionOnInaccessible="hidden">
            <StyledCard margin="0px 0px 20px" className="multiple-assessment-reports report">
              <MultipleAssessmentReport onClickCB={onLinkClick} />
            </StyledCard>
          </FeaturesSwitch>
          <StyledCard margin="0px 0px 20px" className="standards-mastery-reports report">
            <StandardsMasteryReport onClickCB={onLinkClick} />
          </StyledCard>
        </Col>
      </Row>
    </StyledContainer>
  );
});

const enhance = connect(
  state => ({
    isPrinting: getPrintingState(state),
    isCsvDownloading: getCsvDownloadingState(state)
  }),
  {
    setPrintingStateAction,
    setCsvDownloadingStateAction
  }
)(Container);

export default enhance;

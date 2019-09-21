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
          path={[
            `/author/reports/assessment-summary/test/`,
            `/author/reports/peer-performance/test/`,
            `/author/reports/question-analysis/test/`,
            `/author/reports/response-frequency/test/`,
            `/author/reports/performance-by-standards/test/`,
            `/author/reports/performance-by-students/test/`
          ]}
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
          path={[
            `/author/reports/peer-progress-analysis`,
            `/author/reports/student-progress`,
            `/author/reports/performance-over-time`
          ]}
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
          path={[`/author/reports/standards-gradebook`, `/author/reports/standards-performance-summary`]}
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
          path={[
            `/author/reports/student-mastery-profile/student/`,
            `/author/reports/student-assessment-profile/student/`,
            `/author/reports/student-profile-summary/student/`
          ]}
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
  {}
)(props => {
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
                <SingleAssessmentReport />
              </StyledCard>
            </FeaturesSwitch>
            <FeaturesSwitch inputFeatures="studentProfileReport" actionOnInaccessible="hidden">
              <StyledCard margin="0px 0px 20px" className="student-profile-reports report">
                <StudentProfileReport />
              </StyledCard>
            </FeaturesSwitch>
          </Col>
        </FeaturesSwitch>
        <Col md={12} xs={24}>
          <FeaturesSwitch inputFeatures="multipleAssessmentReport" actionOnInaccessible="hidden">
            <StyledCard margin="0px 0px 20px" className="multiple-assessment-reports report">
              <MultipleAssessmentReport />
            </StyledCard>
          </FeaturesSwitch>
          <StyledCard margin="0px 0px 20px" className="standards-mastery-reports report">
            <StandardsMasteryReport />
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

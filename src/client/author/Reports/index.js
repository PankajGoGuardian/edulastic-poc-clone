import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { Row, Col } from "antd";
import next from "immer";

import { SingleAssessmentReportContainer } from "./subPages/singleAssessmentReport";
import { MultipleAssessmentReportContainer } from "./subPages/multipleAssessmentReport";
import { StandardsMasteryReportContainer } from "./subPages/standardsMasteryReport";

import { StyledContainer, StyledCard, PrintableScreen } from "./common/styled";

import { SingleAssessmentReport } from "./components/singleAssessmentReport";
import { StudentProfileReport } from "./components/studentProfileReport";
import { StandardsMasteryReport } from "./components/standardsMasteryReport";
import { MultipleAssessmentReport } from "./components/multipleAssessmentReport";
import { CustomizedHeaderWrapper } from "./common/components/header";

import navigation from "./common/static/json/navigation.json";
import FeaturesSwitch from "../../features/components/FeaturesSwitch";

import { getPrintingState, setPrintingStateAction } from "./ducks";

const Container = props => {
  const [showFilter, setShowFilter] = useState(false);

  // -----|-----|-----|-----|-----| HEADER BUTTON EVENTS BEGIN |-----|-----|-----|-----|----- //

  const onShareClickCB = () => {
    console.log("not implemented yet");
  };

  const onPrintClickCB = () => {
    props.setPrintingStateAction(true);
  };

  const onDownloadCSVClickCB = () => {
    console.log("not implemented yet");
  };

  const onRefineResultsCB = (event, status) => {
    setShowFilter(status);
  };

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
        breadcrumbData: navigation.locToData[loc].breadcrumb
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
      />
      {!props.match.params.reportType ? <Route exact path={props.match.path} component={Reports} /> : null}
      <Route
        path={`/author/reports/assessment-summary/test/`}
        render={_props => (
          <SingleAssessmentReportContainer {..._props} showFilter={expandFilter} loc={props.match.params.reportType} />
        )}
      />
      <Route
        path={`/author/reports/peer-performance/test/`}
        render={_props => (
          <SingleAssessmentReportContainer {..._props} showFilter={expandFilter} loc={props.match.params.reportType} />
        )}
      />
      <Route
        path={`/author/reports/question-analysis/test/`}
        render={_props => (
          <SingleAssessmentReportContainer {..._props} showFilter={showFilter} loc={props.match.params.reportType} />
        )}
      />
      <Route
        path={`/author/reports/response-frequency/test/`}
        render={_props => (
          <SingleAssessmentReportContainer {..._props} showFilter={expandFilter} loc={props.match.params.reportType} />
        )}
      />
      <Route
        path={`/author/reports/performance-by-standards/test/`}
        render={_props => (
          <SingleAssessmentReportContainer {..._props} showFilter={expandFilter} loc={props.match.params.reportType} />
        )}
      />
      <Route
        path={`/author/reports/performance-by-students/test/`}
        render={_props => (
          <SingleAssessmentReportContainer {..._props} showFilter={expandFilter} loc={props.match.params.reportType} />
        )}
      />
      <Route
        path={`/author/reports/peer-progress-analysis/test/`}
        render={_props => (
          <MultipleAssessmentReportContainer {..._props} showFilter={showFilter} loc={props.match.params.reportType} />
        )}
      />
      <Route
        path={`/author/reports/standards-gradebook`}
        render={_props => (
          <StandardsMasteryReportContainer {..._props} showFilter={expandFilter} loc={props.match.params.reportType} />
        )}
      />
      <Route
        path={`/author/reports/standards-performance-summary`}
        render={_props => (
          <StandardsMasteryReportContainer {..._props} showFilter={showFilter} loc={props.match.params.reportType} />
        )}
      />
    </PrintableScreen>
  );
};

const Reports = props => {
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
};

const enhance = connect(
  state => ({
    isPrinting: getPrintingState(state)
  }),
  {
    setPrintingStateAction
  }
)(Container);

export default enhance;

import React, { useState, useEffect, useMemo } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { Row, Col } from "antd";
import next from "immer";

import { SingleAssessmentReportContainer } from "./subPages/singleAssessmentReport";
import { StandardsMasteryReportContainer } from "./subPages/standardsMasteryReport";

import { StyledContainer, StyledCard } from "./common/styled";

import { SingleAssessmentReport } from "./components/singleAssessmentReport";
import { StudentProfileReport } from "./components/studentProfileReport";
import { StandardsMasteryReport } from "./components/standardsMasteryReport";
import { MultipleAssessmentReport } from "./components/multipleAssessmentReport";
import { CustomizedHeaderWrapper } from "./common/components/header";

import navigation from "./common/static/json/navigation.json";
import FeatureWrapper from "../../features/components/FeatureWrapper";
import FeaturesWrapper from "../../features/components/FeaturesWrapper";

const Container = props => {
  const [showFilter, setShowFilter] = useState(false);

  // -----|-----|-----|-----|-----| HEADER BUTTON EVENTS BEGIN |-----|-----|-----|-----|----- //

  const onShareClickCB = () => {
    console.log("not implemented yet");
  };

  const onPrintClickCB = () => {
    console.log("not implemented yet");
  };

  const onDownloadCSVClickCB = () => {
    console.log("not implemented yet");
  };

  const onRefineResultsCB = (event, status) => {
    setShowFilter(status);
  };

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

  return (
    <div>
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
          <SingleAssessmentReportContainer {..._props} showFilter={showFilter} loc={props.match.params.reportType} />
        )}
      />
      <Route
        path={`/author/reports/peer-performance/test/`}
        render={_props => (
          <SingleAssessmentReportContainer {..._props} showFilter={showFilter} loc={props.match.params.reportType} />
        )}
      />
      <Route
        path={`/author/reports/response-frequency/test/`}
        render={_props => (
          <SingleAssessmentReportContainer {..._props} showFilter={showFilter} loc={props.match.params.reportType} />
        )}
      />
      <Route
        path={`/author/reports/performance-by-standards/test/`}
        render={_props => (
          <SingleAssessmentReportContainer {..._props} showFilter={showFilter} loc={props.match.params.reportType} />
        )}
      />
      <Route
        path={`/author/reports/standards-gradebook`}
        render={_props => (
          <StandardsMasteryReportContainer {..._props} showFilter={showFilter} loc={props.match.params.reportType} />
        )}
      />
    </div>
  );
};

const Reports = props => {
  return (
    <StyledContainer>
      <Row gutter={20}>
        <FeaturesWrapper
          featuresArray={["singleAssessmentReport", "studentProfileReport"]}
          operation="OR"
          actionOnInaccessible="hidden"
        >
          <Col md={12} xs={24}>
            <FeatureWrapper feature="singleAssessmentReport" actionOnInaccessible="hidden">
              <StyledCard margin="0px 0px 20px" className="single-assessment-reports report">
                <SingleAssessmentReport />
              </StyledCard>
            </FeatureWrapper>
            <FeatureWrapper feature="studentProfileReport" actionOnInaccessible="hidden">
              <StyledCard margin="0px 0px 20px" className="student-profile-reports report">
                <StudentProfileReport />
              </StyledCard>
            </FeatureWrapper>
          </Col>
        </FeaturesWrapper>
        <Col md={12} xs={24}>
          <FeatureWrapper feature="multipleAssessmentReport" actionOnInaccessible="hidden">
            <StyledCard margin="0px 0px 20px" className="multiple-assessment-reports report">
              <MultipleAssessmentReport />
            </StyledCard>
          </FeatureWrapper>
          <StyledCard margin="0px 0px 20px" className="standards-mastery-reports report">
            <StandardsMasteryReport />
          </StyledCard>
        </Col>
      </Row>
    </StyledContainer>
  );
};

export default Container;

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

import { getLoc } from "./common/util";

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
    let loc = getLoc(props.location.pathname);
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
      <Route exact path={props.match.path} component={Reports} />
      <Route
        path={`${props.match.path}assessment-summary/test/`}
        render={_props => <SingleAssessmentReportContainer {..._props} showFilter={showFilter} />}
      />
      <Route
        path={`${props.match.path}peer-performance/test/`}
        render={_props => <SingleAssessmentReportContainer {..._props} showFilter={showFilter} />}
      />
      <Route
        path={`${props.match.path}response-frequency/test/`}
        render={_props => <SingleAssessmentReportContainer {..._props} showFilter={showFilter} />}
      />
      <Route
        path={`${props.match.path}performance-by-standards/test/`}
        render={_props => <SingleAssessmentReportContainer {..._props} showFilter={showFilter} />}
      />
      <Route
        path={`${props.match.path}standards-gradebook`}
        render={_props => <StandardsMasteryReportContainer {..._props} showFilter={showFilter} />}
      />
    </div>
  );
};

const Reports = props => {
  return (
    <StyledContainer>
      <Row gutter={20}>
        <Col md={12} xs={24}>
          <StyledCard margin="0px 0px 20px" className="single-assessment-reports report">
            <SingleAssessmentReport />
          </StyledCard>
          <StyledCard margin="0px 0px 20px" className="student-profile-reports report">
            <StudentProfileReport />
          </StyledCard>
        </Col>
        <Col md={12} xs={24}>
          <StyledCard margin="0px 0px 20px" className="multiple-assessment-reports report">
            <MultipleAssessmentReport />
          </StyledCard>
          <StyledCard margin="0px 0px 20px" className="standards-mastery-reports report">
            <StandardsMasteryReport />
          </StyledCard>
        </Col>
      </Row>
    </StyledContainer>
  );
};

export default Container;

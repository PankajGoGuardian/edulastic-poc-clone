import React, { useState, useEffect } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";

import Breadcrumb from "../src/components/Breadcrumb";

import ResponseFrequency from "./subPages/ResponseFrequency";
import AssessmentSummary from "./subPages/AssessmentSummary";
import PeerPerformance from "./subPages/PeerPerformance";

// import { StyledContainer, StyledCard } from "./components/styled";
import { StyledContainer, StyledCard } from "./common/styled";
import { Row, Col } from "antd";

import { SingleAssessmentReport } from "./components/singleAssessmentReport";
import { CustomizedHeaderWrapper } from "./common/components/header";

import { getAssignmentsRequestAction, getReportsAssignments } from "./assignmentsDucks";

const locToTitle = {
  "assessment-summary": "Assessment Summary",
  "peer-performance": "Peer Performance",
  "response-frequency": "Response Frequency"
};

const locToBreadcrumb = {
  "assessment-summary": [
    {
      title: "REPORTS",
      to: "/author/reports"
    },
    {
      title: "ASSESSMENT SUMMARY"
    }
  ],
  "peer-performance": [
    {
      title: "REPORTS",
      to: "/author/reports"
    },
    {
      title: "PEER PERFORMANCE"
    }
  ],
  "response-frequency": [
    {
      title: "REPORTS",
      to: "/author/reports"
    },
    {
      title: "RESPONSE FREQUENCY"
    }
  ]
};

const Container = props => {
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    props.getAssignmentsRequestAction();
  }, []);

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

  const getHeaderSettings = () => {
    let url = props.location.pathname;
    if (url.length > 16) {
      let _url = url.substring(16);
      let loc = _url.substring(0, _url.indexOf("/"));
      return {
        title: locToTitle[loc],
        onShareClickCB: onShareClickCB,
        onPrintClickCB: onPrintClickCB,
        onDownloadCSVClickCB: onDownloadCSVClickCB,
        onRefineResultsCB: onRefineResultsCB,
        breadcrumbData: locToBreadcrumb[loc]
      };
    } else {
      return { title: "Reports" };
    }
  };

  const headerSettings = getHeaderSettings();

  return (
    <div>
      <CustomizedHeaderWrapper
        title={headerSettings.title}
        onShareClickCB={headerSettings.onShareClickCB}
        onPrintClickCB={headerSettings.onPrintClickCB}
        onDownloadCSVClickCB={headerSettings.onDownloadCSVClickCB}
        onRefineResultsCB={headerSettings.onRefineResultsCB}
      />
      {headerSettings.title !== "Reports" ? (
        <Breadcrumb data={headerSettings.breadcrumbData} style={{ position: "unset", padding: "10px" }} />
      ) : null}
      <Route exact path={props.match.path} component={Reports} />
      <Route
        exact
        path={`${props.match.path}assessment-summary/test/:testId?`}
        render={_props => <AssessmentSummary {..._props} showFilter={showFilter} assignments={props.assignments} />}
      />
      <Route
        exact
        path={`${props.match.path}peer-performance/test/:testId?`}
        render={_props => <PeerPerformance {..._props} showFilter={showFilter} assignments={props.assignments} />}
      />
      <Route
        exact
        path={`${props.match.path}response-frequency/test/:testId?`}
        render={_props => <ResponseFrequency {..._props} showFilter={showFilter} assignments={props.assignments} />}
      />
    </div>
  );
};

const Reports = props => {
  return (
    <div>
      <StyledContainer type="flex" justify="center">
        <Col className="report-category">
          <StyledCard className="single-assessment-reports report">
            <SingleAssessmentReport />
          </StyledCard>
          <StyledCard className="student-profile-reports report" />
        </Col>
        <Col className="report-category">
          <StyledCard className="multiple-assessment-reports report" />
          <StyledCard className="standards-mastery-reports report" />
          <StyledCard className="engagement-reports report" />
        </Col>
      </StyledContainer>
    </div>
  );
};

const enhance = compose(
  connect(
    state => ({
      assignments: getReportsAssignments(state)
    }),
    {
      getAssignmentsRequestAction: getAssignmentsRequestAction
    }
  )
);

export default enhance(Container);

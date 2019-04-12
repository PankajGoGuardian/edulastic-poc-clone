import React, { useEffect, useMemo } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import queryString from "query-string";
import { Row, Col } from "antd";
import { get } from "lodash";
import next from "immer";

import { SimplePieChart } from "./components/charts/pieChart";
import { StyledCard, StyledH3 } from "../../common/styled";
import { UpperContainer, TableContainer, StyledAssessmentStatisticTable } from "./components/styled";
import Breadcrumb from "../../../src/components/Breadcrumb";
import { CustomizedHeaderWrapper } from "../../common/components/header";
import { Stats } from "./components/stats";
import { NavigatorTabs } from "../../common/components/navigatorTabs";
import { getNavigationTabLinks } from "./../../common/util";
import chartNavigatorLinks from "../../common/static/json/singleAssessmentSummaryChartNavigator.json";
import data from "./static/json/data.json";

import { getAssessmentSummaryRequestAction, getReportsAssessmentSummary } from "./ducks";
import { getUserRole } from "../../../src/selectors/user";

const AssessmentSummary = props => {
  const breadcrumbData = [
    {
      title: "REPORTS",
      to: "/author/reports"
    },
    {
      title: "ASSESSMENT SUMMARY"
    }
  ];

  useEffect(() => {
    let q = queryString.parse(props.location.search);
    q.testId = props.match.params.testId;
    props.getAssessmentSummaryRequestAction(q);
  }, []);

  const state = get(props, "assessmentSummary.data.result", {
    assessmentName: "",
    bandInfo: [],
    metricInfo: []
  });

  const computedChartNavigatorLinks = useMemo(() => {
    return next(chartNavigatorLinks, arr => {
      getNavigationTabLinks(arr, props.match.params.testId);
    });
  }, [props.match.params.testId]);

  return (
    <div>
      <CustomizedHeaderWrapper title="Assessment Summary" />
      <Breadcrumb data={breadcrumbData} style={{ position: "unset", padding: "10px" }} />
      <NavigatorTabs data={computedChartNavigatorLinks} selectedTab={"assessmentSummary"} />
      <UpperContainer type="flex">
        <Col className="sub-container district-statistics" xs={24} sm={24} md={12} lg={12} xl={12}>
          <StyledCard>
            <Stats name={state.assessmentName} data={state.metricInfo} role={props.role} />
          </StyledCard>
        </Col>
        <Col className="sub-container chart-container" xs={24} sm={24} md={12} lg={12} xl={12}>
          <StyledCard>
            <StyledH3>Students in Performance Bands (%)</StyledH3>
            <SimplePieChart data={state.bandInfo} />
          </StyledCard>
        </Col>
      </UpperContainer>
      <TableContainer>
        <Col>
          <StyledCard>
            {props.role ? (
              <StyledAssessmentStatisticTable name={state.assessmentName} data={state.metricInfo} role={props.role} />
            ) : (
              ""
            )}
          </StyledCard>
        </Col>
      </TableContainer>
    </div>
  );
};

const enhance = compose(
  connect(
    state => ({
      assessmentSummary: getReportsAssessmentSummary(state),
      role: getUserRole(state)
    }),
    {
      getAssessmentSummaryRequestAction: getAssessmentSummaryRequestAction
    }
  )
);

export default enhance(AssessmentSummary);

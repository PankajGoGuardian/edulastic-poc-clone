import React, { useEffect, useMemo, useState } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import queryString from "query-string";
import { Row, Col } from "antd";
import { get, isEmpty } from "lodash";
import next from "immer";

import { SimplePieChart } from "./components/charts/pieChart";
import { StyledCard, StyledH3 } from "../../../common/styled";
import { UpperContainer, TableContainer, StyledAssessmentStatisticTable } from "./components/styled";
import { Stats } from "./components/stats";
import { Placeholder } from "../../../common/components/loader";
import data from "./static/json/data.json";

import {
  getAssessmentSummaryRequestAction,
  getReportsAssessmentSummary,
  getReportsAssessmentSummaryLoader
} from "./ducks";
import { getPrintingState } from "../../../ducks";
import { getUserRole } from "../../../../src/selectors/user";

const AssessmentSummary = props => {
  useEffect(() => {
    if (props.settings.selectedTest && props.settings.selectedTest.key) {
      let q = {};
      q.testId = props.settings.selectedTest.key;
      q.requestFilters = { ...props.settings.requestFilters };
      props.getAssessmentSummaryRequestAction(q);
    }
  }, [props.settings]);

  const state = get(props, "assessmentSummary.data.result", {
    assessmentName: "",
    bandInfo: [],
    metricInfo: []
  });

  return (
    <div>
      {props.loading ? (
        <div>
          <Row type="flex">
            <Placeholder />
            <Placeholder />
          </Row>
          <Row type="flex">
            <Placeholder />
          </Row>
        </div>
      ) : (
        <>
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
                  <StyledAssessmentStatisticTable
                    name={state.assessmentName}
                    data={state.metricInfo}
                    role={props.role}
                    isPrinting={props.isPrinting}
                  />
                ) : (
                  ""
                )}
              </StyledCard>
            </Col>
          </TableContainer>
        </>
      )}
    </div>
  );
};

const enhance = compose(
  connect(
    state => ({
      assessmentSummary: getReportsAssessmentSummary(state),
      loading: getReportsAssessmentSummaryLoader(state),
      role: getUserRole(state),
      isPrinting: getPrintingState(state)
    }),
    {
      getAssessmentSummaryRequestAction: getAssessmentSummaryRequestAction
    }
  )
);

export default enhance(AssessmentSummary);

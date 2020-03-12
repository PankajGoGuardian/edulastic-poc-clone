import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { get } from "lodash";
import { Row, Col } from "antd";

import InsightsFilters from "./components/InsightsFilters";
import InsightsChart from "./components/InsightsChart";
// import BoxedInsightsSummary from "./components/BoxedInsightsSummary";
import AddToGroupTable from "./components/AddToGroupTable";
import { getBoxedSummaryData, getMergedTrendMap, getFilteredMetrics, getCuratedMetrics } from "./transformers";

import {
  getReportsStudentProgress,
  getReportsStudentProgressLoader,
  getStudentProgressRequestAction
} from "../../../Reports/subPages/multipleAssessmentReport/StudentProgress/ducks";
import { useGetBandData } from "../../../Reports/subPages/multipleAssessmentReport/StudentProgress/hooks";
import { getUser } from "../../../src/selectors/user";

import * as data from "./dummyData.json";

const defaultBandInfo = [
  {
    threshold: 70,
    aboveStandard: 1,
    name: "Proficient"
  },
  {
    threshold: 50,
    aboveStandard: 1,
    name: "Basic"
  },
  {
    threshold: 0,
    aboveStandard: 0,
    name: "Below Basic"
  }
];

const Insights = ({ user, getStudentProgressRequestAction, studentProgress, loading }) => {
  // get student trend data
  useEffect(() => {
    const termId = get(user, "orgData.defaultTermId", "") || get(user, "orgData.terms", [])?.[0]?._id;
    if (termId) {
      getStudentProgressRequestAction({ termId });
    }
  }, []);
  const { metricInfo = [] } = get(studentProgress, "data.result", {});
  const [trendData, trendCount] = useGetBandData(metricInfo, "student", [], "", defaultBandInfo);

  // merge trendData with studInfo
  const studInfoMap = getMergedTrendMap(data.rawData.studInfo, data.trendData);
  const filteredMetrics = getFilteredMetrics(data.rawData.metricInfo, []);
  const curatedMetrics = getCuratedMetrics(filteredMetrics, studInfoMap);

  return (
    <InsightsContainer type="flex" gutter={[10, 40]} justify="center">
      <StyledCol xs={24} sm={24} md={24} lg={4} xl={4} xxl={4}>
        <InsightsFilters />
      </StyledCol>
      <StyledCol xs={24} sm={24} md={24} lg={15} xl={15} xxl={15}>
        <InsightsChart data={curatedMetrics} />
      </StyledCol>
      <StyledCol xs={24} sm={24} md={24} lg={5} xl={5} xxl={5}>
        <Row>
          {/* <BoxedInsightsSummary data={getBoxedSummaryData(trendCount)} /> */}
          <AddToGroupTable data={data.standardsData} />
        </Row>
      </StyledCol>
    </InsightsContainer>
  );
};

const enhance = connect(
  state => ({
    user: getUser(state),
    studentProgress: getReportsStudentProgress(state),
    loading: getReportsStudentProgressLoader(state)
  }),
  {
    getStudentProgressRequestAction
  }
);

export default enhance(Insights);

const InsightsContainer = styled(Row)`
  width: 100%;
  padding: 40px 40px 0 40px;
`;

const StyledCol = styled(Col)`
  display: flex;
  justify-content: center;
`;

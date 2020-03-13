import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { get } from "lodash";
import { Row, Col, Spin } from "antd";

import InsightsFilters from "./components/InsightsFilters";
import InsightsChart from "./components/InsightsChart";
// import BoxedInsightsSummary from "./components/BoxedInsightsSummary";
import AddToGroupTable from "./components/AddToGroupTable";
import {
  getFilterData,
  getMergedTrendMap,
  getFilteredMetrics,
  getCuratedMetrics,
  getBoxedSummaryData
} from "./transformers";

import { fetchPlaylistInsightsAction } from "../../ducks";
import {
  getReportsStudentProgress,
  getReportsStudentProgressLoader,
  getStudentProgressRequestAction
} from "../../../Reports/subPages/multipleAssessmentReport/StudentProgress/ducks";
import { useGetBandData } from "../../../Reports/subPages/multipleAssessmentReport/StudentProgress/hooks";
import { getUser } from "../../../src/selectors/user";

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

const Insights = ({
  user,
  curriculum,
  playlistInsights,
  studentProgress,
  fetchPlaylistInsightsAction,
  getStudentProgressRequestAction,
  loading,
  loadingProgress
}) => {
  const { _id: playlistId, modules } = curriculum;

  const [filters, updateFilters] = useState({
    modules: [],
    standards: [],
    groups: [],
    masteryList: []
  });

  // get student trend data
  useEffect(() => {
    const termId = get(user, "orgData.defaultTermId", "") || get(user, "orgData.terms", [])?.[0]?._id;
    if (termId) {
      getStudentProgressRequestAction({ termId });
    }
  }, []);
  const { metricInfo = [] } = get(studentProgress, "data.result", {});
  const [trendData, trendCount] = useGetBandData(metricInfo, "student", [], "", defaultBandInfo);

  // fetch playlists
  useEffect(() => {
    if (playlistId) {
      fetchPlaylistInsightsAction({ playlistId });
    }
  }, [playlistId]);

  // merge trendData with studInfo
  const filterData = getFilterData(modules);
  const studInfoMap = getMergedTrendMap(playlistInsights.studInfo, trendData);
  const filteredMetrics = getFilteredMetrics(playlistInsights.metricInfo, studInfoMap, filters);
  const curatedMetrics = getCuratedMetrics(filteredMetrics);

  return loading || loadingProgress ? (
    <Spin style={{ "margin-top": "400px" }} />
  ) : (
    <InsightsContainer type="flex" gutter={[10, 40]} justify="center">
      <StyledCol xs={24} sm={24} md={24} lg={4} xl={4} xxl={4}>
        <InsightsFilters data={filterData} prevFilters={filters} updateFilters={updateFilters} />
      </StyledCol>
      <StyledCol xs={24} sm={24} md={24} lg={15} xl={15} xxl={15}>
        <InsightsChart data={curatedMetrics} />
      </StyledCol>
      <StyledCol xs={24} sm={24} md={24} lg={5} xl={5} xxl={5}>
        <Row>
          {/* <BoxedInsightsSummary data={getBoxedSummaryData(trendCount)} /> */}
          <AddToGroupTable />
        </Row>
      </StyledCol>
    </InsightsContainer>
  );
};

const enhance = connect(
  state => ({
    user: getUser(state),
    loading: state?.curriculumSequence?.loadingInsights,
    playlistInsights: state?.curriculumSequence?.playlistInsights,
    loadingProgress: getReportsStudentProgressLoader(state),
    studentProgress: getReportsStudentProgress(state)
  }),
  {
    fetchPlaylistInsightsAction,
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

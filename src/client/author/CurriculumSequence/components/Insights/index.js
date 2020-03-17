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
  getMasteryData,
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
  currentPlaylist,
  playlistInsights,
  studentProgress,
  fetchPlaylistInsightsAction,
  getStudentProgressRequestAction,
  loading,
  loadingProgress
}) => {
  const { _id: playlistId, modules } = currentPlaylist;

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
  const { metricInfo: progressInfo } = get(studentProgress, "data.result", {});
  const [trendData, trendCount] = useGetBandData(progressInfo || [], "student", [], "", defaultBandInfo);

  // fetch playlists
  useEffect(() => {
    if (playlistId) {
      fetchPlaylistInsightsAction({ playlistId });
    }
  }, [playlistId]);

  const { studInfo = [], metricInfo = [], scaleInfo = [] } = playlistInsights;
  const masteryData = getMasteryData(scaleInfo[0]?.scale);
  const filterData = { ...getFilterData(modules), masteryData };

  // merge trendData with studInfo;
  const studInfoMap = getMergedTrendMap(studInfo, trendData);
  const filteredMetrics = getFilteredMetrics(metricInfo, studInfoMap, filters);
  const curatedMetrics = getCuratedMetrics({ ...filteredMetrics, masteryData });

  return loading || loadingProgress ? (
    <Spin style={{ "margin-top": "400px" }} />
  ) : (
    <InsightsContainer type="flex" gutter={[10, 40]} justify="center">
      {/* TODO: for left section, reduce 6 to 4 on enabling the right section */}
      <StyledCol xs={24} sm={24} md={24} lg={6} xl={6} xxl={6}>
        <InsightsFilters data={filterData} prevFilters={filters} updateFilters={updateFilters} />
      </StyledCol>
      {/* TODO: for mid section, reduce 18 to 14 on enabling the right section */}
      <StyledCol xs={24} sm={24} md={24} lg={18} xl={18} xxl={18}>
        {/* TODO: for insights chart, update width to 100% in the component on enabling the right section */}
        <InsightsChart data={curatedMetrics} />
      </StyledCol>
      {/* <StyledCol xs={24} sm={24} md={24} lg={6} xl={6} xxl={6}>
        <StyledRow> */}
      {/* <BoxedInsightsSummary data={getBoxedSummaryData(trendCount)} /> */}
      {/* <AddToGroupTable studData={curatedMetrics} groupsData={filterData?.groupsData} /> */}
      {/* </StyledRow>
      </StyledCol> */}
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

const StyledRow = styled(Row)`
  width: 100%;
`;

const InsightsContainer = styled(StyledRow)`
  padding: 40px 25px;
`;

const StyledCol = styled(Col)`
  display: flex;
  justify-content: center;
`;

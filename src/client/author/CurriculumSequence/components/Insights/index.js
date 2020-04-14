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

const initialFilters = {
  modules: [],
  standards: [],
  groups: [],
  masteryList: []
};

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

  const [filters, updateFilters] = useState(initialFilters);
  const [highlighted, setHighlighted] = useState({});
  const [overallProgressCheck, setOverallProgressCheck] = useState(false);

  // fetch playlist insights
  useEffect(() => {
    if (playlistId) {
      fetchPlaylistInsightsAction({ playlistId });
    }
  }, [playlistId]);

  // fetch student progress data
  useEffect(() => {
    const termId = get(user, "orgData.defaultTermId", "") || get(user, "orgData.terms", [])?.[0]?._id;
    if (overallProgressCheck && termId) {
      getStudentProgressRequestAction({ termId, insights: true });
    } else if (playlistId && termId) {
      if (filters.modules.length) {
        const playlistModuleIds = filters.modules.map(i => i.key).join(",");
        getStudentProgressRequestAction({ termId, playlistId, playlistModuleIds, insights: true });
      } else {
        getStudentProgressRequestAction({ termId, playlistId, insights: true });
      }
    }
  }, [overallProgressCheck, playlistId, filters.modules]);

  const { metricInfo: progressInfo } = get(studentProgress, "data.result", {});
  const [trendData, trendCount] = useGetBandData(progressInfo || [], "student", [], "", defaultBandInfo);

  const { studInfo = [], metricInfo = [], scaleInfo = [] } = playlistInsights;
  const masteryData = getMasteryData(scaleInfo[0]?.scale);
  const filterData = { ...getFilterData(modules, filters.modules), masteryData };

  // merge trendData with studInfo;
  const studInfoMap = getMergedTrendMap(studInfo, trendData);
  const filteredMetrics = getFilteredMetrics(metricInfo, studInfoMap, filters);
  const curatedMetrics = getCuratedMetrics({ ...filteredMetrics, masteryData });

  const clearFilter = () => {
    updateFilters(initialFilters);
    setOverallProgressCheck(false);
    setHighlighted({});
  };

  return loading ? (
    <Spin style={{ marginTop: "400px" }} />
  ) : (
    <Row type="flex" gutter={[10, 40]} justify="center" style={{ width: "99%", padding: "40px 25px" }}>
      <StyledCol xs={24} sm={24} md={24} lg={4} xl={4} xxl={4}>
        <InsightsFilters
          data={filterData}
          prevFilters={filters}
          updateFilters={updateFilters}
          overallProgressCheck={overallProgressCheck}
          setOverallProgressCheck={setOverallProgressCheck}
          clearFilter={clearFilter}
        />
      </StyledCol>
      <StyledCol xs={24} sm={24} md={24} lg={14} xl={14} xxl={14}>
        {loadingProgress ? (
          <Spin />
        ) : (
          <InsightsChart data={curatedMetrics} highlighted={highlighted} setHighlighted={setHighlighted} />
        )}
      </StyledCol>
      <StyledCol xs={24} sm={24} md={24} lg={6} xl={6} xxl={6}>
        <Row style={{ width: "100%" }}>
          {/* <BoxedInsightsSummary data={getBoxedSummaryData(trendCount)} /> */}
          <AddToGroupTable studData={curatedMetrics} groupsData={filterData?.groupsData} highlighted={highlighted} />
        </Row>
      </StyledCol>
    </Row>
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

const StyledCol = styled(Col)`
  display: flex;
  justify-content: center;
`;

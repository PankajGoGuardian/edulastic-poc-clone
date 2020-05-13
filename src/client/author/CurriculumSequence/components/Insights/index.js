import { themeColor, white } from "@edulastic/colors";
import { withWindowSizes } from "@edulastic/common";
import { IconFilter } from "@edulastic/icons";
import { Col, Row, Spin } from "antd";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import styled from "styled-components";
import { FilterButton } from "../../../Assignments/components/Container/styled";
import {
  getReportsStudentProgress,
  getReportsStudentProgressLoader,
  getStudentProgressRequestAction
} from "../../../Reports/subPages/multipleAssessmentReport/StudentProgress/ducks";
import { useGetBandData } from "../../../Reports/subPages/multipleAssessmentReport/StudentProgress/hooks";
import { getUser } from "../../../src/selectors/user";
import { fetchPlaylistInsightsAction } from "../../ducks";
// import BoxedInsightsSummary from "./components/BoxedInsightsSummary";
import AddToGroupTable from "./components/AddToGroupTable";
import InsightsChart from "./components/InsightsChart";
import InsightsFilters from "./components/InsightsFilters";
import {
  getCuratedMetrics,
  getFilterData,
  getFilteredMetrics,
  getMasteryData,
  getMergedTrendMap
} from "./transformers";

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
  loadingProgress,
  windowWidth
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

  const [showFilter, setShowFilter] = useState(true);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  return loading ? (
    <Spin style={{ marginTop: "400px" }} />
  ) : (
    <InsightsContainer type="flex" gutter={10} justify="center">
      {showFilter && (
        <FilterColumn>
          <InsightsFilters
            data={filterData}
            prevFilters={filters}
            updateFilters={updateFilters}
            overallProgressCheck={overallProgressCheck}
            setOverallProgressCheck={setOverallProgressCheck}
            clearFilter={clearFilter}
          />
        </FilterColumn>
      )}
      <GraphContainer showFilter={showFilter}>
        <FilterIcon showFilter={showFilter} variant="filter" onClick={toggleFilter}>
          <IconFilter data-cy="smart-filter" color={showFilter ? white : themeColor} width={20} height={20} />
        </FilterIcon>
        <StyledCol>
          {loadingProgress ? (
            <Spin />
          ) : (
            <InsightsChart data={curatedMetrics} highlighted={highlighted} setHighlighted={setHighlighted} />
          )}
        </StyledCol>
      </GraphContainer>
      <RightContainer xs={24} sm={24} md={6}>
        <Row style={{ width: "100%" }}>
          {/* <BoxedInsightsSummary data={getBoxedSummaryData(trendCount)} /> */}
          <AddToGroupTable studData={curatedMetrics} groupsData={filterData?.groupsData} highlighted={highlighted} />
        </Row>
      </RightContainer>
    </InsightsContainer>
  );
};

const enhance = compose(
  withWindowSizes,
  connect(
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
  )
);

export default enhance(Insights);

const InsightsContainer = styled(Row)`
  width: 100%;
`;

const FilterIcon = styled(FilterButton)`
  background: ${props => (props.showFilter ? themeColor : white)};
  margin: 0px !important;
`;

const FilterColumn = styled(Col)`
  width: 220px;
`;

const GraphContainer = styled(Col)`
  width: ${props => `calc(100% - ${props.showFilter ? "470px" : "250px"})`};
`;

const RightContainer = styled(Col)`
  width: 250px;
`;

const StyledCol = styled(Col)`
  display: flex;
  justify-content: center;
`;

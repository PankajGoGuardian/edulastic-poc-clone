import React, { useEffect, useState } from "react";
import next from "immer";
import { get, filter, includes, indexOf } from "lodash";
import { connect } from "react-redux";
import { Row, Col } from "antd";

import { Placeholder } from "../../../common/components/loader";
import { StyledCard, StyledH3 } from "../../../common/styled";
import { parseData, augmentTestData } from "./utils/transformers";
import AnalyseByFilter from "../common/components/filters/AnalyseByFilter";

import { getReportsMARFilterData } from "../common/filterDataDucks";
import {
  getReportsPerformanceOverTime,
  getReportsPerformanceOverTimeLoader,
  getPerformanceOverTimeRequestAction
} from "./ducks";
import { getUserRole } from "../../../../../student/Login/ducks";
import PerformanceOverTimeTable from "./components/PerformanceOvetTimeTable";

import analyseByData from "../common/static/json/analyseByDropDown.json";
import ScoreChart from "./components/charts/ScoreChart";
import BandChart from "./components/charts/BandChart";

const usefetchProgressHook = (settings, fetchAction) => {
  useEffect(() => {
    const { requestFilters = {} } = settings;
    const { termId = "" } = requestFilters;

    if (termId) {
      fetchAction(requestFilters);
    }
  }, [settings]);
};

const PerformanceOverTime = ({
  getPerformanceOverTimeRequestAction,
  performanceOverTime,
  MARFilterData,
  settings,
  loading
}) => {
  usefetchProgressHook(settings, getPerformanceOverTimeRequestAction);

  const [analyseBy, setAnalyseBy] = useState(analyseByData[0]);
  const [selectedTests, setSelectedTests] = useState([]);

  const rawData = get(performanceOverTime, "data.result", {});
  const { testData = [] } = get(MARFilterData, "data.result", {});
  const parsedData = parseData(rawData);
  const dataWithTestInfo = augmentTestData(parsedData, testData);
  const filteredTableData = filter(dataWithTestInfo, test => {
    return selectedTests.length ? includes(selectedTests, test.testId) : true;
  });

  const onResetClick = () => setSelectedTests([]);

  const handleToggleSelectedBars = item => {
    setSelectedTests(prevState => {
      const newState = next(prevState, draftState => {
        let index = indexOf(prevState, item.testId);
        if (-1 < index) {
          draftState.splice(index, 1);
        } else {
          draftState.push(item.testId);
        }
      });

      return newState;
    });
  };

  if (loading) {
    return (
      <>
        <Placeholder />
        <Placeholder />
      </>
    );
  }

  return (
    <>
      <StyledCard>
        <Row>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <StyledH3>How is assessment performance over time?</StyledH3>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <AnalyseByFilter onFilterChange={setAnalyseBy} analyseBy={analyseBy} />
          </Col>
        </Row>
        {includes(["score", "rawScore"], analyseBy.key) ? (
          <ScoreChart
            data={dataWithTestInfo}
            analyseBy={analyseBy}
            onBarClickCB={handleToggleSelectedBars}
            selectedTests={selectedTests}
            onResetClickCB={onResetClick}
          />
        ) : (
          <BandChart
            data={dataWithTestInfo}
            bandInfo={rawData.bandInfo}
            analyseBy={analyseBy}
            onBarClickCB={handleToggleSelectedBars}
            selectedTests={selectedTests}
            analyseBy={analyseBy.key}
            onResetClickCB={onResetClick}
          />
        )}
      </StyledCard>
      <PerformanceOverTimeTable dataSource={filteredTableData} />
    </>
  );
};

const enhance = connect(
  state => ({
    performanceOverTime: getReportsPerformanceOverTime(state),
    loading: getReportsPerformanceOverTimeLoader(state),
    MARFilterData: getReportsMARFilterData(state),
    role: getUserRole(state)
  }),
  {
    getPerformanceOverTimeRequestAction
  }
);

export default enhance(PerformanceOverTime);

// -----|-----|-----|-----|-----| COMPONENT ENDED |-----|-----|-----|-----|----- //

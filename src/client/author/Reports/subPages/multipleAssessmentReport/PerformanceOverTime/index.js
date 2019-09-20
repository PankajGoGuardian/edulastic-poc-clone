import React, { useEffect, useState } from "react";
import { get, filter, includes } from "lodash";
import { connect } from "react-redux";
import { Row, Col } from "antd";

import { Placeholder } from "../../../common/components/loader";
import { StyledCard, StyledH3 } from "../../../common/styled";
import { parseData, augmentTestData } from "./utils/transformers";
import AnalyseByFilter from "../common/components/filters/AnalyseByFilter";

import { getReportsMARFilterData, getReportsMARSelectedPerformanceBandProfile } from "../common/filterDataDucks";
import { getCsvDownloadingState } from "../../../ducks";
import {
  getReportsPerformanceOverTime,
  getReportsPerformanceOverTimeLoader,
  getPerformanceOverTimeRequestAction
} from "./ducks";
import { getUserRole } from "../../../../../student/Login/ducks";
import PerformanceOverTimeTable from "./components/table/PerformanceOvetTimeTable";
import ProgressChart from "./components/charts/ProgressChart";

import analyseByData from "../common/static/json/analyseByDropDown.json";
import { usefetchProgressHook } from "../common/hooks";

const PerformanceOverTime = ({
  getPerformanceOverTimeRequestAction,
  performanceOverTime,
  isCsvDownloading,
  MARFilterData,
  settings,
  loading
}) => {
  usefetchProgressHook(settings, getPerformanceOverTimeRequestAction);

  const [analyseBy, setAnalyseBy] = useState(analyseByData[0]);
  const [selectedTests, setSelectedTests] = useState([]);

  const rawData = get(performanceOverTime, "data.result", {});
  const { testData = [] } = get(MARFilterData, "data.result", {});
  const dataWithTestInfo = augmentTestData(parseData(rawData), testData);
  const filteredTableData = filter(dataWithTestInfo, test => {
    return selectedTests.length ? includes(selectedTests, test.uniqId) : true;
  });

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
        <ProgressChart
          data={dataWithTestInfo}
          analyseBy={analyseBy.key}
          selectedItems={selectedTests}
          setSelectedItems={setSelectedTests}
          bandInfo={rawData.bandInfo}
        />
      </StyledCard>
      <PerformanceOverTimeTable isCsvDownloading={isCsvDownloading} dataSource={filteredTableData} />
    </>
  );
};

const enhance = connect(
  state => ({
    performanceOverTime: getReportsPerformanceOverTime(state),
    loading: getReportsPerformanceOverTimeLoader(state),
    MARFilterData: getReportsMARFilterData(state),
    role: getUserRole(state),
    isCsvDownloading: getCsvDownloadingState(state)
  }),
  {
    getPerformanceOverTimeRequestAction
  }
);

export default enhance(PerformanceOverTime);

// -----|-----|-----|-----|-----| COMPONENT ENDED |-----|-----|-----|-----|----- //

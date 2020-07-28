import { SpinLoader } from "@edulastic/common";
import { Col, Row } from "antd";
import { filter, get, includes } from "lodash";
import React, { useState } from "react";
import { connect } from "react-redux";
import { getUserRole, getUserDetails } from "../../../../../student/Login/ducks";
import { StyledCard, StyledH3 } from "../../../common/styled";
import { getCsvDownloadingState } from "../../../ducks";
import AnalyseByFilter from "../common/components/filters/AnalyseByFilter";
import { getReportsMARFilterData } from "../common/filterDataDucks";
import { usefetchProgressHook } from "../common/hooks";
import analyseByData from "../common/static/json/analyseByDropDown.json";
import ProgressChart from "./components/charts/ProgressChart";
import PerformanceOverTimeTable from "./components/table/PerformanceOvetTimeTable";
import {
  getPerformanceOverTimeRequestAction,
  getReportsPerformanceOverTime,
  getReportsPerformanceOverTimeLoader
} from "./ducks";
import { augmentTestData, parseData } from "./utils/transformers";

const PerformanceOverTime = ({
  getPerformanceOverTimeRequest,
  performanceOverTime,
  isCsvDownloading,
  MARFilterData,
  settings,
  loading,
  user
}) => {
  usefetchProgressHook(settings, getPerformanceOverTimeRequest, user);

  const [analyseBy, setAnalyseBy] = useState(analyseByData[0]);
  const [selectedTests, setSelectedTests] = useState([]);

  const rawData = get(performanceOverTime, "data.result", {});
  const { testData = [] } = get(MARFilterData, "data.result", {});
  const dataWithTestInfo = filter(
    augmentTestData(parseData(rawData), testData),
    test => test.testName && test.testName !== "N/A" // filter out tests without testName
  );
  const filteredTableData = filter(dataWithTestInfo, test =>
    selectedTests.length ? includes(selectedTests, test.uniqId) : true
  );

  if (loading) {
    return <SpinLoader position="fixed" />;
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
    user: getUserDetails(state),
    isCsvDownloading: getCsvDownloadingState(state)
  }),
  {
    getPerformanceOverTimeRequest: getPerformanceOverTimeRequestAction
  }
);

export default enhance(PerformanceOverTime);

// -----|-----|-----|-----|-----| COMPONENT ENDED |-----|-----|-----|-----|----- //

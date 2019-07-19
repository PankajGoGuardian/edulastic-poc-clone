import React, { useEffect, useState } from "react";
import { get, head } from "lodash";
import { connect } from "react-redux";
import { getReportsStudentProgress, getReportsStudentProgressLoader, getStudentProgressRequestAction } from "./ducks";

import { Placeholder } from "../../../common/components/loader";
import TrendStats from "../common/components/trend/TrendStats";
import TrendTable from "../common/components/trend/TrendTable";
import AnalyseByFilter from "../common/components/filters/AnalyseByFilter";
import { getReportsMARFilterData } from "../common/filterDataDucks";
import { parseTrendData, augmentWithBand } from "../common/utils/trend";

import dropDownData from "./static/json/dropDownData.json";
// -----|-----|-----|-----|-----| COMPONENT BEGIN |-----|-----|-----|-----|----- //
const bandInfo = [
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

const compareBy = {
  key: "student",
  title: "Student"
};

const usefetchProgressHook = (settings, fetchAction) => {
  useEffect(() => {
    const { requestFilters = {} } = settings;
    const { termId = "" } = requestFilters;

    if (termId) {
      fetchAction(requestFilters);
    }
  }, [settings]);
};

const StudentProgress = ({
  getStudentProgressRequestAction,
  studentProgress,
  MARFilterData,
  settings,
  loading,
  bandInfo
}) => {
  const [analyseBy, setAnalyseBy] = useState(head(dropDownData.analyseByData));
  const [selectedTrend, setSelectedTrend] = useState("");

  usefetchProgressHook(settings, getStudentProgressRequestAction);

  const { metricInfo = [] } = get(studentProgress, "data.result", {});
  const { orgData = [], testData = [] } = get(MARFilterData, "data.result", []);

  const [parsedData, trendCount] = parseTrendData(metricInfo, compareBy.key, orgData, selectedTrend);
  const dataWithBand = augmentWithBand(parsedData, bandInfo);

  const onTrendSelect = trend => setSelectedTrend(trend === selectedTrend ? "" : trend);
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
      <TrendStats trendCount={trendCount} selectedTrend={selectedTrend} onTrendSelect={onTrendSelect} />
      <TrendTable
        data={dataWithBand}
        testData={testData}
        compareBy={compareBy}
        analyseBy={analyseBy}
        rawMetric={metricInfo}
        renderFilters={() => <AnalyseByFilter onFilterChange={setAnalyseBy} analyseBy={analyseBy} />}
      />
    </>
  );
};

const enhance = connect(
  state => ({
    studentProgress: getReportsStudentProgress(state),
    loading: getReportsStudentProgressLoader(state),
    bandInfo,
    MARFilterData: getReportsMARFilterData(state)
  }),
  {
    getStudentProgressRequestAction
  }
);

export default enhance(StudentProgress);

// -----|-----|-----|-----|-----| COMPONENT ENDED |-----|-----|-----|-----|----- //

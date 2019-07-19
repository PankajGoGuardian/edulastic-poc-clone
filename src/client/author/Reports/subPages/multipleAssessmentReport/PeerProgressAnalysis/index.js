import React, { useEffect, useState } from "react";
import { get, head } from "lodash";
import { connect } from "react-redux";
import {
  getReportsPeerProgressAnalysis,
  getReportsPeerProgressAnalysisLoader,
  getPeerProgressAnalysisRequestAction
} from "./ducks";
import { getUserRole } from "../../../../../student/Login/ducks";

import { Placeholder } from "../../../common/components/loader";
import { getReportsMARFilterData } from "../common/filterDataDucks";
import { parseTrendData, getCompareByOptions } from "../common/utils/trend";

import dropDownData from "./static/json/dropDownData.json";
import TrendStats from "../common/components/trend/TrendStats";
import TrendTable from "../common/components/trend/TrendTable";
import Filters from "./components/table/Filters";

// -----|-----|-----|-----|-----| COMPONENT BEGIN |-----|-----|-----|-----|----- //

const usefetchProgressHook = (settings, compareBy, fetchAction) => {
  useEffect(() => {
    const { requestFilters = {} } = settings;
    const { termId = "" } = requestFilters;

    if (termId) {
      fetchAction({
        compareBy: compareBy.key,
        ...requestFilters
      });
    }
  }, [settings, compareBy.key]);
};

const PeerProgressAnalysis = ({
  getPeerProgressAnalysisRequestAction,
  peerProgressAnalysis,
  MARFilterData,
  settings,
  loading,
  role
}) => {
  const compareByData = getCompareByOptions(role);
  const [analyseBy, setAnalyseBy] = useState(head(dropDownData.analyseByData));
  const [compareBy, setCompareBy] = useState(head(compareByData));
  const [selectedTrend, setSelectedTrend] = useState("");

  usefetchProgressHook(settings, compareBy, getPeerProgressAnalysisRequestAction);

  const { metricInfo = [] } = get(peerProgressAnalysis, "data.result", {});
  const { orgData = [], testData = [] } = get(MARFilterData, "data.result", []);

  const [parsedData, trendCount] = parseTrendData(metricInfo, compareBy.key, orgData, selectedTrend);

  const onTrendSelect = trend => setSelectedTrend(trend === selectedTrend ? "" : trend);
  const onFilterChange = (key, selectedItem) => {
    switch (key) {
      case "compareBy":
        setCompareBy(selectedItem);
        break;
      case "analyseBy":
        setAnalyseBy(selectedItem);
        break;
      default:
        return;
    }
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
      <TrendStats trendCount={trendCount} selectedTrend={selectedTrend} onTrendSelect={onTrendSelect} />
      <TrendTable
        data={parsedData}
        testData={testData}
        compareBy={compareBy}
        analyseBy={analyseBy}
        rawMetric={metricInfo}
        renderFilters={() => (
          <Filters
            compareByOptions={compareByData}
            onFilterChange={onFilterChange}
            compareBy={compareBy}
            analyseBy={analyseBy}
          />
        )}
      />
    </>
  );
};

const enhance = connect(
  state => ({
    peerProgressAnalysis: getReportsPeerProgressAnalysis(state),
    loading: getReportsPeerProgressAnalysisLoader(state),
    role: getUserRole(state),
    MARFilterData: getReportsMARFilterData(state)
  }),
  {
    getPeerProgressAnalysisRequestAction
  }
);

export default enhance(PeerProgressAnalysis);

// -----|-----|-----|-----|-----| COMPONENT ENDED |-----|-----|-----|-----|----- //

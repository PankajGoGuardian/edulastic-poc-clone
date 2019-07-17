import React, { useEffect, useState } from "react";
import { get, head, filter } from "lodash";
import { connect } from "react-redux";
import {
  getReportsPeerProgressAnalysis,
  getReportsPeerProgressAnalysisLoader,
  getPeerProgressAnalysisRequestAction
} from "./ducks";
import { getUserRole } from "../../../../../student/Login/ducks";

import PeerProgressAnalysisTable from "./components/table/PeerProgressAnalysisTable";
import { Placeholder } from "../../../common/components/loader";
import { getReportsMARFilterData } from "../common/filterDataDucks";
import { parseData, augmentWithData, calculateTrend } from "./utils/transformers";

import dropDownData from "./static/json/dropDownData.json";
import TrendStats from "./components/trend/TrendStats";

// -----|-----|-----|-----|-----| COMPONENT BEGIN |-----|-----|-----|-----|----- //

const usefetchProgressHook = (settings, compareBy, fetchAction) => {
  useEffect(() => {
    const { requestFilters = {} } = settings;
    const { termId = "" } = requestFilters;

    if (termId) {
      fetchAction({
        compareBy: compareBy.key,
        termId
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
  const [analyseBy, setAnalyseBy] = useState(head(dropDownData.analyseByData));
  const [compareBy, setCompareBy] = useState(head(dropDownData.compareByData));
  const [selectedTrend, setSelectedTrend] = useState("");

  usefetchProgressHook(settings, compareBy, getPeerProgressAnalysisRequestAction);

  const { metricInfo = [] } = get(peerProgressAnalysis, "data.result", {});
  const { orgData = [], testData = [] } = get(MARFilterData, "data.result", []);

  const [parsedData, trendCount] = parseData(metricInfo, compareBy.key, orgData, selectedTrend);

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
      <PeerProgressAnalysisTable
        data={parsedData}
        testData={testData}
        compareBy={compareBy}
        analyseBy={analyseBy}
        onFilterChange={onFilterChange}
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

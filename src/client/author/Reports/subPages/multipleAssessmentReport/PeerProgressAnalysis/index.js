import React, { useEffect, useState } from "react";
import { get, head, capitalize } from "lodash";
import { connect } from "react-redux";
import {
  getReportsPeerProgressAnalysis,
  getReportsPeerProgressAnalysisLoader,
  getPeerProgressAnalysisRequestAction
} from "./ducks";
import { getUserRole } from "../../../../../student/Login/ducks";
import { getCsvDownloadingState } from "../../../ducks";
import { Placeholder } from "../../../common/components/loader";
import { getReportsMARFilterData } from "../common/filterDataDucks";
import { parseTrendData, getCompareByOptions, compareByMap } from "../common/utils/trend";

import dropDownData from "./static/json/dropDownData.json";
import TrendStats from "../common/components/trend/TrendStats";
import TrendTable from "../common/components/trend/TrendTable";
import Filters from "./components/table/Filters";
import TableTooltipRow from "../../../common/components/tooltip/TableTooltipRow";
import { downloadCSV } from "../../../common/util";

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
  isCsvDownloading,
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

  const onCsvConvert = data => downloadCSV(`Peer Progress.csv`, data);

  if (loading) {
    return (
      <>
        <Placeholder />
        <Placeholder />
      </>
    );
  }

  const studentColumn = {
    key: "studentCount",
    title: "Student#",
    dataIndex: "studentCount"
  };

  return (
    <>
      <TrendStats
        heading="Distribution of student subgroup as per progress trend ?"
        trendCount={trendCount}
        selectedTrend={selectedTrend}
        onTrendSelect={onTrendSelect}
        renderFilters={() => (
          <Filters
            compareByOptions={compareByData}
            onFilterChange={onFilterChange}
            compareBy={compareBy}
            analyseBy={analyseBy}
          />
        )}
      />
      <TrendTable
        onCsvConvert={onCsvConvert}
        isCsvDownloading={isCsvDownloading}
        heading="How well are student sub-groups progressing ?"
        data={parsedData}
        testData={testData}
        compareBy={compareBy}
        analyseBy={analyseBy}
        rawMetric={metricInfo}
        customColumns={[studentColumn]}
        toolTipContent={(record, columnValue) => {
          return (
            <>
              <TableTooltipRow title={"Student Count: "} value={record.studentCount} />
              <TableTooltipRow
                title={`${capitalize(compareBy.title)} : `}
                value={record[compareByMap[compareBy.key]]}
              />
            </>
          );
        }}
      />
    </>
  );
};

const enhance = connect(
  state => ({
    peerProgressAnalysis: getReportsPeerProgressAnalysis(state),
    loading: getReportsPeerProgressAnalysisLoader(state),
    role: getUserRole(state),
    MARFilterData: getReportsMARFilterData(state),
    isCsvDownloading: getCsvDownloadingState(state)
  }),
  {
    getPeerProgressAnalysisRequestAction
  }
);

export default enhance(PeerProgressAnalysis);

// -----|-----|-----|-----|-----| COMPONENT ENDED |-----|-----|-----|-----|----- //

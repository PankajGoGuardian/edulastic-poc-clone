import { SpinLoader } from "@edulastic/common";
import { Col, Row } from "antd";
import next from "immer";
import { filter, get, includes } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { getUserRole } from "../../../../src/selectors/user";
import dropDownFormat from "../../../common/static/json/dropDownFormat.json";
import { DropDownContainer, StyledCard } from "../../../common/styled";
import { getCsvDownloadingState } from "../../../ducks";
import {
  getFiltersSelector,
  getReportsStandardsBrowseStandards,
  getReportsStandardsFilters,
  getSelectedStandardProficiency,
  getStandardsFiltersRequestAction
} from "../common/filterDataDucks";
import StandardsPerformanceChart from "./components/charts/StandardsPerformanceChart";
import { StyledInnerRow, StyledRow } from "./components/styled";
import StandardsPerformanceTable from "./components/table/StandardsPerformanceTable";
import {
  getReportsStandardsPerformanceSummary,
  getReportsStandardsPerformanceSummaryLoader,
  getStandardsPerformanceSummaryRequestAction
} from "./ducks";
import dropDownData from "./static/json/dropDownData.json";
import {
  getDropDownData,
  getMasteryLevel,
  getMasteryLevelOptions,
  getMaxMasteryScore,
  getOverallMasteryScore,
  getParsedData
} from "./utils/transformers";

const { compareByData, analyseByData } = dropDownData;

const StandardsPerformance = ({
  standardsPerformanceSummary,
  browseStandards,
  standardsFilters,
  getStandardsPerformanceSummaryRequestAction,
  isCsvDownloading,
  settings,
  role,
  loading,
  selectedStandardProficiency,
  filters
}) => {
  const filterData = get(standardsFilters, "data.result", []);
  const scaleInfo = selectedStandardProficiency || [];
  const rawDomainData = get(browseStandards, "data.result", []);
  const maxMasteryScore = getMaxMasteryScore(scaleInfo);
  const masteryLevelData = getMasteryLevelOptions(scaleInfo);

  // filter compareBy options according to role
  const compareByDataFiltered = filter(compareByData, option => !includes(option.hiddenFromRole, role));

  const [dynamicDropDownData, filterInitState] = useMemo(() => getDropDownData(filterData.orgData, role), [
    filterData.orgData,
    dropDownFormat.filterDropDownData,
    role
  ]);

  const [tableFilters, setTableFilters] = useState({
    masteryLevel: masteryLevelData[0],
    compareBy: compareByDataFiltered[0],
    analyseBy: analyseByData[0]
  });

  const [ddfilter, setDdFilter] = useState(filterInitState);

  const [selectedDomains, setSelectedDomains] = useState([]);

  useEffect(() => {
    const { requestFilters = {} } = settings;
    const { termId = "", domainIds = [], grades = [], subject } = requestFilters;
    const modifiedFilter = next(ddfilter, draft => {
      Object.keys(draft).forEach(key => {
        draft[key] = draft[key].key == "All" ? "" : draft[key].key;
      });
    });

    if (termId) {
      getStandardsPerformanceSummaryRequestAction({
        testIds: settings.selectedTest.map(test => test.key).join(),
        termId,
        domainIds,
        grades: grades.join(","),
        subject,
        compareBy: tableFilters.compareBy.key,
        ...modifiedFilter
      });
      getStandardsFiltersRequestAction({ termId });
    }
  }, [settings, tableFilters.compareBy.key, ddfilter]);

  const res = get(standardsPerformanceSummary, "data.result", {});
  const overallMetricMasteryScore = getOverallMasteryScore(res.metricInfo || []);
  const overallMetricMasteryLevel = getMasteryLevel(overallMetricMasteryScore, scaleInfo);

  const { domainsData, tableData } = useMemo(() => getParsedData(
      res.metricInfo,
      maxMasteryScore,
      tableFilters,
      selectedDomains,
      rawDomainData,
      filterData,
      scaleInfo
    ), [res, maxMasteryScore, filterData, selectedDomains, tableFilters, rawDomainData, scaleInfo]);

  if (loading) {
    return <SpinLoader position="fixed" />;
  }

  const tableFiltersOptions = {
    compareByData: compareByDataFiltered,
    analyseByData,
    masteryLevelData
  };

  return (
    <DropDownContainer>
      <StyledCard>
        <Row>
          <Col>
            <StyledRow>
              <StyledInnerRow type="flex" justify="center" className="students-stats">
                <Col>
                  <p className="students-title">Overall Mastery Score</p>
                  <p className="students-value">{overallMetricMasteryScore}</p>
                </Col>
                <Col>
                  <p className="students-title">Overall Mastery Level</p>
                  <p className="students-value">{overallMetricMasteryLevel.masteryName}</p>
                </Col>
              </StyledInnerRow>
            </StyledRow>
          </Col>
        </Row>
      </StyledCard>
      <StyledCard>
        <StandardsPerformanceChart
          data={domainsData}
          selectedDomains={selectedDomains}
          setSelectedDomains={setSelectedDomains}
          filterValues={ddfilter}
          filterOptions={dynamicDropDownData}
          onFilterChange={setDdFilter}
          rawDomainData={rawDomainData}
          maxMasteryScore={maxMasteryScore}
          scaleInfo={scaleInfo}
        />
      </StyledCard>
      <StyledCard>
        <StandardsPerformanceTable
          dataSource={tableData}
          onFilterChange={setTableFilters}
          tableFilters={tableFilters}
          tableFiltersOptions={tableFiltersOptions}
          domainsData={domainsData}
          scaleInfo={scaleInfo}
          selectedDomains={selectedDomains}
          isCsvDownloading={isCsvDownloading}
          filters={filters}
        />
      </StyledCard>
    </DropDownContainer>
  );
};

const enhance = connect(
  state => ({
    standardsPerformanceSummary: getReportsStandardsPerformanceSummary(state),
    loading: getReportsStandardsPerformanceSummaryLoader(state),
    browseStandards: getReportsStandardsBrowseStandards(state),
    standardsFilters: getReportsStandardsFilters(state),
    filters: getFiltersSelector(state),
    isCsvDownloading: getCsvDownloadingState(state),
    role: getUserRole(state),
    selectedStandardProficiency: getSelectedStandardProficiency(state)
  }),
  {
    getStandardsPerformanceSummaryRequestAction,
    getStandardsFiltersRequestAction
  }
);

export default enhance(StandardsPerformance);

import React, { useState, useEffect, useMemo } from "react";
import next from "immer";
import { connect } from "react-redux";
import { get, includes, filter } from "lodash";
import { Row, Col } from "antd";
import { StyledCard, DropDownContainer } from "../../../common/styled";

import {
  getReportsStandardsPerformanceSummary,
  getReportsStandardsPerformanceSummaryLoader,
  getStandardsPerformanceSummaryRequestAction
} from "./ducks";

import {
  getReportsStandardsBrowseStandards,
  getStandardsFiltersRequestAction,
  getReportsStandardsFilters
} from "../common/filterDataDucks";

import dropDownFormat from "../../../common/static/json/dropDownFormat.json";
import dropDownData from "./static/json/dropDownData.json";

import {
  getMaxMasteryScore,
  getColumns,
  getMasteryLevelOptions,
  getMasteryLevel,
  getParsedData,
  getOverallMasteryScore
} from "./utils/transformers";

import { StyledInnerRow, StyledRow } from "./components/styled";
import { Placeholder } from "../../../common/components/loader";
import { getDropDownData } from "./utils/transformers";
import { getUserRole } from "../../../../src/selectors/user";
import StandardsPerformanceTable from "./components/table/StandardsPerformanceTable";
import StandardsPerformanceChart from "./components/charts/StandardsPerformanceChart";

const { compareByData, analyseByData } = dropDownData;

const StandardsPerformance = ({
  standardsPerformanceSummary,
  browseStandards,
  standardsFilters,
  getStandardsPerformanceSummaryRequestAction,
  settings,
  role,
  loading
}) => {
  const filterData = get(standardsFilters, "data.result", []);
  const { scaleInfo = [] } = filterData;
  const rawDomainData = get(browseStandards, "data.result", []);
  const maxMasteryScore = getMaxMasteryScore(scaleInfo);
  const masteryLevelData = getMasteryLevelOptions(scaleInfo);

  // filter compareBy options according to role
  const compareByDataFiltered = filter(compareByData, option => !includes(option.hiddenFromRole, role));

  let [dynamicDropDownData, filterInitState] = useMemo(() => getDropDownData(filterData.orgData, role), [
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
    const { termId = "", domainIds = [] } = requestFilters;
    const modifiedFilter = next(ddfilter, draft => {
      Object.keys(draft).forEach(key => {
        draft[key] = draft[key].key == "All" ? "" : draft[key].key;
      });
    });

    if (termId) {
      getStandardsPerformanceSummaryRequestAction({
        termId,
        domainIds,
        compareBy: tableFilters.compareBy.key,
        ...modifiedFilter
      });
    }
    getStandardsFiltersRequestAction();
  }, [settings, tableFilters.compareBy.key, ddfilter]);

  const res = get(standardsPerformanceSummary, "data.result", {});
  const overallMetricMasteryScore = getOverallMasteryScore(res.metricInfo || []);
  const overallMetricMasteryLevel = getMasteryLevel(overallMetricMasteryScore, scaleInfo);

  const { domainsData, tableData } = useMemo(() => {
    return getParsedData(res.metricInfo, maxMasteryScore, tableFilters, selectedDomains, rawDomainData, filterData);
  }, [res, maxMasteryScore, filterData, selectedDomains, tableFilters, rawDomainData]);

  if (loading) {
    return (
      <div>
        <Row type="flex">
          <Placeholder />
        </Row>
        <Row type="flex">
          <Placeholder />
        </Row>
      </div>
    );
  }

  const tableFiltersOptions = {
    compareByData: compareByDataFiltered,
    analyseByData,
    masteryLevelData
  };

  console.log(role, "role");

  return (
    <DropDownContainer>
      <StyledCard>
        <Row>
          <Col md={10} lg={10} offset={7}>
            <StyledRow>
              <StyledInnerRow type="flex" justify="start" className="students-stats">
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
    role: getUserRole(state)
  }),
  {
    getStandardsPerformanceSummaryRequestAction,
    getStandardsFiltersRequestAction
  }
);

export default enhance(StandardsPerformance);

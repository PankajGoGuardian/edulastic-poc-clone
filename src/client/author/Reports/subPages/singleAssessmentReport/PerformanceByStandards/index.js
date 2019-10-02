import React, { useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { indexOf, filter as filterArr, capitalize, find, get, intersectionBy } from "lodash";
import { Form, Popover, Button, Icon, Row, Col } from "antd";
import next from "immer";

import { ControlDropDown } from "../../../common/components/widgets/controlDropDown";
import { FilterDropDownWithDropDown } from "../../../common/components/widgets/filterDropDownWithDropDown";
import SimpleStackedBarChartContainer from "./components/charts/SimpleStackedBarChartContainer";
import SignedStackedBarChartContainer from "./components/charts/SignedStackedBarChartContainer";
import PerformanceAnalysisTable from "./components/table/performanceAnalysisTable";
import CardHeader, { CardTitle, CardDropdownWrapper } from "./common/CardHeader/CardHeader";
import { analysisParseData, viewByMode, analyzeByMode, compareByMode } from "./util/transformers";
import { Placeholder } from "../../../common/components/loader";
import { EmptyData } from "../../../common/components/emptyData";
import {
  getPerformanceByStandardsAction,
  getPerformanceByStandardsLoadingSelector,
  getPerformanceByStandardsReportSelector
} from "./ducks";
import { AutocompleteDropDown } from "../../../../Reports/common/components/widgets/autocompleteDropDown";
import dropDownFormat from "./static/json/dropDownFormat.json";
import { getUserRole, getInterestedCurriculumsSelector } from "../../../../src/selectors/user";
import { StyledSignedBarContainer, StyledDropDownContainer, StyledH3, StyledCard } from "../../../common/styled";
import CsvTable from "../../../common/components/tables/CsvTable";
import { getCsvDownloadingState } from "../../../ducks";
import {
  getSAFFilterSelectedStandardsProficiencyProfile,
  getSAFFilterStandardsProficiencyProfiles
} from "../common/filterDataDucks";

const PAGE_SIZE = 15;

const findCompareByTitle = (key = "") => {
  if (!key) return "";

  const { title = "" } = find(dropDownFormat.compareByDropDownData, item => item.key === key) || {};

  return title;
};

const PerformanceByStandards = ({
  loading,
  report = {},
  getPerformanceByStandards,
  match,
  settings,
  role,
  interestedCurriculums,
  isCsvDownloading,
  selectedStandardProficiencyProfile,
  standardProficiencyProfiles
}) => {
  const scaleInfo = useMemo(
    () =>
      (
        standardProficiencyProfiles.find(s => s._id === selectedStandardProficiencyProfile) ||
        standardProficiencyProfiles[0]
      )?.scale,
    [selectedStandardProficiencyProfile, standardProficiencyProfiles]
  );

  const [viewBy, setViewBy] = useState(viewByMode.STANDARDS);
  const [analyzeBy, setAnalyzeBy] = useState(analyzeByMode.SCORE);
  const [compareBy, setCompareBy] = useState(role === "teacher" ? compareByMode.STUDENTS : compareByMode.SCHOOL);
  const [standardId, setStandardId] = useState(0);
  const [selectedStandards, setSelectedStandards] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);

  const compareByIndex = compareBy === compareByMode.STUDENTS ? 1 : 0;
  const isViewByStandards = viewBy === viewByMode.STANDARDS;

  const reportWithFilteredSkills = useMemo(() => {
    return next(report, draftReport => {
      draftReport.skillInfo = filterArr(draftReport.skillInfo, skill => skill.curriculumId === standardId);
      draftReport.scaleInfo = scaleInfo;
    });
  }, [report, standardId, scaleInfo]);

  const filteredDropDownData = dropDownFormat.compareByDropDownData.filter(o => {
    if (o.allowedRoles) {
      return o.allowedRoles.includes(role);
    }
    return true;
  });

  const [filter, setFilter] = useState(
    dropDownFormat.filterDropDownData.reduce(
      (total, item) => ({
        ...total,
        [item.key]: item.data[0].key
      }),
      {}
    )
  );

  const getTitleByTestId = () => {
    const {
      selectedTest: { title: testTitle = "" }
    } = settings;
    return testTitle;
  };

  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      let q = {};
      q.testId = settings.selectedTest.key;
      q.requestFilters = { ...settings.requestFilters };
      getPerformanceByStandards(q);
    }
  }, [settings]);

  const setSelectedData = ({ defaultStandardId }) => {
    setStandardId(defaultStandardId);
    setSelectedStandards([]);
    setSelectedDomains([]);
  };

  useEffect(() => {
    setSelectedData(reportWithFilteredSkills);
  }, [report]);

  const handleResetSelection = () => {
    setSelectedData(report);
  };

  const handleToggleSelectedData = item => {
    const dataField = isViewByStandards ? "standardId" : "domainId";
    const stateHandler = isViewByStandards ? setSelectedStandards : setSelectedDomains;

    stateHandler(prevState => {
      const newState = next(prevState, draftState => {
        const index = indexOf(prevState, item[dataField]);
        if (index > -1) {
          draftState.splice(index, 1);
        } else {
          draftState.push(item[dataField]);
        }
      });

      return newState;
    });
  };

  const handleViewByChange = (event, selected) => {
    setViewBy(selected.key);
  };

  const handleAnalyzeByChange = (event, selected) => {
    setAnalyzeBy(selected.key);
  };

  const handleCompareByChange = (event, selected) => {
    setCompareBy(selected.key);
  };

  const handleStandardIdChange = selected => {
    setStandardId(selected.key);
  };

  const standardsDropdownData = useMemo(() => {
    const { standardsMap } = reportWithFilteredSkills;
    const standardsMapArr = Object.keys(standardsMap).map(item => ({ _id: item, name: standardsMap[item] }));
    let intersected = intersectionBy(standardsMapArr, interestedCurriculums, "_id");
    intersected = intersected.map(item => ({ key: item._id, title: item.name }));
    return intersected || [];
  }, [report]);

  if (loading) {
    return (
      <>
        <Placeholder />
        <Placeholder />
      </>
    );
  }

  const [tableData, totalPoints] = analysisParseData(reportWithFilteredSkills, viewBy, compareBy, filter);

  const { testId } = match.params;
  const testName = getTitleByTestId(testId);
  const assignmentInfo = `${testName} (ID: ${testId})`;

  const selectedStandardId = standardsDropdownData.find(s => s.key === standardId);

  const selectedItems = isViewByStandards ? selectedStandards : selectedDomains;

  const BarToRender =
    analyzeBy === analyzeByMode.SCORE || analyzeBy === analyzeByMode.RAW_SCORE
      ? SimpleStackedBarChartContainer
      : SignedStackedBarChartContainer;

  if (!report.metricInfo.length || !report.studInfo.length) {
    return (
      <>
        <EmptyData />
      </>
    );
  }

  const filterDropDownCB = (event, selected, comData) => {
    setFilter({
      ...filter,
      [comData]: selected.key
    });
  };

  return (
    <>
      <StyledCard>
        <Row type="flex" justify="start">
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <StyledH3>
              Performance by {capitalize(`${viewBy}s`)} | {assignmentInfo}
            </StyledH3>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Row>
              <StyledDropDownContainer xs={24} sm={24} md={8} lg={8} xl={8}>
                <ControlDropDown
                  prefix="View By"
                  by={dropDownFormat.viewByDropDownData[0]}
                  selectCB={handleViewByChange}
                  data={dropDownFormat.viewByDropDownData}
                />
              </StyledDropDownContainer>
              <StyledDropDownContainer xs={24} sm={24} md={7} lg={7} xl={7}>
                <ControlDropDown
                  prefix="Analyze By"
                  by={dropDownFormat.analyzeByDropDownData[0]}
                  selectCB={handleAnalyzeByChange}
                  data={dropDownFormat.analyzeByDropDownData}
                />
              </StyledDropDownContainer>
              <StyledDropDownContainer xs={24} sm={24} md={7} lg={7} xl={7}>
                <AutocompleteDropDown
                  prefix="Standard set"
                  by={selectedStandardId || { key: "", title: "" }}
                  selectCB={handleStandardIdChange}
                  data={standardsDropdownData}
                />
              </StyledDropDownContainer>

              <FilterDropDownWithDropDown updateCB={filterDropDownCB} data={dropDownFormat.filterDropDownData} />
            </Row>
          </Col>
        </Row>
        <StyledSignedBarContainer>
          <BarToRender
            report={reportWithFilteredSkills}
            filter={filter}
            viewBy={viewBy}
            analyzeBy={analyzeBy}
            onBarClick={handleToggleSelectedData}
            selectedData={selectedItems}
            onResetClick={handleResetSelection}
          />
        </StyledSignedBarContainer>
      </StyledCard>
      <StyledCard style={{ marginTop: "20px" }}>
        <CardHeader>
          <CardTitle>
            {capitalize(viewBy)} Performance Analysis by {findCompareByTitle(compareBy)} | {assignmentInfo}
          </CardTitle>
          <CardDropdownWrapper>
            <ControlDropDown
              prefix="Compare By"
              by={filteredDropDownData[compareByIndex]}
              selectCB={handleCompareByChange}
              data={filteredDropDownData}
            />
          </CardDropdownWrapper>
        </CardHeader>
        <PerformanceAnalysisTable
          tableData={tableData}
          report={reportWithFilteredSkills}
          viewBy={viewBy}
          analyzeBy={analyzeBy}
          compareBy={compareBy}
          selectedStandards={selectedStandards}
          selectedDomains={selectedDomains}
          totalPoints={totalPoints}
          isCsvDownloading={isCsvDownloading}
        />
      </StyledCard>
    </>
  );
};

const reportPropType = PropTypes.shape({
  teacherInfo: PropTypes.array,
  scaleInfo: PropTypes.array,
  skillInfo: PropTypes.array,
  metricInfo: PropTypes.array,
  studInfo: PropTypes.array,
  standardsMap: PropTypes.object
});

PerformanceByStandards.propTypes = {
  loading: PropTypes.bool.isRequired,
  settings: PropTypes.object.isRequired,
  report: reportPropType.isRequired,
  match: PropTypes.object.isRequired,
  isCsvDownloading: PropTypes.bool.isRequired,
  selectedStandardProficiencyProfile: PropTypes.string.isRequired,
  standardProficiencyProfiles: PropTypes.array.isRequired,
  interestedCurriculums: PropTypes.array.isRequired,
  getPerformanceByStandards: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired
};

const enhance = connect(
  state => ({
    loading: getPerformanceByStandardsLoadingSelector(state),
    role: getUserRole(state),
    interestedCurriculums: getInterestedCurriculumsSelector(state),
    report: getPerformanceByStandardsReportSelector(state),
    isCsvDownloading: getCsvDownloadingState(state),
    selectedStandardProficiencyProfile: getSAFFilterSelectedStandardsProficiencyProfile(state),
    standardProficiencyProfiles: getSAFFilterStandardsProficiencyProfiles(state)
  }),
  {
    getPerformanceByStandards: getPerformanceByStandardsAction
  }
);

export default enhance(PerformanceByStandards);

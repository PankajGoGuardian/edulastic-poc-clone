import { SpinLoader } from "@edulastic/common";
import { Col, Row } from "antd";
import next from "immer";
import { capitalize, filter as filterArr, find, indexOf, intersectionBy } from "lodash";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { getInterestedCurriculumsSelector, getUserRole } from "../../../../src/selectors/user";
import { EmptyData } from "../../../common/components/emptyData";
import { AutocompleteDropDown } from "../../../common/components/widgets/autocompleteDropDown";
import { ControlDropDown } from "../../../common/components/widgets/controlDropDown";
import { StyledCard, StyledDropDownContainer, StyledH3, StyledSignedBarContainer } from "../../../common/styled";
import { getCsvDownloadingState } from "../../../ducks";
import {
  getReportsSARFilterLoadingState,
  getSAFFilterSelectedStandardsProficiencyProfile,
  getSAFFilterStandardsProficiencyProfiles
} from "../common/filterDataDucks";
import CardHeader, { CardDropdownWrapper, CardTitle } from "./common/CardHeader/CardHeader";
import SignedStackedBarChartContainer from "./components/charts/SignedStackedBarChartContainer";
import SimpleStackedBarChartContainer from "./components/charts/SimpleStackedBarChartContainer";
import PerformanceAnalysisTable from "./components/table/performanceAnalysisTable";
import {
  getPerformanceByStandardsAction,
  getPerformanceByStandardsLoadingSelector,
  getPerformanceByStandardsReportSelector
} from "./ducks";
import dropDownFormat from "./static/json/dropDownFormat.json";
import { analysisParseData, analyzeByMode, compareByMode, viewByMode } from "./util/transformers";

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
  standardProficiencyProfiles,
  location,
  pageTitle,
  filters
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

  const reportWithFilteredSkills = useMemo(
    () =>
      next(report, draftReport => {
        draftReport.skillInfo = filterArr(draftReport.skillInfo, skill => skill.curriculumId === standardId);
        draftReport.scaleInfo = scaleInfo;
      }),
    [report, standardId, scaleInfo]
  );

  const filteredDropDownData = dropDownFormat.compareByDropDownData.filter(o => {
    if (o.allowedRoles) {
      return o.allowedRoles.includes(role);
    }
    return true;
  });

  const getTitleByTestId = () => {
    const {
      selectedTest: { title: testTitle = "" }
    } = settings;
    return testTitle;
  };

  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      const q = {};
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
    const standardsMapArr = Object.keys(standardsMap).map(item => ({ _id: +item, name: standardsMap[item] }));
    let intersected = intersectionBy(standardsMapArr, interestedCurriculums, "_id");
    intersected = intersected.map(item => ({ key: item._id, title: item.name }));
    return intersected || [];
  }, [report]);

  if (loading) {
    return <SpinLoader position="fixed" />;
  }

  const [tableData, totalPoints] = analysisParseData(reportWithFilteredSkills, viewBy, compareBy, filters);

  const { testId } = match.params;
  const testName = getTitleByTestId(testId);
  const assignmentInfo = `${testName}`;

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

  return (
    <>
      <StyledCard>
        <Row type="flex" justify="start">
          <Col xs={24} sm={24} md={12} lg={8} xl={12}>
            <StyledH3>
              Performance by {capitalize(`${viewBy}s`)} | {assignmentInfo}
            </StyledH3>
          </Col>
          <Col xs={24} sm={24} md={12} lg={16} xl={12}>
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
                  style={{ marginLeft: 8 }}
                  prefix="Analyze By"
                  by={dropDownFormat.analyzeByDropDownData[0]}
                  selectCB={handleAnalyzeByChange}
                  data={dropDownFormat.analyzeByDropDownData}
                />
              </StyledDropDownContainer>
              <StyledDropDownContainer padding="0px 5px" xs={24} sm={24} md={7} lg={7} xl={7}>
                <AutocompleteDropDown
                  prefix="Standard set"
                  by={selectedStandardId || { key: "", title: "" }}
                  selectCB={handleStandardIdChange}
                  data={standardsDropdownData}
                />
              </StyledDropDownContainer>
            </Row>
          </Col>
        </Row>
        <StyledSignedBarContainer>
          <BarToRender
            report={reportWithFilteredSkills}
            filter={filters}
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
          location={location}
          pageTitle={pageTitle}
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
    loading: getPerformanceByStandardsLoadingSelector(state)
      || getReportsSARFilterLoadingState(state),
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

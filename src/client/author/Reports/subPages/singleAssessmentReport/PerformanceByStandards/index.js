import React, { useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { indexOf, filter as filterArr } from "lodash";
import { Form, Select, Radio, Popover, Button, Icon } from "antd";
import next from "immer";

import { ControlDropDown } from "../../../common/components/widgets/controlDropDown";
import SimpleBarChartContainer from "./components/charts/simpleBarChartContainer";
import SignedStackedBarChartContainer from "./components/charts/SignedStackedBarChartContainer";
import PerformanceAnalysisTable from "./components/table/performanceAnalysisTable";
import CardHeader, { CardTitle, CardDropdownWrapper } from "./common/CardHeader/CardHeader";
import { analysisParseData, viewByMode, analyzeByMode, compareByMode } from "./util/transformers";
import { Placeholder } from "../../../common/components/loader";
import {
  getPerformanceByStandardsAction,
  getPerformanceByStandardsLoadingSelector,
  getPerformanceByStandardsReportSelector
} from "./ducks";

import dropDownFormat from "./static/json/dropDownFormat.json";
import { getUserRole } from "../../../../src/selectors/user";
import { StyledSignedBarContainer } from "../../../common/styled";

const PAGE_SIZE = 15;

const PerformanceByStandards = ({ loading, report = {}, getPerformanceByStandards, match, settings, role }) => {
  const [viewBy, setViewBy] = useState(viewByMode.STANDARDS);
  const [analyzeBy, setAnalyzeBy] = useState(analyzeByMode.SCORE);
  const [compareBy, setCompareBy] = useState(role === "teacher" ? compareByMode.CLASS : compareByMode.SCHOOL);
  const [standardId, setStandardId] = useState(0);
  const [selectedStandards, setSelectedStandards] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [page, setPage] = useState(0);

  const isViewByStandards = viewBy === viewByMode.STANDARDS;

  const reportWithFilteredSkills = useMemo(() => {
    return next(report, draftReport => {
      draftReport.skillInfo = filterArr(draftReport.skillInfo, skill => skill.curriculumId === standardId);
    });
  }, [report, standardId]);

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

  const handleSetFilter = name => value => {
    setFilter({
      ...filter,
      [name]: value
    });
  };

  const handleToggleSelectedData = item => {
    const dataField = isViewByStandards ? "standardId" : "domainId";
    const stateHandler = isViewByStandards ? setSelectedStandards : setSelectedDomains;

    stateHandler(prevState => {
      const newState = next(prevState, draftState => {
        let index = indexOf(prevState, item[dataField]);
        if (-1 < index) {
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

  const handleStandardIdChange = (event, selected) => {
    setStandardId(selected.key);
  };

  const renderSimpleFilter = ({ key: filterKey, title: filterTitle, data }) => {
    const radioValue = filter[filterKey];

    const handleChange = ({ target: { value } }) => {
      handleSetFilter(filterKey)(value);
    };

    return (
      <Form.Item label={filterTitle}>
        <Radio.Group value={radioValue} onChange={handleChange}>
          {data.map(({ title, key }) => (
            <Radio value={key}>{title}</Radio>
          ))}
        </Radio.Group>
      </Form.Item>
    );
  };

  const renderComplexFilter = ({ key: filterKey, title: filterTitle, data }) => {
    const selectValue = filter[filterKey];

    return (
      <Form.Item label={filterTitle}>
        <Select value={selectValue} onChange={handleSetFilter(filterKey)}>
          {data.map(({ title, key }) => (
            <Select.Option value={key}>{title}</Select.Option>
          ))}
        </Select>
      </Form.Item>
    );
  };

  const renderFilters = () => {
    const popoverContent = (
      <Form layout="vertical">
        {dropDownFormat.filterDropDownData.map(filterItem =>
          filterItem.data.length > 3 ? renderComplexFilter(filterItem) : renderSimpleFilter(filterItem)
        )}
      </Form>
    );
    return (
      <Popover content={popoverContent} trigger="click" placement="bottomLeft">
        <Button type="primary">
          <Icon type="filter" />
        </Button>
      </Popover>
    );
  };

  if (loading) {
    return (
      <>
        <Placeholder />
        <Placeholder />
      </>
    );
  }

  const { standardsMap } = reportWithFilteredSkills;

  const standardsList = Object.keys(standardsMap).map(id => ({
    id,
    name: standardsMap[id]
  }));

  const shouldShowReset = isViewByStandards ? selectedStandards.length : selectedDomains.length;

  const [tableData, totalPoints] = analysisParseData(reportWithFilteredSkills, viewBy, compareBy);

  const { testId } = match.params;
  const testName = getTitleByTestId(testId);
  const assignmentInfo = `${testName} (ID: ${testId})`;

  const standardsDropdownData = standardsList.map(s => ({ key: s.id, title: s.name }));
  const selectedStandardId = standardsDropdownData.find(s => s.key === standardId);

  const selectedItems = isViewByStandards ? selectedStandards : selectedDomains;

  return (
    <>
      <StyledSignedBarContainer>
        <CardHeader>
          <CardTitle>Performance by Standards | {assignmentInfo}</CardTitle>
          <CardDropdownWrapper>
            <ControlDropDown
              prefix="View By"
              by={dropDownFormat.viewByDropDownData[0]}
              selectCB={handleViewByChange}
              data={dropDownFormat.viewByDropDownData}
            />
            <ControlDropDown
              prefix="Analyze By"
              by={dropDownFormat.analyzeByDropDownData[0]}
              selectCB={handleAnalyzeByChange}
              data={dropDownFormat.analyzeByDropDownData}
            />
            <ControlDropDown
              prefix=""
              by={selectedStandardId || { key: "", title: "" }}
              selectCB={handleStandardIdChange}
              data={standardsDropdownData}
            />
            {renderFilters()}
          </CardDropdownWrapper>
        </CardHeader>
        <>
          {analyzeBy === analyzeByMode.SCORE || analyzeBy === analyzeByMode.RAW_SCORE ? (
            <SimpleBarChartContainer
              report={reportWithFilteredSkills}
              filter={filter}
              viewBy={viewBy}
              analyzeBy={analyzeBy}
              onBarClick={handleToggleSelectedData}
              selectedDomains={selectedDomains}
              selectedStandards={selectedStandards}
              shouldShowReset={shouldShowReset}
              onResetClick={handleResetSelection}
            />
          ) : (
            <SignedStackedBarChartContainer
              report={reportWithFilteredSkills}
              filter={filter}
              viewBy={viewBy}
              analyzeBy={analyzeBy}
              onBarClick={handleToggleSelectedData}
              selectedData={selectedItems}
              onResetClick={handleResetSelection}
            />
          )}
        </>
      </StyledSignedBarContainer>
      <StyledSignedBarContainer style={{ marginTop: "20px" }}>
        <CardHeader>
          <CardTitle>Performance by Standards | {assignmentInfo}</CardTitle>
          <CardDropdownWrapper>
            <ControlDropDown
              prefix="Compare By"
              by={filteredDropDownData[0]}
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
        />
      </StyledSignedBarContainer>
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
  getPerformanceByStandards: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired
};

const enhance = connect(
  state => ({
    loading: getPerformanceByStandardsLoadingSelector(state),
    role: getUserRole(state),
    report: getPerformanceByStandardsReportSelector(state)
  }),
  {
    getPerformanceByStandards: getPerformanceByStandardsAction
  }
);

export default enhance(PerformanceByStandards);

import React, { useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { uniq, xor, isEmpty, get } from "lodash";
import { Spin, Card, Form, Select, Radio, Popover, Button, Icon } from "antd";
import next from "immer";

import { getNavigationTabLinks, getDropDownTestIds } from "../../../common/util";
import { StyledControlDropDown, FullWidthControlDropDown } from "../../../common/styled";
import { NavigatorTabs } from "../../../common/components/navigatorTabs";
import SimpleBarChartContainer from "./components/charts/simpleBarChartContainer";
import PerformanceAnalysisTable from "./components/table/performanceAnalysisTable";
import CardHeader, {
  CardTitle,
  CardDropdownWrapper,
  GroupingTitle,
  GroupingSelect,
  ResetButton,
  MasteryLevelWrapper,
  MasteryLevel,
  MasteryLevelIndicator,
  MasteryLevelTitle
} from "./common/CardHeader/CardHeader";
import { viewByMode, analyzeByMode, compareByMode } from "./util/transformers";
import {
  getPerformanceByStandardsAction,
  getPerformanceByStandardsLoadingSelector,
  getPerformanceByStandardsReportSelector,
  defaultReport
} from "./ducks";
import dropDownFormat from "./static/json/dropDownFormat.json";
import chartNavigatorLinks from "../../../common/static/json/singleAssessmentSummaryChartNavigator.json";

const MasteryLevels = ({ scaleInfo }) => (
  <MasteryLevelWrapper>
    {scaleInfo.map((info, key) => (
      <MasteryLevel key={key}>
        <MasteryLevelIndicator background={info.color} />
        <MasteryLevelTitle>{info.masteryName}</MasteryLevelTitle>
      </MasteryLevel>
    ))}
  </MasteryLevelWrapper>
);

const PerformanceByStandards = ({
  loading,
  report,
  getPerformanceByStandards,
  match,
  showFilter,
  assignments,
  history,
  location
}) => {
  const [viewBy, setViewBy] = useState(viewByMode.STANDARDS);
  const [analyzeBy, setAnalyzeBy] = useState(analyzeByMode.SCORE);
  const [compareBy, setCompareBy] = useState(compareByMode.SCHOOL);
  const [standardId, setStandardId] = useState(0);
  const [selectedStandards, setSelectedStandards] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedTest, setSelectedTest] = useState({});

  const [filter, setFilter] = useState(
    dropDownFormat.filterDropDownData.reduce(
      (total, item) => ({
        ...total,
        [item.key]: item.data[0].key
      }),
      {}
    )
  );

  const getTitleByTestId = testId => {
    const arr = get(assignments, "data.result.tests", []);
    const item = arr.find(o => o._id === testId);

    if (item) {
      return item.title;
    }
    return "";
  };

  useEffect(() => {
    if (!isEmpty(assignments)) {
      if (match.params.testId) {
        const q = {
          testId: match.params.testId
        };

        getPerformanceByStandards(q);
        setSelectedTest({ key: q.testId, title: getTitleByTestId(q.testId) });
      } else {
        const tests = [...get(assignments, "data.result.tests", [])];
        tests.sort((a, b) => b.updatedDate - a.updatedDate);

        const q = { testId: tests[0]._id };
        history.push(location.pathname + q.testId);
        getPerformanceByStandards(q);
        setSelectedTest({ key: q.testId, title: getTitleByTestId(q.testId) });
      }
    }
  }, [assignments]);

  const setSelectedData = ({ skillInfo, defaultStandardId, standardsMap }) => {
    const selectedData = skillInfo.reduce(
      (total, skill) => ({
        selectedStandards: total.selectedStandards.concat(skill.standardId),
        selectedDomains: total.selectedDomains.concat(skill.domainId)
      }),
      {
        selectedStandards: [],
        selectedDomains: []
      }
    );

    selectedData.selectedDomains = uniq(selectedData.selectedDomains);

    setStandardId(standardsMap[defaultStandardId]);
    setSelectedStandards(selectedData.selectedStandards);
    setSelectedDomains(selectedData.selectedDomains);
  };

  useEffect(() => {
    setSelectedData(report);
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
    const dataField = viewBy === viewByMode.STANDARDS ? "standardId" : "domainId";
    const stateField = viewBy === viewByMode.STANDARDS ? selectedStandards : selectedDomains;
    const stateHandler = viewBy === viewByMode.STANDARDS ? setSelectedStandards : setSelectedDomains;

    stateHandler(xor(stateField, [item[dataField]]));
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

  const handleUpdateTestId = (event, selected) => {
    const url = match.path.substring(0, match.path.length - 8);
    history.push(url + selected.key);
    const q = { testId: selected.key };
    getPerformanceByStandards(q);
    setSelectedTest({ key: q.testId, title: getTitleByTestId(q.testId) });
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
    return <Spin />;
  }

  const { standardsMap, scaleInfo } = report;

  const standardsList = Object.keys(standardsMap).map(id => ({
    id,
    name: standardsMap[id]
  }));

  const filterOption = (input, option) => option.props.children.toLowerCase().includes(input.toLowerCase());

  const computedChartNavigatorLinks = (() => {
    return next(chartNavigatorLinks, arr => {
      getNavigationTabLinks(arr, match.params.testId);
    });
  })();

  const testIds = (() => {
    const _testsArr = get(assignments, "data.result.tests", []);
    return getDropDownTestIds(_testsArr);
  })();

  return (
    <>
      {showFilter ? (
        <FullWidthControlDropDown
          prefix="Assessment Name"
          showPrefixOnSelected={false}
          by={selectedTest}
          updateCB={handleUpdateTestId}
          data={testIds}
          trigger="click"
        />
      ) : null}
      <NavigatorTabs data={computedChartNavigatorLinks} selectedTab="performanceByStandards" />
      <Card>
        <CardHeader>
          <CardTitle>Performance by Standards</CardTitle>
          <CardDropdownWrapper>
            <StyledControlDropDown
              prefix="View By"
              by={dropDownFormat.viewByDropDownData[0]}
              updateCB={handleViewByChange}
              data={dropDownFormat.viewByDropDownData}
            />
            <StyledControlDropDown
              prefix="Analyze By"
              by={dropDownFormat.analyzeByDropDownData[0]}
              updateCB={handleAnalyzeByChange}
              data={dropDownFormat.analyzeByDropDownData}
            />
            <GroupingTitle>Standard:</GroupingTitle>
            <GroupingSelect
              showSearch
              value={standardId}
              onChange={setStandardId}
              optionFilterProp="children"
              filterOption={filterOption}
            >
              {standardsList.map((standard, key) => (
                <Select.Option key={key + standard.id} value={standard.name}>
                  {standard.name}
                </Select.Option>
              ))}
            </GroupingSelect>
            {renderFilters()}
          </CardDropdownWrapper>
        </CardHeader>
        <div>
          <ResetButton type="dashed" size="small" onClick={handleResetSelection}>
            Reset
          </ResetButton>
          {analyzeBy === analyzeByMode.MASTERY_LEVEL && <MasteryLevels scaleInfo={scaleInfo} />}
        </div>
        <SimpleBarChartContainer
          report={report}
          filter={filter}
          viewBy={viewBy}
          analyzeBy={analyzeBy}
          onBarClick={handleToggleSelectedData}
          selectedDomains={selectedDomains}
          selectedStandards={selectedStandards}
        />
      </Card>
      <Card style={{ marginTop: "20px" }}>
        <CardHeader>
          <CardTitle>Performance by Standards</CardTitle>
          <CardDropdownWrapper>
            <StyledControlDropDown
              prefix="Compare By"
              by={dropDownFormat.compareByDropDownData[0]}
              updateCB={handleCompareByChange}
              data={dropDownFormat.compareByDropDownData}
            />
          </CardDropdownWrapper>
        </CardHeader>
        <PerformanceAnalysisTable
          report={report}
          viewBy={viewBy}
          analyzeBy={analyzeBy}
          compareBy={compareBy}
          selectedStandards={selectedStandards}
          selectedDomains={selectedDomains}
        />
      </Card>
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
  report: reportPropType.isRequired,
  match: PropTypes.object.isRequired,
  getPerformanceByStandards: PropTypes.func.isRequired,
  showFilter: PropTypes.bool.isRequired,
  assignments: PropTypes.array,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

PerformanceByStandards.defaultProps = {
  assignments: []
};

const enhance = connect(
  state => ({
    loading: getPerformanceByStandardsLoadingSelector(state),
    report: getPerformanceByStandardsReportSelector(state)
  }),
  {
    getPerformanceByStandards: getPerformanceByStandardsAction
  }
);

export default enhance(PerformanceByStandards);

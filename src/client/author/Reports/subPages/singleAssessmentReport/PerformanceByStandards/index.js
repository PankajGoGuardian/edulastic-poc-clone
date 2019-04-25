import React, { useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { uniq, xor, isEmpty, get } from "lodash";
import { Spin, Card, Form, Select, Radio, Popover, Button, Icon } from "antd";
import next from "immer";

import { getNavigationTabLinks, getDropDownTestIds } from "../../../common/util";
import { ControlDropDown } from "../../../common/components/widgets/controlDropDown";
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
import { analysisParseData, viewByMode, analyzeByMode, compareByMode } from "./util/transformers";
import {
  getPerformanceByStandardsAction,
  getPerformanceByStandardsLoadingSelector,
  getPerformanceByStandardsReportSelector,
  defaultReport
} from "./ducks";
import { getAssignmentsRequestAction, getReportsAssignments } from "../../../assignmentsDucks";
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

const PAGE_SIZE = 15;

const PerformanceByStandards = ({
  loading,
  report,
  getPerformanceByStandards,
  getAssignmentsRequestAction,
  match,
  assignments,
  history,
  location,
  settings
}) => {
  const [viewBy, setViewBy] = useState(viewByMode.STANDARDS);
  const [analyzeBy, setAnalyzeBy] = useState(analyzeByMode.SCORE);
  const [compareBy, setCompareBy] = useState(compareByMode.SCHOOL);
  const [standardId, setStandardId] = useState(0);
  const [selectedStandards, setSelectedStandards] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedTest, setSelectedTest] = useState({});
  const [totalStandards, setTotalStandards] = useState(0);
  const [totalDomains, setTotalDomains] = useState(0);
  const [page, setPage] = useState(0);

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
        q.requestFilters = { ...settings.requestFilters };
        getPerformanceByStandards(q);
        setSelectedTest({ key: q.testId, title: getTitleByTestId(q.testId) });
      } else {
        const tests = [...get(assignments, "data.result.tests", [])];
        tests.sort((a, b) => b.updatedDate - a.updatedDate);

        const q = { testId: tests[0]._id };
        q.requestFilters = { ...settings.requestFilters };
        history.push(location.pathname + q.testId);
        getPerformanceByStandards(q);
        setSelectedTest({ key: q.testId, title: getTitleByTestId(q.testId) });
      }
    } else {
      getAssignmentsRequestAction();
    }
  }, [assignments, settings]);

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
    setTotalStandards(selectedData.selectedStandards.length);
    setTotalDomains(selectedData.selectedDomains.length);
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

  const handleStandardIdChange = (event, selected) => {
    setStandardId(selected.key);
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

  const shouldShowReset =
    viewBy === viewByMode.STANDARDS ? totalStandards > selectedStandards.length : totalDomains > selectedDomains.length;

  const tableData = analysisParseData(report, viewBy, compareBy);

  const paginationOffset = page * PAGE_SIZE;
  const paginatedData = tableData.slice(paginationOffset, paginationOffset + PAGE_SIZE);

  const handlePrevPage = () => {
    if (page === 0) return;

    setPage(page - 1);
  };

  const handleNextPage = () => {
    if (tableData.length <= paginationOffset) {
      return;
    }

    setPage(page + 1);
  };

  const prevButtonDisabled = page === 0;
  const nextButtonDisabled = (page + 1) * PAGE_SIZE >= tableData.length || tableData.length < PAGE_SIZE;

  const { testId } = match.params;
  const assignmentInfo = `${getTitleByTestId(testId)} (ID: ${testId})`;

  const standardsDropdownData = standardsList.map(s => ({ key: s.id, title: s.name }));
  const selectedStandardId = standardsDropdownData.find(s => s.key === standardId);

  return (
    <>
      <Card>
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
        <div>
          {shouldShowReset && (
            <ResetButton type="dashed" size="small" onClick={handleResetSelection}>
              Reset
            </ResetButton>
          )}
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
          <CardTitle>Performance by Standards | {assignmentInfo}</CardTitle>
          <CardDropdownWrapper>
            <ControlDropDown
              prefix="Compare By"
              by={dropDownFormat.compareByDropDownData[0]}
              selectCB={handleCompareByChange}
              data={dropDownFormat.compareByDropDownData}
            />
            <Button.Group size="middle">
              <Button onClick={handlePrevPage} disabled={prevButtonDisabled}>
                <Icon type="left" />
                Prev
              </Button>
              <Button onClick={handleNextPage} disabled={nextButtonDisabled}>
                Next
                <Icon type="right" />
              </Button>
            </Button.Group>
          </CardDropdownWrapper>
        </CardHeader>
        <PerformanceAnalysisTable
          tableData={paginatedData}
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
    report: getPerformanceByStandardsReportSelector(state),
    assignments: getReportsAssignments(state)
  }),
  {
    getPerformanceByStandards: getPerformanceByStandardsAction,
    getAssignmentsRequestAction: getAssignmentsRequestAction
  }
);

export default enhance(PerformanceByStandards);

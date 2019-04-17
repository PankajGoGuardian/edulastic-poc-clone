import React, { useState, useEffect, useMemo } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import queryString from "query-string";
import { Row, Col } from "antd";
import next from "immer";

import { ResponseFrequencyTable } from "./components/table/responseFrequencyTable";
import { StackedBarChartContainer } from "./components/charts/stackedBarChartContainer";
import { StyledContainer, StyledCard, StyledSimpleBarChartContainer, QuestionTypeHeading } from "./components/styled";
import { StyledSlider, StyledH3, FullWidthControlDropDown } from "../../../common/styled";
import { NavigatorTabs } from "../../../common/components/navigatorTabs";
import { getNavigationTabLinks, getDropDownTestIds } from "./../../../common/util";
import chartNavigatorLinks from "../../../common/static/json/singleAssessmentSummaryChartNavigator.json";
import jsonData from "./static/json/data.json";
import { get, isEmpty } from "lodash";

import { getResponseFrequencyRequestAction, getReportsResponseFrequency } from "./ducks";
import tempData from "./static/json/temp.json";

const filterData = (data, filter) => (Object.keys(filter).length > 0 ? data.filter(item => filter[item.qType]) : data);

const ResponseFrequency = props => {
  const [selectedTest, setSelectedTest] = useState({});

  const [difficultItems, setDifficultItems] = useState(40);
  const [misunderstoodItems, setMisunderstoodItems] = useState(20);

  const [filter, setFilter] = useState({});

  // -----|-----|-----|-----|-----| ROUTE RELATED BEGIN |-----|-----|-----|-----|----- //

  const getTitleByTestId = testId => {
    let arr = get(props, "assignments.data.result.tests", []);
    let item = arr.find(o => o._id === testId);

    if (item) {
      return item.title;
    }
    return "";
  };

  useEffect(() => {
    if (!isEmpty(props.assignments)) {
      if (props.match.params.testId) {
        let q = {};
        q.testId = props.match.params.testId;
        props.getResponseFrequencyRequestAction(q);
        setSelectedTest({ key: q.testId, title: getTitleByTestId(q.testId) });
      } else {
        let arr = [...get(props, "assignments.data.result.tests", [])];
        arr.sort((a, b) => {
          return b.updatedDate - a.updatedDate;
        });

        let testId = arr[0]._id;
        let q = { testId: testId };
        props.history.push(props.location.pathname + testId);
        props.getResponseFrequencyRequestAction(q);
        setSelectedTest({ key: q.testId, title: getTitleByTestId(q.testId) });
      }
    }
  }, [props.assignments]);

  // -----|-----|-----|-----|-----| ROUTE RELATED ENDED |-----|-----|-----|-----|----- //

  let res = get(props, "responseFrequency.data.result", false);

  const obj = useMemo(() => {
    let obj = {
      metaData: {},
      data: [],
      filteredData: []
    };
    if (res && res.metrics && !isEmpty(res.metrics)) {
      let arr = Object.keys(res.metrics).map((key, i) => {
        res.metrics[key].uid = key;
        return res.metrics[key];
      });

      obj = {
        data: [...arr],
        filteredData: [...arr],
        metaData: res.metaData
      };
    }
    return obj;
  }, [res]);

  const filteredData = useMemo(() => filterData(obj.data, filter), [filter, obj.data]);

  const onChangeDifficultSlider = value => {
    setDifficultItems(value);
  };

  const onChangeMisunderstoodSlider = value => {
    setMisunderstoodItems(value);
  };

  const onBarClickCB = key => {
    let _filter = { ...filter };
    if (_filter[key]) {
      delete _filter[key];
    } else {
      _filter[key] = true;
    }
    setFilter(_filter);
  };

  const onResetClickCB = () => {
    setFilter({});
  };

  const computedChartNavigatorLinks = useMemo(() => {
    return next(chartNavigatorLinks, arr => {
      getNavigationTabLinks(arr, props.match.params.testId);
    });
  }, [props.match.params.testId]);

  const testIds = useMemo(() => {
    const _testsArr = get(props, "assignments.data.result.tests", []);
    return getDropDownTestIds(_testsArr);
  }, [props.assignments]);

  const updateTestIdCB = (event, selected, comData) => {
    let url = props.match.path.substring(0, props.match.path.length - 8);
    props.history.push(url + selected.key);
    let q = { testId: selected.key };
    props.getResponseFrequencyRequestAction(q);
    setSelectedTest({ key: q.testId, title: getTitleByTestId(q.testId) });
  };

  return (
    <div>
      {props.showFilter ? (
        <FullWidthControlDropDown
          prefix="Assessment Name"
          showPrefixOnSelected={false}
          by={selectedTest}
          updateCB={updateTestIdCB}
          data={testIds}
          trigger="click"
        />
      ) : null}
      <NavigatorTabs data={computedChartNavigatorLinks} selectedTab={"responseFrequency"} />
      <StyledContainer type="flex">
        <StyledCard>
          <StyledH3>Question Type performance for Assessment: {obj.metaData.testName}</StyledH3>
          <StackedBarChartContainer
            data={obj.data}
            assessment={obj.metaData}
            filter={filter}
            onBarClickCB={onBarClickCB}
            onResetClickCB={onResetClickCB}
          />
        </StyledCard>
        <StyledCard>
          <Row type="flex" justify="center" className="question-area">
            <Col className="question-container">
              <p>What are the most difficult items?</p>
              <p>Set threshold to warn if % correct falls below:</p>
              <Row type="flex" justify="start" align="middle">
                <Col className="answer-slider-percentage">
                  <span>{difficultItems}%</span>
                </Col>
                <Col className="answer-slider">
                  <StyledSlider
                    data-slider-id="difficult"
                    defaultValue={difficultItems}
                    onChange={onChangeDifficultSlider}
                  />
                </Col>
              </Row>
            </Col>
            <Col className="question-container">
              <p>What items are misunderstood?</p>
              <p>Set threshold to warn if % frequency of an incorrect choice is above:</p>
              <Row type="flex" justify="start" align="middle">
                <Col className="answer-slider-percentage">
                  <span>{misunderstoodItems}%</span>
                </Col>
                <Col className="answer-slider">
                  <StyledSlider
                    data-slider-id="misunderstood"
                    defaultValue={misunderstoodItems}
                    onChange={onChangeMisunderstoodSlider}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </StyledCard>
        <ResponseFrequencyTable
          data={filteredData}
          columns={jsonData.columns}
          assessment={obj.metaData}
          correctThreshold={difficultItems}
          incorrectFrequencyThreshold={misunderstoodItems}
        />
      </StyledContainer>
    </div>
  );
};

const enhance = compose(
  connect(
    state => ({
      responseFrequency: getReportsResponseFrequency(state)
    }),
    {
      getResponseFrequencyRequestAction: getResponseFrequencyRequestAction
    }
  )
);

export default enhance(ResponseFrequency);

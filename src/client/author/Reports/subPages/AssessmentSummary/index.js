import React, { useEffect, useMemo, useState } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import queryString from "query-string";
import { Row, Col } from "antd";
import { get, isEmpty } from "lodash";
import next from "immer";

import { SimplePieChart } from "./components/charts/pieChart";
import { StyledCard, StyledH3, FullWidthControlDropDown } from "../../common/styled";
import { UpperContainer, TableContainer, StyledAssessmentStatisticTable } from "./components/styled";
import { Stats } from "./components/stats";
import { NavigatorTabs } from "../../common/components/navigatorTabs";
import { getNavigationTabLinks, getDropDownTestIds } from "./../../common/util";
import chartNavigatorLinks from "../../common/static/json/singleAssessmentSummaryChartNavigator.json";
import data from "./static/json/data.json";

import { getAssessmentSummaryRequestAction, getReportsAssessmentSummary } from "./ducks";
import { getUserRole } from "../../../src/selectors/user";

const AssessmentSummary = props => {
  const [selectedTest, setSelectedTest] = useState({});

  // -----|-----|-----|-----|-----| ROUTE RELATED BEGIN |-----|-----|-----|-----|----- //

  const getTitleByTestId = testId => {
    let arr = get(props, "assignments.data.result.tests", []);
    let title;
    for (let item of arr) {
      if (testId === item._id) {
        title = item.title;
        break;
      }
    }
    return title;
  };

  useEffect(() => {
    if (!isEmpty(props.assignments)) {
      if (props.match.params.testId) {
        let q = {};
        q.testId = props.match.params.testId;
        props.getAssessmentSummaryRequestAction(q);
        setSelectedTest({ key: q.testId, title: getTitleByTestId(q.testId) });
      } else {
        let arr = [...get(props, "assignments.data.result.tests", [])];
        arr.sort((a, b) => {
          return b.updatedDate - a.updatedDate;
        });

        let testId = arr[0]._id;
        let q = { testId: testId };
        props.history.push(props.location.pathname + testId);
        props.getAssessmentSummaryRequestAction(q);
        setSelectedTest({ key: q.testId, title: getTitleByTestId(q.testId) });
      }
    }
  }, [props.assignments]);

  // -----|-----|-----|-----|-----| ROUTE RELATED ENDED |-----|-----|-----|-----|----- //

  const state = get(props, "assessmentSummary.data.result", {
    assessmentName: "",
    bandInfo: [],
    metricInfo: []
  });

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
    props.getAssessmentSummaryRequestAction(q);
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
      <NavigatorTabs data={computedChartNavigatorLinks} selectedTab={"assessmentSummary"} />
      <UpperContainer type="flex">
        <Col className="sub-container district-statistics" xs={24} sm={24} md={12} lg={12} xl={12}>
          <StyledCard>
            <Stats name={state.assessmentName} data={state.metricInfo} role={props.role} />
          </StyledCard>
        </Col>
        <Col className="sub-container chart-container" xs={24} sm={24} md={12} lg={12} xl={12}>
          <StyledCard>
            <StyledH3>Students in Performance Bands (%)</StyledH3>
            <SimplePieChart data={state.bandInfo} />
          </StyledCard>
        </Col>
      </UpperContainer>
      <TableContainer>
        <Col>
          <StyledCard>
            {props.role ? (
              <StyledAssessmentStatisticTable name={state.assessmentName} data={state.metricInfo} role={props.role} />
            ) : (
              ""
            )}
          </StyledCard>
        </Col>
      </TableContainer>
    </div>
  );
};

const enhance = compose(
  connect(
    state => ({
      assessmentSummary: getReportsAssessmentSummary(state),
      role: getUserRole(state)
    }),
    {
      getAssessmentSummaryRequestAction: getAssessmentSummaryRequestAction
    }
  )
);

export default enhance(AssessmentSummary);

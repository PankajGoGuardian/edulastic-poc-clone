import React, { useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { Row, Col } from "antd";
import { get, keyBy, isEmpty } from "lodash";

import { SimpleStackedBarWithLineChartContainer } from "./componenets/charts/simpleStackedBarWithLineChartContainer";
import { QuestionAnalysisTable } from "./componenets/table/questionAnalysisTable";
import { Placeholder } from "../../../common/components/loader";
import { StyledH3 } from "../../../common/styled";
import { StyledCard, UpperContainer, TableContainer } from "./componenets/styled";
import { getChartData, getTableData } from "./utils/transformers";
import { ControlDropDown } from "../../../common/components/widgets/controlDropDown";
import dropDownData from "./static/json/dropDownData.json";

import {
  getQuestionAnalysisRequestAction,
  getReportsQuestionAnalysisLoader,
  getReportsQuestionAnalysis
} from "./ducks";
import { getUserRole } from "../../../../../student/Login/ducks";

const QuestionAnalysis = ({ questionAnalysis, getQuestionAnalysisRequestAction, role, settings, loading }) => {
  const [compareBy, setCompareBy] = useState(role === "teacher" ? "groupId" : "schoolId");
  const [chartFilter, setChartFilter] = useState({});

  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      let q = {};
      q.testId = settings.selectedTest.key;
      q.requestFilters = { ...settings.requestFilters };
      getQuestionAnalysisRequestAction(q);
    }
  }, [settings]);

  const chartData = useMemo(() => {
    return getChartData(questionAnalysis.metricInfo);
  }, [questionAnalysis]);

  const tableData = useMemo(() => {
    return getTableData(questionAnalysis);
  }, [questionAnalysis, compareBy]);

  const compareByDropDownData = dropDownData.compareByDropDownData;
  const dropDownKeyToLabel = dropDownData.dropDownKeyToLabel;

  const updateCompareByCB = (event, selected, comData) => {
    setCompareBy(selected.key);
  };

  const onBarClickCB = key => {
    let _chartFilter = { ...chartFilter };
    if (_chartFilter[key]) {
      delete _chartFilter[key];
    } else {
      _chartFilter[key] = true;
    }
    setChartFilter(_chartFilter);
  };

  const onResetClickCB = () => {
    setChartFilter({});
  };

  return (
    <div>
      {loading ? (
        <div>
          <Row type="flex">
            <Placeholder />
          </Row>
          <Row type="flex">
            <Placeholder />
          </Row>
        </div>
      ) : (
        <>
          <UpperContainer>
            <StyledCard>
              <StyledH3>Question Performance Analysis | {questionAnalysis.assessmentName}</StyledH3>
              <SimpleStackedBarWithLineChartContainer
                chartData={chartData}
                onBarClickCB={onBarClickCB}
                onResetClickCB={onResetClickCB}
                filter={chartFilter}
              />
            </StyledCard>
          </UpperContainer>
          <TableContainer>
            <StyledCard>
              <Row type="flex" justify="start" className="parent-row">
                <Col className={"top-row-container"}>
                  <Row type="flex" justify="space-between" className="top-row">
                    <Col>
                      <StyledH3>
                        Detailed Performance Analysis By {dropDownKeyToLabel[compareBy]} |{" "}
                        {questionAnalysis.assessmentName}
                      </StyledH3>
                    </Col>
                    <Col>
                      {role !== "teacher" ? (
                        <ControlDropDown
                          prefix={"Compare by"}
                          by={compareByDropDownData[0]}
                          selectCB={updateCompareByCB}
                          data={compareByDropDownData}
                        />
                      ) : null}
                    </Col>
                  </Row>
                </Col>
                <Col className={"bottom-table-container"}>
                  <QuestionAnalysisTable tableData={tableData} compareBy={compareBy} filter={chartFilter} />
                </Col>
              </Row>
            </StyledCard>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default connect(
  state => ({
    questionAnalysis: getReportsQuestionAnalysis(state),
    loading: getReportsQuestionAnalysisLoader(state),
    role: getUserRole(state)
  }),
  { getQuestionAnalysisRequestAction }
)(QuestionAnalysis);

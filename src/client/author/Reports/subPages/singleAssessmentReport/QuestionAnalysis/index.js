import React, { useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { Row, Col } from "antd";
import PropTypes from "prop-types";
import { get, isEmpty } from "lodash";

import { SimpleStackedBarWithLineChartContainer } from "./componenets/charts/simpleStackedBarWithLineChartContainer";
import { QuestionAnalysisTable } from "./componenets/table/questionAnalysisTable";
import { Placeholder } from "../../../common/components/loader";
import { EmptyData } from "../../../common/components/emptyData";
import { StyledH3 } from "../../../common/styled";
import { StyledCard, UpperContainer, TableContainer, StyledP } from "./componenets/styled";
import { getChartData, getTableData } from "./utils/transformers";
import { ControlDropDown } from "../../../common/components/widgets/controlDropDown";
import dropDownData from "./static/json/dropDownData.json";
import { getCsvDownloadingState } from "../../../ducks";

import {
  getQuestionAnalysisRequestAction,
  getReportsQuestionAnalysisLoader,
  getReportsQuestionAnalysis
} from "./ducks";
import { getUserRole } from "../../../../../student/Login/ducks";

const QuestionAnalysis = ({ loading, isCsvDownloading, role, questionAnalysis, getQuestionAnalysis, settings }) => {
  const [compareBy, setCompareBy] = useState(role === "teacher" ? "groupId" : "schoolId");
  const [chartFilter, setChartFilter] = useState({});

  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      let q = {};
      q.testId = settings.selectedTest.key;
      q.requestFilters = { ...settings.requestFilters };
      getQuestionAnalysis(q);
    }
  }, [settings]);

  const chartData = useMemo(() => {
    return getChartData(questionAnalysis.metricInfo);
  }, [questionAnalysis]);

  const tableData = useMemo(() => {
    return getTableData(questionAnalysis);
  }, [questionAnalysis, compareBy]);

  const { compareByDropDownData, dropDownKeyToLabel } = dropDownData;

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

  if (isEmpty(questionAnalysis) && !loading) {
    return (
      <>
        <EmptyData />
      </>
    );
  }

  const assessmentName = get(settings, "selectedTest.title", "");

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
              <StyledH3>Question Performance Analysis | {assessmentName}</StyledH3>
              <SimpleStackedBarWithLineChartContainer
                chartData={chartData}
                onBarClickCB={onBarClickCB}
                onResetClickCB={onResetClickCB}
                filter={chartFilter}
              />
              <StyledP>ITEMS (SORTED BY PERFORMANCE IN ASCENDING ORDER)</StyledP>
            </StyledCard>
          </UpperContainer>
          <TableContainer>
            <StyledCard>
              <Row type="flex" justify="start" className="parent-row">
                <Col className={"top-row-container"}>
                  <Row type="flex" justify="space-between" className="top-row">
                    <Col>
                      <StyledH3>
                        Detailed Performance Analysis {role !== "teacher" ? `By ${dropDownKeyToLabel[compareBy]}` : ""}{" "}
                        | {assessmentName}
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
                  <QuestionAnalysisTable
                    isCsvDownloading={isCsvDownloading}
                    tableData={tableData}
                    compareBy={compareBy}
                    filter={chartFilter}
                    role={role}
                    compareByTitle={dropDownKeyToLabel[compareBy]}
                  />
                </Col>
              </Row>
            </StyledCard>
          </TableContainer>
        </>
      )}
    </div>
  );
};

const reportPropType = PropTypes.shape({
  metaInfo: PropTypes.array,
  metricInfo: PropTypes.array
});

QuestionAnalysis.propTypes = {
  loading: PropTypes.bool.isRequired,
  isCsvDownloading: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
  questionAnalysis: reportPropType.isRequired,
  getQuestionAnalysis: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired
};

export default connect(
  state => ({
    loading: getReportsQuestionAnalysisLoader(state),
    isCsvDownloading: getCsvDownloadingState(state),
    role: getUserRole(state),
    questionAnalysis: getReportsQuestionAnalysis(state)
  }),
  { getQuestionAnalysis: getQuestionAnalysisRequestAction }
)(QuestionAnalysis);

import React, { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import { connect } from "react-redux";
import { get } from "lodash";
import PropTypes from "prop-types";

import PerformanceBrand from "./performanceBrand";
import { QuestionTableContainer } from "./QuestionTableContainer";
import { StandardTableContainer } from "./StandardTableContainer";
import PageHeader from "./PageHeader";
import { receiveStudentResponseAction } from "../../src/actions/classBoard";
import { stateStudentResponseSelector } from "../../ClassBoard/ducks";
import { getQuestionTableData, getChartAndStandardTableData } from "../utils/transformers";

import { StyledTableWrapper, StyledPage } from "./styles";
const A4_HEIGHT = 1200;
const PERFORMANCE_BAND_MARGIN = 30;
const QUESTION_TABLE_MARGIN = 30;
const STANDARD_TABLE_MARGIN = 30;
const USER_INFO_HEIGHT = 37;
const USER_INFO_MARGIN = 30;
const PAGE_SIZE_HEIGHT = 30;
const TABLE_HEADER_HEIGHT = 55;

const StudentReportPage = ({
  studentResponse,
  author_classboard_testActivity,
  testActivity,
  groupId,
  loadStudentResponse,
  sections,
  classResponse
}) => {
  const performanceRef = useRef();
  const mainContainerRef = useRef();
  const [performanceBlockHeight, setPerformanceBlockHeight] = useState(0);
  const [questionTableDims, setQuestionTableDims] = useState({});
  const [standardTableDims, setStandardTableDims] = useState({});

  useEffect(() => {
    loadStudentResponse({
      groupId,
      testActivityId: testActivity.testActivityId,
      studentId: testActivity.studentId
    });
  }, [testActivity.studentId]);

  useLayoutEffect(() => {
    setTimeout(() => {
      setPerformanceBlockHeight(performanceRef.current?.clientHeight || 0);

      //get questions table row height
      const questionsElm =
        document
          .getElementById(`report-${testActivity.studentId}`)
          ?.querySelectorAll(".student-report-card-question-table-container .ant-table-body > table > tbody > tr") ||
        [];
      const questionsDims = {};
      questionsElm.forEach((elm, i) => (questionsDims[i] = elm.clientHeight));
      setQuestionTableDims(questionsDims);

      //get standard table row height
      const standardELms =
        document
          .getElementById(`report-${testActivity.studentId}`)
          ?.querySelectorAll(".student-report-card-standard-table-container .ant-table-body > table > tbody > tr") ||
        [];
      const standardDims = {};
      standardELms.forEach((elm, i) => (standardDims[i] = elm.clientHeight));
      setStandardTableDims(standardDims);
    }, 2000);
  }, [studentResponse, author_classboard_testActivity, testActivity, mainContainerRef.current]);

  const currentStudentResponse = {
    data: studentResponse.byStudentId[testActivity.studentId]
  };
  const testData = get(author_classboard_testActivity, "data.test", {});

  //memotized required for performance
  const data = useMemo(() => {
    const questionTableData = getQuestionTableData(currentStudentResponse, author_classboard_testActivity);
    const chartAndStandardTable = getChartAndStandardTableData(currentStudentResponse, author_classboard_testActivity);
    const studentName = testActivity.studentName;
    const feedback = author_classboard_testActivity.data.testActivities?.find(
      ta => ta.userId === testActivity.studentId
    )?.feedback;
    const classTitle = author_classboard_testActivity.additionalData?.className;
    return {
      ...chartAndStandardTable,
      ...questionTableData,
      studentName,
      classResponse,
      feedback,
      classTitle
    };
  }, [studentResponse, author_classboard_testActivity, testActivity]);

  const showPerformanceBand = sections.performanceBand;
  const showQuestionsTable = sections.questionPerformance || sections.studentResponse || sections.correctAnswer;
  const showStandardTable = sections.standardsPerformance || sections.masteryStatus;

  //memrizing the print page calculation
  //spliting content into different section
  const splitQuestionTablesIntoPages = useMemo(() => {
    let printData = {};
    let counter = 0;
    let totalHeight = 0;
    let extraHeight = PAGE_SIZE_HEIGHT + TABLE_HEADER_HEIGHT;
    totalHeight = extraHeight;

    if (showQuestionsTable) {
      const questionValues = Object.values(questionTableDims);
      questionValues.forEach((value, i) => {
        if (i === 0 && !printData[counter]) {
          totalHeight = totalHeight + performanceBlockHeight + PERFORMANCE_BAND_MARGIN;
        }
        if (totalHeight + value > A4_HEIGHT) {
          printData[counter] = {
            questionEnd: i,
            questionStart: counter === 0 ? 0 : printData[counter - 1].questionEnd,
            footerMargin: A4_HEIGHT - totalHeight
          };
          totalHeight = extraHeight + USER_INFO_HEIGHT + USER_INFO_MARGIN;
          if (i === questionValues.length - 1) {
            totalHeight += QUESTION_TABLE_MARGIN;
          }
          counter++;
        }

        totalHeight += value;
      });

      printData[counter] = {
        ...(printData[counter] || {}),
        questionEnd: questionValues.length,
        questionStart: counter === 0 ? 0 : printData[counter - 1]?.questionEnd,
        footerMargin: A4_HEIGHT - totalHeight > 0 ? A4_HEIGHT - totalHeight : 0
      };
    }

    if (showStandardTable) {
      const standardValues = Object.values(standardTableDims);
      standardValues.forEach((value, i) => {
        if (!showQuestionsTable && i === 0 && !printData[counter]) {
          totalHeight = totalHeight + performanceBlockHeight + PERFORMANCE_BAND_MARGIN;
        }
        if (totalHeight + value > A4_HEIGHT) {
          printData[counter] = {
            ...(printData[counter] || {}),
            standardEnd: i,
            standardStart: counter === 0 ? 0 : printData[counter - 1].standardEnd || 0,
            footerMargin: A4_HEIGHT - totalHeight > 0 ? A4_HEIGHT - totalHeight : 0
          };
          totalHeight = extraHeight + USER_INFO_HEIGHT + USER_INFO_MARGIN;
          if (i === standardValues.length - 1) {
            totalHeight += STANDARD_TABLE_MARGIN;
          }
          counter++;
        }
        totalHeight += value;
      });
      printData[counter] = {
        ...(printData[counter] || {}),
        standardEnd: standardValues.length,
        standardStart: counter === 0 ? 0 : printData[counter - 1]?.standardEnd,
        footerMargin: A4_HEIGHT - totalHeight > 0 ? A4_HEIGHT - totalHeight : 0
      };
    }

    //if nothing is selected, then also student details should be display. So, atleast one page will be default
    if (!Object.keys(printData).length) {
      totalHeight = performanceBlockHeight + PERFORMANCE_BAND_MARGIN;
      const questionsLength = Object.values(questionTableDims).length;
      const standardLength = Object.values(standardTableDims).length;
      if (questionsLength) totalHeight += QUESTION_TABLE_MARGIN;
      if (standardLength) totalHeight += STANDARD_TABLE_MARGIN;

      printData = {
        0: {
          questionEnd: questionsLength,
          standardEnd: standardLength,
          footerMargin: A4_HEIGHT - totalHeight > 0 ? A4_HEIGHT - totalHeight : 0
        }
      };
    }
    return printData;
  }, [performanceBlockHeight, questionTableDims, standardTableDims, mainContainerRef.current]);

  return (
    <StyledPage>
      <div id={`report-${testActivity.studentId}`} ref={mainContainerRef}>
        {
          <PerformanceBrand
            showPerformanceBand={showPerformanceBand}
            testData={testData}
            data={data}
            performanceRef={performanceRef}
            className="hide-on-print"
          />
        }
        {showQuestionsTable && (
          <StyledTableWrapper className="student-report-card-question-table-container hide-on-print">
            <QuestionTableContainer dataSource={data.questionTableData} columnsFlags={sections} />
          </StyledTableWrapper>
        )}
        {showStandardTable && (
          <StyledTableWrapper className="student-report-card-standard-table-container hide-on-print">
            <StandardTableContainer
              dataSource={data.standardsTableData}
              standardsMap={data.standardsMap}
              assignmentMasteryMap={data.assignmentMasteryMap}
              columnsFlags={sections}
            />
          </StyledTableWrapper>
        )}
      </div>
      {Object.keys(splitQuestionTablesIntoPages).map((key, i) => {
        const totalPages = Object.keys(splitQuestionTablesIntoPages).length;
        const pageData = splitQuestionTablesIntoPages[key];
        const { questionStart, questionEnd, standardStart, standardEnd, footerMargin } = pageData;
        return (
          <>
            {i === 0 && (
              <PerformanceBrand
                showPerformanceBand={showPerformanceBand}
                testData={testData}
                data={data}
                className="hide-without-print"
              />
            )}
            {i !== 0 && (
              <PageHeader
                style={{ height: `${USER_INFO_HEIGHT}px` }}
                className="hide-without-print"
                studentName={data.studentName}
                assessmentTitle={testData.title}
              />
            )}
            {showQuestionsTable && !!questionEnd && (
              <StyledTableWrapper className="student-report-card-question-table-container hide-without-print">
                <QuestionTableContainer
                  dataSource={data.questionTableData.slice(questionStart, questionEnd)}
                  columnsFlags={sections}
                />
              </StyledTableWrapper>
            )}
            {showStandardTable && !!standardEnd && (
              <StyledTableWrapper className="student-report-card-standard-table-container hide-without-print">
                <StandardTableContainer
                  dataSource={data.standardsTableData.slice(standardStart, standardEnd)}
                  standardsMap={data.standardsMap}
                  assignmentMasteryMap={data.assignmentMasteryMap}
                  columnsFlags={sections}
                />
              </StyledTableWrapper>
            )}
            <div
              style={{
                height: `${PAGE_SIZE_HEIGHT}px`,
                pageBreakAfter: "always",
                justifyContent: "flex-end",
                alignItems: "center",
                marginTop: `${footerMargin}px`
              }}
              className="hide-without-print"
            >
              {i + 1}/{totalPages}
            </div>
          </>
        );
      })}
    </StyledPage>
  );
};

StudentReportPage.propTypes = {
  studentResponse: PropTypes.object,
  author_classboard_testActivity: PropTypes.object,
  testActivity: PropTypes.object,
  groupId: PropTypes.string.isRequired,
  loadStudentResponse: PropTypes.func.isRequired,
  sections: PropTypes.object,
  classResponse: PropTypes.object
};

const enhance = connect(
  state => ({
    studentResponse: stateStudentResponseSelector(state),
    author_classboard_testActivity: get(state, ["author_classboard_testActivity"], []),
    entities: get(state, ["author_classboard_testActivity", "entities"], [])
  }),
  {
    loadStudentResponse: receiveStudentResponseAction
  }
);

export default enhance(StudentReportPage);

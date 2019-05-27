import React, { useState, useEffect, useMemo, useRef } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Modal, Button, Row, Col } from "antd";
import { get, isEmpty } from "lodash";
import Moment from "moment";
import { StyledCard } from "../../../../Reports/common/styled";
import { white, blue, grey, springGreen, someGreyColor1 } from "@edulastic/colors";
import { DonutChartContainer } from "./donutChartContainer";
import { QuestionTableContainer } from "./questionTableContainer";
import { StandardTableContainer } from "./standardTableContainer";
import { getQuestions, getQuestionTableData, getChartAndStandardTableData } from "../utils/transformers";
import { receiveStudentResponseAction } from "../../../../src/actions/classBoard";
import { stateStudentResponseSelector } from "../../../../ClassBoard/ducks";

const StudentReportCardModal = props => {
  const {
    className,
    visible,
    columnsFlags,
    title,
    onOk,
    onCancel,
    studentResponse,
    author_classboard_testActivity,
    receiveStudentResponseAction,
    groupId,
    testActivityId,
    entity = {},
    assignmentId
  } = props;
  const [state, setState] = useState({
    performanceBand: true,
    questionPerformance: false,
    studentResponse: false,
    correctAnswer: false,
    standardsPerformance: false,
    masteryStatus: false
  });
  const [prevStudentResponse, setPrevStudentResponse] = useState(null);
  const first = useRef(true);

  useEffect(() => {
    if (visible) {
      receiveStudentResponseAction({ groupId, testActivityId });
    }
    first.current = true;
  }, [visible]);

  if (prevStudentResponse !== studentResponse && !isEmpty(studentResponse) && first.current !== true) {
    setPrevStudentResponse(studentResponse);
  }

  const data = useMemo(() => {
    if (first.current === false) {
      const questionArr = getQuestions(author_classboard_testActivity);
      const questionTableData = getQuestionTableData(studentResponse, questionArr);
      const chartAndStandardTable = getChartAndStandardTableData(studentResponse, author_classboard_testActivity);
      return { ...chartAndStandardTable, ...questionTableData };
    } else {
      return {
        questionTableData: [],
        totalScore: 0,
        obtainedScore: 0,
        standardsTableData: [],
        chartData: [],
        assignmentMasteryMap: {},
        standardsMap: {}
      };
    }
  }, [studentResponse, author_classboard_testActivity]);

  const testData = get(author_classboard_testActivity, "data.test", {});

  const onSaveAsPdf = () => {
    onCancel();
  };

  const onPrintReport = event => {
    event.preventDefault();
    onOk({ ...state });
  };

  const onCheckBoxClick = event => {
    const { name, checked } = event.currentTarget;
    setState(state => ({
      ...state,
      [name]: checked
    }));
  };

  first.current = false;

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={null}
      className={className}
      width={"85%"}
    >
      <div className="model-buttons">
        <Button key="saveAsPdf" type="primary" onClick={onSaveAsPdf}>
          SAVE AS PDF
        </Button>
        <Button key="printReport" onClick={onPrintReport}>
          PRINT REPORT
        </Button>
      </div>
      <StyledCard bordered={false}>
        <Row className="top-container" type="flex" justify="space-between">
          <div />
          <div className="student-name">
            <p>{entity.studentName}</p>
            <p className="edulastic-training-class">Edulastic Training Class</p>
          </div>
        </Row>
        <StyledCard2 className="student-report-card-chart-container">
          <Row type="flex" justify="start">
            <Col className="student-report-card-description-area">
              <p className="test-name">{testData.title}</p>
              <Row className="student-report-card-key-value" type="flex" justify="start">
                <Col className="student-report-card-key">Date: </Col>
                <Col className="student-report-card-value">{Moment(testData.createdDate).format("Do MMMM YYYY")}</Col>
              </Row>
              <Row className="student-report-card-key-value" type="flex" justify="start">
                <Col className="student-report-card-key">Mastery: </Col>
                <Col className="student-report-card-value">{testData.title}</Col>
              </Row>
              <Row className="student-report-card-key-value">
                <p className="student-report-card-key">Overall Feedback </p>
                <p className="student-report-card-value">{testData.title}</p>
              </Row>
            </Col>
            <Col>
              <StyledCard>
                <Row className={"student-report-card-total-score"} type="flex">
                  <Col>{data.obtainedScore}</Col>
                  <Col>
                    {data.totalScore}
                    <p>SCORE</p>
                  </Col>
                </Row>
              </StyledCard>
            </Col>
            <Col className="student-report-card-chart-area">
              <DonutChartContainer data={data.chartData} />
            </Col>
          </Row>
        </StyledCard2>
        <StyledCard2 className="student-report-card-question-table-container">
          <QuestionTableContainer dataSource={data.questionTableData} columnsFlags={columnsFlags} />
        </StyledCard2>
        <StyledCard2 className="student-report-card-standard-table-container">
          <StandardTableContainer
            dataSource={data.standardsTableData}
            standardsMap={data.standardsMap}
            assignmentMasteryMap={data.assignmentMasteryMap}
            columnsFlags={columnsFlags}
          />
        </StyledCard2>
      </StyledCard>
    </Modal>
  );
};

const StyledStudentReportCardModal = styled(StudentReportCardModal)`
  .ant-modal-content {
    background-color: transparent;
    .ant-modal-close {
      display: none;
    }
    .model-buttons {
      display: flex;
      justify-content: space-between;
      margin: 8px;
      button {
        height: 40px;
        background-color: ${white};
        color: ${blue};
        border: none;
        border-radius: 5px;
        font-weight: 600;
      }
    }
    .top-container {
      height: 60px;
      .student-name {
        text-align: right;
        font-size: 20px;
        font-weight: 900;

        .edulastic-training-class {
          font-size: 12px;
          color: ${someGreyColor1};
        }
      }
    }
    .student-report-card-chart-container {
      .student-report-card-description-area {
        width: 40%;
        .test-name {
          font-size: 22px;
          color: ${springGreen};
          margin-bottom: 7px;
        }
        .student-report-card-key-value {
          margin-bottom: 7px;
          .student-report-card-key {
            font-size: 12px;
            font-weight: 900;
            white-space: pre;
          }
          .student-report-card-value {
            font-size: 12px;
            font-weight: 600;
          }
        }
      }
      .student-report-card-total-score {
        width: 20%;
        flex-direction: column;
        font-size: 25px;
        font-weight: 900;
        text-align: center;
        .ant-col:first-child {
          height: 50px;
          width: 50px;
          border-bottom: solid 1px ${someGreyColor1};
        }
        .ant-col:last-child {
          height: 50px;
          width: 50px;
          p {
            color: ${someGreyColor1};
            font-size: 14px;
          }
        }
      }
      .student-report-card-chart-area {
        width: 40%;
      }
    }
  }
`;

const StyledCard2 = styled(StyledCard)`
  box-shadow: none;
  border: solid 1px ${grey};
`;

const ConnectedStudentReportCardModal = connect(
  state => ({
    studentResponse: stateStudentResponseSelector(state),
    author_classboard_testActivity: get(state, ["author_classboard_testActivity"], [])
  }),
  { receiveStudentResponseAction: receiveStudentResponseAction }
)(StyledStudentReportCardModal);

export { ConnectedStudentReportCardModal as StudentReportCardModal };

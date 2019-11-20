import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { Row, Col } from "antd";

import { withRouter } from "react-router-dom";
import { testsApi } from "@edulastic/api";
import { AnswerContext } from "@edulastic/common";
import { getOrderedQuestionsAndAnswers } from "./utils";
import QuestionWrapper from "../../assessment/components/QuestionWrapper";

function useTestFetch(testId) {
  const [testDetails, setTestDetails] = useState(null);

  useEffect(() => {
    testsApi.getById(testId).then(test => {
      const { passages, testItems = [], title, authors = [], collectionName = "" } = test;
      const { questions, answers } = getOrderedQuestionsAndAnswers(testItems, passages);
      setTestDetails({
        title,
        collectionName,
        author: authors[0]?.name,
        questions,
        answers
      });
    });
  }, []);

  return testDetails;
}

const PrintAssessment = ({ match }) => {
  const { testId } = match.params;
  const test = useTestFetch(testId);

  if (!test) {
    return <div> Loading... </div>;
  }

  return (
    <PrintAssessmentContainer>
      <StyledTitle>
        <b>
          <Color>Edu</Color>
        </b>
        lastic
      </StyledTitle>
      <Row type="flex" className="print-assessment-title-container">
        <Col>
          <span> {test.title}</span>
        </Col>
        <Col>
          <span> Collection: {test.collectionName} </span>
        </Col>
      </Row>
      <span> Created By {test.author} </span> <br />
      <hr />
      <AnswerContext.Provider value={{ isAnswerModifiable: false }}>
        {test.questions.map((question, index) => (
          <>
            <QuestionWrapper
              view="preview"
              type={question.type}
              previewTab="clear"
              qIndex={index}
              data={{ ...question, smallSize: true }}
              isPrint
            />
            <hr />
          </>
        ))}
        {test.answers.map(answer => (
          <AnswerContainer>
            <div className="answer-wrapper">
              {answer.qLabel}. {answer.answer}
            </div>
            <hr />
          </AnswerContainer>
        ))}
      </AnswerContext.Provider>
    </PrintAssessmentContainer>
  );
};

export default withRouter(PrintAssessment);

const PrintAssessmentContainer = styled.div`
  background-color: white;
  padding: 30px;

  .print-assessment-title-container {
    .ant-col {
      flex: 1;
    }
    .ant-col:nth-child(2) {
      text-align: right;
    }
  }
`;

const StyledTitle = styled.p`
  font-size: 30px;
  text-align: left;
  font-weight: normal;
  padding: 15px 0 0 0px;
  margin: 0;
`;

export const Color = styled.span`
  color: #58b294;
`;

const AnswerContainer = styled.div`
  .answer-wrapper {
    padding: 5px 30px;
  }
`;

import React, { useEffect, useState, useContext } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import { Row, Col } from "antd";

import { withRouter } from "react-router-dom";
import { testsApi } from "@edulastic/api";
import { AnswerContext } from "@edulastic/common";
import { roleuser, test as testConstants } from "@edulastic/constants";
import { getOrderedQuestionsAndAnswers } from "./utils";
import QuestionWrapper from "../../assessment/components/QuestionWrapper";
import { getTestAuthorName } from "../dataUtils";
import { getCollectionsSelector, getUserRole } from "../src/selectors/user";

const { testContentVisibility: testContentVisibilityOptions } = testConstants;

function useTestFetch(testId) {
  const [testDetails, setTestDetails] = useState(null);

  useEffect(() => {
    testsApi.getById(testId).then(test => {
      const {
        passages,
        itemGroups = [],
        title,
        authors = [],
        collections = [],
        createdBy = {},
        testContentVisibility
      } = test;
      const testItems = itemGroups.flatMap(itemGroup => itemGroup.items || []);
      const { questions, answers } = getOrderedQuestionsAndAnswers(testItems, passages);
      setTestDetails({
        title,
        collections,
        authors,
        questions,
        answers,
        createdBy,
        testContentVisibility
      });
      document.title = test.title;
    });
  }, []);

  return testDetails;
}

const PrintAssessment = ({ match, collections, userRole }) => {
  const { testId } = match.params;
  const test = useTestFetch(testId);

  if (!test) {
    return <div> Loading... </div>;
  }
  const isAdmin = userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN;
  const isContentHidden =
    !isAdmin &&
    (test?.testContentVisibility === testContentVisibilityOptions.HIDDEN ||
      test?.testContentVisibility === testContentVisibilityOptions.GRADING);

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
          <span> Collection: {getTestAuthorName(test, collections)} </span>
        </Col>
      </Row>
      <span> Created By {test?.createdBy?.name} </span> <br />
      <hr />
      {!isContentHidden ? (
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
                isPrintPreview
              />
              <hr />
            </>
          ))}
          <span style={{ textDecoration: "underline", fontWeight: "700", fontSize: "18px" }}>
            Answer Key of {test.title}
          </span>
          {test.answers.map(answer => (
            <AnswerContainer>
              <div className="answer-wrapper">
                {answer.qLabel}. {answer.answer}
              </div>
              <hr />
            </AnswerContainer>
          ))}
        </AnswerContext.Provider>
      ) : (
        <div>
          <b>
            View of Items is restricted by the admin if content visibility is set to "Always hidden" OR "Hide prior to
            grading"
          </b>
        </div>
      )}
    </PrintAssessmentContainer>
  );
};

const enhance = compose(
  withRouter,
  connect(
    state => ({ collections: getCollectionsSelector(state), userRole: getUserRole(state) }),
    {}
  )
);

export default enhance(PrintAssessment);

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

import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";

import { withRouter } from "react-router-dom";
import { testsApi } from "@edulastic/api";
import { AnswerContext } from "@edulastic/common";
import moment from "moment";
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

  const date = moment().format("MM/DD/YYYY");
  if (!test) {
    return <div> Loading... </div>;
  }

  return (
    <div style={{ backgroundColor: "white", padding: "30px" }}>
      <span>{date} </span>
      <StyledTitle>
        <b>
          <Color>Edu</Color>
        </b>
        lastic
      </StyledTitle>
      <span> {test.title}</span> <br />
      <span> Created By {test.author} </span> <br />
      <span> Collection: {test.collectionName} </span>
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
            />
            <hr />
          </>
        ))}
        {test.answers.map(answer => (
          <div>
            {answer.qLabel}. {answer.answer}
            <hr />
          </div>
        ))}
      </AnswerContext.Provider>
    </div>
  );
};

export default withRouter(PrintAssessment);

const StyledTitle = styled.p`
  font-size: 30px;
  text-align: left;
  font-weight: normal;
  padding: 15px 0 0 25px;
  margin: 0;
`;

export const Color = styled.span`
  color: #58b294;
`;

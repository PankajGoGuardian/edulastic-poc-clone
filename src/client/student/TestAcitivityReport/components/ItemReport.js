import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { test as testConstants } from "@edulastic/constants";
import QuestionWrapper from "../../../assessment/components/QuestionWrapper";
const { releaseGradeLabels } = testConstants;
//TODO user  response to show in UI
const itemReport = ({ question, index, releaseScore, disableResponse }) => (
  <ReportListWrapper>
    <div style={{ width: "100%" }}>
      <QuestionWrapper testItem type={question.type} view="preview" data={question} disableResponse={disableResponse} />
      {releaseScore === releaseGradeLabels.WITH_ANSWERS && (
        <FeedbackWrapper>
          <FeedbackText>
            <QuestionText>Q{index + 1}</QuestionText> - Teacher Feedback
          </FeedbackText>
          <FeedbackContainer>
            <ScoreWrapper>
              <Score data-cy="score">{question.feedback && question.feedback.score}</Score>
              <Total data-cy="maxscore">{question.feedback && question.feedback.maxScore}</Total>
            </ScoreWrapper>
            <Feedback>
              <FeedbackGiven>{question.feedback && question.feedback.text}</FeedbackGiven>
            </Feedback>
          </FeedbackContainer>
        </FeedbackWrapper>
      )}
    </div>
  </ReportListWrapper>
);

itemReport.propTypes = {
  question: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  disableResponse: PropTypes.bool
};

itemReport.defaultProps = {
  disableResponse: false
};

export default itemReport;

const FeedbackWrapper = styled.div`
  margin-top: 55px;
  width: 850px;
  border-radius: 0.5rem;
  max-height: 250px;
`;

const Total = styled.div`
  font-weight: 600;
  font-size: 30px;
  text-align: center;
  color: #434b5d;
`;

const Score = styled(Total)`
  border-bottom: 0.2rem solid #434b5d;
`;

const Feedback = styled.div`
  flex: 1;
`;

const ScoreWrapper = styled.div`
  width: 62px;
`;

const FeedbackContainer = styled.div`
  display: flex;
  margin-top: 14px;
  background: #f8f8f8;
  padding: 26px 21px;
`;

const FeedbackText = styled.div`
  color: #444444;
  font-weight: 700;
  font-size: 16px;
  padding-bottom: 1rem;
  padding-left: 11px;
  border-bottom: 0.05rem solid #f2f2f2;
`;

const QuestionText = styled.span`
  font-weight: 700;
  font-size: 16px;
  color: #4aac8b;
`;

const FeedbackGiven = styled.div`
  max-height: 150px;
  overflow-y: scroll;
  line-height: 2.5;
  padding: 0px 0px 0px 28px;
  color: #878282;
  font-size: 0.8rem;
`;

const ReportListWrapper = styled.div`
  display: flex;
  padding: 1rem 0rem;
  justify-content: space-between;
`;

const SolutionWrapper = styled.div`
  width: 850px;
  margin-top: 50px;
`;

const Answer = styled.div`
  margin-top: 18px;
  margin-left: 20px;
  font-size: 14px;
  line-height: 1.86;
  color: #444444;
`;

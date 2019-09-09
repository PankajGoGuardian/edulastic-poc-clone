import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FeedbackByQIdSelector } from "../../sharedDucks/TestItem";
//TODO user  response to show in UI
const StudentFeedback = ({ question, qId, qLabel }) => {
  const { score, maxScore, feedback } = question[qId] || {};
  return (
    <FeedbackWrapper>
      <FeedbackText>
        <QuestionText>{qLabel}</QuestionText> - Teacher Feedback
      </FeedbackText>
      <FeedbackContainer>
        <ScoreWrapper>
          <Score>{score || score === 0 ? parseFloat(score.toFixed(2)) : "-"}</Score>
          <Total>{maxScore}</Total>
        </ScoreWrapper>
        <Feedback>
          <FeedbackGiven>{feedback && feedback.text}</FeedbackGiven>
        </Feedback>
      </FeedbackContainer>
    </FeedbackWrapper>
  );
};

StudentFeedback.propTypes = {
  question: PropTypes.object.isRequired,
  qId: PropTypes.number.isRequired
};

export default connect(
  state => ({
    question: FeedbackByQIdSelector(state)
  }),
  null
)(StudentFeedback);

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
  flex-wrap: wrap;
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

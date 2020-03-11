import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FeedbackByQIdSelector, getMaxScoreFromCurrentItem } from "../../sharedDucks/TestItem";
// TODO user  response to show in UI
const StudentFeedback = ({ question, qId, qLabel, itemMaxScore, style }) => {
  const { score = 0, maxScore = itemMaxScore, feedback, graded, skipped = true } = question[qId] || {};

  return (
    <FeedbackWrapper style={style}>
      <FeedbackText>
        <QuestionText>{qLabel}</QuestionText> - Teacher Feedback
      </FeedbackText>
      <FeedbackContainer>
        <ScoreWrapper>
          <Score data-cy="score">{skipped ? 0 : graded ? parseFloat(score.toFixed(2)) : <div>&nbsp;</div>}</Score>
          <Total data-cy="maxscore">{maxScore}</Total>
        </ScoreWrapper>
        <Feedback>
          <FeedbackGiven data-cy="feedback">{feedback && feedback.text}</FeedbackGiven>
        </Feedback>
      </FeedbackContainer>
    </FeedbackWrapper>
  );
};

StudentFeedback.propTypes = {
  question: PropTypes.object.isRequired,
  qId: PropTypes.number.isRequired,
  qLabel: PropTypes.string.isRequired
};

export default connect(
  state => ({
    question: FeedbackByQIdSelector(state),
    itemMaxScore: getMaxScoreFromCurrentItem(state)
  }),
  null
)(StudentFeedback);

const FeedbackWrapper = styled.div`
  margin-top: 55px;
  width: 25%;
  border-radius: 0.5rem;
  max-height: 250px;
  ${({ style }) => style};
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
  max-width: 80px;
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
  max-height: 400px;
  overflow-y: auto;
  line-height: 2.5;
  padding: 0px 0px 0px 28px;
  color: #878282;
  font-size: 0.8rem;
`;

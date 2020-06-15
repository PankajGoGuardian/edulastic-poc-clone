import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Tooltip } from "antd";
import { IconCheck } from "@edulastic/icons";
import { white } from "@edulastic/colors";
import { FlexContainer } from "@edulastic/common";
import { FeedbackByQIdSelector, getMaxScoreFromCurrentItem } from "../../sharedDucks/TestItem";
import { getClasses } from "../../Login/ducks";

// TODO user  response to show in UI
const StudentFeedback = ({ question, qId, qLabel, itemMaxScore, isPracticeQuestion, style, classList = [] }) => {
  const { score = 0, maxScore = itemMaxScore, feedback, graded, skipped = true, groupId } = question[qId] || {};

  let _score = skipped ? 0 : parseFloat(score.toFixed(2));
  if (!graded || isPracticeQuestion) {
    _score = "";
  }

  const feedbackTeacher = {
    thumbnail: "",
    firstName: "",
    lastName: ""
  };
  if (feedback) {
    feedbackTeacher.thumbnail = feedback?.thumbnail;
    const [firstName, lastName] = feedback?.teacherName.split(" ");
    feedbackTeacher.firstName = firstName;
    feedbackTeacher.lastName = lastName || "";
  } else {
    const classOwner = classList.find(({ _id }) => _id === groupId)?.owners?.[0];
    feedbackTeacher.thumbnail = classOwner?.thumbnail;
    feedbackTeacher.firstName = classOwner?.firstName;
    feedbackTeacher.lastName = classOwner?.lastName || "";
  }

  const getUserName = type => {
    let userInitials = "";
    const { firstName = "", lastName = "" } = feedbackTeacher;
    if (type === "initials") {
      if (firstName) {
        userInitials += firstName[0].toLocaleUpperCase();
      }
      if (lastName) {
        userInitials += lastName[0].toLocaleUpperCase();
      }
    } else {
      if (firstName) {
        userInitials += firstName;
      }

      if (lastName) {
        userInitials += " ";
        userInitials += lastName;
      }
    }
    return userInitials;
  };

  const _maxScore = isPracticeQuestion ? "" : maxScore;
  return (
    <FeedbackWrapper style={style}>
      <FeedbackText>
        <QuestionText>{qLabel}</QuestionText> - Teacher Feedback
      </FeedbackText>
      <FlexContainer justifyContent="flex-start" padding="0 1rem" alignItems="flex-start">
        <FeedbackContainer>
          <IconCheckWrapper>
            <IconCheck />
          </IconCheckWrapper>
          <ScoreWrapper>
            <Score data-cy="score">{_score}</Score>
            <Total data-cy="maxscore">{_maxScore}</Total>
          </ScoreWrapper>
          <Feedback>
            <FeedbackGiven data-cy="feedback">{feedback && feedback.text}</FeedbackGiven>
          </Feedback>
        </FeedbackContainer>

        <Tooltip placement="top" title={getUserName("fullName")}>
          {feedbackTeacher.thumbnail ? (
            <UserImg src={feedbackTeacher.thumbnail} />
          ) : (
            <UserInitials>{getUserName("initials")}</UserInitials>
          )}
        </Tooltip>
      </FlexContainer>
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
    itemMaxScore: getMaxScoreFromCurrentItem(state),
    classList: getClasses(state)
  }),
  null
)(StudentFeedback);

const FeedbackWrapper = styled.div`
  margin-top: 55px;
  width: 25%;
  border-radius: 0.5rem;
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
  min-width: 65px;
  padding: 0px 12px;
`;

const FeedbackContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 14px;
  background: #f8f8f8;
  margin-right: 8px;
  padding: 26px 21px;
  position: relative;

  &::after {
    content: "";
    top: 32px;
    right: -24px;
    position: absolute;
    border-style: solid;
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-left-color: #f8f8f8;
    border-top-width: 24px;
    border-right-width: 12px;
    border-left-width: 12px;
    border-bottom-width: 24px;
  }
`;

const IconCheckWrapper = styled.div`
  width: 32px;
  height: 32px;
  background: #00ad50;
  border-radius: 50%;
  position: absolute;
  top: 5px;
  left: 5px;
  display: flex;
  justify-content: center;
  align-items: center;

  & svg {
    fill: ${white};
  }
`;

const FeedbackText = styled.div`
  color: #434b5d;
  font-weight: 700;
  font-size: 16px;
  padding-bottom: 1.5rem;
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
  padding: 0px 0px 0px 16px;
  color: #878282;
  font-size: 0.8rem;
`;

const UserImg = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: url(${props => props.src});
  background-position: center center;
  background-size: cover;
  border-radius: 50%;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  margin-top: 50px;
  margin-left: 16px;
`;

const UserInitials = styled(UserImg)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  background: #dddddd;
`;

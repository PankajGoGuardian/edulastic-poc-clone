import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Tooltip } from "antd";
import { FlexContainer } from "@edulastic/common";
import { IconCheck } from "@edulastic/icons";
import { white } from "@edulastic/colors";
import { get } from "lodash";
import { getClasses } from "../../Login/ducks";

const OverallFeedback = ({ testActivity, classList = [] }) => {
  const { feedback, groupId, score, maxScore } = testActivity;
  if (!feedback) {
    return null;
  }
  const { teacherId } = feedback;
  const classOwner = classList.find(({ _id }) => _id === groupId)?.owners?.find(x => x._id === teacherId);

  const getUserName = type => {
    let userInitials = "";
    const { firstName = "", lastName = "" } = classOwner;
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

  return (
    <FeedbackWrapper>
      <FeedbackText>Teacher Feedback</FeedbackText>
      <FlexContainer justifyContent="flex-start" padding="0px" alignItems="flex-start">
        <FeedbackContainer>
          <IconCheckWrapper>
            <IconCheck />
          </IconCheckWrapper>
          <ScoreWrapper>
            <Score data-cy="score">{score}</Score>
            <Total data-cy="maxscore">{maxScore}</Total>
          </ScoreWrapper>

          <Feedback>
            <FeedbackGiven data-cy="feedback">{feedback && feedback.text}</FeedbackGiven>
          </Feedback>
        </FeedbackContainer>
        <Tooltip placement="top" title={getUserName("fullName")}>
          {classOwner.thumbnail ? (
            <UserImg src={classOwner.thumbnail} />
          ) : (
            <UserInitials>{getUserName("initials")}</UserInitials>
          )}
        </Tooltip>
      </FlexContainer>
    </FeedbackWrapper>
  );
};

export default connect(
  state => ({
    classList: getClasses(state),
    testActivity: get(state, `[studentReport][testActivity]`, {})
  }),
  null
)(OverallFeedback);

const FeedbackWrapper = styled.div`
  margin-top: 20px;
  padding: 0px 20px;
  width: 100%;
  border-radius: 0.5rem;
`;

const FeedbackText = styled.div`
  color: #434b5d;
  font-weight: 700;
  font-size: 16px;
  padding-bottom: 1.5rem;
  padding-left: 11px;
  border-bottom: 0.05rem solid #f2f2f2;
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
  width: 22px;
  height: 22px;
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

const ScoreWrapper = styled.div`
  max-width: 80px;
  min-width: 65px;
  padding: 0px 12px;
`;

const Feedback = styled.div`
  flex: 1;
`;

const FeedbackGiven = styled.div`
  max-height: 400px;
  overflow-y: auto;
  line-height: 2.5;
  padding: 0px 0px 0px 16px;
  color: #878282;
  font-size: 0.8rem;
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

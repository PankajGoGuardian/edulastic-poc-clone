import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import { Divider } from "antd";
import styled from "styled-components";
import { yellow, greenDark3, red } from "@edulastic/colors";
import { IconCorrect, IconRemove, IconWrong } from "@edulastic/icons";
import { assignmentPolicyOptions } from "@edulastic/constants";
import { redirectPolicySelector } from "../selectors/test";

const TeacherResponseContainer = ({
  correct,
  answerIcon,
  answer,
  isResponseVisible,
  prevScore,
  prevMaxScore,
  prevFeedback
}) => (
  <TeacherResponse data-cy="teacherResponse">
    <FlexBox>
      <div>
        {correct !== undefined && (
          <span>
            {answerIcon} {`  ${answer}`}
          </span>
        )}
      </div>
      {isResponseVisible && (
        <div>
          <IconRemove data-cy="remove" height={20} width={20} />
        </div>
      )}
    </FlexBox>
    {(prevScore || prevScore === 0) && (
      <FlexBox column>
        <ScoreWrapper data-cy="score">{prevScore}</ScoreWrapper>
        <ScoreDevider />
        <ScoreWrapper data-cy="maxscore">{prevMaxScore}</ScoreWrapper>
      </FlexBox>
    )}
    {!!prevFeedback?.text && <div data-cy="feedBack">{`${prevFeedback.teacherName}: ${prevFeedback.text}`}</div>}
  </TeacherResponse>
);
const FeedBackContainer = ({ correct, prevScore, prevMaxScore, prevFeedback, itemId, userAnswers, redirectPolicy }) => {
  const [feedbackView, setFeedbackView] = useState(false);
  const toggleFeedbackView = () => {
    setFeedbackView(!feedbackView);
  };
  useEffect(() => {
    setFeedbackView(false);
  }, [itemId]);

  const iconHeight = feedbackView ? 12 : 40;
  const iconHeight2 = feedbackView ? 10 : 30;
  const { answer, answerIcon } =
    correct === true
      ? prevScore === prevMaxScore
        ? { answer: "Correct", answerIcon: <IconCorrect height={iconHeight} width={iconHeight} color={greenDark3} /> }
        : {
            answer: "Partially Correct",
            answerIcon: <IconCorrect height={iconHeight} width={iconHeight} color={yellow} />
          }
      : { answer: "Incorrect", answerIcon: <IconWrong height={iconHeight2} width={iconHeight2} color={red} /> };
  const isResponseVisible =
    redirectPolicy === assignmentPolicyOptions.showPreviousAttemptOptions.STUDENT_RESPONSE_AND_FEEDBACK;
  const props = { correct, answerIcon, answer, isResponseVisible, prevScore, prevMaxScore, prevFeedback };
  const currentUserAnswer = userAnswers?.[itemId];
  if (!isEmpty(currentUserAnswer)) {
    return null;
  }
  if (!isResponseVisible) {
    // return here if all contents are blank
    if (!prevFeedback?.text && correct === undefined && !(prevScore || prevScore === 0)) return "";
    return (
      <Wrapper visible>
        <TeacherResponseContainer {...props} />
      </Wrapper>
    );
  }
  return (
    <Wrapper onClick={toggleFeedbackView} visible>
      {!feedbackView && correct !== undefined && (
        <div style={{ width: "100px" }}>
          <div data-cy="answerIcon" style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
            {answerIcon}
          </div>
          <div data-cy="answerType" style={{ textAlign: "center" }}>{`Thats ${answer}`}</div>
        </div>
      )}
      {feedbackView && <TeacherResponseContainer {...props} />}
    </Wrapper>
  );
};

FeedBackContainer.propTypes = {
  correct: PropTypes.bool.isRequired,
  prevScore: PropTypes.number.isRequired,
  prevMaxScore: PropTypes.number.isRequired
};

FeedBackContainer.defaultProps = {};

export default connect(
  state => ({ redirectPolicy: redirectPolicySelector(state), userAnswers: state.answers }),
  null
)(FeedBackContainer);

const Wrapper = styled.div`
  position: fixed;
  right: 40px;
  display: ${({ visible }) => (visible ? "flex" : "none")};
  flex-direction: column;
  box-shadow: 0 3px 10px 2px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  top: 100px;
  padding: 20px 15px;
  background-color: white;
  z-index: 100;
`;

const TeacherResponse = styled.div`
  width: 120px;
`;
const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
  ${props => props.column && "flex-direction:column;"}
`;

const ScoreWrapper = styled.div`
  text-align: center;
  font-size: 20px;
`;
const ScoreDevider = styled(Divider)`
  height: 3px;
  width: 50%;
  background-color: black;
  margin: 3px auto;
`;

/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { yellow, greenDark3, red } from "@edulastic/colors";
import { IconCorrect, IconRemove, IconWrong } from "@edulastic/icons";
import { Divider } from "antd";

const FeedBackContainer = ({ correct, prevScore, prevMaxScore, prevFeedback, itemId }) => {
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
  return (
    <Wrapper onClick={toggleFeedbackView} visible={(!feedbackView && correct !== undefined) || feedbackView}>
      {!feedbackView && correct !== undefined && (
        <div style={{ width: "100px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>{answerIcon}</div>
          <div style={{ textAlign: "center" }}>{`Thats ${answer}`}</div>
        </div>
      )}
      {feedbackView && (
        <div style={{ width: "120px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              {correct !== undefined && (
                <span>
                  {answerIcon} {`  ${answer}`}
                </span>
              )}
            </div>
            <div>
              <IconRemove height={20} width={20} />
            </div>
          </div>
          {(prevScore || prevScore === 0) && (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ textAlign: "center", fontSize: "20px" }}>{prevScore}</div>
              <Divider
                style={{ height: "3px", width: "50%", minWidth: "50%", backgroundColor: "black", margin: "3px auto" }}
              />
              <div style={{ textAlign: "center", fontSize: "20px" }}>{prevMaxScore}</div>
            </div>
          )}
          {!!prevFeedback && <div>{`${prevFeedback.teacherName}: ${prevFeedback.text}`}</div>}
        </div>
      )}
    </Wrapper>
  );
};

FeedBackContainer.propTypes = {
  correct: PropTypes.bool.isRequired,
  prevScore: PropTypes.number.isRequired,
  prevMaxScore: PropTypes.number.isRequired
};

FeedBackContainer.defaultProps = {};

export default FeedBackContainer;

const Wrapper = styled.div`
  position: absolute;
  right: -18px;
  display: ${({ visible }) => (visible ? "flex" : "none")};
  flex-direction: column;
  box-shadow: 0 3px 10px 2px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  top: 40px;
  padding: 20px 15px;
  background-color: white;
`;

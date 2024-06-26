import React, { Component } from "react";
import PropTypes from "prop-types";
import { round } from "lodash";
import { StyledText, StyledWrapper } from "./styled";
import { Tooltip } from "../../../../common/utils/helpers";

class QuestionScore extends Component {
  render() {
    const { question, tableData, showQuestionModal, isTest, scoreMode = true } = this.props;
    const isQuestion = question && question.score !== undefined && question.maxScore !== undefined;
    let { score: studentScore, graded, skipped, maxScore, responseToDisplay } = question || {}; // score, maxScore,
    let answerStatus = null;
    if (studentScore === maxScore && maxScore > 0) {
      answerStatus = "correct";
    } else if (skipped) {
      answerStatus = "skipped";
    } else if (graded === false) {
      answerStatus = "ungraded";
    } else if (studentScore === 0 && maxScore > 0) {
      answerStatus = "wrong";
    } else if (studentScore > 0 && studentScore < maxScore && maxScore > 0) {
      answerStatus = "partiallyCorrect";
    }

    if (!isQuestion) {
      // score = 0;
      // maxScore = 1;
      studentScore = "-";
    }
    if (skipped) studentScore = 0;
    return (
      <React.Fragment>
        {isTest ? (
          <StyledWrapper answerStatus={answerStatus} onClick={() => showQuestionModal(question, tableData)}>
            {/* color={getScoreColor(score, maxScore)} */}
            {scoreMode ? (
              <StyledText>{graded || skipped ? round(studentScore, 2) : "-"}</StyledText>
            ) : (
              <Tooltip title={<span dangerouslySetInnerHTML={{ __html: responseToDisplay || "-" }} />}>
                <StyledText
                  dangerouslySetInnerHTML={{ __html: responseToDisplay || "-" }}
                  responseView
                />
              </Tooltip>
              )}
          </StyledWrapper>
        ) : (
          <StyledWrapper>
            <StyledText>-</StyledText>
          </StyledWrapper>
          )}
      </React.Fragment>
    );
  }
}

QuestionScore.propTypes = {
  question: PropTypes.object.isRequired,
  tableData: PropTypes.array.isRequired,
  showQuestionModal: PropTypes.func.isRequired,
  isTest: PropTypes.string
};

QuestionScore.defaultProps = {
  isTest: ""
};

export default QuestionScore;

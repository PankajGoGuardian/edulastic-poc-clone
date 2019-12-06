import React, { Component } from "react";
import PropTypes from "prop-types";
import { StyledText, StyledWrapper } from "./styled";
import { round } from "lodash";

class QuestionScore extends Component {
  render() {
    const { question, tableData, showQuestionModal, isTest } = this.props;
    const isQuestion = question && question.score !== undefined && question.maxScore !== undefined;
    let { score: studentScore, graded } = question; // score, maxScore,
    if (!isQuestion) {
      // score = 0;
      // maxScore = 1;
      studentScore = "-";
    }

    return (
      <React.Fragment>
        {isTest ? (
          <StyledWrapper onClick={() => showQuestionModal(question, tableData)}>
            {/* color={getScoreColor(score, maxScore)} */}
            <StyledText>{graded ? round(studentScore, 2) : "-"}</StyledText>
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

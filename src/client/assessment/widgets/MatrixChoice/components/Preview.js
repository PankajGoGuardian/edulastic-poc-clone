import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { cloneDeep } from "lodash";
import { InstructorStimulus, MathFormulaDisplay, QuestionNumberLabel } from "@edulastic/common";

import Matrix from "./Matrix";
import CheckAnswerButton from "../../../themes/common/CheckAnswerButton";
import { CLEAR } from "../../../constants/constantsForQuestions";

const Preview = ({
  type,
  saveAnswer,
  userAnswer,
  item,
  smallSize,
  onCheckAnswer,
  feedbackAttempts,
  previewTab,
  changePreviewTab,
  disableResponse,
  showQuestionNumber,
  qIndex,
  isReviewTab,
  changeView
}) => {
  const handleCheck = ({ columnIndex, rowIndex, checked }) => {
    const newAnswer = cloneDeep(userAnswer);
    if (previewTab !== CLEAR) {
      changePreviewTab(CLEAR);
      changeView(CLEAR);
    }
    let value = newAnswer.value[rowIndex];
    let findIndex;

    if (value) {
      findIndex = value.findIndex(i => i === columnIndex);
    }

    if (!checked && value) {
      value.splice(findIndex, 1);
    } else if (!value || !item.multipleResponses) {
      value = [];
      value.push(columnIndex);
    } else {
      value.push(columnIndex);
    }

    newAnswer.value[rowIndex] = value;

    saveAnswer(newAnswer);
  };

  return (
    <QuestionWrapper>
      <QuestionTitleWrapper>
        {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}:</QuestionNumberLabel>}
        <QuestionContentWrapper>
          <MathFormulaDisplay style={{ marginBottom: 20 }} dangerouslySetInnerHTML={{ __html: item.stimulus }} />
          <Matrix
            stems={item.stems}
            options={item.options}
            uiStyle={item.uiStyle}
            response={userAnswer}
            isMultiple={item.multipleResponses}
            onCheck={!disableResponse ? handleCheck : () => {}}
            validation={item.validation}
            type={type}
            smallSize={smallSize}
            previewTab={previewTab}
            isReviewTab={isReviewTab}
          />
        </QuestionContentWrapper>
      </QuestionTitleWrapper>

      {item.instant_feedback && <CheckAnswerButton feedbackAttempts={feedbackAttempts} onCheck={onCheckAnswer} />}
    </QuestionWrapper>
  );
};

Preview.propTypes = {
  type: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.object.isRequired,
  onCheckAnswer: PropTypes.func.isRequired,
  feedbackAttempts: PropTypes.number.isRequired,
  smallSize: PropTypes.bool,
  showQuestionNumber: PropTypes.bool,
  qIndex: PropTypes.number,
  isReviewTab: PropTypes.bool,
  changeView: PropTypes.func.isRequired
};

Preview.defaultProps = {
  smallSize: false,
  showQuestionNumber: false,
  qIndex: null,
  isReviewTab: false
};

export default Preview;

const QuestionTitleWrapper = styled.div`
  display: flex;
`;

const QuestionContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const QuestionWrapper = styled.div`
  width: max-content;
`;

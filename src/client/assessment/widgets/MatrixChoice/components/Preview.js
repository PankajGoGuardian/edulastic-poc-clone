import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { cloneDeep } from "lodash";
import { InstructorStimulus, MathFormulaDisplay } from "@edulastic/common";

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
  isReviewTab
}) => {
  const handleCheck = ({ columnIndex, rowIndex, checked }) => {
    const newAnswer = cloneDeep(userAnswer);
    if (previewTab !== CLEAR) {
      changePreviewTab(CLEAR);
    }
    let value = newAnswer.value[rowIndex];
    let findIndex;

    if (value) {
      findIndex = value.findIndex(i => i === columnIndex);
    }

    if (!checked && value) {
      value.splice(findIndex, 1);
    } else if (!value || !item.multiple_responses) {
      value = [];
      value.push(columnIndex);
    } else {
      value.push(columnIndex);
    }

    newAnswer.value[rowIndex] = value;

    saveAnswer(newAnswer);
  };

  return (
    <div>
      <InstructorStimulus>{item.instructor_stimulus}</InstructorStimulus>

      <QuestionTitleWrapper>
        {showQuestionNumber && <QuestionNumber>{item.qLabel}</QuestionNumber>}
        <MathFormulaDisplay style={{ marginBottom: 20 }} dangerouslySetInnerHTML={{ __html: item.stimulus }} />
      </QuestionTitleWrapper>

      <Matrix
        stems={item.stems}
        options={item.options}
        uiStyle={item.ui_style}
        response={userAnswer}
        isMultiple={item.multiple_responses}
        onCheck={!disableResponse ? handleCheck : () => {}}
        validation={item.validation}
        type={type}
        smallSize={smallSize}
        previewTab={previewTab}
        isReviewTab={isReviewTab}
      />
      {item.instant_feedback && <CheckAnswerButton feedbackAttempts={feedbackAttempts} onCheck={onCheckAnswer} />}
    </div>
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
  isReviewTab: PropTypes.bool
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

const QuestionNumber = styled.div`
  font-weight: 700;
  margin-right: 4px;
`;

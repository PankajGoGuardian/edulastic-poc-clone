/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { cloneDeep } from "lodash";
import { QuestionTitle } from "@edulastic/common";

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

  const questionContent = (
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
  );

  return (
    <div>
      <QuestionTitle
        show={showQuestionNumber}
        label={item.qLabel}
        stimulus={item.stimulus}
        question={questionContent}
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
  isReviewTab: PropTypes.bool,
  changeView: PropTypes.func.isRequired
};

Preview.defaultProps = {
  smallSize: false,
  showQuestionNumber: false,
  isReviewTab: false
};

export default Preview;

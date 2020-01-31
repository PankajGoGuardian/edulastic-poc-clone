import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { cloneDeep } from "lodash";

import Matrix from "./Matrix";
import CheckAnswerButton from "../../../themes/common/CheckAnswerButton";
import { CLEAR } from "../../../constants/constantsForQuestions";

const Preview = ({
  saveAnswer,
  userAnswer,
  item,
  smallSize,
  onCheckAnswer,
  feedbackAttempts,
  previewTab,
  changePreviewTab,
  disableResponse,
  changeView,
  evaluation
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
      <QuestionContent>
        <Matrix
          stems={item.stems}
          options={item.options}
          uiStyle={item.uiStyle}
          response={userAnswer}
          isMultiple={item.multipleResponses}
          onCheck={!disableResponse ? handleCheck : () => {}}
          evaluation={evaluation}
          smallSize={smallSize}
        />
      </QuestionContent>

      {item.instant_feedback && <CheckAnswerButton feedbackAttempts={feedbackAttempts} onCheck={onCheckAnswer} />}
    </QuestionWrapper>
  );
};

Preview.propTypes = {
  item: PropTypes.object.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.object.isRequired,
  onCheckAnswer: PropTypes.func.isRequired,
  feedbackAttempts: PropTypes.number.isRequired,
  smallSize: PropTypes.bool,
  changeView: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func,
  evaluation: PropTypes.object,
  previewTab: PropTypes.string,
  disableResponse: PropTypes.bool
};

Preview.defaultProps = {
  smallSize: false,
  evaluation: null,
  previewTab: CLEAR,
  changePreviewTab: () => {},
  disableResponse: false
};

export default Preview;

const QuestionContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const QuestionWrapper = styled.div`
  max-width: 100%;
  width: max-content;
`;

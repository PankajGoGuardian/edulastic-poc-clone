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
  pl,
  smallSize,
  onCheckAnswer,
  feedbackAttempts,
  previewTab,
  changePreviewTab,
  disableResponse,
  changeView,
  evaluation,
  isPrintPreview
}) => {
  const handleCheck = ({ columnIndex, rowIndex, checked }) => {
    const newAnswer = cloneDeep(userAnswer);
    if (previewTab !== CLEAR) {
      changePreviewTab(CLEAR);
      changeView(CLEAR);
    }

    const { responseIds = [] } = item || {};
    const rowIds = responseIds?.[rowIndex];
    const responseId = rowIds?.[columnIndex];
    newAnswer.value[responseId] = checked;

    if (!item.multipleResponses) {
      rowIds.forEach(id => {
        if (id !== responseId) {
          delete newAnswer.value[id];
        }
      });
    }

    if (!newAnswer.value[responseId]) {
      delete newAnswer.value[responseId];
    }

    saveAnswer(newAnswer);
  };

  return (
    <QuestionWrapper pl={pl}>
      <QuestionContent>
        <Matrix
          stems={item.stems}
          options={item.options}
          uiStyle={item.uiStyle}
          response={userAnswer}
          responseIds={item.responseIds}
          isMultiple={item.multipleResponses}
          onCheck={!disableResponse ? handleCheck : () => {}}
          evaluation={evaluation}
          smallSize={smallSize}
          isPrintPreview={isPrintPreview}
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
  padding-left: ${({ pl }) => pl};
`;

import React, { useContext } from "react";
import { withTheme } from "styled-components";
import get from "lodash/get";
import PropTypes from "prop-types";

import { Stimulus, FlexContainer, QuestionNumberLabel, AnswerContext } from "@edulastic/common";
import Circles from "./Circles";
import Rectangles from "./Rectangles";
import AnnotationRnd from "../../../components/Annotations/AnnotationRnd";
import { CLEAR, SHOW } from "../../../constants/constantsForQuestions";

const Display = ({
  saveAnswer,
  item,
  stimulus,
  evaluation,
  previewTab,
  showQuestionNumber,
  userAnswer,
  changePreviewTab
}) => {
  const { fractionProperties = {} } = item;
  const fractionType = fractionProperties.fractionType;
  const count = fractionProperties.count || 1;
  let selected = userAnswer;

  const answerContext = useContext(AnswerContext);

  if (previewTab === "show" && answerContext.isAnswerModifiable && !answerContext.expressGrader) {
    selected = Array(get(item, "validation.validResponse.value", 1))
      .fill()
      .map((_, i) => i + 1);
  }

  const handleSelect = index => {
    if (
      previewTab === "check" ||
      (previewTab === "show" && !answerContext.expressGrader && answerContext.isAnswerModifiable)
    ) {
      saveAnswer([]);
      changePreviewTab("clear");
      return;
    }
    const _userAnswer = [...userAnswer];
    if (_userAnswer.includes(index)) {
      _userAnswer.splice(_userAnswer.indexOf(index), 1);
    } else {
      _userAnswer.push(index);
    }
    saveAnswer(_userAnswer);
  };

  return (
    <FlexContainer justifyContent="flex-start" flexDirection="column" alignItems="flex-start" flexWrap="wrap">
      {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}: </QuestionNumberLabel>}
      <Stimulus dangerouslySetInnerHTML={{ __html: stimulus }} />
      <FlexContainer style={{ position: "relative" }} flexWrap="wrap" justifyContent="flex-start">
        {Array(count)
          .fill()
          .map((_, index) => {
            return fractionType === "circles" ? (
              <Circles
                fractionNumber={index}
                sectors={fractionProperties.sectors}
                selected={selected}
                sectorClick={index => handleSelect(index)}
                previewTab={previewTab}
                isExpressGrader={answerContext.expressGrader}
                isAnswerModifiable={answerContext.isAnswerModifiable}
                evaluation={evaluation}
              />
            ) : (
              <Rectangles
                fractionNumber={index}
                rows={fractionProperties.rows}
                columns={fractionProperties.columns}
                selected={selected}
                onSelect={index => handleSelect(index)}
                previewTab={previewTab}
                isExpressGrader={answerContext.expressGrader}
                isAnswerModifiable={answerContext.isAnswerModifiable}
                evaluation={evaluation}
              />
            );
          })}
        <AnnotationRnd question={item} setQuestionData={() => {}} disableDragging />
      </FlexContainer>
    </FlexContainer>
  );
};

Display.propTypes = {
  previewTab: PropTypes.string,
  item: PropTypes.object,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.array,
  evaluation: PropTypes.any,
  showQuestionNumber: PropTypes.bool,
  stimulus: PropTypes.string
};

Display.defaultProps = {
  previewTab: CLEAR,
  item: {},
  userAnswer: [],
  evaluation: [],
  showQuestionNumber: false,
  stimulus: ""
};

export default withTheme(Display);

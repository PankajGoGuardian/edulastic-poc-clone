import React from "react";
import { withTheme } from "styled-components";
import get from "lodash/get";
import PropTypes from "prop-types";

import { Stimulus, FlexContainer, QuestionNumberLabel } from "@edulastic/common";
import Circles from "./Circles";
import Rectangles from "./Rectangles";
import AnnotationRnd from "../../../components/Annotations/AnnotationRnd";
import { CLEAR, SHOW } from "../../../constants/constantsForQuestions";

const Display = ({ saveAnswer, item, stimulus, evaluation, previewTab, showQuestionNumber, userAnswer }) => {
  let fillColor = {};

  const { fractionProperties = {} } = item;
  const { fractionType, count = 1 } = fractionProperties;

  let selected = userAnswer;
  if (previewTab === SHOW) {
    if (fractionType === "circles") {
      selected = Array(get(item, "validation.validResponse.value", 1))
        .fill()
        .map((_, i) => i + 1);
    } else {
      selected = Array(get(item, "validation.validResponse.value", 1))
        .fill()
        .map((_, i) => i + 1);
    }
  }

  if (evaluation) {
    Object.keys(evaluation).forEach(key => {
      fillColor[key] = evaluation[key] === true ? "green" : "red";
    });
    if (previewTab === CLEAR) {
      fillColor = {};
    }
  }

  const handleSelect = index => {
    const _userAnswer = [...userAnswer];
    if (_userAnswer.includes(index)) {
      _userAnswer.splice(_userAnswer.indexOf(index));
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
                sectorClick={i => handleSelect(i)}
                fillColor={fillColor}
                previewTab={previewTab}
              />
            ) : (
              <Rectangles
                fractionNumber={index}
                rows={fractionProperties.rows}
                columns={fractionProperties.columns}
                selected={selected}
                onSelect={i => handleSelect(i)}
                fillColor={fillColor}
                previewTab={previewTab}
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

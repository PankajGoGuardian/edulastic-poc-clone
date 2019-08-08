import React, { useEffect } from "react";
import { withTheme } from "styled-components";
import get from "lodash/get";

import { Stimulus, FlexContainer, QuestionNumberLabel } from "@edulastic/common";
import Circles from "./Circles";
import Rectangles from "./Rectangles";

const Display = ({ saveAnswer, item, stimulus, evaluation, previewTab, showQuestionNumber, userAnswer }) => {
  let fillColor = {};

  const { fractionProperties = {} } = item;
  const fractionType = fractionProperties.fractionType;
  const count = fractionProperties.count || 1;

  let selected = userAnswer;
  if (previewTab === "show") {
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
    if (previewTab === "clear") {
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
      <FlexContainer flexWrap="wrap">
        {Array(count)
          .fill()
          .map((_, index) => {
            return fractionType === "circles" ? (
              <Circles
                fractionNumber={index}
                sectors={fractionProperties.sectors}
                selected={selected}
                sectorClick={index => handleSelect(index)}
                fillColor={fillColor}
                previewTab={previewTab}
              />
            ) : (
              <Rectangles
                fractionNumber={index}
                rows={fractionProperties.rows}
                columns={fractionProperties.columns}
                selected={selected}
                onSelect={index => handleSelect(index)}
                fillColor={fillColor}
                previewTab={previewTab}
              />
            );
          })}
      </FlexContainer>
    </FlexContainer>
  );
};

export default withTheme(Display);

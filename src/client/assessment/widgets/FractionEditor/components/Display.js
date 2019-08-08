import React from "react";
import { withTheme } from "styled-components";

import { Stimulus, FlexContainer, QuestionNumberLabel } from "@edulastic/common";
import Circles from "./Circles";
import Rectangles from "./Rectangles";

const Display = ({
  saveAnswer,
  item,
  t,
  stimulus,
  produce,
  evaluation,
  previewTab,
  showQuestionNumber,
  userAnswer
}) => {
  const { fractionProperties = {} } = item;
  const fractionType = fractionProperties.fractionType;
  const count = fractionProperties.count || 1;

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
          .map((el, index) => {
            return fractionType === "circles" ? (
              <Circles
                fractionNumber={index}
                sectors={fractionProperties.sectors}
                selected={userAnswer}
                sectorClick={index => handleSelect(index)}
              />
            ) : (
              <Rectangles
                fractionNumber={index}
                rows={fractionProperties.rows}
                columns={fractionProperties.columns}
                selected={userAnswer}
                onSelect={index => handleSelect(index)}
              />
            );
          })}
      </FlexContainer>
    </FlexContainer>
  );
};

export default withTheme(Display);

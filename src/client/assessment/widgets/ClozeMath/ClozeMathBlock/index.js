import React from "react";
import styled from "styled-components";
import { isEmpty } from "lodash";

import ClozeDropDown from "./ClozeDropDown";
import CheckedDropDown from "./CheckedDropDown";
import ClozeInput from "./ClozeInput";
import CheckedInput from "./CheckedInput";

const ClozeMathBlock = ({
  blocks,
  handleAddAnswer,
  options,
  checked,
  dropDwonEvaluation,
  inputEvaluation,
  userSelections
}) => {
  const parsreTemplate = tpl => tpl.match(/(<span.*?<\/span>)/g);
  let dropDownOptionIndex = 0;
  let inputIndex = 0;

  const { dropDown: _dropDownAnswers, inputs: _inputAnswers } = userSelections;

  return blocks.map((block, blockIndex) => {
    const templateParts = parsreTemplate(block);
    if (isEmpty(templateParts)) {
      return <MathP key={blockIndex} dangerouslySetInnerHTML={{ __html: block }} />;
    }
    return templateParts.map((tplPart, tplIndex) => {
      if (tplPart.indexOf('class="text-dropdown-btn"') !== -1) {
        const optionsIndex = dropDownOptionIndex;
        dropDownOptionIndex++;
        return checked ? (
          <CheckedDropDown
            isCorrect={dropDwonEvaluation[optionsIndex]}
            userAnswer={_dropDownAnswers[optionsIndex]}
            index={optionsIndex}
          />
        ) : (
          <ClozeDropDown
            key={`${blockIndex}_${tplIndex}`}
            handleAddAnswer={handleAddAnswer}
            optionsIndex={optionsIndex}
            options={options}
          />
        );
      }
      if (tplPart.indexOf('class="text-input-btn"') !== -1) {
        const targetIndex = inputIndex;
        inputIndex++;
        return checked ? (
          <CheckedInput
            isCorrect={inputEvaluation[targetIndex]}
            userAnswer={_inputAnswers[targetIndex]}
            index={targetIndex}
          />
        ) : (
          <ClozeInput handleAddAnswer={handleAddAnswer} targetIndex={targetIndex} key={`${blockIndex}_${tplIndex}`} />
        );
      }
      return <MathP key={`${blockIndex}_${tplIndex}`} dangerouslySetInnerHTML={{ __html: tplPart }} />;
    });
  });
};

export default ClozeMathBlock;

const MathP = styled.p`
  p {
    display: inline;
  }
`;

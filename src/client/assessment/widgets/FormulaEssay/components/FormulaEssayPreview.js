import React from "react";
import PropTypes from "prop-types";
import { MathFormulaDisplay, QuestionNumberLabel } from "@edulastic/common";

import { MathEssayInputWrapper } from "./styled";

import MathEssayInput from "./MathEssayInput";

import { InstructorStimulus } from "../styled/InstructorStimulus";
import { QuestionTitleWrapper } from "../styled/QustionNumber";

const FormulaEssayPreview = ({
  item,
  type: previewType,
  lines,
  setLines,
  resetLines,
  showQuestionNumber,
  qIndex,
  disableResponse
}) => {
  return (
    <MathEssayInputWrapper>
      <InstructorStimulus>{item.instructorStimulus}</InstructorStimulus>
      <QuestionTitleWrapper>
        {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}:</QuestionNumberLabel>}
        <MathFormulaDisplay style={{ marginBottom: 15 }} dangerouslySetInnerHTML={{ __html: item.stimulus }} />
      </QuestionTitleWrapper>
      <MathEssayInput
        disableResponse={disableResponse}
        item={item}
        textFormattingOptions={item.uiStyle && item.uiStyle.textFormattingOptions}
        uiStyle={item.uiStyle}
        value={item.template}
        lines={lines}
        setLines={setLines}
        onInput={latex => console.log(latex)}
      />
    </MathEssayInputWrapper>
  );
};

FormulaEssayPreview.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  lines: PropTypes.array.isRequired,
  setLines: PropTypes.func.isRequired,
  resetLines: PropTypes.func.isRequired,
  userAnswer: PropTypes.any.isRequired,
  showQuestionNumber: PropTypes.bool,
  qIndex: PropTypes.number,
  disableResponse: PropTypes.bool
};
FormulaEssayPreview.defaultProps = {
  disableResponse: false,
  showQuestionNumber: false,
  qIndex: null
};

export default FormulaEssayPreview;

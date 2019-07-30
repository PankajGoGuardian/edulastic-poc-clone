import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { MathFormulaDisplay, QuestionNumberLabel } from "@edulastic/common";

import { CLEAR } from "../../../constants/constantsForQuestions";
import { MathEssayInputWrapper } from "./styled";

import MathEssayInput from "./MathEssayInput";

import { InstructorStimulus } from "../styled/InstructorStimulus";
import { QuestionTitleWrapper } from "../styled/QustionNumber";

const FormulaEssayPreview = ({ item, type: previewType, lines, setLines, resetLines, showQuestionNumber, qIndex }) => {
  useEffect(() => {
    if (previewType === CLEAR) {
      resetLines();
    }
  }, [previewType]);

  return (
    <MathEssayInputWrapper>
      <InstructorStimulus>{item.instructor_stimulus}</InstructorStimulus>
      <QuestionTitleWrapper>
        {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}:</QuestionNumberLabel>}
        <MathFormulaDisplay style={{ marginBottom: 15 }} dangerouslySetInnerHTML={{ __html: item.stimulus }} />
      </QuestionTitleWrapper>

      <MathEssayInput
        item={item}
        textFormattingOptions={item.ui_style && item.ui_style.text_formatting_options}
        uiStyle={item.ui_style}
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
  qIndex: PropTypes.number
};
FormulaEssayPreview.defaultProps = {
  showQuestionNumber: false,
  qIndex: null
};

export default FormulaEssayPreview;

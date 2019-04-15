import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { MathFormulaDisplay } from "@edulastic/common";

import { CLEAR } from "../../../constants/constantsForQuestions";

import MathEssayInput from "./MathEssayInput";

import { InstructorStimulus } from "../styled/InstructorStimulus";

const FormulaEssayPreview = ({ item, type: previewType, lines, setLines, resetLines, userAnswer }) => {
  useEffect(() => {
    if (previewType === CLEAR) {
      resetLines();
    }
  }, [previewType, userAnswer]);

  return (
    <div>
      <InstructorStimulus>{item.instructor_stimulus}</InstructorStimulus>

      <MathFormulaDisplay style={{ marginBottom: 15 }} dangerouslySetInnerHTML={{ __html: item.stimulus }} />

      <MathEssayInput
        item={item}
        textFormattingOptions={item.ui_style && item.ui_style.text_formatting_options}
        uiStyle={item.ui_style}
        value={item.template}
        lines={lines}
        setLines={setLines}
        onInput={latex => console.log(latex)}
      />
    </div>
  );
};

FormulaEssayPreview.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  lines: PropTypes.array.isRequired,
  setLines: PropTypes.func.isRequired,
  resetLines: PropTypes.func.isRequired,
  userAnswer: PropTypes.any.isRequired
};

export default FormulaEssayPreview;

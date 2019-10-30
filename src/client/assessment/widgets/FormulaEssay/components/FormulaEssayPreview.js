import React from "react";
import PropTypes from "prop-types";
import { QuestionTitle } from "@edulastic/common";

import { MathEssayInputWrapper } from "./styled";

import MathEssayInput from "./MathEssayInput";

const FormulaEssayPreview = ({ item, lines, setLines, showQuestionNumber, disableResponse }) => (
  <MathEssayInputWrapper>
    <QuestionTitle show={showQuestionNumber} label={item.qLabel} stimulus={item.stimulus} />
    <MathEssayInput
      disableResponse={disableResponse}
      item={item}
      textFormattingOptions={item.uiStyle && item.uiStyle.textFormattingOptions}
      uiStyle={item.uiStyle}
      value={item.template}
      lines={lines}
      setLines={setLines}
      onInput={latex => latex}
    />
  </MathEssayInputWrapper>
);

FormulaEssayPreview.propTypes = {
  item: PropTypes.object.isRequired,
  lines: PropTypes.array.isRequired,
  setLines: PropTypes.func.isRequired,
  showQuestionNumber: PropTypes.bool,
  disableResponse: PropTypes.bool
};
FormulaEssayPreview.defaultProps = {
  disableResponse: false,
  showQuestionNumber: false
};

export default FormulaEssayPreview;

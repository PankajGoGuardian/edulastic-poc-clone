/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { QuestionTitle } from "@edulastic/common";

import Options from "./components/Options";

const Display = ({
  qIndex,
  view,
  smallSize,
  question,
  uiStyle,
  instructorStimulus,
  index,
  styleType,
  multipleResponses,
  showQuestionNumber,
  flowLayout,
  qLabel,
  fontSize,
  ...restProps
}) => (
  <div>
    {!flowLayout && <QuestionTitle show={showQuestionNumber} label={qLabel} stimulus={question} />}

    <Options
      view={view}
      smallSize={smallSize}
      question={question}
      uiStyle={uiStyle}
      styleType={styleType}
      multipleResponses={multipleResponses}
      fontSize={fontSize}
      {...restProps}
    />
  </div>
);

Display.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
  showAnswer: PropTypes.bool,
  validation: PropTypes.object,
  userSelections: PropTypes.array,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  question: PropTypes.string.isRequired,
  instructorStimulus: PropTypes.string,
  uiStyle: PropTypes.object,
  qLabel: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired,
  qIndex: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  styleType: PropTypes.string,
  multipleResponses: PropTypes.bool,
  showQuestionNumber: PropTypes.bool,
  flowLayout: PropTypes.bool
};

Display.defaultProps = {
  options: [],
  onChange: () => {},
  showAnswer: false,
  checkAnswer: false,
  validation: {},
  userSelections: [],
  smallSize: false,
  instructorStimulus: "",
  uiStyle: {
    type: "standard",
    fontsize: "normal",
    columns: 1,
    orientation: "horizontal",
    choiceLabel: "number"
  },
  showQuestionNumber: false,
  flowLayout: false,
  styleType: "default",
  multipleResponses: false
};

export default Display;

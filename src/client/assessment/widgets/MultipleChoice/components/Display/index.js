import React from "react";
import PropTypes from "prop-types";
import { InstructorStimulus, Stimulus } from "@edulastic/common";

import Options from "./components/Options";
import { QuestionTitleWrapper, QuestionNumber } from "./styled/Label";

const Display = ({
  qIndex,
  view,
  smallSize,
  question,
  uiStyle,
  instructorStimulus,
  index,
  styleType,
  multipleResponse,
  showQuestionNumber,
  ...restProps
}) => (
  <div>
    <InstructorStimulus>{instructorStimulus}</InstructorStimulus>
    <QuestionTitleWrapper>
      {showQuestionNumber && <QuestionNumber>{`Q${qIndex + 1}`}</QuestionNumber>}
      <Stimulus dangerouslySetInnerHTML={{ __html: question }} />
    </QuestionTitleWrapper>
    <Options
      view={view}
      smallSize={smallSize}
      question={question}
      uiStyle={uiStyle}
      styleType={styleType}
      multipleResponse={multipleResponse}
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
  view: PropTypes.string.isRequired,
  qIndex: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  styleType: PropTypes.string,
  multipleResponse: PropTypes.bool,
  showQuestionNumber: PropTypes.bool
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
    choice_label: "number"
  },
  showQuestionNumber: false,
  styleType: "default"
};

export default Display;

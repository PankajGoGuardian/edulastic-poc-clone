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
  multipleResponses,
  showQuestionNumber,
  flowLayout,
  qLabel,
  ...restProps
}) => (
  <div>
    {!flowLayout && (
      <>
        <InstructorStimulus>{instructorStimulus}</InstructorStimulus>
        <QuestionTitleWrapper>
          {showQuestionNumber && <QuestionNumber>{qLabel}</QuestionNumber>}
          <Stimulus dangerouslySetInnerHTML={{ __html: question }} />
        </QuestionTitleWrapper>
      </>
    )}

    <Options
      view={view}
      smallSize={smallSize}
      question={question}
      uiStyle={uiStyle}
      styleType={styleType}
      multipleResponses={multipleResponses}
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
    choice_label: "number"
  },
  showQuestionNumber: false,
  flowLayout: false,
  styleType: "default",
  multipleResponses: false
};

export default Display;

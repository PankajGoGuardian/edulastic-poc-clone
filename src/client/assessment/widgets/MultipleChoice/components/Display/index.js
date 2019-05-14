import React from "react";
import PropTypes from "prop-types";
import { InstructorStimulus, Stimulus } from "@edulastic/common";

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
  multipleResponse,
  ...restProps
}) => {
  return (
    <div>
      <InstructorStimulus>{instructorStimulus}</InstructorStimulus>
      <Stimulus dangerouslySetInnerHTML={{ __html: question }} />
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
};

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
  multipleResponse: PropTypes.bool
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
  styleType: "default"
};

export default Display;

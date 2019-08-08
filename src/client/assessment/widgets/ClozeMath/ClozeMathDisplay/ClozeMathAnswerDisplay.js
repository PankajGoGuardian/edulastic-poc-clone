import React from "react";
import PropTypes from "prop-types";

import { MathDisplay } from "@edulastic/common";

const ClozeMathAnswerDisplay = ({ resprops, id }) => {
  const { answers = {}, uiStyles } = resprops;
  const { maths: _userAnwers } = answers;
  const latex = _userAnwers[id] ? _userAnwers[id].value : "";
  return (
    <MathDisplay
      template="\MathQuillMathField{}"
      styles={{ height: uiStyles.height || "31px", width: uiStyles.width }}
      innerValues={[latex]}
    />
  );
};

ClozeMathAnswerDisplay.propTypes = {
  id: PropTypes.string.isRequired,
  resprops: PropTypes.object.isRequired
};

export default ClozeMathAnswerDisplay;

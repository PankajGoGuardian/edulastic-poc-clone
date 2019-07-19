import React from "react";
import PropTypes from "prop-types";

import { MathDisplay } from "@edulastic/common";

const ClozeMathAnswerDisplay = ({ resprops, id }) => {
  const { answers = {} } = resprops;
  const { maths: _userAnwers } = answers;
  const latex = _userAnwers[id] ? _userAnwers[id].value : "";
  return <MathDisplay template="\MathQuillMathField{}" innerValues={[latex]} />;
};

ClozeMathAnswerDisplay.propTypes = {
  id: PropTypes.string.isRequired,
  resprops: PropTypes.object.isRequired
};

export default ClozeMathAnswerDisplay;

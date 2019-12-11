import React from "react";
import PropTypes from "prop-types";

import { MathDisplay } from "@edulastic/common";

const ClozeMathAnswerDisplay = ({ resprops, id }) => {
  const { answers = {}, uiStyles } = resprops;
  const { maths = {}, mathUnits = {} } = answers;
  const userAnswers = { ...maths, ...mathUnits };
  const { value = "", options = {} } = userAnswers[id] || {};
  let { unit } = options;

  if (unit && (unit.search("f") !== -1 || unit.search(/\s/g) !== -1)) {
    unit = `\\text{${unit}}`;
  }

  return (
    <MathDisplay
      template="\MathQuillMathField{}"
      styles={{ height: uiStyles.height || "35px", width: uiStyles.width, alignItems: "center" }}
      innerValues={[
        unit ? (value.search("=") === -1 ? `${value}\\ ${unit}` : value.replace(/=/gm, `\\ ${unit}=`)) : value
      ]}
    />
  );
};

ClozeMathAnswerDisplay.propTypes = {
  id: PropTypes.string.isRequired,
  resprops: PropTypes.object.isRequired
};

export default ClozeMathAnswerDisplay;

import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { isEqual } from "lodash";

import { red, green } from "@edulastic/colors";
import { IconCheck, IconClose } from "@edulastic/icons";

import { Bar, ActiveBar } from "../styled";
import { EDIT, CLEAR } from "../../../constants/constantsForQuestions";

const Bars = ({
  bars,
  step,
  padding,
  height,
  margin,
  onPointOver,
  onMouseDown,
  isMouseDown,
  view,
  validation,
  previewTab
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseAction = value => () => {
    if (!isMouseDown) {
      onPointOver(value);
    }
  };

  const getCenterX = index => step * index + margin / 2 + padding + step / 2 - 10 - (step * 0.8) / 2;

  const getCenterY = dot => height - margin - dot.y;

  const handleMouse = index => () => {
    handleMouseAction(index)();
    setHoveredIndex(index);
  };

  const newValidation = [validation.valid_response, ...validation.alt_responses];

  let matches = 0;
  let validatingIndex = 0;

  newValidation.forEach(({ value }, mainIndex) => {
    const currentMatches = value.filter((ans, ind) => isEqual(ans.y.toFixed(4), bars[ind].y.toFixed(4))).length;
    matches = Math.max(currentMatches, matches);
    if (matches === currentMatches) {
      validatingIndex = mainIndex;
    }
  });
  const renderValidationIcons = index => {
    if (isEqual(newValidation[validatingIndex].value[index].y.toFixed(4), bars[index].y.toFixed(4))) {
      return (
        <g transform={`translate(${getCenterX(index) + (step * 0.8) / 2 - 6},${getCenterY(bars[index]) - 30})`}>
          <IconCheck color={green} width={12} height={12} />
        </g>
      );
    }
    return (
      <g transform={`translate(${getCenterX(index) + (step * 0.8) / 2 - 6},${getCenterY(bars[index]) - 30})`}>
        <IconClose color={red} width={12} height={12} />
      </g>
    );
  };

  return (
    <Fragment>
      {bars.map((dot, index) => (
        <Fragment>
          {previewTab !== CLEAR && renderValidationIcons(index)}
          <Bar
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            x={getCenterX(index)}
            y={getCenterY(dot)}
            width={step * 0.8}
            height={dot.y}
          />
          {((view !== EDIT && !dot.notInteractive) || view === EDIT) && (
            <ActiveBar
              onMouseEnter={handleMouse(index)}
              onMouseLeave={handleMouse(null)}
              onMouseDown={onMouseDown(index)}
              x={getCenterX(index)}
              y={getCenterY(dot)}
              width={step * 0.8}
              hoverState={hoveredIndex === index}
              height={hoveredIndex === index ? 5 : 1}
            />
          )}
        </Fragment>
      ))}
    </Fragment>
  );
};

Bars.propTypes = {
  bars: PropTypes.array.isRequired,
  step: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  margin: PropTypes.number.isRequired,
  onPointOver: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  isMouseDown: PropTypes.bool.isRequired,
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  validation: PropTypes.object
};
Bars.defaultProps = {
  previewTab: CLEAR,
  validation: {
    valid_response: { value: [] },
    alt_responses: [{ value: [] }]
  }
};
export default Bars;

import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { isEqual } from "lodash";

import { mainBlueColor, red, green } from "@edulastic/colors";
import { IconCheck, IconClose } from "@edulastic/icons";
import { Bar, ActiveBar, Text, Circle, StrokedRect } from "../styled";
import { EDIT, CLEAR } from "../../../constants/constantsForQuestions";

const Circles = ({
  bars,
  step,
  yAxisStep,
  height,
  margin,
  onPointOver,
  onMouseDown,
  isMouseDown,
  view,
  previewTab,
  validation
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseAction = value => () => {
    if (!isMouseDown) {
      onPointOver(value);
    }
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

  const getCenterX = index => step * index + 2;

  const getCenterY = dot => height - margin - dot.y;

  const renderValidationIcons = index => {
    if (isEqual(newValidation[validatingIndex].value[index].y.toFixed(4), bars[index].y.toFixed(4))) {
      return (
        <g transform={`translate(${getCenterX(index) + step / 2 - 6},${getCenterY(bars[index]) - 30})`}>
          <IconCheck color={green} width={12} height={12} />
        </g>
      );
    }
    return (
      <g transform={`translate(${getCenterX(index) + step / 2 - 6},${getCenterY(bars[index]) - 30})`}>
        <IconClose color={red} width={12} height={12} />
      </g>
    );
  };

  const handleMouse = index => () => {
    handleMouseAction(index)();
    setHoveredIndex(index);
  };

  return (
    <Fragment>
      {bars.map((dot, index) => (
        <Fragment>
          {previewTab !== CLEAR && renderValidationIcons(index)}
          {Array.from({ length: Math.floor(dot.y / yAxisStep) }).map((a, ind) => (
            <Circle
              cx={getCenterX(index) + step / 2}
              cy={height - margin - ind * yAxisStep - yAxisStep / 2}
              r={yAxisStep / 2 - 5}
            />
          ))}
          <Bar
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            x={getCenterX(index)}
            y={getCenterY(dot)}
            width={step - 2}
            height={dot.y}
            color="transparent"
          />
          {((view !== EDIT && !dot.notInteractive) || view === EDIT) && (
            <Fragment>
              <StrokedRect
                hoverState={hoveredIndex === index}
                x={getCenterX(index)}
                y={getCenterY(dot)}
                width={step - 2}
                height={dot.y}
              />
              <ActiveBar
                onMouseEnter={handleMouse(index)}
                onMouseLeave={handleMouse(null)}
                onMouseDown={onMouseDown(index)}
                x={getCenterX(index)}
                y={getCenterY(dot) - 4}
                width={step - 2}
                color={dot.y === 0 ? mainBlueColor : "transparent"}
                hoverState={hoveredIndex === index}
                height={hoveredIndex === index ? 5 : 1}
              />
            </Fragment>
          )}
          <Text textAnchor="middle" x={getCenterX(index) + step / 2} y={height}>
            {dot.x}
          </Text>
        </Fragment>
      ))}
    </Fragment>
  );
};

Circles.propTypes = {
  bars: PropTypes.array.isRequired,
  step: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  yAxisStep: PropTypes.number.isRequired,
  margin: PropTypes.number.isRequired,
  onPointOver: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  isMouseDown: PropTypes.bool.isRequired,
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  validation: PropTypes.object
};
Circles.defaultProps = {
  previewTab: CLEAR,
  validation: {
    valid_response: { value: [] },
    alt_responses: [{ value: [] }]
  }
};
export default Circles;

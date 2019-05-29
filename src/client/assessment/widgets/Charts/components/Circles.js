import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { isEqual } from "lodash";

import { mainBlueColor, red, green } from "@edulastic/colors";
import { IconCheck, IconClose } from "@edulastic/icons";
import { Bar, ActiveBar, Text, Circle, StrokedRect } from "../styled";
import { EDIT, CLEAR } from "../../../constants/constantsForQuestions";
import { convertUnitToPx, getGridVariables } from "../helpers";

const Circles = ({ bars, onPointOver, onMouseDown, activeIndex, view, gridParams, previewTab, validation }) => {
  const { height, margin, yAxisMin } = gridParams;

  const { yAxisStep, step } = getGridVariables(bars, gridParams, true);

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseAction = value => () => {
    if (activeIndex === null) {
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

  const getCenterY = dot => convertUnitToPx(dot.y, gridParams);

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

  const getBarHeight = y => convertUnitToPx(yAxisMin, gridParams) - convertUnitToPx(y, gridParams);

  const getLength = y => Math.floor((height - margin - convertUnitToPx(y, gridParams)) / yAxisStep);

  const isHovered = index => hoveredIndex === index || activeIndex === index;

  return (
    <Fragment>
      {bars.map((dot, index) => (
        <Fragment>
          {previewTab !== CLEAR && renderValidationIcons(index)}
          {Array.from({ length: getLength(dot.y) }).map((a, ind) => (
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
            height={getBarHeight(dot.y)}
            color="transparent"
          />
          {((view !== EDIT && !dot.notInteractive) || view === EDIT) && (
            <Fragment>
              <StrokedRect
                hoverState={isHovered(index)}
                x={getCenterX(index)}
                y={getCenterY(dot)}
                width={step - 2}
                height={getBarHeight(dot.y)}
              />
              <ActiveBar
                onMouseEnter={handleMouse(index)}
                onMouseLeave={handleMouse(null)}
                onMouseDown={onMouseDown(index)}
                x={getCenterX(index)}
                y={getCenterY(dot) - 4}
                width={step - 2}
                color={dot.y === 0 ? mainBlueColor : "transparent"}
                hoverState={isHovered(index)}
                height={isHovered(index) ? 5 : 1}
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
  onPointOver: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  activeIndex: PropTypes.number.isRequired,
  view: PropTypes.string.isRequired,
  gridParams: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    margin: PropTypes.number,
    yAxisMax: PropTypes.number,
    yAxisMin: PropTypes.number,
    stepSize: PropTypes.number,
    snapTo: PropTypes.number
  }).isRequired,
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

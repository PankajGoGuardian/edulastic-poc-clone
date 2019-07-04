import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";

import { themeColorLight, red, green } from "@edulastic/colors";
import { IconCheck, IconClose } from "@edulastic/icons";

import { EDIT, CLEAR, CHECK, SHOW } from "../../../constants/constantsForQuestions";

import { Bar, ActiveBar, Text, Circle, StrokedRect } from "../styled";
import { convertUnitToPx, getGridVariables } from "../helpers";

const Circles = ({ bars, onPointOver, onMouseDown, activeIndex, view, gridParams, previewTab, correct }) => {
  const { height, margin, yAxisMin } = gridParams;

  const { yAxisStep, step } = getGridVariables(bars, gridParams, true);

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseAction = value => () => {
    if (activeIndex === null) {
      onPointOver(value);
    }
  };

  const getCenterX = index => step * index + 2;

  const getCenterY = dot => convertUnitToPx(dot.y, gridParams) + 20;

  const renderValidationIcons = index => (
    <g transform={`translate(${getCenterX(index) + step / 2 - 6},${getCenterY(bars[index]) - 30})`}>
      {correct[index] && <IconCheck color={green} width={12} height={12} />}
      {!correct[index] && <IconClose color={red} width={12} height={12} />}
    </g>
  );

  const handleMouse = index => () => {
    handleMouseAction(index)();
    setHoveredIndex(index);
  };

  const getBarHeight = y => Math.abs(convertUnitToPx(yAxisMin, gridParams) - convertUnitToPx(y, gridParams));

  const getLength = y => Math.floor((height - margin - convertUnitToPx(y, gridParams)) / yAxisStep);

  const isHovered = index => hoveredIndex === index || activeIndex === index;

  return (
    <Fragment>
      {bars.map((dot, index) => (
        <Fragment>
          {(previewTab === SHOW || previewTab === CHECK) && renderValidationIcons(index)}
          {Array.from({ length: getLength(dot.y) }).map((a, ind) => (
            <Circle
              cx={getCenterX(index) + step / 2}
              cy={height - margin - ind * yAxisStep - yAxisStep / 2 + 20}
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
                color={dot.y === 0 ? themeColorLight : "transparent"}
                hoverState={isHovered(index)}
                height={isHovered(index) ? 5 : 1}
              />
            </Fragment>
          )}
          <Text textAnchor="middle" x={getCenterX(index) + step / 2} y={height + 20}>
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
  correct: PropTypes.array.isRequired,
  previewTab: PropTypes.string
};
Circles.defaultProps = {
  previewTab: CLEAR
};
export default Circles;

/* eslint-disable react/prop-types */
import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";

import { red, green } from "@edulastic/colors";
import { IconCheck, IconClose } from "@edulastic/icons";

import { EDIT } from "../../../constants/constantsForQuestions";

import { Bar, ActiveBar } from "../styled";
import { convertUnitToPx, getGridVariables } from "../helpers";

const Bars = ({
  item,
  bars,
  onPointOver,
  onMouseDown,
  activeIndex,
  view,
  gridParams,
  correct,
  deleteMode,
  saveAnswer,
  showAnswer
}) => {
  const { height, margin, yAxisMin } = gridParams;
  const { chart_data = {} } = item;
  const { data = [] } = chart_data;

  const { padding, step } = getGridVariables(bars, gridParams, true);

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseAction = value => () => {
    if (activeIndex === null) {
      onPointOver(value);
    }
  };

  const getCenterX = index => step * index + margin / 2 + padding + (step * (1 - 0.8)) / 2;

  const getCenterY = dot => convertUnitToPx(dot.y, gridParams) + 20;

  const handleMouse = index => () => {
    handleMouseAction(index)();
    setHoveredIndex(index);
  };

  const renderValidationIcons = index => (
    <g transform={`translate(${getCenterX(index) + (step * 0.8) / 2 - 6},${getCenterY(bars[index]) - 30})`}>
      {correct[index] && <IconCheck color={green} width={12} height={12} />}
      {!correct[index] && <IconClose color={red} width={12} height={12} />}
    </g>
  );

  const getBarHeight = y => Math.abs(convertUnitToPx(yAxisMin, gridParams) - convertUnitToPx(y, gridParams));

  const isHovered = index => hoveredIndex === index || activeIndex === index;

  const isRenderIcons = !!(correct && correct.length);

  return (
    <Fragment>
      {bars.map((dot, index) => (
        <Fragment key={`bar-${index}`}>
          <rect
            fill="transparent"
            x={getCenterX(index)}
            y={0}
            onMouseEnter={handleMouse(index)}
            onMouseLeave={handleMouse(null)}
            width={step - 2}
            height={height + margin}
          />
          {showAnswer && isRenderIcons && renderValidationIcons(index)}
          <Bar
            onMouseEnter={handleMouse(index)}
            onMouseLeave={handleMouse(null)}
            onMouseDown={onMouseDown(index)}
            onClick={handleMouse(index)}
            onTouchEnd={handleMouse(null)}
            onTouchStart={onMouseDown(index)}
            x={getCenterX(index)}
            y={getCenterY(dot)}
            width={step * 0.8}
            height={getBarHeight(dot.y)}
          />
          {((view !== EDIT && !data[index].notInteractive) || view === EDIT) && (
            <ActiveBar
              // onClick={deleteMode ? () => saveAnswer(index) : () => { }}
              onMouseEnter={handleMouse(index)}
              onMouseLeave={handleMouse(null)}
              onMouseDown={onMouseDown(index)}
              onClick={handleMouse(index)}
              onTouchEnd={handleMouse(null)}
              onTouchStart={onMouseDown(index)}
              x={getCenterX(index)}
              y={getCenterY(dot)}
              width={step * 0.8}
              deleteMode={deleteMode}
              hoverState={isHovered(index)}
              height={isHovered(index) ? 5 : 1}
            />
          )}
        </Fragment>
      ))}
    </Fragment>
  );
};

Bars.propTypes = {
  item: PropTypes.object.isRequired,
  bars: PropTypes.array.isRequired,
  onPointOver: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  activeIndex: PropTypes.number,
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
  saveAnswer: PropTypes.func,
  deleteMode: PropTypes.bool
};
Bars.defaultProps = {
  saveAnswer: () => {},
  deleteMode: false
};
export default Bars;

import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";

import { themeColorLight, red, green } from "@edulastic/colors";
import { IconCheck, IconClose } from "@edulastic/icons";

import { EDIT, CLEAR, CHECK, SHOW } from "../../../constants/constantsForQuestions";

import { Bar, ActiveBar, Text, Circle, StrokedRect } from "../styled";
import { convertUnitToPx, getGridVariables } from "../helpers";
import { SHOW_ALWAYS, SHOW_BY_HOVER } from "../const";

import AxisLabel from "./AxisLabel";

const Circles = ({
  item,
  bars,
  onPointOver,
  onMouseDown,
  activeIndex,
  view,
  gridParams,
  previewTab,
  correct,
  saveAnswer,
  deleteMode
}) => {
  const { height, margin, yAxisMin, yAxisMax, stepSize } = gridParams;
  const { chart_data = {} } = item;
  const { data = [] } = chart_data;

  const { yAxisStep, step } = getGridVariables(bars, gridParams, true);

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showLabel, handleLabelVisibility] = useState(null);

  const handleMouseAction = value => () => {
    if (activeIndex === null) {
      onPointOver(value);
    }
  };

  const getCenterX = index => step * index + 2;

  const getCenterY = dot => convertUnitToPx(dot.y, { height, margin, yAxisMax, yAxisMin, stepSize }) + 20;

  const renderValidationIcons = index => (
    <g transform={`translate(${getCenterX(index) + step / 2 - 6},${getCenterY(bars[index]) - 30})`}>
      {correct[index] && <IconCheck color={green} width={12} height={12} />}
      {!correct[index] && <IconClose color={red} width={12} height={12} />}
    </g>
  );

  const handleMouse = index => () => {
    handleMouseAction(index)();
    setHoveredIndex(index);
    handleLabelVisibility(index);
  };

  const getBarHeight = y => Math.abs(convertUnitToPx(yAxisMin, gridParams) - convertUnitToPx(y, gridParams));

  const getLength = y => Math.floor((height - margin - convertUnitToPx(y, gridParams)) / yAxisStep);

  const isHovered = index => hoveredIndex === index || activeIndex === index;

  const labelIsVisible = index =>
    data[index] &&
    ((data[index].labelVisibility === SHOW_BY_HOVER && showLabel === index) ||
      (data[index].labelVisibility === SHOW_ALWAYS || !data[index].labelVisibility));

  const isRenderIcons = !!(correct && correct.length);

  return (
    <Fragment>
      {bars.map((dot, index) => (
        <Fragment key={`bar-${index}`}>
          <rect
            fill="transparent"
            stroke="transparent"
            x={getCenterX(index)}
            y={0}
            onMouseEnter={() => handleLabelVisibility(index)}
            onMouseLeave={() => handleLabelVisibility(null)}
            width={step - 2}
            height={height + margin}
          />
          {(previewTab === SHOW || previewTab === CHECK) && isRenderIcons && renderValidationIcons(index)}
          {Array.from({ length: getLength(dot.y) }).map((a, ind) => (
            <Circle
              key={`circle-inner-${ind}`}
              cx={getCenterX(index) + step / 2}
              cy={height - margin - ind * yAxisStep - yAxisStep / 2 + 20}
              r={yAxisStep / 2 - 5}
            />
          ))}
          <Bar
            onClick={deleteMode ? () => saveAnswer(index) : () => {}}
            onMouseEnter={() => {
              handleLabelVisibility(index);
              setHoveredIndex(index);
            }}
            onMouseLeave={() => {
              handleLabelVisibility(null);
              setHoveredIndex(null);
            }}
            x={getCenterX(index)}
            y={getCenterY(dot)}
            width={step - 2}
            height={getBarHeight(dot.y)}
            color="transparent"
          />
          {((view !== EDIT && !data[index].notInteractive) || view === EDIT) && (
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
                deleteMode={deleteMode}
                color={dot.y === 0 ? themeColorLight : "transparent"}
                hoverState={isHovered(index)}
                height={isHovered(index) ? 5 : 1}
              />
            </Fragment>
          )}
          <g
            onMouseEnter={() => handleLabelVisibility(index)}
            onMouseLeave={() => handleLabelVisibility(null)}
            // "height +2" added to hide the fourth line in x-axis label
            transform={`translate(${getCenterX(index) + step / 2}, ${height + 2})`}
          >
            {labelIsVisible(index) && <AxisLabel fractionFormat={data[index].labelFractionFormat} value={dot.x} />}
          </g>
        </Fragment>
      ))}
    </Fragment>
  );
};

Circles.propTypes = {
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
  previewTab: PropTypes.string,
  saveAnswer: PropTypes.func,
  deleteMode: PropTypes.bool
};
Circles.defaultProps = {
  previewTab: CLEAR,
  saveAnswer: () => {},
  deleteMode: false
};
export default Circles;

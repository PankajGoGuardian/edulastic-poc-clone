import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";

import { themeColorLight, red, green } from "@edulastic/colors";
import { IconCheck, IconClose } from "@edulastic/icons";

import { EDIT, CLEAR, CHECK, SHOW } from "../../../constants/constantsForQuestions";

import { Bar, ActiveBar, StrokedRect } from "../styled";
import { convertUnitToPx, getGridVariables } from "../helpers";
import { SHOW_ALWAYS, SHOW_BY_HOVER } from "../const";
import AxisLabel from "./AxisLabel";

const Crosses = ({
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
  const { height, margin, yAxisMin } = gridParams;
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
            <path
              key={`path-${ind}`}
              transform={`translate(${getCenterX(index) + step / 2 - 16}, ${height -
                margin -
                17 -
                ind * yAxisStep -
                yAxisStep / 2 +
                20})`}
              fill={themeColorLight}
              d="M24.778,21.419L19.276,15.917L24.777,10.415L21.949,7.585L16.447,13.087L10.945,7.585L8.117,10.415L13.618,15.917L8.116,21.419L10.946,24.248L16.447,18.746L21.948,24.248Z"
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
                onClick={handleMouse(index)}
                onTouchEnd={handleMouse(null)}
                onTouchStart={onMouseDown(index)}
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

Crosses.propTypes = {
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
Crosses.defaultProps = {
  previewTab: CLEAR,
  saveAnswer: () => {},
  deleteMode: false
};
export default Crosses;

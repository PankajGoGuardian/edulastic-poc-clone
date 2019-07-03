import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";

import { red, green } from "@edulastic/colors";
import { IconCheck, IconClose } from "@edulastic/icons";

import { EDIT, CLEAR, CHECK, SHOW } from "../../../constants/constantsForQuestions";

import { Bar, ActiveBar } from "../styled";
import { convertUnitToPx, getGridVariables } from "../helpers";

const Bars = ({ bars, onPointOver, onMouseDown, activeIndex, view, gridParams, previewTab, correct }) => {
  const { margin, yAxisMin } = gridParams;

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

  return (
    <Fragment>
      {bars.map((dot, index) => (
        <Fragment>
          {(previewTab === SHOW || previewTab === CHECK) && renderValidationIcons(index)}
          <Bar
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            x={getCenterX(index)}
            y={getCenterY(dot)}
            width={step * 0.8}
            height={getBarHeight(dot.y)}
          />
          {((view !== EDIT && !dot.notInteractive) || view === EDIT) && (
            <ActiveBar
              onMouseEnter={handleMouse(index)}
              onMouseLeave={handleMouse(null)}
              onMouseDown={onMouseDown(index)}
              x={getCenterX(index)}
              y={getCenterY(dot)}
              width={step * 0.8}
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
Bars.defaultProps = {
  previewTab: CLEAR
};
export default Bars;

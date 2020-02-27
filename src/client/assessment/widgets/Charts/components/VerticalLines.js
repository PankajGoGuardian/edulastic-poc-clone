import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";

import { Line, Tick, VxText } from "../styled";
import { getGridVariables } from "../helpers";
import { SHOW_ALWAYS, SHOW_BY_HOVER } from "../const";

const VerticalLines = ({ lines, gridParams, displayAxisLabel, displayGridlines, active }) => {
  const { height, margin, showTicks } = gridParams;

  const { padding, step } = getGridVariables(lines, gridParams);

  const getConstantX = index => step * index + margin / 2 + padding;
  const y2 = height - margin / 2;

  const labelIsVisible = index =>
    lines[index] &&
    ((lines[index].labelVisibility === SHOW_BY_HOVER && active === index) ||
      (lines[index].labelVisibility === SHOW_ALWAYS || !lines[index].labelVisibility));

  return (
    <g>
      {lines.map((dot, index) => {
        const x = getConstantX(index);
        return (
          <Fragment>
            {displayAxisLabel && (
              <g transform={`translate(${getConstantX(index)},${height})`}>
                {labelIsVisible(index) && <VxText textAnchor="middle" verticalAnchor="start" width={70}>
                  {dot.x}
                </VxText>}
              </g>
            )}
            {displayGridlines && <Line x1={x} y1={margin} x2={x} y2={y2} strokeWidth={2} />}
            {showTicks && <Tick x1={x} y1={y2 - 10} x2={x} y2={y2 + 10} strokeWidth={2} />}
          </Fragment>
        );
      })}
    </g>
  );
};

VerticalLines.propTypes = {
  lines: PropTypes.array.isRequired,
  displayAxisLabel: PropTypes.bool,
  displayGridlines: PropTypes.bool,
  gridParams: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    margin: PropTypes.number,
    yAxisMax: PropTypes.number,
    yAxisMin: PropTypes.number,
    stepSize: PropTypes.number,
    snapTo: PropTypes.number
  }).isRequired
};

VerticalLines.defaultProps = {
  displayAxisLabel: true,
  displayGridlines: true
};

export default VerticalLines;

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { Line, Tick, VxText } from "../styled";
import { SHOW_ALWAYS, SHOW_BY_HOVER } from "../const";

const VerticalLines = ({ points, gridParams, displayAxisLabel, displayGridlines, active }) => {
  const { height, margin, showTicks } = gridParams;
  const y2 = height - margin / 2;

  const labelIsVisible = index =>
    points[index] &&
    ((points[index].labelVisibility === SHOW_BY_HOVER && active === index) ||
      (points[index].labelVisibility === SHOW_ALWAYS || !points[index].labelVisibility));

  return (
    <g>
      {points.map((dot, index) => (
        <Fragment key={`vertical-line-${index}`}>
          {displayAxisLabel && (
            <g transform={`translate(${dot.posX},${height})`}>
              {labelIsVisible(index) && (
                <VxText textAnchor="middle" verticalAnchor="start" width={70}>
                  {dot.x}
                </VxText>
              )}
            </g>
          )}
          {displayGridlines && <Line x1={dot.posX} y1={margin} x2={dot.posX} y2={y2} strokeWidth={2} />}
          {showTicks && <Tick x1={dot.posX} y1={y2 - 10} x2={dot.posX} y2={y2 + 10} strokeWidth={2} />}
        </Fragment>
      ))}
    </g>
  );
};

VerticalLines.propTypes = {
  points: PropTypes.array.isRequired,
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

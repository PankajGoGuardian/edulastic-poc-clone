import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { Line, Text, Tick } from "../styled";
import { getGridVariables } from "../helpers";

const VerticalLines = ({ lines, gridParams, displayAxisLabel, displayGridlines }) => {
  const { height, margin, showTicks } = gridParams;

  const { padding, step } = getGridVariables(lines, gridParams);

  const getConstantX = index => step * index + margin / 2 + padding;
  const y2 = height - margin / 2;
  return (
    <g>
      {lines.map((dot, index) => {
        const x = getConstantX(index);
        return (
          <Fragment>
            {displayAxisLabel && (
              <Text textAnchor="middle" x={x} y={showTicks ? height : height - 10}>
                <tspan dy="1.2em" x={x}>
                  {dot.x}
                </tspan>
              </Text>
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

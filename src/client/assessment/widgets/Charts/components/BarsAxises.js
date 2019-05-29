import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { Line, Text } from "../styled";
import { getGridVariables } from "../helpers";

const BarsAxises = ({ lines, gridParams }) => {
  const { height, margin } = gridParams;

  const { padding, step } = getGridVariables(lines, gridParams, true);

  const getConstantX = index => step * index + margin / 2 + padding + step / 2;

  return (
    <g>
      {lines.map((dot, index) => (
        <Fragment>
          <Text textAnchor="middle" x={getConstantX(index)} y={height}>
            {dot.x}
          </Text>
          <Line
            x1={getConstantX(index)}
            y1={margin / 4}
            x2={getConstantX(index)}
            y2={height - margin / 2}
            strokeWidth={1}
          />
        </Fragment>
      ))}
    </g>
  );
};

BarsAxises.propTypes = {
  lines: PropTypes.array.isRequired,
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

export default BarsAxises;

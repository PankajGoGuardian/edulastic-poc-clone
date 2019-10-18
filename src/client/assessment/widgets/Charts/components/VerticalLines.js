import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Line } from "../styled";
import { Text } from "@vx/text";
import { getGridVariables } from "../helpers";

const VerticalLines = ({ lines, gridParams, displayAxisLabel, displayGridlines }) => {
  const { height, margin } = gridParams;

  const { padding, step } = getGridVariables(lines, gridParams);

  const getConstantX = index => step * index + margin / 2 + padding;

  return (
    <g>
      {lines.map((dot, index) => (
        <Fragment>
          {displayAxisLabel && (
            <g transform={`translate(${getConstantX(index)},${height})`}>
              <StyledText textAnchor="middle" verticalAnchor="start" width={70}>
                {dot.x}
              </StyledText>
            </g>
          )}
          {displayGridlines && (
            <Line
              x1={getConstantX(index)}
              y1={margin / 4}
              x2={getConstantX(index)}
              y2={height - margin / 2}
              strokeWidth={1}
            />
          )}
        </Fragment>
      ))}
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

const StyledText = styled(Text)`
  user-select: none;
  fill: ${props => props.theme.widgets.chart.labelStrokeColor};
`;

export default VerticalLines;

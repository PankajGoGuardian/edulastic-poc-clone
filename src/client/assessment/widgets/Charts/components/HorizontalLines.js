import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { Line, Text } from "../styled";
import { convertUnitToPx, getPadding, getYAxis } from "../helpers";
import AxisLabel from "./AxisLabel";

const HorizontalLines = ({ gridParams, displayGridlines, paddingTop }) => {
  const { yAxisMax, yAxisMin, stepSize, width, fractionFormat } = gridParams;
  const yAxis = getYAxis(yAxisMax, yAxisMin, stepSize);
  const padding = getPadding(yAxis);

  return (
    <g>
      {yAxis.map(dot => (
        <Fragment>
          <Text textAnchor="start" x={0} y={convertUnitToPx(dot, gridParams) + paddingTop} transform="translate(0, 5)">
            <AxisLabel fractionFormat={fractionFormat} value={dot} />
          </Text>
          {displayGridlines && (
            <Line
              x1={padding}
              y1={convertUnitToPx(dot, gridParams) + paddingTop}
              x2={width}
              y2={convertUnitToPx(dot, gridParams) + paddingTop}
              strokeWidth={1}
            />
          )}
        </Fragment>
      ))}
    </g>
  );
};

HorizontalLines.propTypes = {
  displayGridlines: PropTypes.bool,
  paddingTop: PropTypes.number,
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

HorizontalLines.defaultProps = {
  paddingTop: 0,
  displayGridlines: true
};

export default HorizontalLines;

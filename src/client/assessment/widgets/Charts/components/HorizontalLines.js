import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { Line, Axis } from "../styled";
import { convertUnitToPx, getPadding, getYAxis } from "../helpers";
import AxisLabel from "./AxisLabel";

const HorizontalLines = ({ gridParams, displayGridlines, paddingTop, isLine }) => {
  const { yAxisMax, yAxisMin, stepSize, width, fractionFormat } = gridParams;
  const yAxis = getYAxis(yAxisMax, yAxisMin, stepSize);
  const padding = getPadding(yAxis);
  const maxCount = 16;
  const labelsFrequency = Math.ceil(yAxis.length / maxCount);

  const displayLabel = index => {
    if (yAxis.length <= maxCount) {
      return true;
    }
    return index % labelsFrequency === 0;
  };

  const AxisComponent = isLine ? Line : Axis;

  return (
    <g>
      {yAxis.map((dot, index) => {
        const y = convertUnitToPx(dot, gridParams) + paddingTop;

        return (
          <Fragment key={`horizontal-line-${index}`}>
            <g transform={`translate(0, ${y})`}>
              {displayLabel(index) && (
                <AxisLabel fractionFormat={fractionFormat} value={dot} textAnchor="start" verticalAnchor="middle" />
              )}
            </g>
            {displayGridlines && yAxis.length - 1 !== index && (
              <Line x1={padding} y1={y} x2={width} y2={y} strokeWidth={2} />
            )}
            {yAxis.length - 1 === index && <AxisComponent x1={padding} y1={y} x2={width} y2={y} strokeWidth={2} />}
          </Fragment>
        );
      })}
    </g>
  );
};

HorizontalLines.propTypes = {
  displayGridlines: PropTypes.bool,
  isLine: PropTypes.bool,
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
  isLine: false,
  displayGridlines: true
};

export default HorizontalLines;

import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Line, Text, Tick } from "../styled";
import { getGridVariables } from "../helpers";

const BarsAxises = ({ lines, gridParams, displayAxisLabel, displayGridlines }) => {
  const { height, margin, showTicks } = gridParams;

  const { padding, step } = getGridVariables(lines, gridParams, true);

  const getConstantX = index => step * index + margin / 2 + padding + step / 2;

  const getParts = index => {
    const cloneOfString = lines[index].x;
    const resultArray = [];
    let partStep = Math.floor((step * 0.8) / 7);
    partStep = Math.max(partStep, 1);
    let startIndex = 0;
    while (startIndex < cloneOfString.length) {
      startIndex += partStep;
      resultArray.push(cloneOfString.slice(startIndex - partStep, startIndex));
    }

    return resultArray;
  };

  const y2 = height - margin / 2;

  return (
    <g>
      {lines.map((_, index) => {
        const x = getConstantX(index);
        return (
          <Fragment>
            {displayAxisLabel && (
              <Text textAnchor="middle" x={x} y={showTicks ? height : height - 10}>
                {getParts(index).map((text, ind) => (
                  <tspan dy="1.2em" x={x} key={ind}>
                    {text}
                  </tspan>
                ))}
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
  }).isRequired,
  displayAxisLabel: PropTypes.bool,
  displayGridlines: PropTypes.bool
};

BarsAxises.defaultProps = {
  displayAxisLabel: true,
  displayGridlines: true
};

export default BarsAxises;

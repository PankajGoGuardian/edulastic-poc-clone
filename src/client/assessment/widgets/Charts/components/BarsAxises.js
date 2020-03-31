import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Line, Text, Tick, VxText } from "../styled";
import { getGridVariables } from "../helpers";
import { SHOW_ALWAYS, SHOW_BY_HOVER } from "../const";

const BarsAxises = ({ lines, gridParams, displayAxisLabel, displayGridlines, active }) => {
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

  const labelIsVisible = index =>
    lines[index] &&
    ((lines[index].labelVisibility === SHOW_BY_HOVER && active === index) ||
      (lines[index].labelVisibility === SHOW_ALWAYS || !lines[index].labelVisibility));

  const y2 = height - margin / 2;

  return (
    <g>
      {lines.map((_, index) => {
        const x = getConstantX(index);
        return (
          <Fragment key={`bar-axis-${index}`}>
            {displayAxisLabel && (
              <g transform={`translate(${getConstantX(index)}, ${height})`}>
                {labelIsVisible(index) && (
                  <VxText textAnchor="middle" verticalAnchor="start" width={70}>
                    {lines[index].x}
                  </VxText>
                )}
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

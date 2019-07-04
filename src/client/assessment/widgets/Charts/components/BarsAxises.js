import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { Line, Text } from "../styled";
import { getGridVariables } from "../helpers";

const BarsAxises = ({ lines, gridParams, displayAxisLabel, displayGridlines, setHeightAddition, heightAddition }) => {
  const { height, margin } = gridParams;

  const { padding, step } = getGridVariables(lines, gridParams, true);

  const getConstantX = index => step * index + margin / 2 + padding + step / 2;

  const getParts = index => {
    const cloneOfString = lines[index].x;
    const resultArray = [];
    const partStep = Math.floor((step * 0.8) / 7);
    let startIndex = 0;
    while (startIndex < cloneOfString.length) {
      startIndex += partStep;
      resultArray.push(cloneOfString.slice(startIndex - partStep, startIndex));
    }
    resultArray.push(cloneOfString.slice(startIndex));

    if (resultArray.length * 17 > heightAddition) {
      setHeightAddition(resultArray.length * 17);
    }

    return resultArray;
  };

  return (
    <g>
      {lines.map((dot, index) => (
        <Fragment>
          {displayAxisLabel && (
            <Text textAnchor="middle" x={getConstantX(index)} y={height + 10}>
              {getParts(index).map((text, ind) => (
                <tspan dy="1.2em" x={getConstantX(index)} key={ind}>
                  {text}
                </tspan>
              ))}
            </Text>
          )}
          {displayGridlines && (
            <Line
              x1={getConstantX(index)}
              y1={margin / 4 + 15}
              x2={getConstantX(index)}
              y2={height - margin / 2 + 15}
              strokeWidth={1}
            />
          )}
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
  }).isRequired,
  displayAxisLabel: PropTypes.bool,
  displayGridlines: PropTypes.bool,
  setHeightAddition: PropTypes.func,
  heightAddition: PropTypes.number
};

BarsAxises.defaultProps = {
  displayAxisLabel: true,
  displayGridlines: true,
  heightAddition: 19,
  setHeightAddition: () => {}
};

export default BarsAxises;

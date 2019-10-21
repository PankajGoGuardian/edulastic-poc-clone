import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Text } from "@vx/text";

import { Line } from "../styled";
import { getGridVariables } from "../helpers";

const BarsAxises = ({ lines, gridParams, displayAxisLabel, displayGridlines, setHeightAddition, heightAddition }) => {
  const { height, margin } = gridParams;

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
            <g transform={`translate(${getConstantX(index)}, ${height})`}>
              <StyledText textAnchor="middle" verticalAnchor="start" width={70}>
                {lines[index].x}
              </StyledText>
            </g>
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

const StyledText = styled(Text)`
  user-select: none;
  fill: ${props => props.theme.widgets.chart.labelStrokeColor};
`;

export default BarsAxises;

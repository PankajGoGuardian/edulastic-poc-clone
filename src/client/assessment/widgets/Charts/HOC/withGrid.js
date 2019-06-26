import React from "react";
import PropTypes from "prop-types";

import { FlexContainer } from "@edulastic/common";

import { getYAxis, getPadding } from "../helpers";

const withGrid = WrappedComponent => {
  const hocComponent = props => {
    const {
      name,
      gridParams: { width, margin, yAxisMax, yAxisMin, stepSize, xAxisLabel, yAxisLabel }
    } = props;

    const yAxis = getYAxis(yAxisMax, yAxisMin, stepSize);
    const padding = getPadding(yAxis);

    return (
      <FlexContainer justifyContent="flex-start">
        <FlexContainer style={{ transform: "rotate(-90deg)", width: 40, whiteSpace: "nowrap", marginTop: margin }}>
          {yAxisLabel}
        </FlexContainer>
        <div>
          <FlexContainer style={{ width, marginBottom: 20 }} justifyContent="center">
            {name}
          </FlexContainer>
          <WrappedComponent {...props} />
          <FlexContainer style={{ width, marginTop: 10, marginLeft: padding / 2 }} justifyContent="center">
            {xAxisLabel}
          </FlexContainer>
        </div>
      </FlexContainer>
    );
  };

  hocComponent.propTypes = {
    data: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    gridParams: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      margin: PropTypes.number,
      yAxisMax: PropTypes.number,
      yAxisMin: PropTypes.number,
      stepSize: PropTypes.number,
      snapTo: PropTypes.number
    })
  };

  hocComponent.defaultProps = {
    gridParams: {
      width: 640,
      height: 440,
      margin: 40,
      yAxisMax: 70,
      yAxisMin: 0,
      stepSize: 5,
      snapTo: 5
    }
  };

  return hocComponent;
};

export default withGrid;

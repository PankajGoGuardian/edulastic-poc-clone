import React from "react";
import { StyledAxisTickText } from "../../../styled";

export const CustomChartXTick = props => {
  const { x, y, payload, data, getXTickText } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <StyledAxisTickText textAnchor="middle" verticalAnchor="start" width={70}>
        {getXTickText ? getXTickText(payload, data) : payload.value}
      </StyledAxisTickText>
    </g>
  );
};

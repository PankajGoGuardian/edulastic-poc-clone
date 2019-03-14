import React from "react";
import { StyledAxisTickText } from "../styled";

export const CustomChartXTick = props => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <StyledAxisTickText textAnchor="middle" verticalAnchor="start" width={70}>
        {payload.value}
      </StyledAxisTickText>
    </g>
  );
};

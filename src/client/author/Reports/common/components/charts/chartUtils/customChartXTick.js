import React from "react";
import { StyledAxisTickText } from "../../../styled";

export const CustomChartXTick = props => {
  const { x, y, payload, data, getXTickText } = props;

  let text;
  if (getXTickText) {
    text = getXTickText(payload, data);
  } else {
    text = payload.value;
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <StyledAxisTickText textAnchor="middle" verticalAnchor="start" width={70}>
        {text}
      </StyledAxisTickText>
    </g>
  );
};

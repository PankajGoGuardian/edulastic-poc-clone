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

  if (text && text.length > 25) {
    if (text[19] === " ") text = text.substr(0, 24);
    else text = text.substr(0, 25);
    text = text + "...";
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <StyledAxisTickText textAnchor="middle" verticalAnchor="start" width={70}>
        {text}
      </StyledAxisTickText>
    </g>
  );
};

//here we are subtracting tooltipWidth/2
export const calculateXCoordinateOfXAxisToolTip = (coordinate, xTickToolTipWidth) =>
  Math.round(coordinate, 3) - xTickToolTipWidth / 2;

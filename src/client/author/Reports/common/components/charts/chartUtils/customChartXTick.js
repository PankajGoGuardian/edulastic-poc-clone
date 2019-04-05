import React from "react";
import { StyledAxisTickText, StyledText } from "../../../styled";
import { isMobileScreen } from "../../../util";

export const CustomChartXTick = props => {
  const { x, y, payload, data, getXTickText } = props;

  let text;
  let isMobile = false;
  if (isMobileScreen()) {
    isMobile = true;
    if (getXTickText) {
      text = getXTickText(payload, data);
    } else {
      text = payload.value;
    }
    if (text.length > 12) {
      text = text.substring(0, 12) + "...";
    }
  }

  return (
    <g transform={`translate(${x},${y})`}>
      {!isMobile ? (
        <StyledAxisTickText textAnchor="middle" verticalAnchor="start" width={70}>
          {getXTickText ? getXTickText(payload, data) : payload.value}
        </StyledAxisTickText>
      ) : (
        <StyledText textAnchor="middle" width={70} transform="rotate(-45)" dx="-45">
          {text}
        </StyledText>
      )}
    </g>
  );
};

import React, { useMemo, useState } from "react";

export const CustomLineLabel = props => {
  const { x, y, index, label, value, showLabel, customValue } = props;

  let showLabelFlag = true;
  if (showLabel && !showLabel(index)) {
    showLabelFlag = false;
  }

  let _value = value;
  if (customValue) {
    _value = customValue;
  }

  return (
    <g transform={`translate(${x}, ${y})`}>
      <text {...label} dy={20}>
        {showLabelFlag ? _value : ""}
      </text>
    </g>
  );
};

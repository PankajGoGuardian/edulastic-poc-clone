import React from "react";
import { fadedBlack } from "@edulastic/colors";

export const CustomChartCursor = props => {
  const { right, height, width, payload, points, lineYDomain, direction } = props;
  const lineYPlotPoint = points[0].y + (height * (lineYDomain[1] - payload[2].value)) / lineYDomain[1];

  return (
    <>
      <line
        x1={points[0].x}
        y1={lineYPlotPoint}
        x2={points[1].x}
        y2={points[1].y}
        stroke={fadedBlack}
        strokeWidth="2px"
        strokeDasharray="6"
      />
      <line
        x1={width + right}
        y1={lineYPlotPoint}
        x2={points[1].x}
        y2={lineYPlotPoint}
        stroke={fadedBlack}
        strokeWidth="2px"
        strokeDasharray="6"
      />
    </>
  );
};

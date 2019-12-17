import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { ResponsiveContainer, LineChart, Line, Legend, Tooltip, XAxis, YAxis, LabelList, Label } from "recharts";

import { CustomLineLabel } from "./chartUtils/CustomLineLabel";

import { VxText } from "../../../assessment/widgets/Charts/styled";

const CustomLineChart = props => {
  const {
    className,
    chartData,
    lineData,
    xAxisDataKey,
    width = "100%",
    height = 400,
    yAxisLabel = "",
    dot = false,
    margin = { top: 10, right: 30, left: 0, bottom: 10 }
  } = props;

  const constants = {
    TICK_FILL: { stroke: "#949CA4", fontSize: "11px", fontWeight: "lighter", dy: 10, fontFamily: "Open Sans" },
    Y_AXIS_LABEL: {
      value: yAxisLabel.toUpperCase(),
      angle: -90,
      dx: 15,
      stroke: "#949CA4",
      fontSize: "11px",
      fontWeight: "lighter",
      letterSpacing: "1.5px",
      fontFamily: "Open Sans"
    }
  };

  const showLineLabel = index => {
    if (index === chartData.length - 2) return true;
  };

  return (
    <ResponsiveContainer className={className} width={width} height={height}>
      <LineChart data={chartData} width={width} height={height} margin={margin}>
        <XAxis
          dataKey={xAxisDataKey}
          tick={constants.TICK_FILL}
          axisLine={{ stroke: "#D6D6D6" }}
          tickLine={{ stroke: "#D6D6D6" }}
          tickSize={10}
        />
        <YAxis
          tick={false}
          label={constants.Y_AXIS_LABEL}
          axisLine={{ stroke: "#D6D6D6", strokeWidth: "1px" }}
          tickLine={{ stroke: "#D6D6D6", strokeWidth: "1px" }}
        />
        {lineData.map((item, index) => (
          <Line
            type="monotone"
            key={`line-${index}`}
            dataKey={item.dataKey}
            stroke={item.stroke}
            strokeDasharray="5 2"
            strokeWidth="2"
            dot={dot}
          >
            <LabelList
              id={item.dataKey}
              position="bottom"
              label={{ stroke: item.labelStroke, fontWeight: "lighter", fontSize: "12px" }}
              content={<CustomLineLabel showLabel={showLineLabel} customValue={item.lineLabel} />}
              offset={10}
            />
          </Line>
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

const StyledCustomLineChart = styled(CustomLineChart)``;

export { StyledCustomLineChart as LineChart };

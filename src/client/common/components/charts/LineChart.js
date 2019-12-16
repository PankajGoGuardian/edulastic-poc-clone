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
    dot = false
  } = props;

  const constants = {
    TICK_FILL: { stroke: "#949CA4", fontWeight: "lighter", fontSize: "12px" },
    Y_AXIS_LABEL: {
      value: yAxisLabel.toUpperCase(),
      angle: -90,
      dx: 0,
      stroke: "#949CA4",
      fontSize: "12px",
      fontWeight: "lighter"
    }
  };

  const showLineLabel = index => {
    if (index === chartData.length - 2) return true;
  };

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={chartData} width={width} height={height}>
        <XAxis
          dataKey={xAxisDataKey}
          tick={constants.TICK_FILL}
          axisLine={{ stroke: "#D6D6D6" }}
          tickLine={{ stroke: "#D6D6D6" }}
        />
        <YAxis
          tick={false}
          label={constants.Y_AXIS_LABEL}
          axisLine={{ stroke: "#D6D6D6" }}
          tickLine={{ stroke: "#D6D6D6" }}
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
              label={{ stroke: item.stroke, fontWeight: "lighter", fontSize: "12px" }}
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

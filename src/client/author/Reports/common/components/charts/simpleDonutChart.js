import React from "react";
import styled from "styled-components";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export const SimpleDonutChart = props => {
  const {
    className,
    data,
    dataKey,
    name,
    tickFormatter,
    height = 250,
    layout = "vertical",
    centerDetails = false,
    centerDetailsData = {}
  } = props;
  let { cx = 0, cy = 0, innerRadius = 0, outerRadius = 0 } = props;
  if (!cx) {
    cx = height / 2;
  }
  if (!cy) {
    cy = height / 2;
  }

  if (!innerRadius) {
    innerRadius = height / 2 - 40;
  }

  if (!outerRadius) {
    outerRadius = height / 2 - 20;
  }

  return (
    <ResponsiveContainer className={className} width={"100%"} height={height}>
      <PieChart>
        <Pie data={data} cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} dataKey={dataKey}>
          {data.map((item, index) => (
            <Cell name={item[name]} key={"cell" + index} fill={item.fill} />
          ))}
        </Pie>
        <Legend verticalAlign="middle" align="right" layout={layout} />
        {centerDetails ? (
          <g style={{ transform: `translate(${cx}px, ${cy}px` }}>
            <text dominantBaseline="middle" textAnchor="middle">
              <tspan style={{ fontSize: "30px" }} fill={centerDetailsData.fill}>
                {centerDetailsData.bigText}
              </tspan>
              <tspan x={0} y={40} fill={"#c0c0c0"}>
                {centerDetailsData.smallText}
              </tspan>
            </text>
          </g>
        ) : null}
      </PieChart>
    </ResponsiveContainer>
  );
};

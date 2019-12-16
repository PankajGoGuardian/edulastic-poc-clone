import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

import { publisherFont2, publisherFont3 } from "@edulastic/colors";

const DonutChartWithText = props => {
  const {
    className,
    chartData,
    dataKey,
    centerTextNumber = 0,
    centerTextUnit = "Units",
    width = 200,
    height = 200,
    innerRadius = 70,
    outerRadius = 100
  } = props;

  return (
    <div className={className} style={{ width: `${width}px`, height: `${height}px` }}>
      <ResponsiveContainer width={width} height={height}>
        <PieChart width={width} height={height}>
          <Pie
            name={"name"}
            data={chartData}
            labelLine={false}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            dataKey={dataKey}
            fill="#8884d8"
          >
            {chartData.map((item, index) => (
              <Cell key={`cell-${index}`} fill={item.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="center-info-content">
        <p className="center-info-number">{centerTextNumber}</p>
        <p className="center-info-unit">{centerTextUnit}</p>
      </div>
    </div>
  );
};

const StyledDonutChartWithText = styled(DonutChartWithText)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .center-info-content {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .center-info-number {
      font-size: 30px;
      color: ${publisherFont2};
      padding: 0;
      font-weight: 900;
    }
    .center-info-unit {
      font-size: 12px;
      font-weight: 900;
      color: ${publisherFont3};
      display: flex;
      align-items: center;
      padding: 0;
      text-transform: uppercase;
    }
  }
`;

export { StyledDonutChartWithText as DonutChartWithText };

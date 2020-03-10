import React from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid } from "recharts";

import { fadedGreen, fadedRed, lightGrey7 } from "@edulastic/colors";

import { getQuadsData } from "../transformers";

// custom label shape for scatter plot
const ScatterLabel = ({ cx, cy, name, trend, fill }) => {
  return (
    <g>
      <text x={cx} y={cy} font-size="12" font-weight="bold" textAnchor="middle" fill={fill}>
        {name} - {trend}
      </text>
      {/* TODO: SVG Arrow which takes {trend} and {color} as input */}
    </g>
  );
};

const InsightsChart = ({ data }) => {
  const quads = getQuadsData(data);

  // props for standard components
  const responsiveContainerProps = {
    width: "50%",
    height: "50%",
    aspect: 1
  };
  const scatterChartProps = {
    width: "100%",
    height: "100%",
    margin: { top: -1, right: -1, bottom: -1, left: -1 }
  };

  return (
    <Row type="flex" justify="center" align="middle" style={{ width: "90%" }}>
      <StyledCol xs={1} sm={2} md={2} lg={2} xl={2}>
        LOW EFFORT
      </StyledCol>
      <StyledCol xs={22} sm={20} md={20} lg={16} xl={16}>
        <Row type="flex" justify="center">
          <StyledCol span={24}>HIGH PERFORMANCE</StyledCol>
          <StyledCol span={24}>
            {quads.map((quad, index) => (
              <ResponsiveContainer {...responsiveContainerProps}>
                <StyledScatterChart region={index} {...scatterChartProps}>
                  <XAxis type="number" dataKey={"effort"} name="effort" domain={quad.domainX} hide />
                  <YAxis type="number" dataKey={"performance"} name="performance" domain={quad.domainY} hide />
                  {/* <CartesianGrid /> */}
                  <Scatter name="A school" data={quad.data} shape={<ScatterLabel fill={quad.color} />} />
                </StyledScatterChart>
              </ResponsiveContainer>
            ))}
          </StyledCol>
          <StyledCol span={24}>LOW PERFORMANCE</StyledCol>
        </Row>
      </StyledCol>
      <StyledCol xs={1} sm={2} md={2} lg={2} xl={2}>
        HIGH EFFORT
      </StyledCol>
    </Row>
  );
};

export default InsightsChart;

const StyledCol = styled(Col)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px;
  text-transform: uppercase;
  color: ${lightGrey7};
  font: Bold 11px/15px Open Sans;
`;

const StyledScatterChart = styled(ScatterChart)`
  ${props => {
    switch (props.region) {
      case 0:
        return `
          border-radius: 100% 0 0 0;
          background-color: ${fadedGreen};
          border-top: 1px solid #ddd;
          border-left: 1px solid #ddd;
        `;
        break;
      case 1:
        return `
          border-radius: 0 100% 0 0;
          border-top: 1px solid #ddd;
          border-right: 1px solid #ddd;
        `;
        break;
      case 2:
        return `
          border-radius: 0 0 0 100%;
          border-bottom: 1px solid #ddd;
          border-left: 1px solid #ddd;
        `;
        break;
      case 3:
        return `
          border-radius: 0 0 100% 0;
          background-color: ${fadedRed};
          border-bottom: 1px solid #ddd;
          border-right: 1px solid #ddd;
        `;
        break;
    }
  }}
`;

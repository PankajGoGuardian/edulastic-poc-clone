import React from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import { round } from "lodash";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis } from "recharts";

import { lightGrey7 } from "@edulastic/colors";
import { domainRange, scaleFactor, getQuadsData, calcArrowPosition } from "../transformers";
import gradientColorRuler from "../assets/ruler-color-gradient.svg";

// custom label shape for scatter plot
const ScatterLabel = ({ cx, cy, name, trendAngle, color }) => {
  return (
    <g>
      <text x={cx} y={cy} font-size="12" font-weight="bold" textAnchor="middle" fill={color}>
        {name}
      </text>
      <g transform={`translate(${calcArrowPosition({ cx, cy, name, trendAngle })}) rotate(${-trendAngle - 90})`}>
        <path d="M0,0V18.385" transform="translate(4.065 3.536)" fill="none" stroke={color} stroke-width="2" />
        <g transform="translate(7.565 26.438) rotate(180)" fill={color}>
          <path
            d="M 6.129451751708984 5.499964714050293 L 0.8705185651779175 5.499964714050293 L 3.499985218048096 0.9923245310783386 L 6.129451751708984 5.499964714050293 Z"
            stroke="none"
          />
          <path
            d="M 3.499985218048096 1.984634399414062 L 1.741035938262939 4.999964714050293 L 5.258934497833252 4.999964714050293 L 3.499985218048096 1.984634399414062 M 3.499985218048096 4.291534423828125e-06 L 6.999975204467773 5.999964714050293 L -4.76837158203125e-06 5.999964714050293 L 3.499985218048096 4.291534423828125e-06 Z"
            stroke="none"
            fill={color}
          />
        </g>
        <path d="M3,0A3,3,0,1,1,0,3,3,3,0,0,1,3,0Z" transform="translate(8.485 4.243) rotate(135)" fill={color} />
      </g>
    </g>
  );
};

const InsightsChart = ({ data }) => {
  const quadsData = getQuadsData(data);
  const graphLimit = round((domainRange * scaleFactor) / 2);

  // props for standard components
  const responsiveContainerProps = {
    width: "100%",
    height: "100%",
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
        <Row type="flex" justify="center" style={{ width: "100%" }}>
          HIGH PERFORMANCE
        </Row>
        <Row type="flex" justify="center" align="middle" style={{ width: "100%" }}>
          <StyledImg alt="icon" src={gradientColorRuler} />
          <ResponsiveContainer {...responsiveContainerProps}>
            <ScatterChart {...scatterChartProps}>
              <XAxis type="number" dataKey={"effort"} name="effort" domain={[-graphLimit, graphLimit]} hide />
              <YAxis type="number" dataKey={"performance"} name="performance" domain={[-graphLimit, graphLimit]} hide />
              <Scatter name="A school" data={quadsData} shape={<ScatterLabel />} />
            </ScatterChart>
          </ResponsiveContainer>
        </Row>
        <Row type="flex" justify="center" style={{ width: "100%" }}>
          LOW PERFORMANCE
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
  min-width: 75px;
  text-transform: uppercase;
  color: ${lightGrey7};
  font: Bold 11px/15px Open Sans;
`;

const StyledImg = styled.img`
  width: 95%;
  height: 95%;
  position: absolute;
`;

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import { round } from "lodash";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis } from "recharts";

import { white, lightGrey7 } from "@edulastic/colors";
import { domainRange, scaleFactor, getQuadsData, calcLabelPosition } from "../transformers";
import gradientColorRuler from "../assets/ruler-color-gradient.svg";
import TrendArrow from "../assets/TrendArrow";

const toggleActiveData = ({ studentId, activeData, setActiveData, allActive }) =>
  setActiveData(
    activeData.map(item => {
      if (!item.isGrouped) {
        item.isActive = item.studentId === studentId ? !item.isActive : allActive == null ? item.isActive : allActive;
      }
      return item;
    })
  );

// custom label shape for scatter plot
const ScatterLabel = props => {
  const { cx, cy, handleArrowClick, handleCircleClick, ...item } = props;
  const { studentId, name, trendAngle, color, count, isActive, isGrouped } = item;
  const { nameX, arrowY } = calcLabelPosition({ cx, cy, name, trendAngle });
  return isGrouped ? (
    <g onClick={e => handleCircleClick(e, item.studentIds, color)}>
      <circle cx={cx} cy={cy} r={12} fill={lightGrey7} />
      <text x={cx} y={cy + 4} fill={white} text-anchor="middle" font-size="11" font-weight="bold" textAnchor="middle">
        {count}
      </text>
    </g>
  ) : (
    <g onClick={e => handleArrowClick(e, studentId)}>
      {isActive && (
        <text x={nameX} y={cy} font-size="12" font-weight="bold" textAnchor="middle" fill={color}>
          {name}
        </text>
      )}
      <TrendArrow cx={cx} cy={arrowY} color={color} trendAngle={trendAngle} />
    </g>
  );
};

const InsightsChart = ({ data, highlighted, setHighlighted }) => {
  // active state of the display data (labels)
  const [activeData, setActiveData] = useState([]);
  const [allActive, setAllActive] = useState(false);

  useEffect(() => {
    setActiveData(getQuadsData(data));
  }, [data]);

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
    margin: { top: -1, right: -1, bottom: -1, left: -1 },
    onClick: () => {
      toggleActiveData({ activeData, setActiveData, allActive: !allActive });
      setAllActive(!allActive);
    }
  };

  return (
    <Row type="flex" justify="center" align="middle" style={{ width: "100%" }}>
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
              <Scatter
                name="Effort vs Performance"
                data={activeData}
                shape={
                  <ScatterLabel
                    handleArrowClick={(e, studentId) => {
                      e.stopPropagation();
                      toggleActiveData({ studentId, activeData, setActiveData });
                    }}
                    handleCircleClick={(e, studentIds, color) => {
                      e.stopPropagation();
                      setHighlighted(highlighted.ids?.includes(studentIds[0]) ? {} : { ids: studentIds, color });
                    }}
                  />
                }
              />
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

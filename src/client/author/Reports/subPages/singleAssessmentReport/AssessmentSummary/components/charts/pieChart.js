import { fadedBlack } from "@edulastic/colors";
import { Col, Row } from "antd";
import { sumBy } from "lodash";
import PropTypes from "prop-types";
import React, { useMemo, useState } from "react";
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import styled from "styled-components";
import { StyledCustomChartTooltip } from "../styled";

export const SimplePieChart = ({ data }) => {
  const [activeLegend, setActiveLegend] = useState(null);

  const onLegendMouseEnter = ({ value }) => setActiveLegend(value);
  const onLegendMouseLeave = () => setActiveLegend(null);

  const renderCustomizedLabel = args => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = args;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill={fadedBlack} textAnchor={"middle"} dominantBaseline="central" fontSize={"11px"}>
        {Math.round(percent * 100) ? `${Math.round(percent * 100)}%` : ""}
      </text>
    );
  };

  const chartData = useMemo(() => {
    const arr = [];
    if (data) {
      const sum = sumBy(data, o => {
        return o.bandPerf;
      });
      for (let i = 0; i < data.length; i++) {
        let fillOpacity = 1;

        if (activeLegend && activeLegend !== data[i].name) {
          fillOpacity = 0.2;
        }

        arr.push({
          bandPerf: data[i].bandPerf,
          fill: data[i].color,
          name: data[i].name,
          sum,
          fillOpacity
        });
      }
    }
    return arr;
  }, [data, activeLegend]);

  const getTooltipJSX = payload => {
    if (payload && payload.length) {
      return (
        <div>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">{payload[0].name} : </Col>
            <Col className="tooltip-value">{Math.round((payload[0].value / payload[0].payload.sum) * 100)}%</Col>
          </Row>
        </div>
      );
    }
    return false;
  };

  return (
    <ResponsiveContainer width={"100%"}>
      <PieChartWrapper>
        <Legend
          onMouseEnter={onLegendMouseEnter}
          onMouseLeave={onLegendMouseLeave}
          layout="vertical"
          align="center"
          verticalAlign="bottom"
        />
        <Tooltip cursor={false} content={<StyledCustomChartTooltip getJSX={getTooltipJSX} />} />
        <Pie
          name={"name"}
          data={chartData}
          labelLine={false}
          innerRadius={35}
          outerRadius={65}
          dataKey="bandPerf"
          label={renderCustomizedLabel}
        />
      </PieChartWrapper>
    </ResponsiveContainer>
  );
};
const performanceByBand = PropTypes.shape({
  aboveStandard: PropTypes.number,
  bandPerf: PropTypes.number,
  color: PropTypes.string,
  name: PropTypes.string,
  threshold: PropTypes.number
});

SimplePieChart.propTypes = {
  data: PropTypes.arrayOf(performanceByBand).isRequired
};

const PieChartWrapper = styled(PieChart)`
  margin-top: 0px;
`;

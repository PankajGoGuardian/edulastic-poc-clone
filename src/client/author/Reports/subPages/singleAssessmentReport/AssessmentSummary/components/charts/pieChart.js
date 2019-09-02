import React, { useMemo, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Legend, Tooltip } from "recharts";
import { fadedBlack } from "@edulastic/colors";
import { StyledCustomChartTooltip } from "../styled";
import { Row, Col } from "antd";
import { sumBy } from "lodash";
import { getHSLFromRange1 } from "../../../../../common/util";
import performanceBandColorRange from "../../../../../common/static/json/performanceBandColorRange.json";

export const SimplePieChart = props => {
  const [activeLegend, setActiveLegend] = useState(null);

  const onLegendMouseEnter = ({ value }) => setActiveLegend(value);
  const onLegendMouseLeave = () => setActiveLegend(null);

  const renderCustomizedLabel = args => {
    const RADIAN = Math.PI / 180;
    let { cx, cy, midAngle, innerRadius, outerRadius, percent, index } = args;
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
    let arr = [];
    if (props.data) {
      const sum = sumBy(props.data, o => {
        return o.bandPerf;
      });
      const colors = performanceBandColorRange[props.data.length];
      for (let i = 0; i < props.data.length; i++) {
        let fillOpacity = 1;

        if (activeLegend && activeLegend !== props.data[i].name) {
          fillOpacity = 0.2;
        }

        arr.push({
          bandPerf: props.data[i].bandPerf,
          fill: colors[i],
          name: props.data[i].name,
          sum,
          fillOpacity
        });
      }
    }
    return arr;
  }, [props.data, activeLegend]);

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
      <PieChart>
        <Legend
          onMouseEnter={onLegendMouseEnter}
          onMouseLeave={onLegendMouseLeave}
          layout="vertical"
          align="center"
          verticalAlign="bottom"
        />
        <Tooltip cursor={false} content={<StyledCustomChartTooltip getJSX={getTooltipJSX} />} />
        <Pie name={"name"} data={chartData} labelLine={false} dataKey="bandPerf" label={renderCustomizedLabel} />
      </PieChart>
    </ResponsiveContainer>
  );
};

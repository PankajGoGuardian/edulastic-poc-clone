import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ResponsiveContainer, PieChart, Pie, Legend, Tooltip } from "recharts";
import { fadedBlack } from "@edulastic/colors";
import { StyledCustomChartTooltip } from "../styled";
import { Row, Col } from "antd";
import { sumBy, isEmpty } from "lodash";
import { getHSLFromRange1 } from "../../../../../common/util";
import performanceBandColorRange from "../../../../../common/static/json/performanceBandColorRange.json";

const renderCustomizedLabel = args => {
  console.log("renderCustomizedLabel");
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

const customTooltip = <StyledCustomChartTooltip getJSX={getTooltipJSX} />;

export const SimplePieChart = props => {
  // const [prevData, setPrevData] = useState(null);

  // const renderCustomizedLabel = useCallback(args => {
  //   console.log("renderCustomizedLabel");
  //   const RADIAN = Math.PI / 180;
  //   let { cx, cy, midAngle, innerRadius, outerRadius, percent, index } = args;
  //   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  //   const x = cx + radius * Math.cos(-midAngle * RADIAN);
  //   const y = cy + radius * Math.sin(-midAngle * RADIAN);
  //   return (
  //     <text x={x} y={y} fill={fadedBlack} textAnchor={"middle"} dominantBaseline="central" fontSize={"11px"}>
  //       {Math.round(percent * 100) ? `${Math.round(percent * 100)}%` : ""}
  //     </text>
  //   );
  // }, []);

  const chartData = useMemo(() => {
    let arr = [];
    if (props.data) {
      const sum = sumBy(props.data, o => {
        return o.bandPerf;
      });
      const colors = performanceBandColorRange[props.data.length];
      for (let i = 0; i < props.data.length; i++) {
        arr.push({
          bandPerf: props.data[i].bandPerf,
          fill: colors[i],
          name: props.data[i].name,
          sum: sum
        });
      }
    }
    return arr;
  }, [props.data]);

  // const getTooltipJSX = payload => {
  //   if (payload && payload.length) {
  //     return (
  //       <div>
  //         <Row type="flex" justify="start">
  //           <Col className="tooltip-key">{payload[0].name} : </Col>
  //           <Col className="tooltip-value">{Math.round((payload[0].value / payload[0].payload.sum) * 100)}%</Col>
  //         </Row>
  //       </div>
  //     );
  //   }
  //   return false;
  // };

  // let shouldAnimate = false;
  // if (props.data !== prevData && !isEmpty(props.data)) {
  //   setPrevData(props.data);
  //   shouldAnimate = true;
  // }

  return (
    <ResponsiveContainer width={"100%"}>
      <PieChart>
        <Legend layout="vertical" align="left" verticalAlign="middle" />
        {/* <Tooltip cursor={false} content={<StyledCustomChartTooltip getJSX={getTooltipJSX} />} /> */}
        <Tooltip cursor={false} content={customTooltip} />
        <Pie
          name={"name"}
          data={chartData}
          labelLine={false}
          dataKey="bandPerf"
          label={renderCustomizedLabel}
          // isAnimationActive={shouldAnimate}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

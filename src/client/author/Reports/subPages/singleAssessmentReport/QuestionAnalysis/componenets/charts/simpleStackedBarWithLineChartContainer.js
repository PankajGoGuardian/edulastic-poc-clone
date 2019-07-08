import React, { useMemo } from "react";
import { Row, Col } from "antd";
import { maxBy } from "lodash";
import { ticks } from "d3-array";
import { getHSLFromRange1 } from "../../../../../common/util";
import { SimpleStackedBarChart } from "../../../../../common/components/charts/simpleStackedBarChart";
import { fadedBlack } from "@edulastic/colors";

import { getFormattedTimeInMins } from "../../utils/helpers";

const chartSpecifics = {
  barsData: [
    { key: "avgPerformance", stackId: "a", fill: getHSLFromRange1(100), unit: "%" },
    { key: "avgIncorrect", stackId: "a", fill: getHSLFromRange1(0), unit: "%" }
  ],
  yAxisLabel: "Above/Below Standard"
};

const lineYTickFormatter = val => {
  return getFormattedTimeInMins(val);
};

export const SimpleStackedBarWithLineChartContainer = ({ chartData, filter, onBarClickCB, onResetClickCB }) => {
  const getTooltipJSX = payload => {
    if (payload && payload.length) {
      const { qLabel, avgPerformance, avgTime, districtAvg } = payload[0].payload;
      return (
        <div>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">{qLabel}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">Avg. Performance: </Col>
            <Col className="tooltip-value">{avgPerformance}%</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">Avg. Time: </Col>
            <Col className="tooltip-value">{getFormattedTimeInMins(avgTime)} mins</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">District Avg: </Col>
            <Col className="tooltip-value">{districtAvg}%</Col>
          </Row>
        </div>
      );
    }
    return false;
  };

  const getTooltipCursorJSX = props => {
    const { right, height, width, payload, points, lineYDomain } = props;
    const lineYPlotPoint = points[0].y + (height * (lineYDomain[1] - payload[2].value)) / lineYDomain[1];
    return (
      <>
        <line
          x1={points[0].x}
          y1={lineYPlotPoint}
          x2={points[1].x}
          y2={points[1].y}
          stroke={fadedBlack}
          strokeWidth="2px"
          strokeDasharray="6"
        />
        <line
          x1={width + right}
          y1={lineYPlotPoint}
          x2={points[1].x}
          y2={lineYPlotPoint}
          stroke={fadedBlack}
          strokeWidth="2px"
          strokeDasharray="6"
        />
      </>
    );
  };

  const lineYDomain = useMemo(() => {
    let m = maxBy(chartData, "avgTime");
    m = m ? m.avgTime : 0;
    m = m + (20 / 100) * m;
    return [0, m];
  }, [chartData]);

  const len = Object.keys(filter).length;
  for (let item of chartData) {
    if (filter[item["qLabel"]] || len === 0) {
      item.fill = getHSLFromRange1(item.avgPerformance);
    } else {
      item.fill = "#cccccc";
    }
  }

  return (
    <SimpleStackedBarChart
      margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
      pageSize={10}
      data={chartData}
      barsData={chartSpecifics.barsData}
      xAxisDataKey={"qLabel"}
      bottomStackDataKey={"avgPerformance"}
      topStackDataKey={"avgIncorrect"}
      getTooltipJSX={getTooltipJSX}
      getTooltipCursorJSX={getTooltipCursorJSX}
      onBarClickCB={onBarClickCB}
      onResetClickCB={onResetClickCB}
      yAxisLabel="Avg.Score (%)"
      filter={filter}
      lineXAxisDataKey={"qLabel"}
      lineYAxisLabel="Time (mins)"
      lineYTickFormatter={lineYTickFormatter}
      lineYDomain={lineYDomain}
      lineTicks={ticks(0, lineYDomain[1], 10)}
      lineChartDataKey="avgTime"
      lineProps={{ stroke: "#ff7300", strokeWidth: "5px" }}
      lineYAxisLabel="Time (mins)"
    />
  );
};

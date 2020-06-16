import React, { useMemo } from "react";
import { Row, Col } from "antd";
import { ticks } from "d3-array";
import { SimpleStackedBarChart } from "../../../../../common/components/charts/simpleStackedBarChart";
import { getHSLFromRange1 } from "../../../../../common/util";
import { idToName } from "../../util/transformers";

export const SimpleStackedBarChartContainer = ({
  data,
  analyseBy,
  compareBy,
  filter,
  onBarClickCB,
  onResetClickCB,
  assessmentName,
  role
}) => {
  const dataParser = () => {
    for (const item of data) {
      if (filter[item[compareBy === "group" ? "groupId" : compareBy]] || Object.keys(filter).length === 0) {
        if (analyseBy === "score(%)") {
          item.fill = getHSLFromRange1(item.avgStudentScorePercent);
        } else if (analyseBy === "rawScore") {
          item.fill = getHSLFromRange1((item.avgStudentScore / item.maxScore) * 100);
        }
      } else {
        item.fill = "#cccccc";
      }
    }
    return data;
  };

  const getTooltipJSX = payload => {
    if (payload && payload.length) {
      const { districtAvg, compareBy, compareBylabel } = payload[0].payload;
      return (
        <div>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">{"Assessment Name: "}</Col>
            <Col className="tooltip-value">{assessmentName}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">{`${idToName[compareBy]  }: `}</Col>
            <Col className="tooltip-value">{compareBylabel}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">{"District Average: "}</Col>
            <Col className="tooltip-value">{analyseBy === "score(%)" ? `${districtAvg  }%` : districtAvg}</Col>
          </Row>
        </div>
      );
    }
    return false;
  };

  const getXTickText = (payload, items) => {
    for (const item of items) {
      if (item[compareBy === "group" ? "groupId" : compareBy] === payload.value) {
        return item.compareBylabel;
      }
    }
    return "";
  };

  const chartData = useMemo(() => dataParser(), [data, filter]);

  const _onBarClickCB = key => {
    onBarClickCB(key);
  };

  const _onResetClickCB = () => {
    onResetClickCB();
  };

  const getChartSpecifics = () => {
    let referenceLineY = 0;
    if (chartData.length) {
      referenceLineY = chartData[0].districtAvg;
    }
    if (analyseBy === "score(%)") {
      let yAxisLabel = "Avg. Score %";
      if (role === "teacher") {
        yAxisLabel = "Avg. Class Performance %";
      }
      return {
        yDomain: [0, 110],
        ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        formatter: val => `${val  }%`,
        yAxisLabel,
        referenceLineY
      };
    } if (analyseBy === "rawScore" && chartData.length > 0) {
      const maxScore = chartData[0].maxScore;
      const arr = ticks(0, maxScore, 10);
      const max = arr[arr.length - 1];
      return {
        yDomain: [0, max + (arr[1] - arr[0])],
        ticks: arr,
        formatter: val => val,
        yAxisLabel: "Avg. Score",
        referenceLineY
      };
    } 
      return {};
    
  };

  const chartSpecifics = getChartSpecifics();

  return (
    <SimpleStackedBarChart
      data={chartData}
      yDomain={chartSpecifics.yDomain}
      ticks={chartSpecifics.ticks}
      yTickFormatter={chartSpecifics.formatter}
      barsLabelFormatter={chartSpecifics.formatter}
      xAxisDataKey={compareBy === "group" ? "groupId" : compareBy}
      bottomStackDataKey="correct"
      topStackDataKey="incorrect"
      getTooltipJSX={getTooltipJSX}
      dataParser={dataParser}
      onBarClickCB={_onBarClickCB}
      onResetClickCB={_onResetClickCB}
      getXTickText={getXTickText}
      yAxisLabel={chartSpecifics.yAxisLabel}
      filter={filter}
      referenceLineY={chartSpecifics.referenceLineY}
    />
  );
};

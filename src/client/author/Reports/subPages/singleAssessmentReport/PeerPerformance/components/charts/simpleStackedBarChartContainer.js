import React, { useState, useEffect, useMemo } from "react";
import { groupBy } from "lodash";
import { Row, Col } from "antd";
import { ticks } from "d3-array";
import { SimpleStackedBarChart } from "../../../../../common/components/charts/simpleStackedBarChart";
import { getHSLFromRange1 } from "../../../../../common/util";
import { idToName, analyseByToName } from "../../util/transformers";

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
    for (let item of data) {
      if (filter[item[compareBy]] || Object.keys(filter).length === 0) {
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
      let { districtAvg, compareBy, compareBylabel, correct } = payload[0].payload;
      return (
        <div>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">{"Assessment Name: "}</Col>
            <Col className="tooltip-value">{assessmentName}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">{idToName[compareBy] + ": "}</Col>
            <Col className="tooltip-value">{compareBylabel}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">{"District Average: "}</Col>
            <Col className="tooltip-value">{analyseBy === "score(%)" ? districtAvg + "%" : districtAvg}</Col>
          </Row>
        </div>
      );
    }
    return false;
  };

  const getXTickText = (payload, data) => {
    for (let item of data) {
      if (item[compareBy] === payload.value) {
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
        yTickFormatter: val => {
          if (val !== 0) {
            return val + "%";
          } else {
            return "";
          }
        },
        yAxisLabel: yAxisLabel,
        referenceLineY: referenceLineY
      };
    } else if (analyseBy === "rawScore" && chartData.length > 0) {
      let maxScore = chartData[0].maxScore;
      let arr = ticks(0, maxScore, 10);
      let max = arr[arr.length - 1];
      return {
        yDomain: [0, max + (arr[1] - arr[0])],
        ticks: arr,
        yTickFormatter: val => {
          if (val !== 0) {
            return val;
          } else {
            return "";
          }
        },
        yAxisLabel: "Avg. Score",
        referenceLineY: referenceLineY
      };
    } else {
      return {};
    }
  };

  const chartSpecifics = getChartSpecifics();

  return (
    <SimpleStackedBarChart
      data={chartData}
      yDomain={chartSpecifics.yDomain}
      ticks={chartSpecifics.ticks}
      yTickFormatter={chartSpecifics.yTickFormatter}
      barsLabelFormatter={chartSpecifics.yTickFormatter}
      xAxisDataKey={compareBy}
      bottomStackDataKey={"correct"}
      topStackDataKey={"incorrect"}
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

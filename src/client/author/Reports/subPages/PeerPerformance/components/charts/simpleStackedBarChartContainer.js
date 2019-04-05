import React, { useState, useEffect, useMemo } from "react";
import { groupBy } from "lodash";
import { Row, Col } from "antd";
import { SimpleStackedBarChart } from "../../../../common/components/charts/simpleStackedBarChart";
import { getHSLFromRange1 } from "../../../../common/util";
import { idToName, analyseByToName } from "../../util/transformers";

export const SimpleStackedBarChartContainer = ({
  data,
  analyseBy,
  compareBy,
  filter,
  onBarClickCB,
  onResetClickCB,
  assessmentName
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
            <Col className="tooltip-key">{analyseByToName[analyseBy] + ": "}</Col>
            <Col className="tooltip-value">{analyseBy === "score(%)" ? correct + "%" : correct}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">{"District Average: "}</Col>
            <Col className="tooltip-value">{analyseBy === "score(%)" ? districtAvg + "%" : districtAvg}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">{idToName[compareBy] + ": "}</Col>
            <Col className="tooltip-value">{compareBylabel}</Col>
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
    if (analyseBy === "score(%)") {
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
        yAxisLabel: "Avg. Score %"
      };
    } else if (analyseBy === "rawScore" && chartData.length > 0) {
      let maxScore = chartData[0].maxScore;
      let interval = Math.ceil(maxScore / 10);
      let arr = [];
      let count = 0;
      while (count * interval <= maxScore) {
        arr.push(count * interval);
        count++;
      }
      let max = arr[arr.length - 1];
      if (max < maxScore) {
        arr.push(maxScore);
      }

      return {
        yDomain: [0, max + interval],
        ticks: arr,
        yTickFormatter: val => {
          if (val !== 0) {
            return val;
          } else {
            return "";
          }
        },
        yAxisLabel: "Avg. Score"
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
      xAxisDataKey={compareBy}
      bottomStackDataKey={"correct"}
      topStackDataKey={"incorrect"}
      getTooltipJSX={getTooltipJSX}
      dataParser={dataParser}
      onBarClickCB={_onBarClickCB}
      onResetClickCB={_onResetClickCB}
      getXTickText={getXTickText}
      yAxisLabel={chartSpecifics.yAxisLabel}
    />
  );
};

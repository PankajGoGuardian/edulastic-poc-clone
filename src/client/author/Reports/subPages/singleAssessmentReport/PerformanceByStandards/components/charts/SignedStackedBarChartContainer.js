import React, { useState, useEffect, useMemo } from "react";
import { groupBy } from "lodash";
import { Row, Col } from "antd";
import { SignedStackedBarChart } from "../../../../../common/components/charts/signedStackedBarChart";
import { getHSLFromRange1 } from "../../../../../common/util";
import { getParsedGroupedMetricData, getMasteryLevel, analyzeByMode } from "../../util/transformers";

const SignedStackedBarChartContainer = ({ report, filter, onBarClickCB, onResetClickCB, viewBy, analyzeBy }) => {
  const { scaleInfo } = report;

  const parsedGroupedMetricData = getParsedGroupedMetricData(report, filter, viewBy);

  console.log(parsedGroupedMetricData, "parsedGroupedMetricData");

  const dataParser = () => {
    scaleInfo.sort((a, b) => {
      return a.threshold - b.threshold;
    });

    let arr = parsedGroupedMetricData.map(item => {
      for (let i = 0; i < scaleInfo.length; i++) {
        item["fill_" + i] = scaleInfo[i].color;
      }
      // if (Object.keys(selectedDomains).length === 0) {
      //   for (let i = 0; i < scaleInfo.length; i++) {
      //     item["fill_" + i] = getHSLFromRange1(Math.round((100 / (scaleInfo.length - 1)) * i));
      //   }
      // } else {
      //   for (let i = 0; i < scaleInfo.length; i++) {
      //     item["fill_" + i] = "#cccccc";
      //   }
      // }
      return { ...item };
    });

    return arr;
  };

  const getTooltipJSX = (payload, barIndex) => {
    if (payload && payload.length && barIndex !== null) {
      let { compareBy, compareBylabel } = payload[0].payload;

      return (
        <div>
          <Row type="flex" justify="start">
            {/* <Col className="tooltip-key">{idToName[compareBy] + ": "}</Col> */}
            <Col className="tooltip-value">{compareBylabel}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">Band: </Col>
            <Col className="tooltip-value">{payload[barIndex].name}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">{"Student (%): "}</Col>
            <Col className="tooltip-value">
              {`${Math.abs(payload[barIndex].value)}% (${
                payload[barIndex].payload[payload[barIndex].dataKey.substring(0, payload[barIndex].dataKey.length - 10)]
              })`}
            </Col>
          </Row>
        </div>
      );
    }
    return false;
  };

  const yTickFormatter = val => {
    return "";
  };

  const barsLabelFormatter = val => {
    if (val !== 0) {
      return Math.abs(val) + "%";
    } else {
      return "";
    }
  };

  const getXTickText = (payload, data) => {
    return payload.value;
  };

  const chartData = useMemo(() => dataParser(), [report, filter, viewBy, analyzeBy]);

  const _onBarClickCB = key => {
    onBarClickCB(key);
  };

  const _onResetClickCB = () => {
    onResetClickCB();
  };

  const getChartSpecifics = () => {
    scaleInfo.sort((a, b) => {
      return a.threshold - b.threshold;
    });

    let barsData = [];

    for (let [index, value] of scaleInfo.entries()) {
      barsData.push({
        key: value.masteryLabel + " Percentage",
        stackId: "a",
        fill: value.color,
        unit: "%",
        name: value[analyzeBy === analyzeByMode.MASTERY_LEVEL ? "masteryName" : "score"]
      });
    }
    return {
      barsData: barsData,
      yAxisLabel: "Mastery"
    };
  };

  const chartSpecifics = getChartSpecifics();

  return (
    <SignedStackedBarChart
      data={chartData}
      barsData={chartSpecifics.barsData}
      xAxisDataKey={"name"}
      getTooltipJSX={getTooltipJSX}
      onBarClickCB={_onBarClickCB}
      onResetClickCB={_onResetClickCB}
      getXTickText={getXTickText}
      yAxisLabel={chartSpecifics.yAxisLabel}
      yTickFormatter={yTickFormatter}
      barsLabelFormatter={barsLabelFormatter}
    />
  );
};

export default SignedStackedBarChartContainer;

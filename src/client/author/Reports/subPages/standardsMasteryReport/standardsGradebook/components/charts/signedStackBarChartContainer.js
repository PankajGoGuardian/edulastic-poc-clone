import React, { useEffect, useState, useMemo } from "react";
import { Row, Col } from "antd";
import { get, isEmpty } from "lodash";
import { SignedStackedBarChart } from "../../../../../common/components/charts/signedStackedBarChart";
import { getChartData } from "../../utils/transformers";
import { getHSLFromRange1 } from "../../../../../common/util";

export const SignedStackBarChartContainer = ({
  denormalizedData,
  rawData,
  filters,
  chartFilter,
  masteryScale = [],
  role,
  onBarClickCB
}) => {
  const chartData = useMemo(() => {
    return getChartData(denormalizedData, masteryScale, filters, role);
  }, [denormalizedData, masteryScale, filters, role]);

  const getChartSpecifics = () => {
    if (!isEmpty(masteryScale)) {
      let tempArr = masteryScale.sort((a, b) => {
        return a.score - b.score;
      });
      let barsData = [];
      for (let i = 0; i < tempArr.length; i++) {
        barsData.push({
          key: tempArr[i].masteryLabel,
          stackId: "a",
          // V1 Color code
          // fill: tempArr[i].color,
          // V2 Color code
          fill: getHSLFromRange1((i / masteryScale.length) * 100),
          unit: "%",
          name: tempArr[i].masteryName
        });
      }
      return {
        barsData,
        yAxisLabel: "Student %",
        xAxisDataKey: "standard"
      };
    } else {
      return {
        barsData: [],
        yAxisLabel: "Student %",
        xAxisDataKey: "standard"
      };
    }
  };

  const chartSpecifics = useMemo(() => {
    return getChartSpecifics();
  }, [masteryScale]);

  const getTooltipJSX = (payload, barIndex) => {
    if (payload && payload.length && barIndex !== null) {
      let { dataKey: masteryLabel, value: studentPercent } = payload[barIndex];
      let { standard, standardName, masteryLabelInfo, totalStudents } = payload[barIndex].payload;
      let masteryName = masteryLabelInfo[masteryLabel];

      return (
        <div>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">Standard: </Col>
            <Col className="tooltip-value">{standard}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">Description: </Col>
            <Col className="tooltip-value">{standardName}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">Mastery Level: </Col>
            <Col className="tooltip-value">{masteryName}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">Student %: </Col>
            <Col className="tooltip-value">{Math.abs(studentPercent)}%</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">Student #: </Col>
            <Col className="tooltip-value">{totalStudents}</Col>
          </Row>
        </div>
      );
    }
    return false;
  };

  const _onBarClickCB = key => {
    onBarClickCB(key);
  };

  const _onResetClickCB = () => {};

  const getXTickText = () => {};

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

  return (
    <SignedStackedBarChart
      data={chartData}
      barsData={chartSpecifics.barsData}
      xAxisDataKey={"standard"}
      getTooltipJSX={getTooltipJSX}
      onBarClickCB={_onBarClickCB}
      onResetClickCB={_onResetClickCB}
      yAxisLabel={chartSpecifics.yAxisLabel}
      yTickFormatter={yTickFormatter}
      barsLabelFormatter={barsLabelFormatter}
      filter={chartFilter}
    />
  );
};
7406713131;

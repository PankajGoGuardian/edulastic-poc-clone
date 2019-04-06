import React, { useState, useEffect, useMemo } from "react";
import { groupBy } from "lodash";
import { Row, Col } from "antd";
import { SignedStackedBarChart } from "../../../../common/components/charts/signedStackedBarChart";
import { getHSLFromRange1 } from "../../../../common/util";
import { idToName, analyseByToName } from "../../util/transformers";

export const SignedStackedBarChartContainer = ({
  data,
  analyseBy,
  compareBy,
  filter,
  onBarClickCB,
  onResetClickCB,
  assessmentName,
  bandInfo
}) => {
  const aboveBelowStandard = "aboveBelowStandard";
  const proficiencyBand = "proficiencyBand";

  const dataParser = () => {
    bandInfo.sort((a, b) => {
      return a.threshold - b.threshold;
    });

    let arr = data.map(item => {
      if (filter[item[compareBy]] || Object.keys(filter).length === 0) {
        if (analyseBy === aboveBelowStandard) {
          item.fill_0 = getHSLFromRange1(100);
          item.fill_1 = getHSLFromRange1(0);
        } else if (analyseBy === proficiencyBand) {
          for (let i = 0; i < bandInfo.length; i++) {
            item["fill_" + i] = getHSLFromRange1(Math.round((100 / (bandInfo.length - 1)) * i));
          }
        }
      } else {
        if (analyseBy === aboveBelowStandard) {
          item.fill_0 = "#cccccc";
          item.fill_1 = "#cccccc";
        } else if (analyseBy === proficiencyBand) {
          for (let i = 0; i < bandInfo.length; i++) {
            item["fill_" + i] = "#cccccc";
          }
        }
      }
      return { ...item };
    });

    return arr;
  };

  const getTooltipJSX = payload => {
    if (payload && payload.length) {
      let { districtAvg, compareBy, compareBylabel, correct } = payload[0].payload;
      let arr = [...payload];
      if (analyseBy === proficiencyBand) {
        arr.reverse();
      }
      return (
        <div>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">{idToName[compareBy] + ": "}</Col>
            <Col className="tooltip-value">{compareBylabel}</Col>
          </Row>
          {arr.map((item, index) => {
            return (
              <Row key={item.name} type="flex" justify="start" style={{ backgroundColor: item.fill }}>
                <Col className="tooltip-key">{item.name + ": "}</Col>
                <Col className="tooltip-value">
                  {`${Math.abs(item.value)}% (${item.payload[item.dataKey.substring(0, item.dataKey.length - 10)]})`}
                </Col>
              </Row>
            );
          })}
          <Row type="flex" justify="start">
            <Col className="tooltip-key">District Average: </Col>
            <Col className="tooltip-value">{districtAvg}</Col>
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
    if (analyseBy === aboveBelowStandard) {
      return {
        barsData: [
          {
            key: "aboveStandardPercentage",
            stackId: "a",
            fill: getHSLFromRange1(100),
            unit: "%",
            name: "Above Standard"
          },
          {
            key: "belowStandardPercentage",
            stackId: "a",
            fill: getHSLFromRange1(0),
            unit: "%",
            name: "Below Standard"
          }
        ],
        yAxisLabel: "Below standard/Above standard"
      };
    } else if (analyseBy === proficiencyBand) {
      bandInfo.sort((a, b) => {
        return a.threshold - b.threshold;
      });
      let barsData = [];
      for (let [index, value] of bandInfo.entries()) {
        barsData.push({
          key: value.name + "Percentage",
          stackId: "a",
          fill: getHSLFromRange1((100 / (bandInfo.length - 1)) * index),
          unit: "%",
          name: value.name
        });
      }
      return {
        barsData: barsData,
        yAxisLabel: "Below standard/Above standard"
      };
    } else {
      return {};
    }
  };

  const chartSpecifics = getChartSpecifics();

  return (
    <SignedStackedBarChart
      data={chartData}
      barsData={chartSpecifics.barsData}
      xAxisDataKey={compareBy}
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

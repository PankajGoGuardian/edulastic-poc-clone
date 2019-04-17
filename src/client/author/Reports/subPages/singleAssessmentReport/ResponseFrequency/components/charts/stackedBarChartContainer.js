import React, { useMemo } from "react";
import { groupBy } from "lodash";
import { Row, Col } from "antd";
import { SimpleStackedBarChart } from "../../../../../common/components/charts/simpleStackedBarChart";
import { getHSLFromRange1 } from "../../../../../common/util";

export const StackedBarChartContainer = props => {
  const dataParser = filter => {
    let hmap = groupBy(props.data, "qType");

    let arr = Object.keys(hmap).map((data, i) => {
      let qCount = hmap[data].length;
      let tmp = hmap[data].reduce(
        (total, currentValue, currentIndex) => {
          let { corr_cnt = 0, incorr_cnt = 0, skip_cnt = 0, part_cnt = 0 } = currentValue;
          return {
            corr_cnt: total.corr_cnt + corr_cnt,
            incorr_cnt: total.incorr_cnt + incorr_cnt,
            skip_cnt: total.skip_cnt + skip_cnt,
            part_cnt: total.part_cnt + part_cnt
          };
        },
        { corr_cnt: 0, incorr_cnt: 0, skip_cnt: 0, part_cnt: 0 }
      );

      let sum = tmp.corr_cnt + tmp.incorr_cnt + tmp.skip_cnt + tmp.part_cnt;
      tmp.name = data;
      tmp.qCount = qCount;
      tmp.correct = Number(((tmp.corr_cnt / sum) * 100).toFixed(0));
      if (isNaN(tmp.correct)) tmp.correct = 0;
      tmp.incorrect = 100 - tmp.correct;
      if (props.filter[tmp.name] || Object.keys(props.filter).length === 0) {
        tmp.fill = getHSLFromRange1(tmp.correct);
      } else {
        tmp.fill = "#cccccc";
      }

      tmp.assessment = props.assessment.testName;
      return tmp;
    });
    return arr;
  };

  const getTooltipJSX = payload => {
    if (payload && payload.length) {
      let corr_cnt, incorr_cnt, part_cnt, skip_cnt, qCount;
      if (payload && payload.length === 2) {
        corr_cnt = payload[0].payload.corr_cnt;
        incorr_cnt = payload[0].payload.incorr_cnt;
        part_cnt = payload[0].payload.part_cnt;
        skip_cnt = payload[0].payload.skip_cnt;
        qCount = payload[0].payload.qCount;
      }
      return (
        <div>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">{"Avg Performance: "}</Col>
            <Col className="tooltip-value">{payload[0].value}%</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">{"Assessment: "}</Col>
            <Col className="tooltip-value">{payload[0].payload.assessment}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">{"Total Questions: "}</Col>
            <Col className="tooltip-value">{qCount}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">{"Question Type: "}</Col>
            <Col className="tooltip-value">{payload[0].payload.name}</Col>
          </Row>
        </div>
      );
    }
    return false;
  };

  const getXTickText = (payload, data) => {
    const getDataByName = name => {
      if (data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].name === name) {
            return data[i].qCount;
          }
        }
      }
      return "";
    };
    return payload.value + " (" + getDataByName(payload.value) + ")";
  };

  const chartData = useMemo(() => dataParser(props.filter), [props.data, props.filter]);

  const onBarClickCB = key => {
    props.onBarClickCB(key);
  };

  const onResetClickCB = () => {
    props.onResetClickCB();
  };

  const getChartSpecifics = () => {
    return {
      barsData: [
        { key: "correct", stackId: "a", fill: getHSLFromRange1(100), unit: "%" },
        { key: "incorrect", stackId: "a", fill: getHSLFromRange1(0), unit: "%" }
      ],
      yAxisLabel: "Above/Below Standard"
    };
  };

  const chartSpecifics = getChartSpecifics();

  return (
    <SimpleStackedBarChart
      data={chartData}
      barsData={chartSpecifics.barsData}
      xAxisDataKey={"name"}
      bottomStackDataKey={"correct"}
      topStackDataKey={"incorrect"}
      getTooltipJSX={getTooltipJSX}
      onBarClickCB={onBarClickCB}
      onResetClickCB={onResetClickCB}
      getXTickText={getXTickText}
      yAxisLabel="Performance"
      filter={props.filter}
    />
  );
};

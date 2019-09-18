import React from "react";
import PropTypes from "prop-types";
import { round, get, find } from "lodash";
import { addColors } from "../../../../../common/util";
import { SimpleStackedBarChart } from "../../../../../common/components/charts/simpleStackedBarChart";
import BarTooltipRow from "../../../../../common/components/tooltip/BarTooltipRow";

const AssessmentChart = ({ data, selectedTests, onBarClickCB, onResetClickCB, studentClassData }) => {
  const xDataKey = "uniqId";

  const dataWithColors = addColors(data, selectedTests, xDataKey, "score");

  const barsLabelFormatter = value => `${round(value || 0)}%`;

  const getXTickText = (payload, data) => {
    const currentBarData = find(data, item => item[xDataKey] === payload.value) || {};
    return currentBarData.testName || "";
  };

  const _onBarClickCB = key => {
    const clickedBarData = find(dataWithColors, item => item[xDataKey] === key) || {};
    onBarClickCB(clickedBarData);
  };

  const getTooltipJSX = (payload, barIndex) => {
    if (payload && payload.length && barIndex !== null) {
      const record = get(payload[0], "payload", {});
      return (
        <div>
          <BarTooltipRow title="Assessment : " value={record.testName || "N/A"} />
          <BarTooltipRow title="Subject : " value={studentClassData[0].standardSet || "N/A"} />
          <BarTooltipRow title="Type : " value={record.testType} />
          <BarTooltipRow title="Performance Band : " value={record.band.name} />
          <BarTooltipRow title="Student Performance : " value={`${record.score}%`} />
        </div>
      );
    }
    return false;
  };

  return (
    <SimpleStackedBarChart
      data={dataWithColors}
      xAxisDataKey={xDataKey}
      bottomStackDataKey={"score"}
      topStackDataKey={"diffScore"}
      yAxisLabel={"Assessment Performance"}
      getTooltipJSX={getTooltipJSX}
      getXTickText={getXTickText}
      barsLabelFormatter={barsLabelFormatter}
      onBarClickCB={_onBarClickCB}
      onResetClickCB={onResetClickCB}
      filter={selectedTests}
    />
  );
};

AssessmentChart.propTypes = {
  data: PropTypes.array.isRequired,
  onBarClickCB: PropTypes.func,
  onResetClickCB: PropTypes.func,
  selectedTests: PropTypes.array
};

AssessmentChart.defaultProps = {
  onBarClickCB: () => {},
  onResetClickCB: () => {},
  selectedTests: []
};

export default AssessmentChart;

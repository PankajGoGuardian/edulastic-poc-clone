import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { SignedStackedBarChart } from "../../../../../common/components/charts/signedStackedBarChart";
import { getParsedGroupedMetricData, analyzeByMode, getYLabelString, viewByMode } from "../../util/transformers";
import { find, forEach } from "lodash";
import BarTooltipRow from "../../../../../common/components/tooltip/BarTooltipRow";

const getSelectedItems = items => {
  const selectedItems = {};

  forEach(items, item => {
    selectedItems[item] = true;
  });

  return selectedItems;
};

const dataParser = (data, scaleInfo) => {
  return data.map(item => {
    for (let i = 0; i < scaleInfo.length; i++) {
      item["fill_" + i] = scaleInfo[i].color;
    }
    return { ...item };
  });
};

const yTickFormatter = val => {
  return "";
};

const barsLabelFormatter = val => {
  if (12 <= val || val <= -12) {
    return Math.abs(val) + "%";
  } else {
    return "";
  }
};

const getChartSpecifics = (analyzeBy, scaleInfo) => {
  scaleInfo.sort((a, b) => {
    return a.threshold - b.threshold;
  });

  let barsData = [];

  for (let [_, value] of scaleInfo.entries()) {
    barsData.push({
      key: value.masteryLabel + " Percentage",
      stackId: "a",
      fill: value.color,
      unit: "%",
      name: value.masteryName
    });
  }
  return {
    barsData: barsData,
    yAxisLabel: getYLabelString(analyzeBy)
  };
};

const SignedStackedBarChartContainer = ({
  report,
  filter,
  selectedData,
  onBarClick,
  onResetClick,
  viewBy,
  analyzeBy
}) => {
  const { scaleInfo } = report;
  const xAxisDataKey = viewBy === viewByMode.STANDARDS ? "standardId" : "domainId";

  const orderedScaleInfo = scaleInfo.sort((a, b) => {
    return a.threshold - b.threshold;
  });

  const parsedGroupedMetricData = useMemo(() => getParsedGroupedMetricData(report, filter, viewBy), [
    report,
    filter,
    viewBy
  ]);

  const getTooltipJSX = (payload, barIndex) => {
    if (payload && payload.length && barIndex !== null) {
      let { name = "" } = payload[0].payload;
      return (
        <div>
          <BarTooltipRow title={`${viewBy === viewByMode.STANDARDS ? "Standard" : "Domain"} : `} value={name} />
          <BarTooltipRow
            title={`Mastery ${analyzeBy === analyzeByMode.MASTERY_LEVEL ? "Level" : "Score"} : `}
            value={payload[barIndex].name}
          />
          <BarTooltipRow title="Student (%): " value={`${Math.abs(payload[barIndex].value)}%`} />
        </div>
      );
    }
    return false;
  };

  const chartData = useMemo(() => dataParser(parsedGroupedMetricData, orderedScaleInfo), [
    report,
    filter,
    viewBy,
    analyzeBy
  ]);

  const _onBarClickCB = key => {
    const clickedBarData = find(chartData, item => item[xAxisDataKey] === key) || {};
    onBarClick(clickedBarData);
  };

  const _onResetClickCB = () => {
    onResetClick();
  };

  const getXTickText = (payload, data) => {
    const currentBarData = find(data, item => item[xAxisDataKey] === payload.value) || {};
    return currentBarData.name || "";
  };

  const chartSpecifics = getChartSpecifics(analyzeBy, orderedScaleInfo);

  return (
    <SignedStackedBarChart
      data={chartData}
      barsData={chartSpecifics.barsData}
      xAxisDataKey={xAxisDataKey}
      getTooltipJSX={getTooltipJSX}
      onBarClickCB={_onBarClickCB}
      onResetClickCB={_onResetClickCB}
      getXTickText={getXTickText}
      yAxisLabel={chartSpecifics.yAxisLabel}
      yTickFormatter={yTickFormatter}
      barsLabelFormatter={barsLabelFormatter}
      filter={getSelectedItems(selectedData)}
    />
  );
};

SignedStackedBarChartContainer.propTypes = {
  viewBy: PropTypes.string.isRequired,
  analyzeBy: PropTypes.string.isRequired,
  onBarClick: PropTypes.func.isRequired,
  onResetClick: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired,
  report: PropTypes.object,
  selectedData: PropTypes.array
};

SignedStackedBarChartContainer.defaultProps = {
  report: {
    metricInfo: [],
    skillInfo: [],
    studInfo: [],
    teacherInfo: []
  },
  selectedData: []
};

export default SignedStackedBarChartContainer;

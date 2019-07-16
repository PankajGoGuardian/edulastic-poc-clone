import React, { useMemo } from "react";
import next from "immer";
import PropTypes from "prop-types";
import { find, map, round, includes, get } from "lodash";

import { SimpleStackedBarChart } from "../../../../../common/components/charts/simpleStackedBarChart";
import { viewByMode, analyzeByMode, getYLabelString, getChartScoreData } from "../../util/transformers";
import { getHSLFromRange1 } from "../../../../../common/util";
import BarTooltipRow from "../../../../../common/components/tooltip/BarTooltipRow";

const defaultSkillInfo = { standard: "", domain: "" };

const addColors = (data = [], selectedData, xDataKey) => {
  return map(data, item =>
    next(item, draft => {
      draft.fill =
        includes(selectedData, item[xDataKey]) || !selectedData.length ? getHSLFromRange1(draft.avgScore) : "#cccccc";
    })
  );
};

const SimpleStackedBarChartContainer = ({
  report,
  filter,
  viewBy,
  analyzeBy,
  onBarClick,
  selectedData,
  onResetClick
}) => {
  const xDataKey = viewBy === viewByMode.STANDARDS ? "standardId" : "domainId";
  const barDataKey = "avgScore";
  const ticks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  let formattedData = useMemo(() => getChartScoreData(report, filter, viewBy), [report, filter, viewBy]);

  const data = useMemo(() => {
    return addColors(formattedData, selectedData, xDataKey);
  }, [formattedData, selectedData, xDataKey]);

  const { skillInfo } = report;

  const tickFormatter = id => {
    const dataField = viewBy === viewByMode.STANDARDS ? "standardId" : "domainId";
    const labelKey = viewBy === viewByMode.STANDARDS ? "standard" : "domain";

    const skill = skillInfo.find(info => info[dataField] === id);

    return (skill || defaultSkillInfo)[labelKey];
  };

  formattedData = data.sort((a, b) => tickFormatter(a[xDataKey]).localeCompare(tickFormatter(b[xDataKey])));

  const yTickformatLabel = score => {
    switch (analyzeBy) {
      case analyzeByMode.SCORE:
        return `${Math.round(Number(score))}%`;
      case analyzeByMode.RAW_SCORE:
        return "";
    }
  };

  const barsLabelFormatter = (value, index) => {
    switch (analyzeBy) {
      case analyzeByMode.SCORE:
        return yTickformatLabel(value);
      case analyzeByMode.RAW_SCORE:
        return `${round(formattedData[index].rawScore, 2)} / ${formattedData[index].maxScore}`;
    }
  };

  const getXTickText = (payload, data) => {
    const currentBarData = find(data, item => item[xDataKey] === payload.value) || {};
    return currentBarData.name || "";
  };

  const _onBarClickCB = key => {
    const clickedBarData = find(data, item => item[xDataKey] === key) || {};
    onBarClick(clickedBarData);
  };

  const getTooltipJSX = (payload, barIndex) => {
    if (payload && payload.length && barIndex !== null) {
      let { name = "" } = payload[0].payload;

      let lastItem = null;

      switch (analyzeBy) {
        case analyzeByMode.SCORE:
          lastItem = {
            title: "Avg.Score(%) : ",
            value: `${payload[0].value}%`
          };
          break;
        case analyzeByMode.RAW_SCORE:
          lastItem = {
            title: "Avg.Score : ",
            value: `${round(payload[0].payload.rawScore, 2)} / ${payload[0].payload.maxScore}`
          };
          break;
      }

      return (
        <div>
          <BarTooltipRow title={`${viewBy === viewByMode.STANDARDS ? "Standard" : "Domain"} : `} value={name} />
          <BarTooltipRow title="Total Points :" value={get(payload[0], "payload.maxScore", "")} />
          {lastItem && <BarTooltipRow {...lastItem} />}
        </div>
      );
    }
    return false;
  };

  return (
    <SimpleStackedBarChart
      data={formattedData}
      xAxisDataKey={xDataKey}
      bottomStackDataKey={barDataKey}
      topStackDataKey={"diffScore"}
      yAxisLabel={getYLabelString(analyzeBy)}
      getXTickText={getXTickText}
      getTooltipJSX={getTooltipJSX}
      yTickFormatter={yTickformatLabel}
      barsLabelFormatter={barsLabelFormatter}
      onBarClickCB={_onBarClickCB}
      ticks={ticks}
      onResetClickCB={onResetClick}
      filter={selectedData}
    />
  );
};

SimpleStackedBarChartContainer.propTypes = {
  viewBy: PropTypes.string.isRequired,
  analyzeBy: PropTypes.string.isRequired,
  onBarClick: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired,
  onResetClick: PropTypes.func.isRequired,
  report: PropTypes.object,
  selectedData: PropTypes.array
};

SimpleStackedBarChartContainer.defaultProps = {
  report: {
    metricInfo: [],
    skillInfo: [],
    studInfo: [],
    teacherInfo: []
  },
  selectedData: []
};

export default SimpleStackedBarChartContainer;

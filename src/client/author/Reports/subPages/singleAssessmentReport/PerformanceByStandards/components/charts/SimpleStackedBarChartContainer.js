import React, { useMemo } from "react";
import next from "immer";
import PropTypes from "prop-types";
import { find, map, round, includes } from "lodash";
import { Cell } from "recharts";

import { SimpleStackedBarChart } from "../../../../../common/components/charts/simpleStackedBarChart";
import { viewByMode, analyzeByMode, getYLabelString, getChartScoreData } from "../../util/transformers";
import { TooltipWrapper, TooltipLabel } from "./styled";
import { getHSLFromRange1 } from "../../../../../common/util";
import BarTooltipRow from "../../../../../common/components/tooltip/BarTooltipRow";

const getBarDataKey = analyzeBy => {
  switch (analyzeBy) {
    case analyzeByMode.RAW_SCORE:
    case analyzeByMode.SCORE:
      return "avgScore";
    default:
      return "";
  }
};

const defaultSkillInfo = { standard: "", domain: "" };

const getTicks = analyzeBy => {
  switch (analyzeBy) {
    case analyzeByMode.SCORE:
      return [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    default:
      return [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  }
};

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
  shouldShowReset,
  onResetClick
}) => {
  const xDataKey = viewBy === viewByMode.STANDARDS ? "standardId" : "domainId";
  const barDataKey = getBarDataKey(analyzeBy);
  const ticks = getTicks(analyzeBy);

  let formattedData = useMemo(() => getChartScoreData(report, filter, viewBy), [report, filter, viewBy]);

  const data = useMemo(() => {
    return addColors(formattedData, selectedData, xDataKey);
  }, [formattedData, selectedData, xDataKey]);

  formattedData = data.map(item => {
    switch (analyzeBy) {
      case analyzeByMode.SCORE:
        return {
          ...item,
          totalScore: item.totalScore * 100,
          totalScoreRaw: item.totalScore
        };
      case analyzeByMode.MASTERY_LEVEL:
        return {
          ...item,
          masteryScoreRaw: item.masteryScore,
          masteryScore: (item.masteryScore / 4) * 100
        };
      default:
        return item;
    }
  });

  const { skillInfo, scaleInfo } = report;

  const tickFormatter = id => {
    const dataField = viewBy === viewByMode.STANDARDS ? "standardId" : "domainId";
    const labelKey = viewBy === viewByMode.STANDARDS ? "standard" : "domain";

    const skill = skillInfo.find(info => info[dataField] === id);

    return (skill || defaultSkillInfo)[labelKey];
  };

  formattedData = formattedData.sort((a, b) => tickFormatter(a[xDataKey]).localeCompare(tickFormatter(b[xDataKey])));

  const getTooltipPayloadRawField = () => {
    switch (analyzeBy) {
      case analyzeByMode.SCORE:
      case analyzeByMode.RAW_SCORE:
        return "totalScoreRaw";
      case analyzeByMode.MASTERY_LEVEL:
      case analyzeByMode.MASTERY_SCORE:
        return "masteryScoreRaw";
      default:
        return {};
    }
  };

  const yTickformatLabel = score => {
    return `${Math.round(Number(score))}%`;
  };

  const barsLabelFormatter = (value, index) => {
    switch (analyzeBy) {
      case analyzeByMode.SCORE:
        return yTickformatLabel(value);
      case analyzeByMode.RAW_SCORE:
        return `${round(formattedData[index].rawScore, 2)} / ${formattedData[index].maxScore}`;
    }
  };

  const standardById = skillInfo.reduce(
    (result, skill) => ({
      ...result,
      [skill.standardId]: skill.standard
    }),
    {}
  );

  const domainById = skillInfo.reduce(
    (result, skill) => ({
      ...result,
      [skill.domainId]: skill.domain
    }),
    {}
  );

  const renderTooltip = ({ payload }) => {
    if (!payload || !payload.length) {
      return;
    }

    const [data] = payload;

    const skillById = viewBy === viewByMode.STANDARDS ? standardById : domainById;
    const field = viewBy === viewByMode.STANDARDS ? "standardId" : "domainId";
    const title = viewBy === viewByMode.STANDARDS ? "Standard" : "Domain";
    const skillId = data.payload[field];
    const skillTitle = skillById[skillId];

    const rawValue = getTooltipPayloadRawField();

    return (
      <TooltipWrapper>
        <TooltipLabel>
          {title}: {skillTitle}
        </TooltipLabel>
        <TooltipLabel>Total Points: {(data.payload[rawValue] || data.value).toFixed(2)}</TooltipLabel>
        <TooltipLabel>Avg.Score(%): {formatLabel(data.value)}</TooltipLabel>
      </TooltipWrapper>
    );
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
  report: PropTypes.object,
  selectedStandards: PropTypes.array,
  selectedData: PropTypes.array,
  filter: PropTypes.object.isRequired
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

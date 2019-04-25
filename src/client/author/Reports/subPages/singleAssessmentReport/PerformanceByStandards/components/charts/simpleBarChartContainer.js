import React from "react";
import PropTypes from "prop-types";
import { Cell } from "recharts";

import SimpleBarChart from "../../../../../common/components/charts/simpleBarChart";
import { chartParseData, viewByMode, analyzeByMode } from "../../util/transformers";

const getBarDataKey = analyzeBy => {
  switch (analyzeBy) {
    case analyzeByMode.SCORE:
    case analyzeByMode.RAW_SCORE:
      return "totalScore";
    case analyzeByMode.MASTERY_LEVEL:
    case analyzeByMode.MASTERY_SCORE:
      return "masteryScore";
    default:
      return "";
  }
};

const getYLabel = analyzeBy => {
  const proportion = analyzeBy === analyzeByMode.SCORE ? "(%)" : "";
  return { value: `Avg. score ${proportion}`, angle: -90, position: "insideLeft", dy: 35 };
};

const makeMasteryColorByScore = scaleInfo => score => scaleInfo.find(info => info.score === Math.floor(score)).color;

const defaultSkillInfo = { standard: "", domain: "" };

const getTicks = analyzeBy => {
  switch (analyzeBy) {
    case analyzeByMode.SCORE:
    case analyzeByMode.MASTERY_LEVEL:
      return [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    case analyzeByMode.RAW_SCORE:
      return [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
    case analyzeByMode.MASTERY_SCORE:
      return [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];
    default:
      return [];
  }
};

const SimpleBarChartContainer = ({
  report,
  filter,
  viewBy,
  analyzeBy,
  onBarClick,
  selectedDomains,
  selectedStandards
}) => {
  const data = chartParseData(report, viewBy, filter);
  const xDataKey = viewBy === viewByMode.STANDARDS ? "standardId" : "domainId";
  const barDataKey = getBarDataKey(analyzeBy);
  const yLabel = getYLabel(analyzeBy);
  const ticks = getTicks(analyzeBy);

  const { skillInfo, scaleInfo } = report;

  const getMasteryScore = makeMasteryColorByScore(scaleInfo);

  const tickFormatter = id => {
    const dataField = viewBy === viewByMode.STANDARDS ? "standardId" : "domainId";
    const labelKey = viewBy === viewByMode.STANDARDS ? "standard" : "domain";

    const skill = skillInfo.find(info => info[dataField] === id);

    return (skill || defaultSkillInfo)[labelKey];
  };

  const renderBarCells = chartData => {
    const selectedData = viewBy === viewByMode.STANDARDS ? selectedStandards : selectedDomains;
    const field = viewBy === viewByMode.STANDARDS ? "standardId" : "domainId";

    const selectedColor = "#99ca7a";
    const unselectedColor = "#bbbbbb";
    const badScoreColor = "#ff9b9b";

    const itemInSelected = item =>
      selectedData.includes(item[field])
        ? analyzeBy === analyzeByMode.MASTERY_LEVEL
          ? getMasteryScore(item.masteryScoreRaw)
          : analyzeBy === analyzeByMode.RAW_SCORE
          ? item.totalScore < 0.5
            ? badScoreColor
            : selectedColor
          : item.totalScore < 50
          ? badScoreColor
          : selectedColor
        : unselectedColor;

    return chartData.map((item, key) => (
      <Cell key={`bar-cell-${key}`} style={{ cursor: "pointer" }} fill={itemInSelected(item)} />
    ));
  };

  const formatLabel = score => {
    const formattedScore = Number(score).toFixed(2);

    switch (analyzeBy) {
      case analyzeByMode.SCORE:
      case analyzeByMode.MASTERY_LEVEL:
        return `${Math.round(Number(formattedScore))}%`;
      default:
        return formattedScore;
    }
  };

  const formattedData = data.map(item => {
    switch (analyzeBy) {
      case analyzeByMode.SCORE:
        return {
          ...item,
          totalScore: item.totalScore * 100
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

  return (
    <SimpleBarChart
      data={formattedData}
      xDataKey={xDataKey}
      barDataKey={barDataKey}
      yLabel={yLabel}
      xTickFormatter={tickFormatter}
      yTickFormatter={formatLabel}
      onBarClick={onBarClick}
      formatScore={formatLabel}
      renderBarCells={renderBarCells}
      ticks={ticks}
    />
  );
};

SimpleBarChartContainer.propTypes = {
  viewBy: PropTypes.string.isRequired,
  analyzeBy: PropTypes.string.isRequired,
  onBarClick: PropTypes.func.isRequired,
  report: PropTypes.object,
  selectedStandards: PropTypes.array,
  selectedDomains: PropTypes.array,
  filter: PropTypes.object.isRequired
};

SimpleBarChartContainer.defaultProps = {
  report: {
    metricInfo: [],
    skillInfo: [],
    studInfo: [],
    teacherInfo: []
  },
  selectedStandards: [],
  selectedDomains: []
};

export default SimpleBarChartContainer;

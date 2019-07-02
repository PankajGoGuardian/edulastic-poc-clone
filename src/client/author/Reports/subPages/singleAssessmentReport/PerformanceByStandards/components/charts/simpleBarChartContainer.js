import React from "react";
import PropTypes from "prop-types";
import { Cell } from "recharts";

import SimpleBarChart from "../../../../../common/components/charts/simpleBarChart";
import { chartParseData, viewByMode, analyzeByMode } from "../../util/transformers";
import { TooltipWrapper, TooltipLabel } from "./styled";
import { getHSLFromRange1 } from "../../../../../common/util";

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
  let label;
  switch (analyzeBy) {
    case analyzeByMode.RAW_SCORE:
      label = "Avg. score";
      break;
    case analyzeByMode.MASTERY_LEVEL:
    case analyzeByMode.MASTERY_SCORE:
      label = "Student (%)";
      break;
    default:
      label = "Avg. score (%)";
  }
  return { value: label, angle: -90, position: "insideLeft", dy: 35 };
};

const getMasteryColorByScore = scaleInfo => score => scaleInfo.find(info => info.score === Math.floor(score)).color;

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

  const getMasteryScore = getMasteryColorByScore(scaleInfo);

  const tickFormatter = id => {
    const dataField = viewBy === viewByMode.STANDARDS ? "standardId" : "domainId";
    const labelKey = viewBy === viewByMode.STANDARDS ? "standard" : "domain";

    const skill = skillInfo.find(info => info[dataField] === id);

    return (skill || defaultSkillInfo)[labelKey];
  };

  const renderBarCells = chartData => {
    const selectedData = viewBy === viewByMode.STANDARDS ? selectedStandards : selectedDomains;
    const field = viewBy === viewByMode.STANDARDS ? "standardId" : "domainId";

    const selectedColor = "#c7e8b2";
    const unselectedColor = "#bbbbbb";
    const badScoreColor = "#ffc6c6";

    const itemInSelected = item => {
      if (selectedData.includes(item[field])) {
        switch (analyzeBy) {
          case analyzeByMode.MASTERY_SCORE:
            return getMasteryScore(item.masteryScore);
          case analyzeByMode.MASTERY_LEVEL:
            return getMasteryScore(item.masteryScoreRaw);
          case analyzeByMode.RAW_SCORE:
            return getHSLFromRange1(item.totalScore * 100);
          case analyzeByMode.SCORE:
            return getHSLFromRange1(item.totalScore);
          default:
            return unselectedColor;
        }
      }
      return unselectedColor;
    };

    return chartData.map((item, key) => (
      <Cell key={`bar-cell-${key}`} style={{ cursor: "pointer" }} fill={itemInSelected(item)} />
    ));
  };

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

  const formatLabel = score => {
    const formattedScore = Number(score).toFixed(2);

    switch (analyzeBy) {
      case analyzeByMode.SCORE:
        return `${Math.round(Number(formattedScore))}%`;
      default:
        return formattedScore;
    }
  };

  const yTickformatLabel = score => {
    const formattedScore = Number(score).toFixed(2);

    switch (analyzeBy) {
      case analyzeByMode.SCORE:
        return `${Math.round(Number(formattedScore))}%`;
      default:
        return "";
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

  const formattedData = data.map(item => {
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

  return (
    <SimpleBarChart
      data={formattedData}
      xDataKey={xDataKey}
      barDataKey={barDataKey}
      yLabel={yLabel}
      xTickFormatter={tickFormatter}
      yTickFormatter={yTickformatLabel}
      onBarClick={onBarClick}
      formatScore={formatLabel}
      renderBarCells={renderBarCells}
      ticks={ticks}
      renderTooltip={renderTooltip}
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

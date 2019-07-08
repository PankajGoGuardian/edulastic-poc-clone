import PropTypes from "prop-types";
import { orderBy } from "lodash";
import styled from "styled-components";
import { Table } from "antd";
import { uniqBy } from "lodash";

import { compareByColumns, analyzeByMode, viewByMode, reduceAverageStandardScore } from "../../util/transformers";
import { getHSLFromRange1 } from "../../../../../common/util";

const makeStandardColumnConfig = skill => ({
  [viewByMode.STANDARDS]: {
    title: skill.standard,
    key: skill.standardId
  },
  [viewByMode.DOMAINS]: {
    title: skill.domain,
    key: skill.domainId
  }
});

const getMasteryColorByScore = scaleInfo => score => scaleInfo.find(info => info.score === Math.floor(score)).color;

const PerformanceAnalysisTable = ({
  report,
  viewBy,
  analyzeBy,
  compareBy,
  selectedStandards,
  selectedDomains,
  tableData
}) => {
  const formatScore = score => {
    switch (analyzeBy) {
      case analyzeByMode.SCORE:
        return `${Math.round(Number(score) * 100)}%`;
      case analyzeByMode.MASTERY_LEVEL:
        return `${Math.round((Number(score) / 4) * 100)}%`;
      default:
        return Number(score).toFixed(2);
    }
  };

  const getAnalyzeField = () => {
    switch (analyzeBy) {
      case analyzeByMode.MASTERY_LEVEL:
      case analyzeByMode.MASTERY_SCORE:
        return "masteryScore";
      default:
        return "totalScore";
    }
  };

  const makeStandardColumnData = () => {
    const { skillInfo } = report;

    return {
      [viewByMode.STANDARDS]: {
        selectedData: selectedStandards,
        dataField: "standardId",
        standardColumnsData: skillInfo.sort((a, b) => a.standard.localeCompare(b.standard))
      },
      [viewByMode.DOMAINS]: {
        selectedData: selectedDomains,
        dataField: "domainId",
        standardColumnsData: uniqBy(skillInfo, "domainId")
          .filter(o => o.domain !== null)
          .sort((a, b) => a.domain.localeCompare(b.domain))
      }
    };
  };

  const makeOverallColumn = () => {
    const { selectedData, dataField } = makeStandardColumnData()[viewBy];

    const selectedItems = metric => selectedData.includes(metric[dataField]) || !selectedData.length;

    const getAverage = student => {
      const standardMetrics = Object.values(student.standardMetrics).filter(selectedItems);
      const field = getAnalyzeField();

      const sumTotal = (total, metric) => total + metric[field];
      const overall = standardMetrics.reduce(sumTotal, 0);
      return overall / (standardMetrics.length || 1);
    };

    return {
      title: "Overall",
      dataIndex: "overall",
      key: "overall",
      sorter: (a, b) => getAverage(a) - getAverage(b),
      render: (studentId, student) => {
        const standardMetrics = Object.values(student.standardMetrics).filter(selectedItems);
        const average = getAverage(student);

        return standardMetrics.length ? formatScore(average) : "N/A";
      }
    };
  };

  const { scaleInfo } = report;

  const getMasteryScore = getMasteryColorByScore(scaleInfo);

  const makeStandardColumns = averageScoreByView => {
    const { selectedData, dataField, standardColumnsData } = makeStandardColumnData()[viewBy];

    const selectedItems = skill => selectedData.includes(skill[dataField]) || !selectedData.length;

    const makeStandardColumn = skill => {
      const config = makeStandardColumnConfig(skill)[viewBy];
      const field = getAnalyzeField();
      const averagePoints = averageScoreByView[config.key] || 0;

      return {
        title: (
          <p>
            {config.title}
            <br />
            Points - {averagePoints.toFixed(2)}
            <br />
            {formatScore(averagePoints)}
          </p>
        ),
        dataIndex: "standardMetrics",
        key: config.key,
        render: (studentId, student) => {
          const standard = student.standardMetrics[config.key];
          let color = "white";

          if (!standard) {
            return <ScoreCell color={color}>N/A</ScoreCell>;
          }

          const score = standard[field];

          if ([analyzeByMode.SCORE, analyzeByMode.RAW_SCORE].includes(analyzeBy)) {
            color = getHSLFromRange1(score * 100);
          } else {
            color = getMasteryScore(score);
          }

          return <ScoreCell color={color}>{standard ? formatScore(standard[field]) : "N/A"}</ScoreCell>;
        }
      };
    };

    return standardColumnsData.filter(selectedItems).map(makeStandardColumn);
  };

  const averageScoreByView = reduceAverageStandardScore(tableData, getAnalyzeField());

  const getAnalysisColumns = () => [
    compareByColumns[compareBy],
    makeOverallColumn(),
    ...makeStandardColumns(averageScoreByView)
  ];

  const columns = getAnalysisColumns();

  return <AnalysisTable dataSource={tableData} columns={columns} pagination={false} size="middle" />;
};

PerformanceAnalysisTable.propTypes = {
  report: PropTypes.object,
  viewBy: PropTypes.string.isRequired,
  analyzeBy: PropTypes.string.isRequired,
  compareBy: PropTypes.string.isRequired,
  selectedStandards: PropTypes.array,
  selectedDomains: PropTypes.array,
  tableData: PropTypes.array.isRequired
};

PerformanceAnalysisTable.defaultProps = {
  report: {
    metricInfo: [],
    skillInfo: [],
    studInfo: [],
    teacherInfo: []
  },
  selectedStandards: [],
  selectedDomains: []
};

export default PerformanceAnalysisTable;

const AnalysisTable = styled(Table)`
  .ant-table-thead {
    th {
      font-size: 12px;
      font-weight: bold;
      padding-right: 16px !important;

      &:nth-child(n + 3) {
        text-align: right;
      }
    }
  }

  .ant-table-tbody {
    td:nth-child(n + 3) {
      padding: 0 !important;
      text-align: right;
    }
  }
`;

const ScoreCell = styled.div`
  background: ${props => props.color};
  height: 51px;
  padding: 16px;
`;

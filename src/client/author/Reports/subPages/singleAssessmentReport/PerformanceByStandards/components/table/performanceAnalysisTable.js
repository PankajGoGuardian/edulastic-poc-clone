import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Table } from "antd";
import { uniqBy } from "lodash";

import { analysisParseData, compareByColumns, analyzeByMode, viewByMode } from "../../util/transformers";

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

const PerformanceAnalysisTable = ({ report, viewBy, analyzeBy, compareBy, selectedStandards, selectedDomains }) => {
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
        standardColumnsData: skillInfo
      },
      [viewByMode.DOMAINS]: {
        selectedData: selectedDomains,
        dataField: "domainId",
        standardColumnsData: uniqBy(skillInfo, "domainId")
      }
    };
  };

  const makeOverallColumn = () => {
    const { selectedData, dataField } = makeStandardColumnData()[viewBy];

    const selectedItems = metric => selectedData.includes(metric[dataField]);

    return {
      title: "Overall",
      dataIndex: "overall",
      key: "overall",
      render: (studentId, student) => {
        const standardMetrics = Object.values(student.standardMetrics).filter(selectedItems);
        const field = getAnalyzeField();

        const sumTotal = (total, metric) => total + metric[field];
        const overall = standardMetrics.reduce(sumTotal, 0);
        const average = overall / (standardMetrics.length || 1);

        return standardMetrics.length ? formatScore(average) : "N/A";
      }
    };
  };

  const makeStandardColumns = () => {
    const { selectedData, dataField, standardColumnsData } = makeStandardColumnData()[viewBy];

    const selectedItems = skill => selectedData.includes(skill[dataField]);

    const makeStandardColumn = skill => {
      const config = makeStandardColumnConfig(skill)[viewBy];
      const field = getAnalyzeField();

      return {
        title: config.title,
        dataIndex: "standardMetrics",
        key: config.key,
        render: (studentId, student) => {
          const standard = student.standardMetrics[config.key];
          return standard ? formatScore(standard[field]) : "N/A";
        }
      };
    };

    return standardColumnsData.filter(selectedItems).map(makeStandardColumn);
  };

  const getAnalysisColumns = () => [compareByColumns[compareBy], makeOverallColumn(), ...makeStandardColumns()];

  const data = analysisParseData(report, viewBy, compareBy);
  const columns = getAnalysisColumns();

  return <AnalysisTable dataSource={data} columns={columns} pagination={false} size="middle" />;
};

PerformanceAnalysisTable.propTypes = {
  report: PropTypes.object,
  viewBy: PropTypes.string.isRequired,
  analyzeBy: PropTypes.string.isRequired,
  compareBy: PropTypes.string.isRequired,
  selectedStandards: PropTypes.array,
  selectedDomains: PropTypes.array
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
  .ant-table-tbody {
    td:nth-child(n + 3) {
      background: #d4ecc4;
    }
  }
`;

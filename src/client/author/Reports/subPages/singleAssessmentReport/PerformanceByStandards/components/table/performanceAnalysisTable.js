import PropTypes from "prop-types";
import styled from "styled-components";
import { uniqBy, map, round, reduce } from "lodash";
import { Link } from "react-router-dom";
import {
  compareByColumns,
  analyzeByMode,
  viewByMode,
  getMasteryLevel,
  getOverallRawScore,
  getFormattedName
} from "../../util/transformers";
import { getHSLFromRange1, getOverallScore, downloadCSV } from "../../../../../common/util";
import { StyledTable } from "../../../../../common/styled";
import { CustomTableTooltip } from "../../../../../common/components/customTableTooltip";
import TableTooltipRow from "../../../../../common/components/tooltip/TableTooltipRow";
import CsvTable from "../../../../../common/components/tables/CsvTable";
import { reportLinkColor } from "../../../../multipleAssessmentReport/common/utils/constants";

const columnHashMap = {
  teacher: "teacherName",
  class: "groupName",
  school: "schoolName"
};

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

const getMasteryColorByScore = (score, scaleInfo) => getMasteryLevel(score, scaleInfo, "score").color;

const PerformanceAnalysisTable = ({
  report,
  viewBy,
  analyzeBy,
  compareBy,
  selectedStandards,
  selectedDomains,
  tableData,
  totalPoints,
  isCsvDownloading,
  location = { pathname: "" },
  pageTitle
}) => {
  const formatScore = (score, analyzeBy) => {
    switch (analyzeBy) {
      case analyzeByMode.SCORE:
        return `${Math.round(Number(score))}%`;
      case analyzeByMode.RAW_SCORE:
        return round(score, 2);
      default:
        return score;
    }
  };

  const getAnalyzeField = () => {
    switch (analyzeBy) {
      case analyzeByMode.MASTERY_LEVEL:
        return "masteryLabel";
      case analyzeByMode.MASTERY_SCORE:
        return "masteryScore";
      case analyzeByMode.RAW_SCORE:
        return "rawScore";
      case analyzeByMode.SCORE:
        return "avgScore";
      default:
        return "avgScore";
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

  const { scaleInfo } = report;

  const getOverallValue = (records = {}, analyzeBy) => {
    const allRecords = reduce(records, (result, value = {}) => result.concat(value.records || []), []);
    const masteryLevel = getMasteryLevel(getOverallScore(allRecords), scaleInfo);

    switch (analyzeBy) {
      case analyzeByMode.SCORE:
        return formatScore(getOverallScore(allRecords), analyzeBy);
      case analyzeByMode.RAW_SCORE:
        return formatScore(getOverallRawScore(allRecords), analyzeBy);
      case analyzeByMode.MASTERY_LEVEL:
        return masteryLevel.masteryLabel;
      case analyzeByMode.MASTERY_SCORE:
        return masteryLevel.score;
      default:
        return "N/A";
    }
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
      render: (recordId, record) => {
        const path = {
          pathname: `/author/classboard/${record.assignmentId}/${record.groupId}/test-activity/${
            record.testActivityId
          }`,
          state: {
            // this will be consumed in /src/client/author/Shared/Components/ClassBreadCrumb.js
            breadCrumb: [
              {
                to: "/author/reports",
                title: "REPORTS"
              },
              {
                to: `${location.pathname}${location.search}`,
                title: pageTitle
              }
            ]
          }
        };
        return (
          <Link to={path} style={{ color: reportLinkColor }}>
            {getOverallValue(record.standardMetrics, analyzeBy)}
          </Link>
        );
      }
    };
  };

  const getFieldTotalValue = (tableData, analyzeBy, config) => {
    const allRecords = reduce(
      tableData,
      (result, value) => {
        return result.concat(value.standardMetrics[config.key]);
      },
      []
    );

    return getOverallValue(allRecords, analyzeBy);
  };

  const makeStandardColumns = tableData => {
    const { selectedData, dataField, standardColumnsData } = makeStandardColumnData()[viewBy];

    const selectedItems = skill => selectedData.includes(skill[dataField]) || !selectedData.length;

    const makeStandardColumn = skill => {
      const config = makeStandardColumnConfig(skill)[viewBy];
      const field = getAnalyzeField();
      const averagePoints = totalPoints[config.key] || 0;

      return {
        title: (
          <p>
            {config.title}
            <br />
            Points - {parseFloat(averagePoints.toFixed(2))}
            <br />
            {getFieldTotalValue(tableData, analyzeBy, config)}
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

          const getColValue = (columnKey, record) => {
            if (columnKey === "students") {
              return `${record.firstName} ${record.lastName}`;
            } else if (record[columnHashMap[columnKey]]) {
              return record[columnHashMap[columnKey]];
            } else {
              return record[columnKey];
            }
          };

          switch (analyzeBy) {
            case analyzeByMode.RAW_SCORE:
            case analyzeByMode.SCORE:
              color = getHSLFromRange1(standard.avgScore);
              break;
            default:
              color = getMasteryColorByScore(standard.masteryScore, scaleInfo);
              break;
          }

          const toolTipText = record => {
            const compareByColumn = compareByColumns[compareBy];

            let lastItem = null;

            switch (analyzeBy) {
              case analyzeByMode.MASTERY_LEVEL:
                lastItem = {
                  title: "Mastery Code: ",
                  value: `${formatScore(standard[field], analyzeByMode.MASTERY_LEVEL)}`
                };
                break;
              case analyzeByMode.MASTERY_SCORE:
                lastItem = {
                  title: "Mastery Score: ",
                  value: `${formatScore(standard[field], analyzeByMode.MASTERY_SCORE)}`
                };
                break;
            }

            return (
              <div>
                <TableTooltipRow title={`${compareByColumn.title}: `} value={getColValue(compareBy, record)} />
                <TableTooltipRow
                  title={`${viewBy === viewByMode.STANDARDS ? "Standard" : "Domain"} : `}
                  value={config.title}
                />
                <TableTooltipRow
                  title={`
                    Avg.Score${analyzeBy === analyzeByMode.RAW_SCORE ? "" : "(%)"} :
                  `}
                  value={
                    analyzeBy === analyzeByMode.RAW_SCORE
                      ? formatScore(standard.rawScore, analyzeByMode.RAW_SCORE)
                      : formatScore(standard.avgScore, analyzeByMode.SCORE)
                  }
                />
                {lastItem ? <TableTooltipRow {...lastItem} /> : null}
              </div>
            );
          };

          return (
            <CustomTableTooltip
              placement="top"
              title={toolTipText(student)}
              getCellContents={() => (
                <ScoreCell color={color}>{standard ? formatScore(standard[field], analyzeBy) : "N/A"}</ScoreCell>
              )}
            />
          );
        }
      };
    };

    return standardColumnsData.filter(selectedItems).map(makeStandardColumn);
  };

  const getAnalysisColumns = () => [
    compareByColumns[compareBy],
    makeOverallColumn(),
    ...makeStandardColumns(tableData),
    {
      title: "SIS ID",
      dataIndex: "sisId",
      key: "sisId",
      visibleOn: ["csv"]
    }
  ];

  /**
   *
   * converts table header string starting from 3rd column
   * From
   * "1-ESS1-2 POINTS - 1 50%"
   * TO
   * "1-ESS1-2 (POINTS - 1) (50%)"
   */
  const onCsvConvert = data => {
    const splittedData = data.split("\n");
    const header = splittedData[0];
    const columns = header.split(",");
    for (let i = 2; i < columns.length; i++) {
      let str = columns[i];
      let _str = str.toLocaleLowerCase();
      let indexOfPoints = _str.lastIndexOf("points");
      let indexOfLastSpace = _str.lastIndexOf(" ");

      const transformedStr = `${str.substring(0, indexOfPoints - 1)}(${str
        .substring(indexOfPoints, indexOfLastSpace)
        .replace(/\s/g, "")})(Avg-${str.substring(indexOfLastSpace + 1, str.length - 1)})"`;
      columns[i] = transformedStr;
    }
    const _header = columns.join(",");
    splittedData[0] = _header;
    const finalData = splittedData.join("\n");
    downloadCSV(`Performance By Standard Report.csv`, finalData);
  };

  const columns = getAnalysisColumns();

  // format the student names in the data & sort in ascending order
  const dataSource = map(tableData, d => ({
    ...d,
    studentName: getFormattedName(`${d.firstName || ""} ${d.lastName || ""}`)
  })).sort((a, b) => a.studentName.toLowerCase().localeCompare(b.studentName.toLowerCase()));

  return (
    <CsvTable
      onCsvConvert={onCsvConvert}
      isCsvDownloading={isCsvDownloading}
      tableToRender={AnalysisTable}
      dataSource={dataSource}
      columns={columns}
    />
  );
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

const AnalysisTable = styled(StyledTable)`
  .ant-table-tbody {
    td {
      min-width: 100px;
      padding: 0;
      &:nth-child(1) {
        padding: 0px 8px;
      }
    }
  }
`;

const ScoreCell = styled.div`
  background: ${props => props.color};
  padding: 10px 8px;
`;

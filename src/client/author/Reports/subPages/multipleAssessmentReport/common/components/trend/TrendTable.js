import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Row, Col } from "antd";
import { groupBy, map, capitalize, values } from "lodash";

import { StyledTable, StyledCard, StyledH3 } from "../../../../../common/styled";

import { getHSLFromRange1, stringCompare } from "../../../../../common/util";
import { CustomTableTooltip } from "../../../../../common/components/customTableTooltip";
import { StyledCell } from "../../../../../common/styled";
import TableTooltipRow from "../../../../../common/components/tooltip/TableTooltipRow";
import TrendColumn from "./TrendColumn";
import dropDownData from "../../static/json/dropDownData.json";
import { compareByMap } from "../../utils/trend";
import CsvTable from "../../../../../common/components/tables/CsvTable";

const formatText = (test, type) => {
  if (test[type] === null || typeof test[type] === "undefined") return "N/A";

  if (test.records[0].maxScore === null || test.records[0].totalScore === null) return "Absent";

  if (type == "score") {
    return `${test[type]}%`;
  }

  return test[type];
};

const getCol = (text, backgroundColor) => {
  return <StyledCell style={{ backgroundColor }}>{text || "N/A"}</StyledCell>;
};

const getCellAttributes = (test = {}, analyseBy = {}) => {
  let value = "N/A";
  let color = "#cccccc";

  switch (analyseBy.key) {
    case "proficiencyBand":
      if (test.proficiencyBand) {
        value = test.proficiencyBand.name || value;
        color = test.proficiencyBand.color || color;
      }
      break;
    case "standard":
      value = test.proficiencyBand.aboveStandard ? "Above Standard" : "Below Standard";
      color = getHSLFromRange1((test.proficiencyBand.aboveStandard || 0) * 100);
      break;
    default:
      value = formatText(test, analyseBy.key);
      if (value !== "Absent") {
        color = getHSLFromRange1(test.score);
      }
      break;
  }

  return {
    value,
    color
  };
};

const getColumns = (
  testData = [],
  rawMetric = [],
  analyseBy = "",
  compareBy = {},
  customColumns = [],
  toolTipContent,
  filters = {}
) => {
  const groupedTests = groupBy(testData, "testId");
  const groupedAvailableTests = groupBy(rawMetric, "testId");

  const dynamicColumns = map(groupedAvailableTests, (_, testId) => {
    const currentTestGroup = groupedTests[testId] || {};
    const test = currentTestGroup[0] || {};
    const assessmentName = (test && test.testName) || "";

    return {
      key: testId,
      title: assessmentName,
      assessmentDate: test.assessmentDate,
      align: "right",
      className: "normal-text",
      dataIndex: "tests",
      render: (tests = {}, record) => {
        const currentTest = tests[testId];

        if (!currentTest) {
          return getCol("N/A", "#cccccc");
        }

        const { color, value } = getCellAttributes(currentTest, analyseBy);

        if (value === "Absent") {
          return getCol("Absent", "#cccccc");
        }

        const toolTipText = () => (
          <div>
            <TableTooltipRow title={"Assessment Name: "} value={assessmentName} />
            {toolTipContent(record, value)}
            <TableTooltipRow title={`${capitalize(analyseBy.title)} : `} value={value} />
          </div>
        );

        return (
          <CustomTableTooltip placement="top" title={toolTipText()} getCellContents={() => getCol(value, color)} />
        );
      }
    };
  });

  const columns = [
    {
      key: compareBy.key,
      title: capitalize(compareBy.title),
      dataIndex: compareByMap[compareBy.key],
      render: (data, record) => {
        return compareBy.key === "student" ? (
          <Link to={`/author/reports/student-profile-summary/student/${record.id}?termId=${filters?.termId}`}>
            {data}
          </Link>
        ) : (
          data
        );
      },
      sorter: (a, b) => {
        const keyword = compareByMap[compareBy.key];
        return a[keyword].toLowerCase().localeCompare(b[keyword].toLowerCase());
      }
    },
    ...customColumns,
    {
      key: "trend",
      title: "Trend",
      dataIndex: "tests",
      width: 150,
      align: "center",
      visibleOn: ["browser"],
      render: (tests, record) => {
        const augmentedTests = map(tests, (test, testId) => {
          const currentTestGroup = groupedTests[testId] || {};
          const currentTest = currentTestGroup[0] || {};
          const currentTestName = currentTest.testName || "";

          return {
            ...test,
            testName: currentTestName
          };
        }).sort((a, b) => {
          return a.records[0].assessmentDate - b.records[0].assessmentDate;
        });

        return <TrendColumn type={record.trend} tests={augmentedTests} />;
      }
    },
    {
      key: "type",
      title: "Trend",
      dataIndex: "trend",
      width: 0,
      align: "center",
      visibleOn: ["csv"],
      render: (trend, record) => capitalize(trend)
    },
    {
      title: "SIS ID",
      dataIndex: "sisId",
      key: "sisId",
      visibleOn: ["csv"]
    }
  ];

  return columns.concat(
    dynamicColumns.sort((a, b) => {
      return a.assessmentDate - b.assessmentDate;
    })
  );
};

const TrendTable = ({
  filters = {},
  data,
  rowSelection,
  rawMetric,
  testData,
  analyseBy,
  compareBy,
  customColumns,
  heading,
  toolTipContent,
  isCsvDownloading,
  onCsvConvert
}) => {
  const columns = getColumns(testData, rawMetric, analyseBy, compareBy, customColumns, toolTipContent, filters);
  const groupedAvailableTests = groupBy(rawMetric, "testId");

  return (
    <StyledCard>
      <Row>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <StyledH3>{heading}</StyledH3>
        </Col>
      </Row>
      <TableContainer>
        <CsvTable
          dataSource={data}
          columns={columns}
          rowSelection={rowSelection}
          colouredCellsNo={values(groupedAvailableTests).length}
          onCsvConvert={onCsvConvert}
          isCsvDownloading={isCsvDownloading}
          tableToRender={StyledTable}
        />
      </TableContainer>
    </StyledCard>
  );
};

const optionShape = PropTypes.shape({
  key: PropTypes.string,
  title: PropTypes.string
});

TrendTable.propTypes = {
  testData: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  rawMetric: PropTypes.array.isRequired,
  analyseBy: optionShape,
  compareBy: optionShape,
  customColumns: PropTypes.array,
  heading: PropTypes.string,
  toolTipContent: PropTypes.func,
  isCsvDownloading: PropTypes.bool,
  onCsvConvert: PropTypes.func
};

TrendTable.defaultProps = {
  analyseBy: dropDownData.analyseByData[0],
  compareBy: dropDownData.compareByData[0],
  customColumns: [],
  heading: "",
  toolTipContent: () => null,
  isCsvDownloading: false,
  onCsvConvert: () => {}
};

export default TrendTable;

const TableContainer = styled.div`
  .ant-table-body {
    padding-bottom: 30px;
  }
`;

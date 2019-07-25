import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Row, Col } from "antd";
import { groupBy, map, capitalize, values } from "lodash";

import { StyledTable, StyledCard, StyledH3 } from "../../../../../common/styled";

import { getHSLFromRange1, stringCompare } from "../../../../../common/util";
import { CustomTableTooltip } from "../../../../../common/components/customTableTooltip";
import { StyledCell } from "../styled";
import TableTooltipRow from "../../../../../common/components/tooltip/TableTooltipRow";
import TrendColumn from "./TrendColumn";
import dropDownData from "../../static/json/dropDownData.json";
import { compareByMap } from "../../utils/trend";

const getSorter = compareBy => {
  switch (compareBy) {
    case "school":
    case "teacher":
    case "group":
      return (a, b) => {
        const compareByKey = compareByMap[compareBy];
        return stringCompare(a[compareByKey], b[compareByKey]);
      };
    case "student":
      return (a, b) => stringCompare(a.lastName, b.lastName);
  }
};

const formatText = (text, type) => {
  if (!text) return "N/A";

  if (type == "score") {
    return `${text}%`;
  }

  return text;
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
      value = formatText(test[analyseBy.key], analyseBy.key);
      color = getHSLFromRange1(test.score);
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
  toolTipContent
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
      dataIndex: "tests",
      render: (tests = {}, record) => {
        const currentTest = tests[testId];

        if (!currentTest) {
          return getCol("N/A", "#cccccc");
        }

        const { color, value } = getCellAttributes(currentTest, analyseBy);

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
      sorter: getSorter(compareBy.key),
      dataIndex: compareByMap[compareBy.key]
    },
    ...customColumns,
    {
      key: "trend",
      title: "Trend",
      dataIndex: "tests",
      width: 150,
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
    }
  ];

  return columns.concat(
    dynamicColumns.sort((a, b) => {
      return a.assessmentDate - b.assessmentDate;
    })
  );
};

const TrendTable = ({ data, rawMetric, testData, analyseBy, compareBy, customColumns, heading, toolTipContent }) => {
  const columns = getColumns(testData, rawMetric, analyseBy, compareBy, customColumns, toolTipContent);
  const groupedAvailableTests = groupBy(rawMetric, "testId");
  return (
    <StyledCard>
      <Row>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <StyledH3>{heading}</StyledH3>
        </Col>
      </Row>
      <TableContainer>
        <StyledTable dataSource={data} columns={columns} colouredCellsNo={values(groupedAvailableTests).length} />
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
  toolTipContent: PropTypes.func
};

TrendTable.defaultProps = {
  analyseBy: dropDownData.analyseByData[0],
  compareBy: dropDownData.compareByData[0],
  customColumns: [],
  heading: "",
  toolTipContent: () => null
};

export default TrendTable;

const TableContainer = styled.div`
  .ant-table-body {
    padding-bottom: 30px;
  }
`;

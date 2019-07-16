import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Row, Col } from "antd";
import { groupBy, map, capitalize, orderBy } from "lodash";

import { StyledTable, StyledCard, StyledH3 } from "../../../../../common/styled";
import { ControlDropDown } from "../../../../../common/components/widgets/controlDropDown";

import dropDownData from "../../static/json/dropDownData.json";
import { getHSLFromRange1 } from "../../../../../common/util";
import { CustomTableTooltip } from "../../../../../common/components/customTableTooltip";
import TableTooltipRow from "../../../../../common/components/tooltip/TableTooltipRow";
import TrendColumn from "./TrendColumn";
import { StyledCell } from "../styled";

const compareByMap = {
  school: "schoolName",
  teacher: "teacherName",
  group: "groupName",
  student: "studentName"
};

const stringCompare = (a_string = "", b_string = "") => {
  return a_string.toLowerCase().localeCompare(b_string.toLowerCase());
};

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

const getColumns = (testData = [], analyseBy = "", compareBy = {}) => {
  const groupedTests = groupBy(testData, "testId");

  const dynamicColumns = map(groupedTests, (tests, testId) => {
    const assessmentName = tests[0].testName || "";
    return {
      key: testId,
      title: assessmentName,
      assessmentDate: tests[0].assessmentDate,
      dataIndex: "tests",
      render: (tests = {}, record) => {
        const currentTest = tests[testId];

        if (!currentTest) {
          return getCol("N/A", "#cccccc");
        }

        const value = formatText(currentTest[analyseBy.key], analyseBy.key);

        const toolTipText = () => (
          <div>
            <TableTooltipRow title={"Assessment Name: "} value={assessmentName} />
            <TableTooltipRow title={`${capitalize(compareBy.title)} : `} value={record[compareByMap[compareBy.key]]} />
            <TableTooltipRow title={`${capitalize(analyseBy.title)} : `} value={value} />
          </div>
        );

        return (
          <CustomTableTooltip
            placement="top"
            title={toolTipText()}
            getCellContents={() => getCol(value, getHSLFromRange1(currentTest.score))}
          />
        );
      }
    };
  });

  const columns = [
    {
      key: compareBy.key,
      title: capitalize(compareBy.title),
      sorter: getSorter(compareBy.key),
      render: (value, record) => {
        return record[compareByMap[compareBy.key]];
      }
    },
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

const PeerProgressAnalysisTable = ({ data, testData, analyseBy, compareBy, onFilterChange }) => {
  const columns = getColumns(testData, analyseBy, compareBy);

  const onDropDownChange = key => (_, selectedItem) => onFilterChange(key, selectedItem);

  const onCompareByChange = onDropDownChange("compareBy");
  const onAnalyseByChange = onDropDownChange("analyseBy");

  return (
    <StyledCard>
      <Row>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <StyledH3>How well are student sub-groups progressing ?</StyledH3>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Row type="flex" justify="end">
            <ControlDropDown
              prefix="Analyse By"
              by={analyseBy}
              selectCB={onAnalyseByChange}
              data={dropDownData.analyseByData}
            />
            <ControlDropDown
              prefix="Compare By"
              by={compareBy}
              selectCB={onCompareByChange}
              data={dropDownData.compareByData}
            />
          </Row>
        </Col>
      </Row>
      <TableContainer>
        <StyledTable dataSource={data} columns={columns} colouredCellsNo={columns.length - 1} />
      </TableContainer>
    </StyledCard>
  );
};

const getShape = data =>
  PropTypes.shape({
    key: PropTypes.oneOf(data.map(item => item.key)),
    title: PropTypes.oneOf(data.map(item => item.title))
  });

const analyseByShape = getShape(dropDownData.analyseByData);
const compareByShape = getShape(dropDownData.compareByData);

PeerProgressAnalysisTable.propTypes = {
  testData: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  analyseBy: analyseByShape,
  compareBy: compareByShape
};

PeerProgressAnalysisTable.defaultProps = {
  analyseBy: "score",
  compareBy: "group"
};

export default PeerProgressAnalysisTable;

const TableContainer = styled.div`
  margin-top: 30px;
  .ant-table-body {
    overflow: auto visible;
    overflow-x: visible;
  }
`;

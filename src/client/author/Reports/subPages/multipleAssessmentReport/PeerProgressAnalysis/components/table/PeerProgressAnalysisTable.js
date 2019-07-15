import React from "react";
import PropTypes from "prop-types";
import { groupBy, map, capitalize } from "lodash";
import { StyledTable } from "../../../../../common/styled";

const compareByMap = {
  school: "schoolName",
  teacher: "teacherName",
  group: "groupName",
  student: "studentName"
};

const formatText = (text, type) => {
  if (type == "score") {
    return `${text}%`;
  }

  return text;
};

const getColumns = (testData = [], analyseBy = "", compareBy = "") => {
  const groupedTests = groupBy(testData, "testId");
  const columns = [
    {
      key: compareBy,
      title: capitalize(compareBy),
      render: (value, record) => {
        return record[compareByMap[compareBy]];
      }
    }
  ];

  const dynamicColumns = map(groupedTests, (tests, testId) => {
    return {
      key: testId,
      title: tests[0].testName,
      dataIndex: "tests",
      render: (tests = {}) => {
        const currentTest = tests[testId];

        if (!currentTest) {
          return "N/A";
        }

        return formatText(currentTest[analyseBy], analyseBy);
      }
    };
  });

  return columns.concat(dynamicColumns);
};

const PeerProgressAnalysisTable = ({ data, testData, analyseBy, compareBy }) => {
  const columns = getColumns(testData, analyseBy, compareBy);

  return <StyledTable dataSource={data} columns={columns} />;
};

PeerProgressAnalysisTable.propTypes = {
  testData: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  analyseBy: PropTypes.oneOf(["score", "rawScore"]),
  compareBy: PropTypes.oneOf(Object.keys(compareByMap))
};

PeerProgressAnalysisTable.defaultProps = {
  analyseBy: "score",
  compareBy: "group"
};

export default PeerProgressAnalysisTable;

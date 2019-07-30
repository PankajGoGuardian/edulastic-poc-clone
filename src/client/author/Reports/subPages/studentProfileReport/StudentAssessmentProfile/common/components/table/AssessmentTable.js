import React from "react";
import PropTypes from "prop-types";
import { CustomTableTooltip } from "../../../../../../common/components/customTableTooltip";
import TableTooltipRow from "../../../../../../common/components/tooltip/TableTooltipRow";
import { StyledTable, StyledCell } from "../../../../../../common/styled";
import { getHSLFromRange1 } from "../../../../../../common/util";

const getCol = (text, backgroundColor) => {
  return <StyledCell style={{ backgroundColor }}>{text ? `${text}%` : "N/A"}</StyledCell>;
};

const tableColumns = [
  {
    title: "Assessment Name",
    dataIndex: "testName",
    key: "testName"
  },
  {
    title: "Assessment Type",
    dataIndex: "testType",
    key: "testType"
  },
  {
    title: "Day of Assessment Start",
    dataIndex: "assignmentDateFormatted",
    key: "assignmentDateFormatted",
    sorter: (a, b) => {
      return a.assignmentDate - b.assignmentDate;
    }
  },
  {
    title: "Total Questions",
    dataIndex: "totalQuestions",
    key: "totalQuestions"
  },
  {
    title: "Score",
    dataIndex: "rawScore",
    key: "rawScore"
  },
  {
    title: "District (Avg. Score%)",
    dataIndex: "districtAvg",
    key: "districtAvg"
  },
  {
    title: "School (Avg Score%)",
    dataIndex: "schoolAvg",
    key: "schoolAvg"
  },
  {
    title: "Class (Avg Score%)",
    dataIndex: "groupAvg",
    key: "groupAvg"
  }
];

const getColumns = (studentName = "") => {
  return [
    ...tableColumns,
    {
      title: "Student (Score%)",
      dataIndex: "score",
      key: "score",
      sorter: (a, b) => {
        return a.score - b.score;
      },
      render: (score, record) => {
        if (!score) {
          return getCol("N/A", "#cccccc");
        }

        const toolTipText = () => (
          <div>
            <TableTooltipRow title={"Assessment Name: "} value={record.testName} />
            <TableTooltipRow title={"Assessment Type: "} value={record.testType} />
            <TableTooltipRow title={"Student Name: "} value={studentName} />
            <TableTooltipRow title={"Day of Assessment Start: "} value={record.assignmentDateFormatted} />
            <TableTooltipRow title={"Student Perfromance: "} value={`${record.score}%`} />
            <TableTooltipRow title={"District Perfromance: "} value={`${record.districtAvg}%`} />
            <TableTooltipRow title={"School Perfromance: "} value={`${record.schoolAvg}%`} />
            <TableTooltipRow title={"Class Perfromance: "} value={`${record.groupAvg}%`} />
            <TableTooltipRow title={"Total Questions: "} value={record.totalQuestions} />
            <TableTooltipRow title={"Score: "} value={record.rawScore} />
          </div>
        );

        return (
          <CustomTableTooltip
            placement="top"
            title={toolTipText()}
            getCellContents={() => getCol(score, getHSLFromRange1(score))}
          />
        );
      }
    }
  ];
};

const AssessmentTable = ({ data, studentName }) => {
  const columns = getColumns(studentName);

  return <StyledTable dataSource={data} columns={columns} colouredCellsNo={1} />;
};

AssessmentTable.propTypes = {
  data: PropTypes.array,
  studentName: PropTypes.string
};

AssessmentTable.defaultProps = {
  data: [],
  studentName: ""
};

export default AssessmentTable;

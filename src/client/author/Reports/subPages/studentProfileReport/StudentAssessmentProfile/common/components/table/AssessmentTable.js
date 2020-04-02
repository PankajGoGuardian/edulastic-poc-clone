import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { filter, includes } from "lodash";
import { CustomTableTooltip } from "../../../../../../common/components/customTableTooltip";
import TableTooltipRow from "../../../../../../common/components/tooltip/TableTooltipRow";
import { StyledTable, StyledCell } from "../../../../../../common/styled";
import { getHSLFromRange1 } from "../../../../../../common/util";
import CsvTable from "../../../../../../common/components/tables/CsvTable";
import { reportLinkColor } from "../../../../../multipleAssessmentReport/common/utils/constants";

const getCol = (text, backgroundColor, columnKey, location, pageTitle, record) => {
  let value = text === undefined || text === null ? "N/A" : `${text}%`;
  if (columnKey === "score") {
    value = <Link style={{ color: reportLinkColor }} to={{
      pathname: `/author/classboard/${record.assignmentId}/${record.groupId}/test-activity/${record.testActivityId}`,
      state: {// this will be consumed in /src/client/author/Shared/Components/ClassBreadCrumb.js
        breadCrumb: [
          {
            title: "REPORTS",
            to: "/author/reports"
          },
          {
            title: pageTitle,
            to: `${location.pathname}${location.search}`
          }
        ]
      }
    }}>
      {value}
    </Link>
  };
  return <StyledCell style={{ backgroundColor }}>{value}</StyledCell>;
};

const tableColumns = [
  {
    title: "Assessment Name",
    dataIndex: "testName",
    key: "testName",
    render: (data, record) => (
      <Link to={`/author/classboard/${record.assignmentId}/${record.groupId}/test-activity/${record.testActivityId}`}>
        {data}
      </Link>
    )
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
    align: "right",
    className: "assessmentDate",
    sorter: (a, b) => {
      return a.assignmentDate - b.assignmentDate;
    }
  },
  {
    title: "Total Questions",
    dataIndex: "totalQuestions",
    align: "right",
    key: "totalQuestions"
  },
  {
    title: "Score",
    dataIndex: "rawScore",
    className: "rawscore",
    align: "right",
    key: "rawScore"
  },
  {
    title: "District (Avg. Score%)",
    dataIndex: "districtAvg",
    align: "right",
    key: "districtAvg"
  },
  {
    title: "School (Avg Score%)",
    dataIndex: "schoolAvg",
    align: "right",
    key: "schoolAvg"
  },
  {
    title: "Class (Avg Score%)",
    dataIndex: "groupAvg",
    align: "right",
    key: "groupAvg"
  }
];

const getColumns = (studentName = "", location, pageTitle) => {
  return [
    ...tableColumns,
    {
      title: "Student (Score%)",
      dataIndex: "score",
      align: "right",
      key: "score",
      sorter: (a, b) => {
        return a.score - b.score;
      },
      render: (score, record) => {
        if (isNaN(score) && score !== null) {
          return getCol(score, "#cccccc");
        }

        const toolTipText = () => (
          <div>
            <TableTooltipRow title={"Assessment Name: "} value={record.testName} />
            <TableTooltipRow title={"Assessment Type: "} value={record.testType} />
            <TableTooltipRow title={"Subject: "} value={record.standardSet} />
            <TableTooltipRow title={"Student Name: "} value={studentName} />
            <TableTooltipRow title={"Day of Assessment Start: "} value={record.assignmentDateFormatted} />
            <TableTooltipRow title={"Student Performance: "} value={`${record.score}%`} />
            <TableTooltipRow title={"District Performance: "} value={`${record.districtAvg}%`} />
            <TableTooltipRow title={"School Performance: "} value={`${record.schoolAvg}%`} />
            <TableTooltipRow title={"Class Performance: "} value={`${record.groupAvg}%`} />
            <TableTooltipRow title={"Total Questions: "} value={record.totalQuestions} />
            <TableTooltipRow title={"Score: "} value={record.rawScore} />
          </div>
        );

        return (
          <CustomTableTooltip
            placement="top"
            title={toolTipText()}
            getCellContents={() => getCol(score, getHSLFromRange1(score), "score", location, pageTitle, record)}
          />
        );
      }
    }
  ];
};

const AssessmentTable = ({ data, studentName, selectedTests, isCsvDownloading, onCsvConvert, location, pageTitle }) => {
  const columns = getColumns(studentName, location, pageTitle);

  const filteredData = filter(data, test => {
    return selectedTests.length ? includes(selectedTests, test.uniqId) : true;
  });

  return (
    <CsvTable
      dataSource={filteredData}
      columns={columns}
      colouredCellsNo={1}
      tableToRender={StyledTable}
      onCsvConvert={onCsvConvert}
      isCsvDownloading={isCsvDownloading}
    />
  );
};

AssessmentTable.propTypes = {
  data: PropTypes.array,
  studentName: PropTypes.string,
  selectedTests: PropTypes.array,
  isCsvDownloading: PropTypes.bool,
  onCsvConvert: PropTypes.func
};

AssessmentTable.defaultProps = {
  data: [],
  studentName: "",
  selectedTests: [],
  isCsvDownloading: false,
  onCsvConvert: () => {}
};

export default AssessmentTable;

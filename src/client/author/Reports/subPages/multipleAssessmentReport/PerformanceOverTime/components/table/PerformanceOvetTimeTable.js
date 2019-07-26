import React from "react";
import { map } from "lodash";
import PropTypes from "prop-types";
import { StyledCard, StyledTable, StyledH3, StyledCell } from "../../../../../common/styled";
import { CustomTableTooltip } from "../../../../../common/components/customTableTooltip";
import TableTooltipRow from "../../../../../common/components/tooltip/TableTooltipRow";
import { getHSLFromRange1, stringCompare } from "../../../../../common/util";

const staticFields = [
  {
    title: "Assessment Name",
    dataIndex: "testName",
    sorter: (a, b) => {
      return stringCompare(a.testName, b.testName);
    }
  },
  {
    title: "Assessment Type",
    dataIndex: "testType"
  },
  {
    title: "Assessment Date",
    dataIndex: "assessmentDateFormatted",
    sorter: (a, b) => {
      return a.assessmentDate - b.assessmentDate;
    }
  },
  {
    title: "Max Possible Score",
    dataIndex: "maxPossibleScore"
  },
  {
    title: "Questions#",
    dataIndex: "totalTestItems"
  },
  {
    title: "#Assigned",
    dataIndex: "totalAssigned"
  },
  {
    title: "#Graded",
    dataIndex: "totalGraded"
  },
  {
    title: "#Absent",
    dataIndex: "totalAbsent"
  }
];

const customFields = [
  {
    title: "Min. Score",
    dataIndex: "minScore"
  },
  {
    title: "Max. Score",
    dataIndex: "maxScore"
  },
  {
    title: "Avg. Student(Score%)",
    dataIndex: "score"
  }
];

const getCol = (text, backgroundColor) => {
  return <StyledCell style={{ backgroundColor }}>{text || "N/A"}</StyledCell>;
};

const getColumns = () => {
  const dynamicColumns = map(customFields, field => ({
    ...field,
    render: (text, record) => {
      let value = text;
      let color = "transparent";

      if (field.dataIndex === "score") {
        color = getHSLFromRange1(text);
        value = text ? `${text}%` : "";
      }

      const toolTipText = () => (
        <div>
          <TableTooltipRow title={"Assessment Name : "} value={record.testName || "N/A"} />
          <TableTooltipRow title={`Assessment Date : `} value={record.assessmentDateFormatted} />
          <TableTooltipRow title={`${field.title} : `} value={value} />
        </div>
      );

      return <CustomTableTooltip placement="top" title={toolTipText()} getCellContents={() => getCol(value, color)} />;
    }
  }));

  return [...staticFields, ...dynamicColumns];
};

const PerformanceOverTimeTable = ({ dataSource }) => {
  return (
    <StyledCard>
      <StyledH3>Assessment Statistics Over Time</StyledH3>
      <StyledTable dataSource={dataSource} columns={getColumns()} colouredCellsNo={3} />
    </StyledCard>
  );
};

PerformanceOverTimeTable.propTypes = {
  dataSource: PropTypes.array.isRequired
};

export default PerformanceOverTimeTable;

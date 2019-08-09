import React from "react";
import { map } from "lodash";
import PropTypes from "prop-types";
import { StyledCard, StyledTable, StyledH3, StyledCell } from "../../../../../common/styled";
import { CustomTableTooltip } from "../../../../../common/components/customTableTooltip";
import TableTooltipRow from "../../../../../common/components/tooltip/TableTooltipRow";
import { getHSLFromRange1, stringCompare, downloadCSV } from "../../../../../common/util";
import CsvTable from "../../../../../common/components/tables/CsvTable";

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
      let value = text || 0;
      let color = "transparent";

      if (field.dataIndex === "score") {
        color = getHSLFromRange1(value);
        value = `${value}%`;
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

const PerformanceOverTimeTable = ({ dataSource, isCsvDownloading }) => {
  const onCsvConvert = data => downloadCSV(`Performance Over Time.csv`, data);

  return (
    <StyledCard>
      <StyledH3>Assessment Statistics Over Time</StyledH3>
      <CsvTable
        dataSource={dataSource}
        columns={getColumns()}
        colouredCellsNo={3}
        tableToRender={StyledTable}
        onCsvConvert={onCsvConvert}
        isCsvDownloading={isCsvDownloading}
      />
    </StyledCard>
  );
};

PerformanceOverTimeTable.propTypes = {
  dataSource: PropTypes.array.isRequired,
  isCsvDownloading: PropTypes.bool
};

export default PerformanceOverTimeTable;

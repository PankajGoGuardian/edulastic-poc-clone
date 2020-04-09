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
    title: "Type",
    dataIndex: "testType"
  },
  {
    align: "right",
    title: "Assessment Date",
    dataIndex: "assessmentDateFormatted",
    className: "assessmentDate",
    sorter: (a, b) => {
      return a.startDate - b.startDate;
    }
  },
  {
    align: "right",
    title: "Max Possible Score",
    dataIndex: "maxPossibleScore"
  },
  {
    align: "right",
    title: "Questions",
    dataIndex: "totalTestItems"
  },
  {
    align: "right",
    title: "Assigned",
    dataIndex: "totalAssigned"
  },
  {
    align: "right",
    title: "Graded",
    dataIndex: "totalGraded"
  },
  {
    align: "right",
    title: "Absent",
    dataIndex: "totalAbsent"
  }
];

const customFields = [
  {
    align: "right",
    title: "Min. Score",
    dataIndex: "minScore"
  },
  {
    align: "right",
    title: "Max. Score",
    dataIndex: "maxScore"
  },
  {
    align: "right",
    title: "Avg. Student (Score%)",
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
      } else {
        // to display maxScore and minScore upto 2 decimal places
        value = value.toFixed(2);
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

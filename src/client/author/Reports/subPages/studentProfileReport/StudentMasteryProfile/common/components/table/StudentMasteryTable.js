import React from "react";
import { intersection, filter } from "lodash";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
import TableTooltipRow from "../../../../../../common/components/tooltip/TableTooltipRow";
import { CustomTableTooltip } from "../../../../../../common/components/customTableTooltip";
import { StyledCell, StyledH3, StyledCard } from "../../../../../../common/styled";
import CsvTable from "../../../../../../common/components/tables/CsvTable";
import { OnClick, StyledTable } from "../../styled";

const getCol = (text, backgroundColor) => {
  return <StyledCell style={{ backgroundColor }}>{text}</StyledCell>;
};

const renderToolTipColumn = columnName => (value, record) => {
  const toolTipText = () => (
    <div>
      <TableTooltipRow title={"Mastery : "} value={record.masteryName} />
      <TableTooltipRow title={"Domain : "} value={record.domain} />
      <TableTooltipRow title={"Standard : "} value={record.standard} />
      <TableTooltipRow title={"Description : "} value={record.standardName} />
      <TableTooltipRow title={`${columnName} : `} value={value} />
    </div>
  );

  const { color = "#cccccc" } = record.scale;

  return <CustomTableTooltip placement="top" title={toolTipText()} getCellContents={() => getCol(value, color)} />;
};

const getColumns = (handleOnClickStandard, filters) => {
  const columns = [
    {
      title: "Domain",
      key: "domain",
      dataIndex: "domain"
    },
    {
      title: "Standard",
      key: "standard",
      dataIndex: "standard",
      render: (data, record) => {
        const obj = {
          termId: filters.termId,
          studentId: record.studentId,
          standardId: record.standardId,
          profileId: filters.standardsProficiencyProfileId
        };
        return <OnClick onClick={() => handleOnClickStandard(obj, data)}>{data}</OnClick>;
      }
    },
    {
      title: "Description",
      key: "standardName",
      dataIndex: "standardName",
      width: 300,
      render: data => {
        let str = data || "";
        if (str.length > 60) {
          str = str.substring(0, 60) + "...";
        }
        return <span>{str}</span>;
      }
    },
    {
      title: "Mastery",
      key: "masteryName",
      dataIndex: "masteryName",
      render: (data, record) => {
        const obj = {
          termId: filters.termId,
          studentId: record.studentId,
          standardId: record.standardId,
          profileId: filters.standardsProficiencyProfileId
        };
        return <OnClick onClick={() => handleOnClickStandard(obj, record.standard)}>{data}</OnClick>;
      }
    },
    {
      title: "Assessment#",
      key: "testCount",
      dataIndex: "testCount",
      render: renderToolTipColumn("Assessment#")
    },
    {
      title: "Total Questions",
      key: "questionCount",
      dataIndex: "questionCount",
      render: renderToolTipColumn("Total Questions")
    },
    {
      title: "Score",
      key: "totalScore",
      dataIndex: "totalScore",
      render: renderToolTipColumn("Score")
    },
    {
      title: "Max Possible Score",
      key: "maxScore",
      dataIndex: "maxScore",
      render: renderToolTipColumn("Max Possible Score")
    },
    {
      title: "Avg. Score(%)",
      key: "scoreFormatted",
      dataIndex: "scoreFormatted",
      render: renderToolTipColumn("Avg. Score(%)")
    }
  ];
  return columns;
};

const StudentMasteryTable = ({
  data,
  selectedMastery,
  isCsvDownloading,
  onCsvConvert,
  handleOnClickStandard,
  filters
}) => {
  const filteredStandards = filter(data, standard => {
    return !selectedMastery.length || intersection([standard.scale.masteryLabel], selectedMastery).length;
  });

  const _columns = getColumns(handleOnClickStandard, filters);

  return (
    <StyledCard>
      <StyledH3>Standard Performance Details</StyledH3>
      <Row>
        <Col>
          <CsvTable
            dataSource={filteredStandards}
            columns={_columns}
            colouredCellsNo={5}
            tableToRender={StyledTable}
            onCsvConvert={onCsvConvert}
            isCsvDownloading={isCsvDownloading}
            pagination={false}
          />
        </Col>
      </Row>
    </StyledCard>
  );
};

StudentMasteryTable.propTypes = {
  data: PropTypes.array,
  selectedMastery: PropTypes.array,
  isCsvDownloading: PropTypes.bool,
  onCsvConvert: PropTypes.func
};

StudentMasteryTable.defaultProps = {
  data: [],
  selectedMastery: [],
  isCsvDownloading: false,
  onCsvConvert: () => {}
};

export default StudentMasteryTable;

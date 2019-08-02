import React from "react";
import { intersection, filter } from "lodash";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
import TableTooltipRow from "../../../../../../common/components/tooltip/TableTooltipRow";
import { CustomTableTooltip } from "../../../../../../common/components/customTableTooltip";
import { StyledTable, StyledCell, StyledH3, StyledCard } from "../../../../../../common/styled";

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

const columns = [
  {
    title: "Domain",
    key: "domain",
    dataIndex: "domain"
  },
  {
    title: "Standard",
    key: "standard",
    dataIndex: "standard"
  },
  {
    title: "Description",
    key: "standardName",
    dataIndex: "standardName",
    width: 300
  },
  {
    title: "Mastery",
    key: "masteryName",
    dataIndex: "masteryName"
  },
  {
    title: "Assessment#",
    key: "assessmentCount",
    dataIndex: "assessmentCount",
    render: renderToolTipColumn("Assessment#")
  },
  {
    title: "Total Questions",
    key: "totalQuestions",
    dataIndex: "totalQuestions",
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

const StudentMasteryTable = ({ data, selectedMastery }) => {
  const filteredStandards = filter(data, standard => {
    return !selectedMastery.length || intersection([standard.scale.masteryLabel], selectedMastery).length;
  });

  return (
    <StyledCard>
      <StyledH3>Standard Performance Details</StyledH3>
      <Row>
        <Col>
          <StyledTable dataSource={filteredStandards} columns={columns} colouredCellsNo={5} />
        </Col>
      </Row>
    </StyledCard>
  );
};

StudentMasteryTable.propTypes = {
  data: PropTypes.array,
  selectedMastery: PropTypes.array
};

StudentMasteryTable.defaultProps = {
  data: [],
  selectedMastery: []
};

export default StudentMasteryTable;

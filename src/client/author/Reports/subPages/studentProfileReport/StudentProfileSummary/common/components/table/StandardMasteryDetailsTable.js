import React from "react";
import { round } from "lodash";
import PropTypes from "prop-types";
import TableTooltipRow from "../../../../../../common/components/tooltip/TableTooltipRow";
import { CustomTableTooltip } from "../../../../../../common/components/customTableTooltip";
import { StyledTable, StyledCell, StyledH3 } from "../../../../../../common/styled";

const getCol = (text, backgroundColor) => {
  return <StyledCell style={{ backgroundColor }}>{text}</StyledCell>;
};

const renderToolTipColumn = (value, record) => {
  const toolTipText = () => (
    <div>
      <TableTooltipRow title={"Domain : "} value={record.name} />
      <TableTooltipRow title={"Domain description : "} value={record.description} />
      <TableTooltipRow
        title={"Standards Mastered : "}
        value={`${record.masteredCount} out of ${record.standards.length}`}
      />
    </div>
  );

  const { color = "#cccccc" } = record.scale;

  return (
    <CustomTableTooltip
      placement="top"
      title={toolTipText()}
      getCellContents={() => getCol(`${round(value)}%`, color)}
    />
  );
};

const columns = [
  {
    title: "Domain",
    key: "name",
    dataIndex: "name"
  },
  {
    title: "Domain Description",
    key: "description",
    dataIndex: "description",
    width: 300
  },
  {
    title: "Mastered Standards",
    key: "masteredCount",
    dataIndex: "masteredCount",
    render: (masteredCount, record) => `${masteredCount} out of ${record.standards.length}`
  },
  {
    title: "Avg. Score(%)",
    key: "score",
    dataIndex: "score",
    sorter: (a, b) => a.score - b.score,
    render: renderToolTipColumn
  }
];

const StandardMasteryDetailsTable = ({ data }) => {
  return (
    <StyledTable
      dataSource={data}
      columns={columns}
      colouredCellsNo={1}
      rightAligned={2}
      pagination={{
        pageSize: 5
      }}
    />
  );
};

StandardMasteryDetailsTable.propTypes = {
  data: PropTypes.array
};

StandardMasteryDetailsTable.defaultProps = {
  data: []
};

export default StandardMasteryDetailsTable;

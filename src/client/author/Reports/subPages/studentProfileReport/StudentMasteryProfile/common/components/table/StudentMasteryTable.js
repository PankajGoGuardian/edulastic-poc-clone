import React from "react";
import { intersection, filter } from "lodash";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
import { greyThemeDark1, themeColorLight } from "@edulastic/colors";
import TableTooltipRow from "../../../../../../common/components/tooltip/TableTooltipRow";
import { CustomTableTooltip } from "../../../../../../common/components/customTableTooltip";
import { StyledCell } from "../../../../../../common/styled";
import CsvTable from "../../../../../../common/components/tables/CsvTable";
import { StyledTable, ReStyledTag, StyledSpan } from "../../styled";

const getCol = (text, backgroundColor) => (
  <StyledCell style={{ backgroundColor }} justify="center">
    {text}
  </StyledCell>
);

const renderToolTipColumn = columnName => (value, record) => {
  const toolTipText = () => (
    <div>
      <TableTooltipRow title="Mastery : " value={record.masteryName} />
      <TableTooltipRow title="Domain : " value={record.domain} />
      <TableTooltipRow title="Standard : " value={record.standard} />
      <TableTooltipRow title="Description : " value={record.standardName} />
      <TableTooltipRow title={`${columnName} : `} value={value} />
    </div>
  );

  const { color = "#cccccc" } = record.scale;

  return <CustomTableTooltip placement="top" title={toolTipText()} getCellContents={() => getCol(value, color)} />;
};

const getColumns = (handleOnClickStandard, filters, termId) => {
  const columns = [
    {
      title: "Standard",
      key: "standard",
      dataIndex: "standard",
      fixed: "left",
      width: 150,
      render: (data, record) => {
        const obj = {
          termId: filters.termId || termId,
          studentId: record.studentId,
          standardId: record.standardId,
          profileId: filters.standardsProficiencyProfileId
        };
        return (
          <ReStyledTag
            onClick={() => handleOnClickStandard(obj, data)}
            bgColor={record.scale.color}
            textColor={greyThemeDark1}
            padding="0px 10px"
            fontWeight="Bold"
            cursor="pointer"
          >
            {data}
          </ReStyledTag>
        );
      },
      sorter: (a, b) => a.standard.localeCompare(b.standard)
    },
    {
      title: "Description",
      key: "standardName",
      dataIndex: "standardName",
      width: 250,
      render: data => {
        let str = data || "";
        if (str.length > 60) {
          str = `${str.substring(0, 60)}...`;
        }
        return <StyledSpan>{str}</StyledSpan>;
      },
      sorter: (a, b) => a.standardName.localeCompare(b.standardName)
    },
    {
      title: "Mastery",
      key: "masteryName",
      align: "center",
      width: 180,
      dataIndex: "masteryName",
      render: (data, record) => {
        const obj = {
          termId: filters.termId || termId,
          studentId: record.studentId,
          standardId: record.standardId,
          profileId: filters.standardsProficiencyProfileId
        };
        return (
          <StyledSpan
            onClick={() => handleOnClickStandard(obj, record.standard)}
            cursor="pointer"
            alignment="center"
            hoverColor={themeColorLight}
          >
            {data}
          </StyledSpan>
        );
      },
      sorter: (a, b) => {
        if (a.masteryName !== b.masteryName) {
          return a.masteryName.localeCompare(b.masteryName);
        }
        return a.scoreFormatted.localeCompare(b.scoreFormatted);
      }
    },
    {
      title: "Assessment",
      key: "testCount",
      dataIndex: "testCount",
      width: 180,
      align: "center",
      render: renderToolTipColumn("Assessments"),
      sorter: (a, b) => a.testCount - b.testCount
    },
    {
      title: "Total Questions",
      key: "questionCount",
      dataIndex: "questionCount",
      width: 100,
      align: "center",
      render: renderToolTipColumn("Total Questions"),
      sorter: (a, b) => a.questionCount - b.questionCount
    },
    {
      title: "Score",
      key: "totalScore",
      dataIndex: "totalScore",
      align: "center",
      width: 100,
      render: renderToolTipColumn("Score"),
      sorter: (a, b) => a.totalScore - b.totalScore
    },
    {
      title: "Max Possible Score",
      key: "maxScore",
      dataIndex: "maxScore",
      width: 100,
      align: "center",
      render: renderToolTipColumn("Max Possible Score"),
      sorter: (a, b) => a.maxScore - b.maxScore
    },
    {
      title: "Avg. Score(%)",
      key: "scoreFormatted",
      dataIndex: "scoreFormatted",
      width: 130,
      align: "center",
      render: renderToolTipColumn("Avg. Score"),
      sorter: (a, b) => a.scoreFormatted.localeCompare(b.scoreFormatted)
    }
  ];
  return columns;
};

const StudentMasteryTable = ({
  parentRow,
  data,
  selectedMastery,
  isCsvDownloading,
  onCsvConvert,
  handleOnClickStandard,
  filters,
  termId
}) => {
  const filteredStandards = filter(
    data,
    standard =>
      (!selectedMastery.length || intersection([standard.scale.masteryLabel], selectedMastery).length) &&
      (!parentRow || String(parentRow.domainId) === String(standard.domainId))
  );

  const _columns = getColumns(handleOnClickStandard, filters, termId);

  return (
    <Row>
      <Col>
        <CsvTable
          dataSource={filteredStandards}
          columns={_columns}
          colouredCellsNo={5}
          tableToRender={StyledTable}
          onCsvConvert={onCsvConvert}
          scroll={{ x: "100%" }}
          isCsvDownloading={isCsvDownloading}
        />
      </Col>
    </Row>
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

import React from "react";
import { intersection, filter } from "lodash";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
import TableTooltipRow from "../../../../../../common/components/tooltip/TableTooltipRow";
import { CustomTableTooltip } from "../../../../../../common/components/customTableTooltip";
import { StyledCell } from "../../../../../../common/styled";
import CsvTable from "../../../../../../common/components/tables/CsvTable";
import { StyledTable, ReStyledTag, StyledSpan } from "../../styled";
import { greyThemeDark1, themeColorLight } from "@edulastic/colors";

const getCol = (text, backgroundColor) => {
  return (
    <StyledCell style={{ backgroundColor }} justify="center">
      {text}
    </StyledCell>
  );
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

const getColumns = (handleOnClickStandard, filters, termId) => {
  const columns = [
    {
      title: "Standard",
      key: "standard",
      dataIndex: "standard",
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
            padding={"0px 10px"}
            fontWeight={"Bold"}
            cursor={"pointer"}
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
          str = str.substring(0, 60) + "...";
        }
        return <StyledSpan>{str}</StyledSpan>;
      },
      sorter: (a, b) => a.standardName.localeCompare(b.standardName)
    },
    {
      title: "Mastery",
      key: "masteryName",
      align: "center",
      dataIndex: "masteryName",
      render: (data, record) => {
        const obj = {
          termId: filters.termId,
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
        } else {
          return a.scoreFormatted.localeCompare(b.scoreFormatted);
        }
      }
    },
    {
      title: "Assessment",
      key: "testCount",
      dataIndex: "testCount",
      align: "center",
      render: renderToolTipColumn("Assessments"),
      sorter: (a, b) => a.testCount - b.testCount
    },
    {
      title: "Total Questions",
      key: "questionCount",
      dataIndex: "questionCount",
      align: "center",
      render: renderToolTipColumn("Total Questions"),
      sorter: (a, b) => a.questionCount - b.questionCount
    },
    {
      title: "Score",
      key: "totalScore",
      dataIndex: "totalScore",
      align: "center",
      render: renderToolTipColumn("Score"),
      sorter: (a, b) => a.totalScore - b.totalScore
    },
    {
      title: "Max Possible Score",
      key: "maxScore",
      dataIndex: "maxScore",
      align: "center",
      render: renderToolTipColumn("Max Possible Score"),
      sorter: (a, b) => a.maxScore - b.maxScore
    },
    {
      title: "Avg. Score(%)",
      key: "scoreFormatted",
      dataIndex: "scoreFormatted",
      align: "center",
      render: renderToolTipColumn("Avg. Score"),
      sorter: (a, b) => a.scoreFormatted.localeCompare(b.scoreFormatted)
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
  filters,
  termId
}) => {
  const filteredStandards = filter(data, standard => {
    return !selectedMastery.length || intersection([standard.scale.masteryLabel], selectedMastery).length;
  });

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
          isCsvDownloading={isCsvDownloading}
          pagination={false}
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

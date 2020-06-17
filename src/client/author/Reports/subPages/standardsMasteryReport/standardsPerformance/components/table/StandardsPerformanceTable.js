import React from "react";
import { Link } from "react-router-dom";
import { sumBy, includes, filter } from "lodash";
import next from "immer";
import { Row, Col } from "antd";
import styled from "styled-components";
import { withNamespaces } from "@edulastic/localization";
import {
  getOptionFromKey,
  getMasteryScore,
  getScore,
  getMasteryLevel,
  getMasteryScoreColor,
  getAnalyseByTitle,
  getOverallValue,
  getOverallMasteryScore,
  getRecordMasteryLevel
} from "../../utils/transformers";
import { StyledDropDownContainer } from "../styled";
import { ControlDropDown } from "../../../../../common/components/widgets/controlDropDown";
import { StyledH3, StyledTable, ColoredCell } from "../../../../../common/styled";
import { CustomTableTooltip } from "../../../../../common/components/customTableTooltip";
import TableTooltipRow from "../../../../../common/components/tooltip/TableTooltipRow";
import CsvTable from "../../../../../common/components/tables/CsvTable";
import { percentage, downloadCSV } from "../../../../../common/util";

export const getOverallScore = (metrics = []) => percentage(sumBy(metrics, "totalScore"), sumBy(metrics, "maxScore"));

const getColValue = (record = {}, domainId, analyseByKey, scaleInfo) => {
  const domain = record.domainData[domainId];

  switch (analyseByKey) {
    case "masteryScore":
      return domain ? getMasteryScore(domain) : "N/A";
    case "score":
      return domain ? `${getScore(domain)}%` : "N/A";
    case "rawScore":
      return domain ? `${(domain.totalScore || 0).toFixed(2)} / ${domain.maxScore}` : 0;
    case "masteryLevel":
      return domain ? getMasteryLevel(getMasteryScore(domain), scaleInfo).masteryLabel : "N/A";
    default:
      return "";
  }
};

const getCol = (record = {}, domainId, analyseByKey, scaleInfo) => {
  const domain = record.domainData[domainId] || {};
  const colValue = getColValue(record, domainId, analyseByKey, scaleInfo);
  if (colValue === "N/A") {
    return colValue;
  }
  return (
    <ColoredCell bgColor={getMasteryScoreColor(domain, scaleInfo)}>
      {getColValue(record, domainId, analyseByKey, scaleInfo)}
    </ColoredCell>
  );
};

const getColorCell = (domainId, domainName, compareBy, analyseByKey, scaleInfo) => (_, record) => {
  const toolTipText = rec => (
    <div>
      <TableTooltipRow title={`${compareBy.title}: `} value={rec.name} />
      <TableTooltipRow title="Domain: " value={domainName} />
      <TableTooltipRow
        title={`${getAnalyseByTitle(analyseByKey)}: `}
        value={getColValue(rec, domainId, analyseByKey, scaleInfo)}
      />
    </div>
  );

  return (
    <CustomTableTooltip
      placement="top"
      title={toolTipText(record)}
      getCellContents={() => getCol(record, domainId, analyseByKey, scaleInfo)}
    />
  );
};

const getOverallColSorter = (analyseKey, scaleInfo) => {
  switch (analyseKey) {
    case "score":
      return (a, b) => getOverallScore(a.records) - getOverallScore(b.records);
    case "rawScore":
      return (a, b) => sumBy(a.records, "totalScore") - sumBy(b.records, "totalScore");
    case "masteryScore":
      return (a, b) => getOverallMasteryScore(a.records) - getOverallMasteryScore(b.records);
    case "masteryLevel":
      return (a, b) =>
        getRecordMasteryLevel(a.records, scaleInfo).score - getRecordMasteryLevel(b.records, scaleInfo).score;
    default:
      break;
  }
};

export const getColumns = (compareBy, analyseByKey, domains, scaleInfo, selectedDomains, filters = {}, t) => {
  const filteredDomains = filter(
    domains,
    domain => includes(selectedDomains, domain.domainId) || !selectedDomains.length
  );
  const domainCols = filteredDomains.map(domain => ({
    title: (
      <>
        <span>{domain.domainName}</span>
        <br />
        <span>
          {domain[analyseByKey]} {analyseByKey == "score" ? "%" : ""}
        </span>
      </>
    ),
    dataIndex: domain.domainName,
    key: domain.domainName,
    render: getColorCell(domain.domainId, domain.domainName, compareBy, analyseByKey, scaleInfo)
  }));

  const cols = [
    {
      title: compareBy.title,
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      render: (data, record) =>
        compareBy.title === "Student" ? (
          <Link to={`/author/reports/student-profile-summary/student/${record.id}?termId=${filters?.termId}`}>
            {data || t("common.anonymous")}
          </Link>
        ) : (
          data
        )
    },
    {
      title: "Overall",
      dataIndex: "overall",
      key: "overall",
      sorter: getOverallColSorter(analyseByKey, scaleInfo),
      render: (_, record) => getOverallValue(record, analyseByKey, scaleInfo)
    },
    ...domainCols,
    {
      title: "SIS ID",
      dataIndex: "sisId",
      key: "sisId",
      visibleOn: ["csv"],
      render: (_, record) => record.rowInfo.sisId || ""
    }
  ];

  return cols;
};

const StandardsPerformanceTable = ({
  className,
  tableFilters,
  tableFiltersOptions,
  onFilterChange,
  domainsData,
  scaleInfo,
  selectedDomains,
  isCsvDownloading,
  filters = {},
  t,
  ...tableProps
}) => {
  const columns = getColumns(
    tableFilters.compareBy,
    tableFilters.analyseBy.key,
    domainsData,
    scaleInfo,
    selectedDomains,
    filters,
    t
  );

  const { analyseByData, compareByData } = tableFiltersOptions;

  const onChangeTableFilters = (prefix, options, selectedPayload) => {
    const modifiedState = next(tableFilters, draft => {
      draft[prefix] = getOptionFromKey(options, selectedPayload.key);
    });
    onFilterChange(modifiedState);
  };

  const bindOnChange = (prefix, options) => props => onChangeTableFilters(prefix, options, props);

  const onCsvConvert = data => downloadCSV(`Mastery By Domain.csv`, data);

  return (
    <>
      <Row type="flex" justify="start" className={className}>
        <Col xs={24} sm={24} md={11} lg={11} xl={12}>
          <StyledH3>Domain Mastery Details by School</StyledH3>
        </Col>
        <Col xs={24} sm={24} md={13} lg={13} xl={12}>
          <Row className="control-dropdown-row">
            <StyledDropDownContainer xs={24} sm={24} md={11} lg={11} xl={8}>
              <ControlDropDown
                prefix="Compare by "
                data={compareByData}
                by={tableFilters.compareBy}
                selectCB={bindOnChange("compareBy", compareByData)}
              />
            </StyledDropDownContainer>
            <StyledDropDownContainer xs={24} sm={24} md={13} lg={13} xl={8}>
              <ControlDropDown
                prefix="Analyse by "
                data={analyseByData}
                by={tableFilters.analyseBy}
                selectCB={bindOnChange("analyseBy", analyseByData)}
              />
            </StyledDropDownContainer>
          </Row>
        </Col>
      </Row>
      <Row type="flex" justify="start">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <CsvTable
            {...tableProps}
            colouredCellsNo={domainsData.length}
            centerAligned={domainsData.length}
            columns={columns}
            onCsvConvert={onCsvConvert}
            isCsvDownloading={isCsvDownloading}
            tableToRender={StyledTable}
            scroll={{ x: "100%" }}
          />
        </Col>
      </Row>
    </>
  );
};

const StyledStandardsPerformanceTable = styled(StandardsPerformanceTable)`
  .control-dropdown-row {
    display: flex;
    justify-content: flex-end;
  }
`;

export default withNamespaces("student")(StyledStandardsPerformanceTable);

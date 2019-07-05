import React from "react";
import { sumBy, includes, filter } from "lodash";
import next from "immer";
import { Row, Col } from "antd";
import {
  getOptionFromKey,
  getMasteryScore,
  getScore,
  getMasteryLevel,
  getMasteryScoreColor,
  getAnalyseByTitle,
  getOverallValue
} from "../../utils/transformers";
import { StyledDropDownContainer } from "../styled";
import { ControlDropDown } from "../../../../../common/components/widgets/controlDropDown";
import { StyledH3, StyledTable } from "../../../../../common/styled";
import { CustomTableTooltip } from "../../../../../common/components/customTableTooltip";
import TableTooltipRow from "../../../../../common/components/tooltip/TableTooltipRow";

const getColValue = (record = {}, domainId, analyseByKey, scaleInfo) => {
  const domain = record.domainData[domainId] || {};

  switch (analyseByKey) {
    case "masteryScore":
      return getMasteryScore(domain);
    case "score":
      return `${getScore(domain)}%`;
    case "rawScore":
      return `${domain.totalScore} / ${domain.maxScore}`;
    case "masteryLevel":
      return getMasteryLevel(getMasteryScore(domain), scaleInfo).masteryLabel;
    default:
      return "";
  }
};

const getCol = (record = {}, domainId, analyseByKey, scaleInfo) => {
  const domain = record.domainData[domainId] || {};
  return (
    <div style={{ backgroundColor: getMasteryScoreColor(domain, scaleInfo) }}>
      {getColValue(record, domainId, analyseByKey, scaleInfo)}
    </div>
  );
};

const getColorCell = (domainId, domainName, compareBy, analyseByKey, scaleInfo) => (_, record) => {
  const toolTipText = record => {
    return (
      <div>
        <TableTooltipRow title={`${compareBy.title}: `} value={record.name} />
        <TableTooltipRow title={"Domain: "} value={domainName} />
        <TableTooltipRow
          title={`${getAnalyseByTitle(analyseByKey)}: `}
          value={getColValue(record, domainId, analyseByKey, scaleInfo)}
        />
      </div>
    );
  };

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
  }
};

export const getColumns = (compareBy, analyseByKey, domains, scaleInfo, selectedDomains) => {
  let filteredDomains = filter(
    domains,
    domain => includes(selectedDomains, domain.domainId) || !selectedDomains.length
  );

  let domainCols = filteredDomains.map(domain => ({
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

  let cols = [
    {
      title: compareBy.title,
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: "Overall",
      dataIndex: "overall",
      key: "overall",
      sorter: getOverallColSorter(analyseByKey, scaleInfo),
      render: (_, record) => getOverallValue(record, analyseByKey, scaleInfo)
    },
    ...domainCols
  ];

  return cols;
};

const StandardsPerformanceTable = ({
  tableFilters,
  tableFiltersOptions,
  onFilterChange,
  domainsData,
  scaleInfo,
  selectedDomains,
  ...tableProps
}) => {
  const columns = getColumns(
    tableFilters.compareBy,
    tableFilters.analyseBy.key,
    domainsData,
    scaleInfo,
    selectedDomains
  );

  const { analyseByData, compareByData, masteryLevelData } = tableFiltersOptions;

  const onChangeTableFilters = (prefix, options, selectedPayload) => {
    const modifiedState = next(tableFilters, draft => {
      draft[prefix] = getOptionFromKey(options, selectedPayload.key);
    });
    onFilterChange(modifiedState);
  };

  const bindOnChange = (prefix, options) => props => onChangeTableFilters(prefix, options, props);

  return (
    <>
      <Row type="flex" justify="start">
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <StyledH3>Domain Mastery Details by School</StyledH3>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Row>
            <StyledDropDownContainer xs={24} sm={24} md={8} lg={8} xl={8}>
              <ControlDropDown
                prefix={"Mastery Level - "}
                data={masteryLevelData}
                by={tableFilters.masteryLevel}
                selectCB={bindOnChange("masteryLevel", masteryLevelData)}
              />
            </StyledDropDownContainer>
            <StyledDropDownContainer xs={24} sm={24} md={8} lg={8} xl={8}>
              <ControlDropDown
                prefix={"Compare by "}
                data={compareByData}
                by={tableFilters.compareBy}
                selectCB={bindOnChange("compareBy", compareByData)}
              />
            </StyledDropDownContainer>
            <StyledDropDownContainer xs={24} sm={24} md={8} lg={8} xl={8}>
              <ControlDropDown
                prefix={"Analyse by "}
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
          <StyledTable
            {...tableProps}
            colouredCellsNo={domainsData.length}
            centerAligned={domainsData.length}
            columns={columns}
          />
        </Col>
      </Row>
    </>
  );
};

export default StandardsPerformanceTable;

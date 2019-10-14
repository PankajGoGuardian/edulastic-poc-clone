import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "antd";
import styled from "styled-components";
import { isEmpty } from "lodash";
import next from "immer";

import { ControlDropDown } from "../../../../../common/components/widgets/controlDropDown";

import { StyledTable, StyledDropDownContainer, OnClick } from "../styled";
import { StyledH3, StyledCard } from "../../../../../common/styled";
import { CustomTableTooltip } from "../../../../../common/components/customTableTooltip";

import CsvTable from "../../../../../common/components/tables/CsvTable";
import { downloadCSV } from "../../../../../common/util";

import {
  getTableData,
  getMasteryDropDown,
  idToName,
  analyseByToKeyToRender,
  analyseByToName,
  getAverageStandardScorePercent
} from "../../utils/transformers";

import dropDownFormat from "../../static/json/dropDownFormat.json";

export const StandardsGradebookTable = ({
  filteredDenormalizedData,
  masteryScale,
  chartFilter,
  isCsvDownloading,
  role,
  filters = {},
  handleOnClickStandard
}) => {
  const [tableDdFilters, setTableDdFilters] = useState({
    masteryLevel: "all",
    analyseBy: "score(%)",
    compareBy: role === "teacher" ? "studentId" : "schoolId"
  });

  const [prevMasteryScale, setPrevMasteryScale] = useState(null);

  if (prevMasteryScale !== masteryScale) {
    const masteryDropDownData = getMasteryDropDown(masteryScale);
    setPrevMasteryScale(masteryScale);
    setTableDdFilters({
      ...tableDdFilters,
      masteryLevel: masteryDropDownData[0].key
    });
  }

  const tableData = useMemo(() => {
    return getTableData(
      filteredDenormalizedData,
      masteryScale,
      tableDdFilters.compareBy,
      tableDdFilters.analyseBy,
      tableDdFilters.masteryLevel,
      role
    );
  }, [filteredDenormalizedData, masteryScale, tableDdFilters]);

  const averageStandardScorePercent = useMemo(() => getAverageStandardScorePercent(tableData), [tableData]);

  const getFilteredTableData = () => {
    return next(tableData, arr => {
      arr.map((item, index) => {
        let tempArr = item.standardsInfo.filter((_item, index) => {
          if (chartFilter[_item.standardName] || isEmpty(chartFilter)) {
            return {
              ..._item
            };
          }
        });
        item.standardsInfo = tempArr;
      });
    });
  };

  const filteredTableData = getFilteredTableData();

  const getDisplayValue = (item = {}, _analyseBy, data, record) => {
    let printData;
    if (item.scorePercent === 0 || item.rawScore === 0 || item.masteryScore === 0) {
      return "N/A";
    }

    if (_analyseBy === "score(%)") {
      printData = item.scorePercent + "%";
    } else if (_analyseBy === "rawScore") {
      printData = item.totalTotalScore.toFixed(2) + "/" + item.totalMaxScore.toFixed(2);
    } else if (_analyseBy === "masteryLevel") {
      printData = item.masteryLevel;
    } else if (_analyseBy === "masteryScore") {
      printData = item.fm.toFixed(2);
    }
    return printData;
  };

  const renderStandardIdColumns = (index, _compareBy, _analyseBy, standardName, standardId) => (data, record) => {
    const tooltipText = record => {
      return (
        <div>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">{idToName[_compareBy]}: </Col>
            <Col className="custom-table-tooltip-value">{record.compareByLabel}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">Standard: </Col>
            <Col className="custom-table-tooltip-value">{record.standardsInfo[index].standardName}</Col>
          </Row>

          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">{analyseByToName[_analyseBy]}: </Col>
            {_analyseBy === "score(%)" ? (
              <Col className="custom-table-tooltip-value">
                {record.standardsInfo[index][analyseByToKeyToRender[_analyseBy]]}%
              </Col>
            ) : null}
            {_analyseBy === "rawScore" ? (
              <Col className="custom-table-tooltip-value">
                {record.standardsInfo[index].totalTotalScore}/{record.standardsInfo[index].totalMaxScore}
              </Col>
            ) : null}
            {_analyseBy === "masteryLevel" ? (
              <Col className="custom-table-tooltip-value">{record.standardsInfo[index].masteryName}</Col>
            ) : null}
            {_analyseBy === "masteryScore" ? (
              <Col className="custom-table-tooltip-value">
                {record.standardsInfo[index][analyseByToKeyToRender[_analyseBy]]}
              </Col>
            ) : null}
          </Row>
        </div>
      );
    };

    const obj = {
      termId: filters.termId,
      studentId: record.studentId,
      standardId: standardId,
      profileId: filters.profileId
    };

    const getCellContents = props => {
      let { printData } = props;
      if (_compareBy === "studentId") {
        return (
          <div style={{ backgroundColor: record.color }}>
            {printData === "N/A" ? (
              printData
            ) : (
              <OnClick onClick={() => handleOnClickStandard(obj, standardName, record.compareByLabel)}>
                {printData}
              </OnClick>
            )}
          </div>
        );
      }
      return <div style={{ backgroundColor: record.color }}>{printData}</div>;
    };

    let printData = getDisplayValue(record.standardsInfo[index], _analyseBy, data, record);

    return (
      <CustomTableTooltip
        printData={printData}
        placement="top"
        title={tooltipText(record)}
        getCellContents={getCellContents}
      />
    );
  };

  const getColumnsData = () => {
    const extraColsNeeded = filteredTableData.length && filteredTableData[0].standardsInfo.length;
    let result = [
      {
        title: idToName[tableDdFilters.compareBy],
        dataIndex: tableDdFilters.compareBy,
        key: tableDdFilters.compareBy,
        render: (data, record) => {
          return record.compareBy === "studentId" ? (
            <Link to={`/author/reports/student-profile-summary/student/${data}?termId=${filters?.termId}`}>
              {record.compareByLabel}
            </Link>
          ) : (
            record.compareByLabel
          );
        }
      },
      {
        title: "Overall",
        dataIndex: analyseByToKeyToRender[tableDdFilters.analyseBy],
        key: analyseByToKeyToRender[tableDdFilters.analyseBy],
        width: 250
      }
    ];

    if (extraColsNeeded) {
      result = [
        ...result,
        ...filteredTableData[0].standardsInfo.map((item, index) => ({
          title: (
            <>
              <span>{item.standardName}</span>
              <br />
              <span>{averageStandardScorePercent[item.standardName]}%</span>
            </>
          ),
          dataIndex: item.standardId,
          key: item.standardId,
          width: 150,
          render: renderStandardIdColumns(
            index,
            tableDdFilters.compareBy,
            tableDdFilters.analyseBy,
            item.standardName,
            item.standardId
          )
        }))
      ];
    }

    return result;
  };

  const columnsData = getColumnsData();

  const compareByDropDownData = next(dropDownFormat.compareByDropDownData, arr => {
    if (role === "teacher") {
      arr.splice(0, 2);
    }
  });

  const tableFilterDropDownCB = (event, _selected, comData) => {
    if (comData === "compareBy") {
      setTableDdFilters({
        ...tableDdFilters,
        compareBy: _selected.key
      });
    } else if (comData === "analyseBy") {
      setTableDdFilters({
        ...tableDdFilters,
        analyseBy: _selected.key
      });
    }
  };

  const onCsvConvert = data => downloadCSV(`Standard Grade Book.csv`, data);

  return (
    <>
      <StyledCard>
        <Row type="flex" justify="start">
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <StyledH3>Standards Mastery By {idToName[tableDdFilters.compareBy]}</StyledH3>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Row className="control-dropdown-row">
              <StyledDropDownContainer xs={24} sm={24} md={8} lg={8} xl={8}>
                <ControlDropDown
                  data={compareByDropDownData}
                  by={compareByDropDownData[0]}
                  prefix="Compare By"
                  selectCB={tableFilterDropDownCB}
                  comData={"compareBy"}
                />
              </StyledDropDownContainer>
              <StyledDropDownContainer xs={24} sm={24} md={8} lg={8} xl={8}>
                <ControlDropDown
                  data={dropDownFormat.analyseByDropDownData}
                  by={dropDownFormat.analyseByDropDownData[0]}
                  prefix="Analyse By"
                  selectCB={tableFilterDropDownCB}
                  comData={"analyseBy"}
                />
              </StyledDropDownContainer>
            </Row>
          </Col>
        </Row>
        <Row>
          <CsvTable
            columns={columnsData}
            dataSource={filteredTableData}
            rowKey={tableDdFilters.compareBy}
            tableToRender={StyledTable}
            onCsvConvert={onCsvConvert}
            isCsvDownloading={isCsvDownloading}
          />
        </Row>
      </StyledCard>
    </>
  );
};

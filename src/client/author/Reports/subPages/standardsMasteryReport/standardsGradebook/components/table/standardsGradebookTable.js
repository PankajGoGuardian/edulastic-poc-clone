import React, { useEffect, useState, useMemo } from "react";
import { Row, Col } from "antd";
import styled from "styled-components";
import { isEmpty } from "lodash";
import next from "immer";

import { ControlDropDown } from "../../../../../common/components/widgets/controlDropDown";

import { StyledTable } from "../styled";
import { StyledH3, StyledCard } from "../../../../../common/styled";
import { CustomTableTooltip } from "../../../../../common/components/customTableTooltip";

import {
  getTableData,
  getMasteryDropDown,
  idToName,
  analyseByToKeyToRender,
  analyseByToName
} from "../../utils/transformers";

import dropDownFormat from "../../static/json/dropDownFormat.json";

export const StandardsGradebookTable = ({ denormalizedData, masteryScale, chartFilter, role }) => {
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

  const masteryLevelDropDownData = useMemo(() => {
    return getMasteryDropDown(masteryScale);
  }, [masteryScale]);

  const tableData = useMemo(() => {
    return getTableData(
      denormalizedData,
      masteryScale,
      tableDdFilters.compareBy,
      tableDdFilters.analyseBy,
      tableDdFilters.masteryLevel,
      role
    );
  }, [denormalizedData, masteryScale, tableDdFilters]);

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

  const getDisplayValue = (item, _analyseBy, data, record) => {
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

  const renderStandardIdColumns = (index, _compareBy, _analyseBy) => (data, record) => {
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

    const getCellContents = props => {
      let { printData } = props;
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
          return record.compareByLabel;
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
          title: item.standardName,
          dataIndex: item.standardId,
          key: item.standardId,
          width: 150,
          render: renderStandardIdColumns(index, tableDdFilters.compareBy, tableDdFilters.analyseBy)
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
    if (comData === "masteryLevel") {
      setTableDdFilters({
        ...tableDdFilters,
        masteryLevel: _selected.key
      });
    } else if (comData === "compareBy") {
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

  return (
    <>
      <StyledCard>
        <Row type="flex" justify="start">
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <StyledH3>Standards Mastery By {idToName[tableDdFilters.compareBy]}</StyledH3>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <ControlDropDown
              data={masteryLevelDropDownData}
              by={masteryLevelDropDownData[0]}
              prefix="Mastery Level"
              selectCB={tableFilterDropDownCB}
              comData={"masteryLevel"}
            />
            <ControlDropDown
              data={compareByDropDownData}
              by={compareByDropDownData[0]}
              prefix="Compare By"
              selectCB={tableFilterDropDownCB}
              comData={"compareBy"}
            />
            <ControlDropDown
              data={dropDownFormat.analyseByDropDownData}
              by={dropDownFormat.analyseByDropDownData[0]}
              prefix="Analyse By"
              selectCB={tableFilterDropDownCB}
              comData={"analyseBy"}
            />
          </Col>
        </Row>
        <Row>
          <StyledTable columns={columnsData} dataSource={filteredTableData} rowKey={tableDdFilters.compareBy} />
        </Row>
      </StyledCard>
    </>
  );
};

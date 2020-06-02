import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "antd";
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
  analyseByToName
} from "../../utils/transformers";

import dropDownFormat from "../../static/json/dropDownFormat.json";
import { reportLinkColor } from "../../../../multipleAssessmentReport/common/utils/constants";

export const StandardsGradebookTable = ({
  filteredDenormalizedData,
  masteryScale,
  chartFilter,
  isCsvDownloading,
  role,
  filters = {},
  handleOnClickStandard,
  standardsData,
  location,
  pageTitle
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

  const tableData = useMemo(
    () => getTableData(filteredDenormalizedData, masteryScale, tableDdFilters.compareBy, tableDdFilters.masteryLevel),
    [filteredDenormalizedData, masteryScale, tableDdFilters]
  );

  const getCurrentStandard = (standardId, analyseBy) => {
    const currentStandard = standardsData.find(s => s.standardId === standardId);
    if (analyseBy === "score(%)") return `${currentStandard.score}%`;
    return currentStandard[analyseBy];
  };

  const getFilteredTableData = () =>
    next(tableData, arr => {
      arr.map((item, index) => {
        const tempArr = item.standardsInfo.filter((_item, index) => {
          if (chartFilter[_item.standardName] || isEmpty(chartFilter)) {
            return {
              ..._item
            };
          }
        });
        item.standardsInfo = tempArr;
      });
    });

  const filteredTableData = getFilteredTableData();

  const getDisplayValue = (item, _analyseBy, data, record) => {
    let printData;
    if (!item) {
      return "N/A";
    }

    if (_analyseBy === "score(%)") {
      printData = `${item.scorePercent}%`;
    } else if (_analyseBy === "rawScore") {
      printData = `${item.totalTotalScore.toFixed(2)}/${item.totalMaxScore}`;
    } else if (_analyseBy === "masteryLevel") {
      printData = item.masteryLevel;
    } else if (_analyseBy === "masteryScore") {
      printData = item.fm.toFixed(2);
    }
    return printData;
  };

  const renderStandardIdColumns = (index, _compareBy, _analyseBy, standardName, standardId) => (data, record) => {
    const tooltipText = record => (
      <div>
        <Row type="flex" justify="start">
          <Col className="custom-table-tooltip-key">{idToName[_compareBy]}: </Col>
          <Col className="custom-table-tooltip-value">{record.compareByLabel}</Col>
        </Row>
        <Row type="flex" justify="start">
          <Col className="custom-table-tooltip-key">Standard: </Col>
          <Col className="custom-table-tooltip-value">{record.standardsInfo[index]?.standardName}</Col>
        </Row>

        <Row type="flex" justify="start">
          <Col className="custom-table-tooltip-key">{analyseByToName[_analyseBy]}: </Col>
          {_analyseBy === "score(%)" ? (
            <Col className="custom-table-tooltip-value">
              {record.standardsInfo[index]?.[analyseByToKeyToRender[_analyseBy]]}%
            </Col>
          ) : null}
          {_analyseBy === "rawScore" ? (
            <Col className="custom-table-tooltip-value">
              {record.standardsInfo[index]?.totalTotalScore}/{record.standardsInfo[index]?.totalMaxScore}
            </Col>
          ) : null}
          {_analyseBy === "masteryLevel" ? (
            <Col className="custom-table-tooltip-value">{record.standardsInfo[index]?.masteryName}</Col>
          ) : null}
          {_analyseBy === "masteryScore" ? (
            <Col className="custom-table-tooltip-value">
              {(record.standardsInfo[index] || {})[analyseByToKeyToRender[_analyseBy]]}
            </Col>
          ) : null}
        </Row>
      </div>
    );

    const obj = {
      termId: filters.termId,
      studentId: record.studentId,
      standardId,
      profileId: filters.profileId
    };

    const getCellContents = props => {
      const { printData } = props;
      if (_compareBy === "studentId") {
        return (
          <div style={{ backgroundColor: record.standardsInfo?.[index]?.color }}>
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
      return <div style={{ backgroundColor: record.standardsInfo?.[index]?.color }}>{printData}</div>;
    };

    const printData = getDisplayValue(record.standardsInfo[index], _analyseBy, data, record);

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
        sorter: (a, b) => a.compareByLabel.toLowerCase().localeCompare(b.compareByLabel.toLowerCase()),
        render: (data, record) =>
          record.compareBy === "studentId" ? (
            <Link to={`/author/reports/student-profile-summary/student/${data}?termId=${filters?.termId}`}>
              {record.compareByLabel}
            </Link>
          ) : (
            record.compareByLabel
          )
      },
      {
        title: "Overall",
        dataIndex: analyseByToKeyToRender[tableDdFilters.analyseBy],
        key: analyseByToKeyToRender[tableDdFilters.analyseBy],
        width: 250,
        sorter: (a, b) => {
          const key = analyseByToKeyToRender[tableDdFilters.analyseBy];
          return a[key] - b[key];
        },
        render: (data, record) => (
          <Link
            style={{ color: reportLinkColor }}
            to={{
              pathname: `/author/classboard/${record.assignmentId}/${record.groupId}/test-activity/${
                record.testActivityId
              }`,
              state: {
                // this will be consumed in /src/client/author/Shared/Components/ClassBreadCrumb.js
                breadCrumb: [
                  {
                    title: "REPORTS",
                    to: "/author/reports"
                  },
                  {
                    title: pageTitle,
                    to: `${location.pathname}${location.search}`
                  }
                ]
              }
            }}
          >
            {tableDdFilters.analyseBy === "score(%)" ? `${data}%` : data}
          </Link>
        )
      },
      {
        title: "SIS ID",
        dataIndex: "sisId",
        key: "sisId",
        visibleOn: ["csv"]
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
              <span>{getCurrentStandard(item.standardId, tableDdFilters.analyseBy)}</span>
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
          <Col xs={24} sm={24} md={10} lg={10} xl={12}>
            <StyledH3>Standards Mastery By {idToName[tableDdFilters.compareBy]}</StyledH3>
          </Col>
          <Col xs={24} sm={24} md={14} lg={14} xl={12}>
            <Row className="control-dropdown-row">
              <StyledDropDownContainer xs={24} sm={24} md={11} lg={11} xl={8}>
                <ControlDropDown
                  data={compareByDropDownData}
                  by={compareByDropDownData[0]}
                  prefix="Compare By"
                  selectCB={tableFilterDropDownCB}
                  comData="compareBy"
                />
              </StyledDropDownContainer>
              <StyledDropDownContainer xs={24} sm={24} md={12} lg={12} xl={8}>
                <ControlDropDown
                  data={dropDownFormat.analyseByDropDownData}
                  by={dropDownFormat.analyseByDropDownData[0]}
                  prefix="Analyse By"
                  selectCB={tableFilterDropDownCB}
                  comData="analyseBy"
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

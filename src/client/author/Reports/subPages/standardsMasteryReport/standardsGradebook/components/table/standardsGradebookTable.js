/* eslint-disable array-callback-return */
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "antd";
import { isEmpty } from "lodash";
import styled from "styled-components";
import next from "immer";
import { withNamespaces } from "@edulastic/localization";

import { extraDesktopWidthMax } from "@edulastic/colors";
import { ControlDropDown } from "../../../../../common/components/widgets/controlDropDown";

import { StyledTable, StyledDropDownContainer } from "../styled";
import { StyledH3, StyledCard, ColoredCell } from "../../../../../common/styled";
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

const GradebookTable = styled(StyledTable)`
  .ant-table-layout-fixed {
    .ant-table-scroll {
      table tbody tr td {
        border-bottom: 1px solid #e9e9e9;
      }
      .ant-table-thead {
        th {
          white-space: nowrap;
        }
      }
      .ant-table-body {
        overflow-x: auto !important;
      }
    }
    .ant-table-fixed-left {
      .ant-table-thead {
        th {
          padding: 8px;
          color: #aaafb5;
          font-weight: 900;
          text-transform: uppercase;
          font-size: 10px;
          border: 0px;
          .ant-table-column-sorter {
            vertical-align: top;
          }
        }
      }
      .ant-table-tbody {
        td {
          padding: 10px 8px;
          font-size: 11px;
          color: #434b5d;
          font-weight: 600;
          @media (min-width: ${extraDesktopWidthMax}) {
            font-size: 14px;
          }
        }
      }
    }
  }
  .ant-table-tbody {
    td {
      min-width: 100px;
      padding: 0;
      &:nth-child(1) {
        padding: 0px 8px;
      }
    }
  }
`;

const StandardsGradebookTableComponent = ({
  filteredDenormalizedData,
  masteryScale,
  chartFilter,
  isCsvDownloading,
  role,
  filters = {},
  handleOnClickStandard,
  standardsData,
  location,
  pageTitle,
  t
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
      arr.map(item => {
        const tempArr = item.standardsInfo.filter(_item => {
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

  const getDisplayValue = (item, _analyseBy) => {
    let printData;
    if (!item) {
      return "N/A";
    }

    if (_analyseBy === "score(%)") {
      printData = `${item.scorePercent}%`;
    } else if (_analyseBy === "rawScore") {
      printData = `${item.totalTotalScore.toFixed(2)}/${item.totalMaxScore}`;
    } else if (_analyseBy === "masteryLevel") {
      printData = item.masteryName;
    } else if (_analyseBy === "masteryScore") {
      printData = item.fm.toFixed(2);
    }
    return printData;
  };

  const renderStandardIdColumns = (index, _compareBy, _analyseBy, standardName, standardId) => (data, record) => {
    const tooltipText = rec => (
      <div>
        <Row type="flex" justify="start">
          <Col className="custom-table-tooltip-key">{idToName[_compareBy]}: </Col>
          <Col className="custom-table-tooltip-value">{rec.compareByLabel}</Col>
        </Row>
        <Row type="flex" justify="start">
          <Col className="custom-table-tooltip-key">Standard: </Col>
          <Col className="custom-table-tooltip-value">{rec.standardsInfo[index]?.standardName}</Col>
        </Row>

        <Row type="flex" justify="start">
          <Col className="custom-table-tooltip-key">{analyseByToName[_analyseBy]}: </Col>
          {_analyseBy === "rawScore" ? (
            <Col className="custom-table-tooltip-value">
              {rec.standardsInfo[index]?.totalTotalScore}/{rec.standardsInfo[index]?.totalMaxScore}
            </Col>
          ) : (
            <Col className="custom-table-tooltip-value">
              {rec.standardsInfo[index]?.[analyseByToKeyToRender[_analyseBy]]}
              {_analyseBy === "score(%)" ? "%" : ""}
            </Col>
          )}
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
          <ColoredCell
            bgColor={record.standardsInfo?.[index]?.color}
            onClick={
              printData === "N/A" ? () => null : () => handleOnClickStandard(obj, standardName, record.compareByLabel)
            }
          >
            {printData}
          </ColoredCell>
        );
      }
      return <ColoredCell bgColor={record.standardsInfo[index].color}>{printData}</ColoredCell>;
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
        width: 150,
        fixed: "left",
        ellipsis: true,
        sorter: (a, b) => a.compareByLabel.toLowerCase().localeCompare(b.compareByLabel.toLowerCase()),
        render: (data, record) =>
          record.compareBy === "studentId" ? (
            <Link to={`/author/reports/student-profile-summary/student/${data}?termId=${filters?.termId}`}>
              {record.compareByLabel || t("common.anonymous")}
            </Link>
          ) : (
            record.compareByLabel
          )
      },
      {
        title: "Overall",
        dataIndex: analyseByToKeyToRender[tableDdFilters.analyseBy],
        key: analyseByToKeyToRender[tableDdFilters.analyseBy],
        align: "left",
        width: 150,
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
            {tableDdFilters.analyseBy === "score(%)"
              ? `${data}%`
              : tableDdFilters.analyseBy === "rawScore"
              ? `${data}/${record.totalMaxScore}`
              : data}
          </Link>
        )
      },
      {
        title: "SIS ID",
        dataIndex: "sisId",
        width: 150,
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
          align: "center",
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
            tableToRender={GradebookTable}
            onCsvConvert={onCsvConvert}
            isCsvDownloading={isCsvDownloading}
            scroll={{ x: "100%" }}
          />
        </Row>
      </StyledCard>
    </>
  );
};

export const StandardsGradebookTable = withNamespaces("student")(StandardsGradebookTableComponent);
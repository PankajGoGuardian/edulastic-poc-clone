import React, { useEffect, useState, useMemo } from "react";
import { Row, Col } from "antd";
import next from "immer";
import { StyledTable } from "../styled";
import { StyledH3 } from "../../../../common/styled";
import { CustomTableTooltip } from "../../../../common/components/customTableTooltip";
import { idToName, analyseByToName } from "../../util/transformers";
import styled from "styled-components";

export const PeerPerformanceTable = ({
  columns,
  dataSource,
  rowKey,
  analyseBy,
  compareBy,
  assessmentName,
  filter,
  bandInfo,
  role
}) => {
  const sortNumbers = key => (a, b) => {
    let _a = a[key] || 0;
    let _b = b[key] || 0;

    return _a - _b;
  };

  let _columns = [];

  const colorCell = (colorkey, columnKey) => (data, record) => {
    const tooltipText = record => () => {
      return (
        <div>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">Assessment Name: </Col>
            <Col className="custom-table-tooltip-value">{assessmentName}</Col>
          </Row>
          {_columns.map((column, index) => {
            return (
              <Row type="flex" justify="start" key={column.key}>
                <Col className="custom-table-tooltip-key">{column.title + ": "}</Col>
                <Col className="custom-table-tooltip-value">
                  {record[column.key]}
                  {record[column.key + "Percentage"] ? " (" + Math.abs(record[column.key + "Percentage"]) + "%)" : ""}
                </Col>
              </Row>
            );
          })}
        </div>
      );
    };

    const getCellContents = props => {
      let { printData, colorKey } = props;
      return <div style={{ backgroundColor: record[colorKey] }}>{printData}</div>;
    };

    let printData = data;
    if (analyseBy === "score(%)") {
      printData = printData + "%";
    } else if (analyseBy === "proficiencyBand" || analyseBy === "aboveBelowStandard") {
      printData = data + " (" + Math.abs(record[columnKey + "Percentage"]) + "%)";
    }

    return (
      <CustomTableTooltip
        printData={printData}
        colorKey={colorkey}
        placement="top"
        title={tooltipText(record)}
        getCellContents={getCellContents}
      />
    );
  };

  let colouredCellsNo = 0;

  _columns = next(columns, arr => {
    if (analyseBy === "score(%)" || analyseBy === "rawScore") {
      arr[arr.length - 1].render = colorCell("fill");
      arr[arr.length - 2].render = colorCell("dFill");
      colouredCellsNo = 2;
    } else if (analyseBy === "aboveBelowStandard") {
      arr[arr.length - 1].render = colorCell("fill_0", "aboveStandard");
      arr[arr.length - 2].render = colorCell("fill_1", "belowStandard");
      colouredCellsNo = 2;
    } else {
      bandInfo.sort((a, b) => {
        return a.threshold - b.threshold;
      });
      for (let [index, value] of bandInfo.entries()) {
        arr.push({
          title: value.name,
          dataIndex: value.name,
          key: value.name,
          width: 250,
          render: colorCell("fill_" + index, value.name)
        });
      }
      colouredCellsNo = bandInfo.length;
    }
    arr[arr.length - 1].sorter = sortNumbers(arr[arr.length - 1].key);
    if (role === "teacher" && compareBy === "groupId") {
      arr.splice(1, 2);
    }
  });

  const tableData = useMemo(() => {
    let arr = dataSource.filter((item, index) => {
      if (filter[item[compareBy]] || Object.keys(filter).length === 0) {
        return true;
      }
      return false;
    });
    return arr;
  }, [dataSource, filter]);

  return (
    <div>
      <StyledDiv>
        <StyledH3>
          Assessment Statistics By {idToName[compareBy]} | {assessmentName}
        </StyledH3>
      </StyledDiv>
      <StyledTable colouredCellsNo={colouredCellsNo} columns={_columns} dataSource={tableData} rowKey={rowKey} />
    </div>
  );
};

const StyledDiv = styled.div`
  padding: 10px;
`;

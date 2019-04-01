import React, { useEffect, useState, useMemo } from "react";
import { Row, Col } from "antd";
import next from "immer";
import { StyledTable } from "../styled";
import { CustomTableTooltip } from "../../../../common/components/customTableTooltip";
import { idToName, analyseByToName } from "../../util/parser";

export const PeerPerformanceTable = ({ columns, dataSource, rowKey, analyseBy, compareBy, assessmentName, filter }) => {
  const sortNumbers = key => (a, b) => {
    let _a = a[key] || 0;
    let _b = b[key] || 0;

    return _a - _b;
  };

  const colorCell = key => (data, record) => {
    const tooltipText = record => () => {
      return (
        <div>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">Assessment Name: </Col>
            <Col className="custom-table-tooltip-value">{assessmentName}</Col>
          </Row>
          {columns.map((data, index) => {
            return (
              <Row type="flex" justify="start" key={data.key}>
                <Col className="custom-table-tooltip-key">{data.title + ": "}</Col>
                <Col className="custom-table-tooltip-value">{record[data.key]}</Col>
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

    return (
      <CustomTableTooltip
        printData={data}
        colorKey={key}
        placement="top"
        title={tooltipText(record)}
        getCellContents={getCellContents}
      />
    );
  };

  let tableClass = null;

  const _columns = next(columns, obj => {
    obj[obj.length - 1].sorter = sortNumbers(obj[obj.length - 1].key);
    if (analyseBy === "score(%)" || analyseBy === "rawScore" || analyseBy === "aboveBelowStandard") {
      obj[obj.length - 1].render = colorCell("fill");
      obj[obj.length - 2].render = colorCell("dFill");
      tableClass = "pad-0-2";
    } else {
      obj[obj.length - 1].render = colorCell("fill");
      obj[obj.length - 2].render = colorCell();
      obj[obj.length - 3].render = colorCell();
      tableClass = "pad-0-3";
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

  return <StyledTable className={tableClass} columns={_columns} dataSource={tableData} rowKey={rowKey} />;
};

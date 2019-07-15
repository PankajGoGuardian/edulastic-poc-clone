import React, { useEffect, useState, useMemo } from "react";
import { Row, Col } from "antd";
import { get, keyBy, isEmpty } from "lodash";
import next from "immer";

import { roleuser } from "@edulastic/constants";
import { getHSLFromRange1 } from "../../../../../common/util";
import { CustomTableTooltip } from "../../../../../common/components/customTableTooltip";
import { StyledTable } from "../styled";
import columns from "../../static/json/tableColumns.json";

const comparedByToToolTipLabel = {
  comparedBySchool: {
    name: "School Name",
    type: "School (% Score)",
    all: "All Schools (% Score)",
    nameKey: "schoolName"
  },
  comparedByTeacher: {
    name: "Teacher Name",
    type: "Teacher (% Score)",
    all: "All Teachers (% Score)",
    nameKey: "teacherName"
  },
  comparedByClass: { name: "Class Name", type: "Class (% Score)", all: "All Classes (% Score)", nameKey: "className" }
};

const compareByToPluralName = {
  schoolId: "Schools",
  teacherId: "Teachers",
  groupId: "Classes"
};

const sortNumbers = (compareByType, index, key) => (a, b) => {
  let _a = a[compareByType][index][key] || 0;
  let _b = b[compareByType][index][key] || 0;

  return _a - _b;
};

export const QuestionAnalysisTable = ({ tableData, compareBy, filter, role }) => {
  const colouredCells = (compareByType, index) => (text, record) => {
    const tooltipText = (_compareByType, _record, _index) => {
      return (
        <div>
          <Row type="flex" justify="center">
            <Col className="custom-table-tooltip-value">{_record.qLabel}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">{comparedByToToolTipLabel[_compareByType].name}: </Col>
            <Col className="custom-table-tooltip-value">
              {_record[_compareByType][_index][comparedByToToolTipLabel[_compareByType].nameKey]}
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">{comparedByToToolTipLabel[_compareByType].type}: </Col>
            <Col className="custom-table-tooltip-value">{_record[_compareByType][_index].avgPerformance}%</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">{comparedByToToolTipLabel[_compareByType].all}: </Col>
            <Col className="custom-table-tooltip-value">{_record.avgPerformance}%</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">District (% Score): </Col>
            <Col className="custom-table-tooltip-value">{_record.districtAvg}%</Col>
          </Row>
        </div>
      );
    };

    const getCellContents = props => {
      let { printData } = props;
      return <div style={{ backgroundColor: getHSLFromRange1(printData) }}>{printData + "%"}</div>;
    };

    return (
      <CustomTableTooltip
        printData={record[compareByType][index].avgPerformance}
        placement="top"
        title={tooltipText(compareByType, record, index)}
        getCellContents={getCellContents}
      />
    );
  };

  const _columns = next(columns, rawColumns => {
    rawColumns[0].sorter = (a, b) => {
      if (a.qLabel && b.qLabel) {
        let _a = parseInt(a.qLabel.substring(1));
        let _b = parseInt(b.qLabel.substring(1));
        return _a - _b;
      } else {
        return 0;
      }
    };
    rawColumns[1].render = (text, record, _index) => {
      if (Array.isArray(text)) {
        return text.join(", ");
      } else {
        return text;
      }
    };
    rawColumns[2].render = (text, record, _index) => {
      return text.toFixed(2);
    };
    rawColumns[3].render = (text, record, _index) => {
      return text + "%";
    };

    if (roleuser.TEACHER === role) {
      rawColumns.push({
        title: `All ${compareByToPluralName[compareBy]} (Score %)`,
        dataIndex: "avgPerformance",
        key: "avgPerformance",
        width: 100,
        render: (text, record, _index) => {
          return text + "%";
        }
      });
    }
    if (!tableData.length) {
      return;
    }
    if (compareBy === "schoolId") {
      for (let [index, item] of tableData[0].comparedBySchool.entries()) {
        const col = {
          title: item.schoolName,
          dataIndex: item.schoolId,
          key: item.schoolId,
          width: 150,
          render: colouredCells("comparedBySchool", index),
          sorter: sortNumbers("comparedBySchool", index, "avgPerformance")
        };
        rawColumns.push(col);
      }
    } else if (compareBy === "teacherId") {
      for (let [index, item] of tableData[0].comparedByTeacher.entries()) {
        const col = {
          title: item.teacherName,
          dataIndex: item.teacherId,
          key: item.teacherId,
          width: 150,
          render: colouredCells("comparedByTeacher", index),
          sorter: sortNumbers("comparedByTeacher", index, "avgPerformance")
        };
        rawColumns.push(col);
      }
    } else if (compareBy === "groupId") {
      for (let [index, item] of tableData[0].comparedByClass.entries()) {
        const col = {
          title: item.className,
          dataIndex: item.groupId,
          key: item.groupId,
          width: 150,
          render: colouredCells("comparedByClass", index),
          sorter: sortNumbers("comparedByClass", index, "avgPerformance")
        };
        rawColumns.push(col);
      }
    }
  });

  const _tableData = useMemo(() => {
    const len = Object.keys(filter).length;
    return tableData.filter(item => {
      if (filter[item["qLabel"]] || len === 0) {
        return true;
      } else {
        return false;
      }
    });
  }, [filter]);

  return (
    <StyledTable
      columns={_columns}
      dataSource={_tableData}
      rowKey={"questionId"}
      colorCellStart={role === roleuser.TEACHER ? 6 : 5}
    />
  );
};

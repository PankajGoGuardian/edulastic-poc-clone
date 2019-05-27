import React from "react";
import next from "immer";
import styled from "styled-components";
import { Icon } from "antd";
import { StyledTable } from "../styled";
import tableColumnsData from "../utils/tableColumnData.json";

const Mastery = props => {
  const { className, children, mastery } = props;
  return (
    <div className={className} style={{ backgroundColor: mastery ? mastery.color : "" }}>
      {children}
    </div>
  );
};

const StyledMastery = styled(Mastery)`
  height: 30px;
  font-weight: 900;
  border: none;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StandardTableContainer = props => {
  const { dataSource, standardsMap, assignmentMasteryMap, columnsFlags } = props;
  const columns = next(tableColumnsData.standardsTable, arr => {
    arr[0].render = (data, record, index) => {
      return standardsMap[data._id].identifier;
    };
    arr[1].render = (data, record, index) => {
      const len = record.question ? record.question.length : 0;
      return data.reduce(
        (total, item, index) => (index === len - 1 ? total + ("Q" + item) : total + ("Q" + item) + ", "),
        ""
      );
    };
    arr[2].render = (data, record, index) => {
      return `${data}/${record.maxScore}`;
    };
    arr[3].render = (data, record, index) => {
      return data + "%";
    };
    arr[4].render = (data, record, index) => {
      return <StyledMastery mastery={assignmentMasteryMap[data]}>{data}</StyledMastery>;
    };
  });
  let _columns = [columns[0], columns[1], columns[2]];
  if (columnsFlags.standardsPerformance) {
    _columns = [..._columns, columns[3]];
  }

  if (columnsFlags.masteryStatus) {
    _columns = [..._columns, columns[4]];
  }

  return (
    <StyledTable
      columns={_columns}
      dataSource={dataSource}
      rowKey={"standardId"}
      pagination={{ disabled: true, pageSize: 100 }}
    />
  );
};

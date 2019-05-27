import React from "react";
import next from "immer";
import styled from "styled-components";
import { Icon } from "antd";
import { StyledTable } from "../styled";
import tableColumnsData from "../utils/tableColumnData.json";

const Check = props => {
  const { className, children, question } = props;
  return (
    <span className={className}>
      {children}
      {question ? <Icon type="check" style={{ color: "green" }} /> : <Icon type="close" style={{ color: "red" }} />}
    </span>
  );
};

const StyledCheck = styled(Check)`
  i {
    margin-left: 10px;
  }
`;

export const QuestionTableContainer = props => {
  const { dataSource, columnsFlags } = props;
  const columns = next(tableColumnsData.questionTable, arr => {
    arr[0].render = (data, record, index) => {
      return <StyledCheck question={data}>{record.questionNumber}</StyledCheck>;
    };
    arr[1].render = (data, record, index) => {
      return data.join(", ");
    };
    arr[2].render = (data, record, index) => {
      return data.join(", ");
    };
  });

  let _columns = [...columns];
  if (!columnsFlags.questionPerformance) {
    _columns[0] = null;
  }

  if (!columnsFlags.studentResponse) {
    _columns[1] = null;
  }

  if (!columnsFlags.correctAnswer) {
    _columns[2] = null;
  }

  _columns = _columns.filter((item, index) => (item ? true : false));

  return (
    <StyledTable
      columns={_columns}
      dataSource={dataSource}
      rowKey={"_id"}
      pagination={{ disabled: true, pageSize: 100 }}
    />
  );
};

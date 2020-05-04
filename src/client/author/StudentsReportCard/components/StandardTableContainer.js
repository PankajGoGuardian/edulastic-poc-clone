import React from "react";
import next from "immer";
import styled from "styled-components";
import { Icon } from "antd";
import { lightGreen5, themeColorLighter, greenDark } from "@edulastic/colors";
import { StyledTable } from "./styles";
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
  border: none;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
`;

const StyledDomain = styled.div`
  background-color: #c0e8d4;
  border-radius: 5px;
  padding: 5px;
  font-size: 10px;
  width: 100px;
  margin: auto;
`;

export const StandardTableContainer = props => {
  const { dataSource, assignmentMasteryMap, columnsFlags } = props;
  //column[0] = domains,
  //column[1] = standards
  //column[2] = question
  //column[3] = score
  //column[4] = performance
  //column[5] = masterySummary
  const columns = next(tableColumnsData.standardsTable, arr => {
    arr[0].render = (data, record, index) => {
      return (
        <StyledDomain>
          <span style={{ color: greenDark }}>{data}</span>
        </StyledDomain>
      );
    };
    arr[1].render = (data, record, index) => (
      <span data-cy={data} style={{ fontWeight: "bold" }}>
        {data}
      </span>
    );
    arr[2].render = (data, record, index) => {
      return data.map((q, i) => (
        <>
          <span key={q} style={{ color: themeColorLighter }}>
            Q{q}
          </span>
          {i !== data.length - 1 && ", "}
        </>
      ));
    };
    arr[3].render = (data, record, index) => {
      return `${data}/${record.maxScore}`;
    };
    arr[4].render = (data, record, index) => {
      return data + "%";
    };
    arr[5].render = (data, record, index) => {
      return <StyledMastery mastery={assignmentMasteryMap[data]}>{data}</StyledMastery>;
    };
  });

  //this checking which column to display/hide as per options selected
  let _columns = [columns[0], columns[1], columns[2]];
  if (columnsFlags.standardsPerformance) {
    _columns = [..._columns, columns[3], columns[4]];
  }

  if (columnsFlags.masteryStatus) {
    _columns = [..._columns, columns[5]];
  }

  return (
    <StyledTable
      data-cy="report-standard-table"
      columns={_columns}
      dataSource={dataSource}
      rowKey={"standardId"}
      pagination={false}
    />
  );
};

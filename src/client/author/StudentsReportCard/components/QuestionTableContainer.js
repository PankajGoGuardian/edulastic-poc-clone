import React from "react";
import next from "immer";
import styled from "styled-components";
import { Icon } from "antd";
import { StyledTable } from "./styles";
import tableColumnsData from "../utils/tableColumnData.json";
import { MathFormulaDisplay } from "@edulastic/common";

const Check = props => {
  const {
    className,
    children,
    record: { correct, partialCorrect }
  } = props;
  let IconComponent = <Icon type="close" style={{ color: "red" }} />;
  if (correct) {
    IconComponent = <Icon type="check" style={{ color: "green" }} />;
  } else if (partialCorrect) {
    IconComponent = <Icon type="check" style={{ color: "orange" }} />;
  }

  return (
    <span className={className}>
      {children}
      {IconComponent}
    </span>
  );
};

const StyledCheck = styled(Check)`
  i {
    margin-left: 29px;
  }
`;

export const QuestionTableContainer = props => {
  const { dataSource, columnsFlags } = props;

  //column[0] = question,
  //column[1] = yourAnswer
  //column[2] = correctAnswer
  //column[3] = score
  //column[4] = maxScore
  let columns = next(tableColumnsData.questionTable, arr => {
    arr[0].render = (data, record, index) => {
      return <StyledCheck record={record}>{data}</StyledCheck>;
    };
    arr[1].render = (data, record, index) => {
      return data.map(yAnswer => {
        let content = yAnswer;
        if (yAnswer === "TEI") {
          content = "<span style='font-size:16px;font-weight: 500;'>#</span>";
        } else if (yAnswer === "Constructed Response") {
          content = "<span style='font-size:16px;font-weight: 500;'>*</span>";
        }
        return (
          <MathFormulaDisplay
            style={{ marginBottom: "10px", minHeight: "22px" }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      });
    };
    arr[2].render = (data, record, index) => {
      return data.map(cAnswer => {
        let content = cAnswer;
        if (cAnswer === "TEI") {
          content = "<span style='font-size:16px;font-weight: 500;'>#</span>";
        } else if (cAnswer === "Constructed Response") {
          content = "<span style='font-size:16px;font-weight: 500;'>*</span>";
        }
        return (
          <MathFormulaDisplay
            style={{ marginBottom: "10px", minHeight: "22px" }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      });
    };
  });

  //this is checking which columns to display/hide
  columns = columns.filter((item, index) => {
    if (!columnsFlags.questionPerformance && ["score", "maxScore"].includes(item.key)) {
      return false;
    }

    if (!columnsFlags.studentResponse && item.key === "yourAnswer") {
      return false;
    }

    if (!columnsFlags.correctAnswer && item.key === "correctAnswer") {
      return false;
    }
    return true;
  });

  return (
    <StyledTable
      data-cy="report-question-table"
      columns={columns}
      dataSource={dataSource}
      rowKey={"_id"}
      pagination={false}
    />
  );
};

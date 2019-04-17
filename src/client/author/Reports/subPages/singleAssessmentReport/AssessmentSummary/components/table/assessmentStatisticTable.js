import React, { useState, useEffect, useRef, useMemo } from "react";
import { Row, Col } from "antd";
import { groupBy, cloneDeep } from "lodash";
import Moment from "moment";
import next from "immer";
import { StyledTable } from "../styled";

import { getStandardDeviation, getVariance } from "../../../../../common/util";
import { StyledControlDropDown, StyledH3 } from "../../../../../common/styled";

import columnData from "../../static/json/tableColumns.json";

export const AssessmentStatisticTable = props => {
  const [tableType, setTableType] = useState({ key: "school", title: "School" });

  if (props.role === "teacher" && tableType.key != "class") {
    let o = { key: "class", title: "Class" };
    setTableType(o);
  }

  const updateTable = (type, data) => {
    let arr;
    let hMap;
    if (type === "school") {
      hMap = groupBy(data, "schoolId");
    } else if (type === "teacher") {
      hMap = groupBy(data, "teacherId");
    } else if (type === "class") {
      hMap = groupBy(data, "groupId");
    }

    arr = Object.keys(hMap).map((key, index) => {
      let data = hMap[key];
      let obj = { ...data[0] };

      let maxAssessmentDate = 0,
        sumTotalScore = 0,
        sumTotalMaxScore = 0,
        sumSampleCount = 0,
        sumStudentsAbsent = 0,
        sumStudentsAssigned = 0,
        sumStudentsGraded = 0,
        minScore = Infinity,
        maxScore = -Infinity,
        concatScores = [];

      for (let item of data) {
        let {
          totalScore,
          totalMaxScore,
          sampleCount,
          assessmentDate,
          studentsAbsent,
          studentsAssigned,
          studentsGraded,
          minScore: _minScore,
          maxScore: _maxScore,
          scores
        } = item;

        sumTotalScore += totalScore;
        sumTotalMaxScore += totalMaxScore;

        sumSampleCount += sampleCount;
        if (maxAssessmentDate < assessmentDate) maxAssessmentDate = assessmentDate;

        sumStudentsAbsent += studentsAbsent;
        sumStudentsAssigned += studentsAssigned;
        sumStudentsGraded += studentsGraded;
        minScore = Math.min(_minScore, minScore);
        maxScore = Math.max(_maxScore, maxScore);

        concatScores = concatScores.concat(scores);
      }

      let scoreVariance = getVariance(concatScores);

      let result = {
        ...obj,
        avgStudentScore: Number(((sumTotalScore / sumTotalMaxScore) * 100).toFixed(0)),
        scoreVariance: scoreVariance.toFixed(2),
        scoreStdDeviation: getStandardDeviation(scoreVariance).toFixed(2),
        avgScore: (sumTotalScore / sumSampleCount).toFixed(2),
        assessmentDate: Moment(maxAssessmentDate).format("MMMM D, YYYY"),
        studentsAbsent: sumStudentsAbsent,
        studentsAssigned: sumStudentsAssigned,
        studentsGraded: sumStudentsGraded,
        minScore: minScore.toFixed(2),
        maxScore: maxScore.toFixed(2)
      };

      return result;
    });
    return arr;
  };

  const sortAlphabets = key => (a, b) => {
    if (a[key] < b[key]) {
      return -1;
    } else if (a[key] > b[key]) {
      return 1;
    }
    return 0;
  };

  const sortNumbers = key => (a, b) => {
    let _a = a[key] || 0;
    let _b = b[key] || 0;
    return _a - _b;
  };

  const getColumns = tableType => {
    return next(columnData[tableType.key].columns, columns => {
      if (props.role === "teacher") {
        columns.splice(0, 1);
        columns[0].sorter = sortAlphabets("groupName");
      } else {
        columns[0].sorter = sortAlphabets("schoolId");
      }

      if (tableType.key === "school" || props.role === "teacher") {
        columns[1].sorter = sortNumbers("avgStudentScore");
        columns[1].render = (text, record, index) => {
          return text + "%";
        };
      } else {
        columns[2].sorter = sortNumbers("avgStudentScore");
        columns[2].render = (text, record, index) => {
          return text + "%";
        };
      }
    });
  };

  const table = useMemo(() => {
    if (props.data) {
      let tt = tableType;
      if (props.role === "teacher") {
        let o = { key: "class", title: "Class" };
        tt = o;
      }
      return {
        columns: getColumns(tt),
        tableData: updateTable(tt.key, props.data)
      };
    }
    return {
      columns: [],
      tableData: []
    };
  }, [props.data, tableType]);

  const updateTableCB = (event, selected, comData) => {
    setTableType(selected);
  };

  const dropDownData = [
    { key: "school", title: "School" },
    { key: "teacher", title: "Teacher" },
    { key: "class", title: "Class" }
  ];

  return (
    <div className={`${props.className}`}>
      <Row type="flex" justify="start" className="top-area">
        <Col className="top-area-col table-title">
          <StyledH3>
            Assessment Statistics of {props.name} by <span className="stats-grouped-by">{tableType.title}</span>
          </StyledH3>
        </Col>
        {props.role !== "teacher" ? (
          <Col className="top-area-col control-area">
            <StyledControlDropDown prefix={"Compare by"} by={tableType} updateCB={updateTableCB} data={dropDownData} />
          </Col>
        ) : (
          ""
        )}
      </Row>
      <StyledTable columns={table.columns} dataSource={table.tableData} rowKey={"groupId"} />
    </div>
  );
};

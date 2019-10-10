import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import { groupBy } from "lodash";
import next from "immer";
import { StyledTable } from "../styled";

import { getStandardDeviation, getVariance, downloadCSV, formatDate } from "../../../../../common/util";
import { StyledH3 } from "../../../../../common/styled";
import { ControlDropDown } from "../../../../../common/components/widgets/controlDropDown";
import PrintableTable from "../../../../../common/components/tables/PrintableTable";
import CsvTable from "../../../../../common/components/tables/CsvTable";

import columnData from "../../static/json/tableColumns.json";

export const AssessmentStatisticTable = props => {
  const [tableType, setTableType] = useState({ key: "school", title: "School" });

  if (props.role === "teacher" && tableType.key !== "class") {
    const o = { key: "class", title: "Class" };
    setTableType(o);
  }

  const updateTable = (type, _data) => {
    let hMap;
    if (type === "school") {
      hMap = groupBy(_data, "schoolId");
    } else if (type === "teacher") {
      hMap = groupBy(_data, "teacherId");
    } else if (type === "class") {
      hMap = groupBy(_data, o => `${o.assignmentId}_${o.groupId}`);
    }

    const arr = Object.keys(hMap).map((key, index) => {
      const data = hMap[key];
      const obj = { ...data[0] };

      let maxAssessmentDate = 0;
      let sumTotalScore = 0;
      let sumTotalMaxScore = 0;
      let sumSampleCount = 0;
      let sumStudentsAbsent = 0;
      let sumStudentsAssigned = 0;
      let sumStudentsGraded = 0;
      let minScore = Infinity;
      let maxScore = -Infinity;
      let concatScores = [];

      for (const item of data) {
        const {
          totalScore = 0,
          totalMaxScore = 0,
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

      const scoreVariance = getVariance(concatScores);
      let avgStudentScore = 0;
      if (sumTotalMaxScore) {
        avgStudentScore = Number(((sumTotalScore / sumTotalMaxScore) * 100).toFixed(0));
      }
      let avgScore = 0;
      if (sumTotalScore) {
        avgScore = (sumTotalScore / (sumSampleCount - (sumStudentsAbsent || 0))).toFixed(2);
      }
      const result = {
        ...obj,
        avgStudentScore,
        scoreVariance: scoreVariance.toFixed(2),
        scoreStdDeviation: getStandardDeviation(scoreVariance).toFixed(2),
        avgScore,
        assessmentDate: formatDate(maxAssessmentDate),
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

  const onCsvConvert = data => downloadCSV(`${tableType.title} Level Performance Report.csv`, data);

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
          <StyledControlDropDownContainer className="top-area-col control-area">
            <ControlDropDown prefix={"Compare by"} by={tableType} selectCB={updateTableCB} data={dropDownData} />
          </StyledControlDropDownContainer>
        ) : (
          ""
        )}
      </Row>
      <CsvTable
        isPrinting={props.isPrinting}
        component={StyledTable}
        columns={table.columns}
        dataSource={table.tableData}
        rowKey={"groupId"}
        onCsvConvert={onCsvConvert}
        isCsvDownloading={props.isCsvDownloading}
        tableToRender={PrintableTable}
      />
    </div>
  );
};

const StyledControlDropDownContainer = styled(Col)`
  display: flex;
  justify-content: flex-end;
`;

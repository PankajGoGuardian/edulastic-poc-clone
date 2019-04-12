import React, { Component } from "react";
import PropTypes from "prop-types";
import { round } from "lodash";
import { lightGreenSecondary } from "@edulastic/colors";
import QuestionScore from "../QuestionScore/QuestionScore";
import { StyledCard, TableData, StyledDivMid, StyledText, TableTitle, StudentsTitle, ScoreTitle } from "./styled";
import InfoIcon from "../../Assets/info.svg";

function getDataForTable(data) {
  let dataSource;
  if (data && data.length !== 0) {
    dataSource = data
      .filter(std => std.status === "submitted")
      .map((student, index) => {
        const students = [];
        const rowIndex = index;
        const studentInfo = {
          studentId: student.studentId,
          studentName: student.studentName
        };
        const testActivityId = student.testActivityId ? student.testActivityId : null;
        student.questionActivities.forEach((question, index1) => {
          const key = `Q${index1}`;
          question.key = key;
          students[key] = question;
          question.colIndex = index1;
          question.id = question._id;
          question.rowIndex = rowIndex;
          question.studentId = student.studentId;
          question.testActivityId = testActivityId;
          question.score = Number.isNaN(question.score) ? 0 : question.score;
        });
        students.questions = student.questionActivities.length;
        students.students = studentInfo;
        students.score = {
          score: Number.isNaN(student.score) ? 0 : student.score,
          maxScore: student.maxScore
        };
        return students;
      });
  } else {
    dataSource = [];
  }

  return dataSource;
}

class ScoreTable extends Component {
  static propTypes = {
    showQuestionModal: PropTypes.func.isRequired,
    testActivity: PropTypes.array
  };

  static defaultProps = {
    testActivity: {}
  };

  constructor() {
    super();
    this.state = {
      columnData: []
    };
  }

  static getDerivedStateFromProps(props) {
    const { testActivity } = props;
    const columnData = getDataForTable(testActivity);
    return { columnData };
  }

  getColumnsForTable = length => {
    const { showQuestionModal } = this.props;
    const columns = [
      {
        title: <TableTitle>Questions & Standards</TableTitle>,
        // TODO: find another way to determine fixed column by questions length
        fixed: window.innerWidth - 500 / length < 160,
        width: 230,
        children: [
          {
            key: "students",
            title: <StudentsTitle>students</StudentsTitle>,
            dataIndex: "students",
            className: "th-border-bottom",
            render: record => (
              <StyledDivMid style={{ textAlign: "left", paddingLeft: 15 }}>{record.studentName}</StyledDivMid>
            ),
            sorter: (a, b) => (a.students.studentName.toUpperCase() > b.students.studentName.toUpperCase() ? 1 : -1)
          },
          {
            key: "score",
            title: <ScoreTitle>score</ScoreTitle>,
            className: "th-border-bottom",
            dataIndex: "score",
            render: record => {
              const { score = 0, maxScore = 0 } = record;
              const percent = maxScore === 0 ? "-" : `${((100 * score) / maxScore).toFixed(0)}%`;
              return (
                <StyledDivMid style={{ textAlign: "left", paddingLeft: 25 }}>
                  <StyledText color={lightGreenSecondary}>{percent}</StyledText>({round(score, 1)} / {maxScore})
                </StyledDivMid>
              );
            },
            onFilter: (value, record) => record.score.indexOf(value) === 0,
            sorter: (a, b) => (a.score.score > b.score.score ? 1 : -1)
          }
        ]
      }
    ];

    for (let index = 0; index < length; index++) {
      let successAnswer = 0;
      const { testActivity: students } = this.props;
      const key = `Q${index}`;
      const title = (
        <StyledDivMid>
          Q{index + 1}
          <img src={InfoIcon} alt="help" />
        </StyledDivMid>
      );
      students.forEach(student => {
        if (student && student.questionActivities[index].correct) successAnswer++;
      });
      const questionAvarageScore = (
        <StyledDivMid>
          <StyledText color={lightGreenSecondary}>{`${Math.round((successAnswer / length) * 100)}%`}</StyledText>(
          {successAnswer}/ {length})
        </StyledDivMid>
      );

      const column = {
        title,
        children: [
          {
            key,
            dataIndex: key,
            title: questionAvarageScore,
            className: "sub-thead-th th-border-bottom",
            render: record => {
              const { columnData: tableData } = this.state;
              const isTest = record && record.testActivityId;

              const cell = (
                <QuestionScore
                  question={record}
                  tableData={tableData}
                  showQuestionModal={showQuestionModal}
                  isTest={isTest}
                />
              );
              return cell;
            }
          }
        ],
        sorter: (a, b) => a[key].score - b[key].score,
        sortDirections: ["descend"]
      };

      columns.push(column);
    }
    return columns;
  };

  render() {
    let columnInfo = [];
    const { columnData } = this.state;
    const { testActivity } = this.props;
    const columnsLength = testActivity && testActivity.length !== 0 ? testActivity[0].questionActivities.length : 0;
    if (columnsLength) {
      columnInfo = this.getColumnsForTable(columnsLength);
    }

    return (
      <StyledCard bordered={false}>
        <TableData
          pagination={false}
          columns={columnInfo}
          dataSource={columnData}
          scroll={{ x: true }}
          rowKey={(record, i) => i}
        />
      </StyledCard>
    );
  }
}

export default ScoreTable;

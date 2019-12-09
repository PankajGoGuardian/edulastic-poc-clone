import React, { Component } from "react";
import PropTypes from "prop-types";
import { round } from "lodash";
import { greenThird } from "@edulastic/colors";
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
          studentName: student.studentName,
          fakeName: student.fakeName,
          icon: student.icon,
          color: student.color
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
    testActivity: PropTypes.array,
    isPresentationMode: PropTypes.bool
  };

  static defaultProps = {
    testActivity: {},
    isPresentationMode: false
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

  getColumnsForTable = (length, submittedLength, showColumnsCount) => {
    const { showQuestionModal, isPresentationMode } = this.props;

    const columns = [
      {
        title: <TableTitle>Score Grid</TableTitle>,
        // Make score grid column fixed when more than 10 questions data exist
        fixed: length > showColumnsCount ? "left" : false,
        width: 300,
        children: [
          {
            key: "students",
            title: <StudentsTitle>students</StudentsTitle>,
            dataIndex: "students",
            className: "th-border-bottom",
            width: 200,
            render: record => (
              <StyledDivMid className="name-col">
                {isPresentationMode ? record.fakeName : record.studentName}
              </StyledDivMid>
            ),
            sorter: (a, b) => (a.students.studentName.toUpperCase() > b.students.studentName.toUpperCase() ? 1 : -1)
          },
          {
            key: "score",
            title: <ScoreTitle>score</ScoreTitle>,
            className: "th-border-bottom score-title",
            dataIndex: "score",
            width: 100,
            render: record => {
              const { score = 0, maxScore = 0 } = record;
              const percent = maxScore === 0 ? "-" : `${((100 * score) / maxScore).toFixed(0)}%`;
              return (
                <StyledDivMid>
                  <StyledText color={greenThird}>{percent}</StyledText> ({round(score, 1)}/{maxScore})
                </StyledDivMid>
              );
            },
            onFilter: (value, record) => record.score.indexOf(value) === 0,
            sorter: (a, b) => (a.score.score > b.score.score ? 1 : -1),
            sortDirections: ["descend", "ascend"]
          }
        ]
      }
    ];

    for (let index = 0; index < length; index++) {
      let successScore = 0;
      let num = 0;
      const { testActivity: students } = this.props;
      const key = `Q${index}`;
      const qids = students[0].questionActivities[index].qids;
      const title = <StyledDivMid>{students[0].questionActivities[index].barLabel}</StyledDivMid>;

      students
        .filter(x => x.status === "submitted")
        .forEach(student => {
          if (student && !student.questionActivities[index].notStarted) {
            successScore += student.questionActivities[index].score / student.questionActivities[index].maxScore;
            num++;
          }
        });
      const averageScore = successScore;
      const questionAvarageScore = (
        <StyledDivMid>
          <StyledText color={greenThird}>
            {`${submittedLength > 0 ? round((averageScore / submittedLength) * 100, 1) || 0 : 0}%`}
          </StyledText>
          <div style={{ fontSize: "12px", lineHeight: "14px" }}>
            ({round(averageScore, 2) || 0}/{submittedLength})
          </div>
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
        sortDirections: ["descend", "ascend"]
      };

      columns.push(column);
    }
    return columns;
  };

  render() {
    let columnInfo = [];
    const { columnData } = this.state;
    const { testActivity, windowWidth } = this.props;
    const columnsLength = testActivity && testActivity.length !== 0 ? testActivity[0].questionActivities.length : 0;
    const submittedLength = testActivity.filter(x => x.status === "submitted").length;
    const showColumnsCount = windowWidth < 1366 ? 5 : windowWidth < 1600 ? 7 : 10;
    if (columnsLength) {
      columnInfo = this.getColumnsForTable(columnsLength, submittedLength, showColumnsCount);
    }
    const scrollX = columnsLength * 100 + 300;
    const scrollY = window.innerHeight - 360;

    return (
      <StyledCard bordered={false}>
        <TableData
          pagination={false}
          columns={columnInfo}
          dataSource={columnData}
          //Columns length will be the number of questions
          //Column data length will be number of students
          scroll={{
            x: columnsLength > showColumnsCount ? scrollX : false,
            y: columnData.length > 6 ? scrollY : false
          }}
          rowKey={(record, i) => i}
        />
      </StyledCard>
    );
  }
}

export default ScoreTable;

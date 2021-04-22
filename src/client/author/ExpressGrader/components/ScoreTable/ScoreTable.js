import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { round } from 'lodash'
import { greenThird } from '@edulastic/colors'
import { withNamespaces } from '@edulastic/localization'
import QuestionScore from '../QuestionScore/QuestionScore'
import {
  StyledCard,
  TableData,
  StyledDivMid,
  StyledText,
  TableTitle,
  StudentsTitle,
  ScoreTitle,
} from './styled'

class ScoreTable extends Component {
  getColumnsForTable = (length, submittedLength) => {
    const {
      showQuestionModal,
      isPresentationMode,
      scoreMode,
      isGridEditOn,
      groupId,
      t,
    } = this.props

    const columns = [
      {
        title: <TableTitle>Score Grid</TableTitle>,
        className: 'main-heading',
        // Make score grid column fixed when more than 10 questions data exist
        fixed: 'left',
        width: 320,
        children: [
          {
            key: 'students',
            title: <StudentsTitle>students</StudentsTitle>,
            dataIndex: 'students',
            className: 'th-border-bottom student-names',
            width: 220,
            render: (record) => (
              <StyledDivMid
                style={{ color: '#000', textAlign: 'left' }}
                className="name-col"
              >
                {isPresentationMode
                  ? record.fakeName
                  : record.studentName || t('common.anonymous')}
              </StyledDivMid>
            ),
            sorter: (a, b) =>
              a.students.studentName.toUpperCase() >
              b.students.studentName.toUpperCase()
                ? 1
                : -1,
          },
          {
            key: 'score',
            title: <ScoreTitle>score</ScoreTitle>,
            className: 'th-border-bottom score-title',
            dataIndex: 'score',
            width: 100,
            render: (record) => {
              const { score = 0, maxScore = 0 } = record
              const percent =
                maxScore === 0
                  ? '-'
                  : `${((100 * score) / maxScore).toFixed(0)}%`
              return (
                <StyledDivMid style={{ color: '#000', textAlign: 'left' }}>
                  <StyledText color={greenThird}>{percent}</StyledText>&nbsp; (
                  {round(score, 1)}/{maxScore})
                </StyledDivMid>
              )
            },
            onFilter: (value, record) => record.score.indexOf(value) === 0,
            sorter: (a, b) => (a.score.score > b.score.score ? 1 : -1),
            sortDirections: ['descend', 'ascend'],
          },
        ],
      },
    ]

    for (let index = 0; index < length; index++) {
      let successScore = 0
      const { testActivity: students } = this.props
      const key = `Q${index}`
      const title = (
        <StyledDivMid>
          {students[0].questionActivities[index].barLabel}
        </StyledDivMid>
      )
      students
        .filter((x) => x.status === 'submitted')
        .forEach((student) => {
          if (
            student &&
            student.questionActivities[index] &&
            !student.questionActivities[index]?.notStarted
          ) {
            const { score = 0, maxScore = 0 } =
              student.questionActivities[index] || {}
            const uqaAvg = score / maxScore
            successScore += Number.isNaN(uqaAvg) ? 0 : uqaAvg
          }
        })
      const averageScore = successScore
      const questionAvarageScore = (
        <StyledDivMid style={{ color: '#000' }}>
          <StyledText color={greenThird}>
            {`${
              submittedLength > 0
                ? round((averageScore / submittedLength) * 100, 1) || 0
                : 0
            }%`}
          </StyledText>
          <div style={{ fontSize: '12px', lineHeight: '14px' }}>
            ({round(averageScore, 2) || 0}/{submittedLength})
          </div>
        </StyledDivMid>
      )

      const column = {
        title,
        children: [
          {
            key,
            dataIndex: key,
            title: questionAvarageScore,
            className: 'sub-thead-th th-border-bottom',
            render: (record) => {
              const isTest = record && record.testActivityId

              const cell = (
                <QuestionScore
                  question={record}
                  showQuestionModal={showQuestionModal}
                  isTest={isTest}
                  scoreMode={scoreMode}
                  isGridEditOn={isGridEditOn}
                  groupId={groupId}
                />
              )
              return cell
            },
          },
        ],
        sorter: (a, b) => a[key].score - b[key].score,
        sortDirections: ['descend', 'ascend'],
      }

      columns.push(column)
    }
    return columns
  }

  render() {
    let columnInfo = []
    const { testActivity, tableData } = this.props
    const columnsLength =
      testActivity && testActivity.length !== 0
        ? testActivity[0].questionActivities.length
        : 0
    const submittedLength = testActivity.filter((x) => x.status === 'submitted')
      .length
    if (columnsLength) {
      columnInfo = this.getColumnsForTable(columnsLength, submittedLength)
    }

    const scrollY = window.innerHeight - 250
    // 40 sice of each cell in table + 3 overlapped padding
    const showY = tableData.length * 43 > scrollY

    return (
      <StyledCard bordered={false} marginBottom="0px">
        <TableData
          pagination={false}
          columns={columnInfo}
          dataSource={tableData}
          // Columns length will be the number of questions
          // Column data length will be number of students
          scroll={{
            x: 'max-content',
            y: showY ? scrollY : false,
          }}
          rowKey={(record, i) => i}
        />
      </StyledCard>
    )
  }
}

ScoreTable.propTypes = {
  showQuestionModal: PropTypes.func.isRequired,
  testActivity: PropTypes.array,
  isPresentationMode: PropTypes.bool,
}

ScoreTable.defaultProps = {
  testActivity: {},
  isPresentationMode: false,
}

export default withNamespaces('student')(ScoreTable)

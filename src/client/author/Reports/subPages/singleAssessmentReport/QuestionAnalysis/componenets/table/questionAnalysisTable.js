import React, { useMemo } from 'react'
import { roleuser } from '@edulastic/constants'
import { uniqBy } from 'lodash'
import { Tooltip, Row, Col } from 'antd'
import { StyledTable, QLabelSpan } from '../styled'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import Tags from '../../../../../../src/components/common/Tags'
import {
  getOrderedQuestions,
  getTableData,
  sortByAvgPerformanceAndLabel,
} from '../../utils/transformers'

const comparedByToToolTipLabel = {
  schoolId: {
    name: 'School Name',
    type: 'School (% Score)',
    all: 'All Schools (% Score)',
    nameKey: 'schoolName',
  },
  teacherId: {
    name: 'Teacher Name',
    type: 'Teacher (% Score)',
    all: 'All Teachers (% Score)',
    nameKey: 'teacherName',
  },
  groupId: {
    name: 'Class Name',
    type: 'Class (% Score)',
    all: 'All Classes (% Score)',
    nameKey: 'groupName',
  },
}

const compareByToPluralName = {
  schoolId: 'Schools',
  teacherId: 'Teachers',
  groupId: 'Classes',
}

const tooltipText = (compareByType, record, { questionId, questionLabel }) => {
  if (record.key === 'districtAvg') {
    return ''
  }
  return (
    <div>
      <Row type="flex" justify="center">
        <Col className="custom-table-tooltip-value">{questionLabel}</Col>
      </Row>
      <Row type="flex" justify="start">
        <Col className="custom-table-tooltip-key">
          {comparedByToToolTipLabel[compareByType].name}:{'  -'}
        </Col>
        <Col className="custom-table-tooltip-value">
          {record[compareByType]}
        </Col>
      </Row>
      <Row type="flex" justify="start">
        <Col className="custom-table-tooltip-key">
          {comparedByToToolTipLabel[compareByType].type}:{' '}
        </Col>
        <Col className="custom-table-tooltip-value">
          {record.scorePercentByQId?.[questionId]}%
        </Col>
      </Row>
      <Row type="flex" justify="start">
        <Col className="custom-table-tooltip-key">
          {comparedByToToolTipLabel[compareByType].all}:{' '}
        </Col>
        <Col className="custom-table-tooltip-value">
          {record.averageScoreByQId?.[questionId]}%
        </Col>
      </Row>
    </div>
  )
}
const getTableColumns = (
  { qSummary },
  compareBy,
  filter = {},
  horizontalPage
) => {
  const qLabelsToFilter = Object.keys(filter)
  const uniqQuestionMetrics = uniqBy(qSummary, 'questionId').filter(
    (question) => {
      if (qLabelsToFilter && qLabelsToFilter.length) {
        return qLabelsToFilter.includes(question.questionLabel)
      }
      return true
    }
  )
  const orderedQuestions = sortByAvgPerformanceAndLabel(
    getOrderedQuestions(uniqQuestionMetrics)
  ).filter(
    (_, index) =>
      index >= horizontalPage.startIndex && index <= horizontalPage.endIndex
  )

  const result = orderedQuestions.map((question) => {
    const standards = question.standards
    return {
      title: (
        <>
          <QLabelSpan>{question.questionLabel}</QLabelSpan>
          <Tags tags={standards} show={1} />
          <span>points {question.points}</span>
        </>
      ),
      dataIndex: `averageScoreByQId.${question.questionId}`,
      key: question.questionId,
      sorter: (a, b) => {
        if (a.key === 'districtAvg' || b.key === 'districtAvg') {
          return 0
        }
        return (
          a.averageScoreByQId[question.questionId] -
          b.averageScoreByQId[question.questionId]
        )
      },
      render: (text, record) => (
        <Tooltip title={tooltipText(compareBy, record, question)}>
          {text || 0}%
        </Tooltip>
      ),
      width: '140px',
    }
  })

  const compareColumn = {
    title: compareByToPluralName[compareBy],
    width: 150,
    dataIndex: compareBy,
    sorter: (a, b) => {
      if (a.key === 'districtAvg' || b.key === 'districtAvg') {
        return 0
      }
      return a.key.localeCompare(b.key)
    },
  }

  if (result && result.length) {
    return [compareColumn, ...result]
  }
  return [compareColumn]
}

export const QuestionAnalysisTable = ({
  compareBy,
  filter,
  role,
  isCsvDownloading,
  questionAnalysis,
  horizontalPage,
}) => {
  const columns = useMemo(
    () => getTableColumns(questionAnalysis, compareBy, filter, horizontalPage),
    [questionAnalysis, compareBy, filter, horizontalPage]
  )
  const tableData = useMemo(() => getTableData(questionAnalysis, compareBy), [
    questionAnalysis,
    compareBy,
  ])
  return (
    <CsvTable
      data-testid="QuestionAnalysisTable"
      isCsvDownloading={isCsvDownloading}
      tableToRender={StyledTable}
      columns={columns}
      dataSource={tableData}
      rowKey="questionId"
      colorCellStart={role === roleuser.TEACHER ? 6 : 5}
      scroll={{ x: '100%' }}
    />
  )
}

import React, { useMemo } from 'react'
import { roleuser } from '@edulastic/constants'
import { StyledTable } from '../styled'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import { groupBy, sortBy, uniqBy } from 'lodash'
import Tags from '../../../../../../src/components/common/Tags'
import { themeColor } from '@edulastic/colors'

const compareByToPluralName = {
  schoolId: 'Schools',
  teacherId: 'Teachers',
  groupId: 'Classes',
}

const variableKeyMapForComparison = {
  schoolId: {
    percent: "allSchoolsScorePercent",
    id: "schoolId",
    name: "schoolName"
  },
  teacherId: {
    percent: "allTeachersScorePercent",
    id: "teacherId",
    name: "teacherName"
  },
  groupId: {
    percent: "allGroupsScorePercent",
    id: "groupId",
    name: "groupName"
  },
}

const getTableColumns = ({ qSummary }, compareBy, filter={}) => {
  const qLabelsToFilter = Object.keys(filter)
  const uniqQuestionMetrics = uniqBy(qSummary, "questionId").filter((question)=> {
    if( qLabelsToFilter && qLabelsToFilter.length ){
      return qLabelsToFilter.includes(question.questionLabel)
    }
    return true
  })
  const orderedQuestions = sortBy(uniqQuestionMetrics, "questionLabel")

  const result = orderedQuestions.map((question)=> {
    const standards = question.standards
    return {
      title: (
        <>
          <span style={{color: themeColor, marginBottom: "10px", display:"inline-block"}}>{question.questionLabel}</span>
          <Tags tags={standards} show={1}/>
          <span>points {question.points}</span>
        </>
      ),
      dataIndex: `averageScoreByQId.${question.questionId}`,
      key: question.questionId,
      sorter: (a, b) => {
        if(a.key === "districtAvg" || b.key === "districtAvg"){
          return 0
        }
        return a.averageScoreByQId[question.questionId] - b.averageScoreByQId[question.questionId]
      },
      render: (text) => `${text}%`,
      width: "140px"
    }
  })

  const compareColumn = {
    title: compareByToPluralName[compareBy],
    width: 150,
    dataIndex: compareBy,
  }

  if(result && result.length){
    return [ compareColumn, ...result ]
  }
  return [compareColumn]
}

const getTableRows = ({ performanceByDimension, qSummary }, compareBy) => {
  const groupDetailsByTeacherId = groupBy(performanceByDimension.details, compareBy)
  const orderedQuestions = sortBy(uniqBy(qSummary, "questionId"), "questionLabel")
  const { percent, name } = variableKeyMapForComparison[compareBy]

  const result = Object.keys(groupDetailsByTeacherId).map(item=> {
    const teacherGroup = groupDetailsByTeacherId[item]
    const [firstItem] = teacherGroup
    const averageScoreByQId = {}
    teacherGroup.forEach(data=> {
      averageScoreByQId[data.questionId] = data[percent]
    })
    return {
      key: item,
      [compareBy]: firstItem[name],
      averageScoreByQId
    }
  })
  
  const districtAvgRow = {
    key: "districtAvg",
    [compareBy]: "District Avg.",
    averageScoreByQId: orderedQuestions.reduce((acc, c)=> {
      acc[c.questionId] = c.districtAvgPerf
      return acc
    },{}),
  }
  return [districtAvgRow, ...result]
}

export const QuestionAnalysisTable = ({
  compareBy,
  filter,
  role,
  isCsvDownloading,
  questionAnalysis,
}) => {
  const columns = useMemo(()=> getTableColumns(questionAnalysis, compareBy, filter), [questionAnalysis,compareBy, filter])
  const tableData = useMemo(()=> getTableRows(questionAnalysis, compareBy), [questionAnalysis,compareBy])
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

import { groupBy, orderBy } from 'lodash'
import { getHSLFromRange1 } from '../../../../common/util'

export const variableKeyMapForComparison = {
  school: {
    percent: 'allSchoolsScorePercent',
    id: 'schoolId',
    name: 'schoolName',
  },
  teacher: {
    percent: 'allTeachersScorePercent',
    id: 'teacherId',
    name: 'teacherName',
  },
  group: {
    percent: 'allGroupsScorePercent',
    id: 'groupId',
    name: 'groupName',
  },
}

export const comparedByToToolTipLabel = {
  school: {
    name: 'School Name',
    type: 'School (% Score)',
    all: 'All Schools (% Score)',
    nameKey: 'schoolName',
  },
  teacher: {
    name: 'Teacher Name',
    type: 'Teacher (% Score)',
    all: 'All Teachers (% Score)',
    nameKey: 'teacherName',
  },
  group: {
    name: 'Class Name',
    type: 'Class (% Score)',
    all: 'All Classes (% Score)',
    nameKey: 'groupName',
  },
}

export const compareByToPluralName = {
  school: 'Schools',
  teacher: 'Teachers',
  group: 'Classes',
}

export const sortByAvgPerformanceAndLabel = (arr, sortBy) =>
  orderBy(
    arr,
    sortBy === 'qLabel'
      ? [(item) => Number((item.qLabel || '').substring(1))]
      : [sortBy, (item) => Number((item.qLabel || '').substring(1))],
    ['asc']
  )

export const getOrderedQuestions = (questions) => {
  return questions.sort((a, b) => {
    return a.questionLabel.localeCompare(b.questionLabel, undefined, {
      numeric: true,
      sensitivity: 'base',
    })
  })
}

export const getChartData = (qSummary = [], sortBy) => {
  const arr = qSummary.map((item) => {
    const avgPerformance = !Number.isNaN(item.avgPerformance)
      ? Math.round(item.avgPerformance)
      : 0
    const avgIncorrect = Math.round(100 - item.avgPerformance)
    const districtAvg = Math.round(item.districtAvgPerf)
    const avgTimeSecs = Math.floor(item.avgTimeSpent / 1000)
    const avgTimeMins = item.avgTimeSpent
    return {
      ...item,
      qLabel: item.questionLabel,
      avgPerformance,
      avgIncorrect,
      avgTime: item.avgTimeSpent,
      avgTimeSecs,
      avgTimeMins,
      districtAvg,
      fill: getHSLFromRange1(avgPerformance),
    }
  })
  return sortByAvgPerformanceAndLabel(arr, sortBy)
}

export const getTableData = (
  { performanceByDimension, qSummary },
  compareBy
) => {
  const groupDetailsByTeacherId = groupBy(
    performanceByDimension.details,
    `${compareBy}Id` // will be modified as dimensionId
  )
  const orderedQuestions = getOrderedQuestions(qSummary)
  const { percent, name } = variableKeyMapForComparison[compareBy]

  const result = Object.keys(groupDetailsByTeacherId).map((item) => {
    const groupedItem = groupDetailsByTeacherId[item]
    const [firstItem] = groupedItem
    const averageScoreByQId = {}
    const scorePercentByQId = {}
    groupedItem.forEach((data) => {
      averageScoreByQId[data.questionId] = data[percent]
      scorePercentByQId[data.questionId] = data.scorePercent
    })
    return {
      key: item,
      [compareBy]: firstItem[name],
      averageScoreByQId,
      scorePercentByQId,
      districtAverage: orderedQuestions.reduce((acc, c) => {
        acc[c.questionId] = c.districtAvgPerf
        return acc
      }, {}),
    }
  })

  return result
}

import { groupBy, orderBy } from 'lodash'
import { getHSLFromRange1 } from '../../../../common/util'

const variableKeyMapForComparison = {
  schoolId: {
    percent: 'allSchoolsScorePercent',
    id: 'schoolId',
    name: 'schoolName',
  },
  teacherId: {
    percent: 'allTeachersScorePercent',
    id: 'teacherId',
    name: 'teacherName',
  },
  groupId: {
    percent: 'allGroupsScorePercent',
    id: 'groupId',
    name: 'groupName',
  },
}

export const sortByAvgPerformanceAndLabel = (arr) =>
  orderBy(arr, [
    'avgPerformance',
    (item) => Number((item.qLabel || '').substring(1)),
  ])

export const getOrderedQuestions = (questions) => {
  return questions.sort((a, b) => {
    return a.questionLabel.localeCompare(b.questionLabel, undefined, {
      numeric: true,
      sensitivity: 'base',
    })
  })
}

export const getChartData = (qSummary = []) => {
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
  return sortByAvgPerformanceAndLabel(arr)
}

export const getTableData = (
  { performanceByDimension, qSummary },
  compareBy
) => {
  const groupDetailsByTeacherId = groupBy(
    performanceByDimension.details,
    compareBy
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
      scorePercentByQId[data.questionId] = data[percent]
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

import { groupBy, orderBy } from 'lodash'
import { getHSLFromRange1 } from '../../../../common/util'

export const sortByAvgPerformanceAndLabel = (arr, sortKey) =>
  orderBy(
    arr,
    sortKey === 'qLabel'
      ? [(item) => Number((item.qLabel || '').substring(1))]
      : [sortKey, (item) => Number((item.qLabel || '').substring(1))],
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

export const getChartData = (qSummary = [], sortKey) => {
  const percent_100 = 100
  const milliseconds_1000 = 1000
  const arr = qSummary.map((item) => {
    const {
      avgPerformance: _avgPerformance,
      questionLabel: qLabel,
      avgTimeSpent: avgTimeMins,
      districtAvgPerf,
      ...rest
    } = item
    const avgPerformance = !Number.isNaN(_avgPerformance)
      ? Math.round(_avgPerformance)
      : 0
    const avgIncorrect = Math.round(percent_100 - avgPerformance)
    const districtAvg = Math.round(districtAvgPerf)
    const avgTimeSecs = Math.floor(avgTimeMins / milliseconds_1000)
    return {
      ...rest,
      qLabel,
      avgPerformance,
      avgIncorrect,
      avgTime: avgTimeMins,
      avgTimeSecs,
      avgTimeMins,
      districtAvg,
      fill: getHSLFromRange1(avgPerformance),
    }
  })
  return sortByAvgPerformanceAndLabel(arr, sortKey)
}

const createRows = (districtAverage, groupDetailsByDomainId) => (item) => {
  const groupedItem = groupDetailsByDomainId[item]
  const [firstItem] = groupedItem
  const averageScoreByQId = {}
  const scorePercentByQId = {}
  groupedItem.forEach(({ questionId, dimensionPercentage, scorePercent }) => {
    averageScoreByQId[questionId] = Math.round(dimensionPercentage)
    scorePercentByQId[questionId] = Math.round(scorePercent)
  })
  const { dimensionName: dimension } = firstItem
  return {
    key: item,
    dimension,
    averageScoreByQId,
    scorePercentByQId,
    districtAverage,
  }
}

export const getTableData = (qSummary, performanceByDimension, iteratee) => {
  const groupDetailsByDomainId = groupBy(
    performanceByDimension.details,
    iteratee
  )
  const orderedQuestions = getOrderedQuestions(qSummary)
  const districtAverage = orderedQuestions.reduce(
    (acc, { questionId, districtAvgPerf }) => {
      acc[questionId] = Math.round(districtAvgPerf)
      return acc
    },
    {}
  )
  const result = Object.keys(groupDetailsByDomainId).map(
    createRows(districtAverage, groupDetailsByDomainId)
  )

  return result
}

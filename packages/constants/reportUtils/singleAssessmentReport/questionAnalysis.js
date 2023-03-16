const { groupBy, orderBy, uniqBy } = require('lodash')

const compareByToPluralName = {
  school: 'Schools',
  teacher: 'Teachers',
  class: 'Classes',
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

const getOrderedQuestions = (questions) => {
  return questions.sort((a, b) => {
    return a.questionLabel.localeCompare(b.questionLabel, undefined, {
      numeric: true,
      sensitivity: 'base',
    })
  })
}

const sortByAvgPerformanceAndLabel = (arr, sortKey) =>
  orderBy(
    arr,
    sortKey === 'qLabel'
      ? [(item) => Number((item.qLabel || '').substring(1))]
      : [sortKey, (item) => Number((item.qLabel || '').substring(1))],
    ['asc']
  )

const getTableColumns = (
  qSummary,
  compareBy,
  filter = {},
  visibleIndices,
  sortKey
) => {
  const uniqQuestionMetrics = uniqBy(qSummary, 'questionId')
  const qLabelsToFilter = Object.keys(filter)
  const orderedQuestions = sortByAvgPerformanceAndLabel(
    getOrderedQuestions(uniqQuestionMetrics),
    sortKey
  ).filter((question, index) => {
    // filter out selected bars
    if (qLabelsToFilter && qLabelsToFilter.length) {
      return qLabelsToFilter.includes(question.questionLabel)
    }
    // if no bar selected then choose current page items
    return (
      index >= visibleIndices.startIndex && index <= visibleIndices.endIndex
    )
  })

  return orderedQuestions
}

const getTableData = (
  qSummary,
  performanceByDimension,
  iteratee = 'dimensionId'
) => {
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

const convertQAnalysisTableToCSV = (
  qSummary,
  dataSource,
  compareBy,
  filter,
  sortBy,
  includeHeader = true
) => {
  const csv = []
  const csvRawData = []

  const headerRow = []
  // header row
  const qLabelsToFilter = Object.keys(filter)
  const compareByTitle = compareByToPluralName[compareBy]
  headerRow.push(`${compareByTitle}`)
  let orderedQuestions = sortByAvgPerformanceAndLabel(
    getOrderedQuestions(qSummary),
    sortBy
  )
  if (qLabelsToFilter.length) {
    orderedQuestions = orderedQuestions.filter((item) =>
      qLabelsToFilter.includes(item.questionLabel)
    )
  }
  orderedQuestions.forEach((question) => {
    headerRow.push(
      `${question.questionLabel}: ${question.standards.join('|')}: ${
        question.points
      }`
    )
  })

  // district avg row
  const districtHeaderRow = ['District Avg.']
  orderedQuestions.forEach((question) => {
    districtHeaderRow.push(Math.round(question.districtAvgPerf))
  })

  if (includeHeader) {
    csv.push(headerRow.join(','))
    csvRawData.push(headerRow)

    csv.push(districtHeaderRow.join(','))
    csvRawData.push(districtHeaderRow)
  }

  // content area
  dataSource.forEach((data) => {
    const contentRows = [data.dimension]
    orderedQuestions.forEach((question) => {
      contentRows.push(data.scorePercentByQId[question.questionId])
    })
    csv.push(contentRows.join(','))
    csvRawData.push(contentRows)
  })

  return {
    csvText: csv.join('\n'),
    csvRawData,
  }
}

module.exports = {
  compareByToPluralName,
  getTableData,
  getOrderedQuestions,
  convertQAnalysisTableToCSV,
  sortByAvgPerformanceAndLabel,
  getTableColumns,
}

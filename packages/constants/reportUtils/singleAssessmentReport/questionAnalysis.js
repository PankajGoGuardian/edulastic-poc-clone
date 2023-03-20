const { groupBy, orderBy, uniqBy } = require('lodash')

const compareByToPluralName = {
  school: 'Schools',
  teacher: 'Teachers',
  class: 'Classes',
}

const tableHeaderFields = {
  question: 'Question',
  standards: 'STANDARDS',
  points: 'POINTS',
  districtAvg: 'District Avg.',
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

const getTableColumns = (qSummary, filter = {}, visibleIndices, sortKey) => {
  const uniqQuestionMetrics = uniqBy(qSummary, 'questionId')?.map((item) => {
    const { avgPerformance: _avgPerformance, ...rest } = item
    const avgPerformance = !Number.isNaN(_avgPerformance)
      ? Math.round(_avgPerformance)
      : 0
    return {
      ...rest,
      avgPerformance,
    }
  })
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

const prepareHeaderRow = (questions) => {
  const questionRow = [tableHeaderFields.question]
  const standardsRow = [tableHeaderFields.standards]
  const pointsRow = [tableHeaderFields.points]
  questions.forEach((question) => {
    questionRow.push(`${question.questionLabel}`)
    standardsRow.push(
      `"${question.standards ? question.standards.join(',') : ''}"`
    )
    pointsRow.push(`${question.points}`)
  })

  return [questionRow, pointsRow, standardsRow]
}

const prepareDistrictHeaderRow = (questions) => {
  const districtHeaderRow = [tableHeaderFields.districtAvg]
  questions.forEach((question) => {
    districtHeaderRow.push(Math.round(question.districtAvgPerf))
  })
  return districtHeaderRow
}

const getOrderedAndSelectedQuestions = (qSummary, filter, sortBy) => {
  const qLabelsToFilter = Object.keys(filter)
  let orderedQuestions = sortByAvgPerformanceAndLabel(
    getOrderedQuestions(qSummary),
    sortBy
  )
  if (qLabelsToFilter.length) {
    orderedQuestions = orderedQuestions.filter((item) =>
      qLabelsToFilter.includes(item.questionLabel)
    )
  }
  return orderedQuestions
}

const prepareTableDataRow = (dataSource, orderedQuestions) => {
  const csv = []
  const csvRawData = []

  dataSource.forEach((data) => {
    const contentRows = [data.dimension]
    orderedQuestions.forEach((question) => {
      contentRows.push(data.scorePercentByQId[question.questionId])
    })
    csv.push(contentRows.join(','))
    csvRawData.push(contentRows)
  })

  return {
    csv,
    csvRawData,
  }
}

const convertQAnalysisTableToCSV = (
  qSummary,
  dataSource,
  filter,
  sortBy,
  compareBy
) => {
  const csv = []

  const orderedQuestions = getOrderedAndSelectedQuestions(
    qSummary,
    filter,
    sortBy
  )

  // header row
  const headerRows = prepareHeaderRow(orderedQuestions, compareBy)
  headerRows.forEach((row) => {
    csv.push(row.join(','))
  })

  // district avg row
  const districtHeaderRow = prepareDistrictHeaderRow(orderedQuestions)
  csv.push(districtHeaderRow.join(','))

  // content area
  const tableData = prepareTableDataRow(dataSource, orderedQuestions)

  csv.push(...tableData.csv)

  return { csvText: csv.join('\n') }
}

module.exports = {
  compareByToPluralName,
  prepareHeaderRow,
  prepareDistrictHeaderRow,
  prepareTableDataRow,
  getTableData,
  getOrderedQuestions,
  convertQAnalysisTableToCSV,
  sortByAvgPerformanceAndLabel,
  getOrderedAndSelectedQuestions,
  getTableColumns,
}

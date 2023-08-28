const { round, isEmpty, keyBy } = require('lodash')

const { getCsvDataFromTableBE } = require('../../common')
const { getMasteryLevel, getScore } = require('../standardsPerformanceSummary')
const {
  CHART_PAGE_SIZE,
  TABLE_PAGE_SIZE,
  SortKeys,
  SortOrders,
  SortOrdersMap,
  FilterSummaryFields,
  SharedSummaryFields,
  SharedDetailsFields,
  FilterDetailsFields,
  ComDataForDropDown,
  CompareByKeys,
  CompareByKeyToNameMap,
  CompareByDropDownData,
  AnalyseByKeys,
  AnalyseByKeyToNameMap,
  AnalyseByDropDownData,
} = require('./constants')

/**
 * Function to get color code for the mastery level based on mastery score.
 * @param {Object} data - contains masteryScore property to compare with mastery scale score.
 * @param {Object} masteryScale - contains selected mastery scale details.
 * @returns {string} color code or null if mastery scale is not matched.
 */
const getMasteryScoreColor = (data, masteryScale) =>
  !isEmpty(data) && data.masteryScore != null
    ? getMasteryLevel(data.masteryScore, masteryScale).color
    : null

/**
 * Function to get table cell render value based on selected analyse by filter.
 * @param {Object} data - contains masteryScore property to compare with mastery scale score.
 * @param {string} analyseByKey - key for the selected analyse by.
 * @param {Object} masteryScale - contains selected mastery scale details.
 * @returns {string} score %, raw score, mastery score or mastery level based on selected analyse by filter.
 */
const getAnalyzeByRenderData = (data, analyseByKey, masteryScale) => {
  if (isEmpty(data) || data.masteryScore == null) {
    return 'N/A'
  }
  switch (analyseByKey) {
    case AnalyseByKeys.SCORE_PERCENT:
      return `${getScore({
        totalScore: data.totalScore,
        maxScore: data.totalMaxScore,
      })}%`
    case AnalyseByKeys.RAW_SCORE:
      return `${(data.totalScore || 0).toFixed(2)} / ${data.totalMaxScore}`
    case AnalyseByKeys.MASTERY_SCORE:
      return (data.masteryScore || 0).toFixed(2)
    case AnalyseByKeys.MASTERY_LEVEL:
      return getMasteryLevel(data.masteryScore, masteryScale).masteryLabel
    default:
      return 'N/A'
  }
}

/**
 * Function to get transformed chart metrics curated from test info containing metrics details from summary api response.
 * @param {Object[]} summary - summary api response.
 * @param {Object[]} testInfo - test info api response.
 * @returns {Object[]} transformed test info containing metrics details for rendering chart.
 */
const getChartMetrics = (summary, testInfo) => {
  if (isEmpty(summary) || isEmpty(testInfo)) {
    return { metrics: [] }
  }

  const { metrics } = summary
  const metricsByTestId = keyBy(metrics, 'testId')

  // We need to show empty bars in the chart for the selected tests that do not have metrics data
  // hence we iterate over testInfo and add metrics data to the test if present
  // otherwise only show test details with empty metrics.
  // reverse is required to show tests in same order as in production (before 36.0)
  // ref: https://goguardian.atlassian.net/browse/EV-39827
  const chartMetrics = testInfo
    .map(({ testId, testName }) => {
      const metric = metricsByTestId[testId] || {
        masteryScore: null,
        totalScore: null,
        totalMaxScore: null,
        totalStudentCount: 0,
        distribution: [],
      }
      return { testId, testName, ...metric }
    })
    .reverse()

  return { metrics: chartMetrics }
}

/**
 * Function to get transformed table metrics from the details api response.
 * @param {Object[]} details - details api response.
 * @returns {Object[]} transformed table metrics to render table.
 */
const getTableMetrics = (details) => {
  if (isEmpty(details)) {
    return { metrics: [], totalRowCount: 0 }
  }
  const { metrics, totalRowCount } = details

  const tableMetrics = metrics.map(
    ({
      dimension,
      sisId,
      studentNumber,
      masteryScore,
      totalScore,
      totalMaxScore,
      totalStudentCount,
      distribution,
    }) => {
      const performance = {
        masteryScore,
        totalStudentCount,
        totalScore,
        totalMaxScore,
      }
      const performanceByTestId = keyBy(distribution, 'testId')
      return {
        [SortKeys.DIMENSION]: dimension,
        [SortKeys.PERFORMANCE]: performance,
        sisId,
        studentNumber,
        ...performanceByTestId,
      }
    }
  )

  return { metrics: tableMetrics, totalRowCount }
}

/**
 * Function to generate Bar chart data for each bar and its segments.
 * @param {Object[]} chartData - contains transformed test data with metrics.
 * @param {Object} masteryScale  - contains selected mastery scale details.
 * @returns {Object[]} chart data to be passed to rechart component to render the chart.
 */
const getChartData = (chartData, masteryScale) => {
  if (isEmpty(chartData) || isEmpty(masteryScale)) {
    return []
  }

  const masteryMap = keyBy(masteryScale, 'score')
  const masteryCountHelper = {}

  // Setting up mastery count helper object with scale score as keys and 0 as default value
  for (const scale of masteryScale) {
    masteryCountHelper[scale.score] = 0
  }
  const _chartData = chartData.map((dataItem) => {
    const totalStudents = dataItem.totalStudentCount
    // setting up a temp mastery count helper for each test in chart data
    const tempMasteryCountHelper = { ...masteryCountHelper }

    // updating temp mastery count for each mastery score by adding no. of students in the distribution
    for (const item of dataItem.distribution) {
      const { masteryScore, totalStudentCount } = item
      if (tempMasteryCountHelper[round(masteryScore)]) {
        tempMasteryCountHelper[round(masteryScore)] += totalStudentCount
      } else {
        tempMasteryCountHelper[round(masteryScore)] = totalStudentCount
      }
    }
    const obj = {
      totalStudents,
      testId: dataItem.testId,
      testName: dataItem.testName,
    }
    const masteryLabelInfo = {}

    // Calculating each mastery level student percentage which makes up each segment in the bar
    Object.keys(tempMasteryCountHelper).forEach((_item) => {
      if (masteryMap[_item]) {
        const masteryPercentage = totalStudents
          ? round((tempMasteryCountHelper[_item] / totalStudents) * 100)
          : 0
        masteryLabelInfo[masteryMap[_item].masteryLabel] =
          masteryMap[_item].masteryName
        if (_item == 1) {
          obj[masteryMap[_item].masteryLabel] = -masteryPercentage
        } else {
          obj[masteryMap[_item].masteryLabel] = masteryPercentage
        }
      }
    })
    obj.masteryLabelInfo = masteryLabelInfo

    return obj
  })

  return _chartData
}

/**
 * Function to get the table columns for standards progress table.
 * @param {Object[]} chartMetrics - contains transformed test data with metrics.
 * @param {Object} masteryScale - selected scale info details.
 * @param {string} compareByKey - selected compare by filter key.
 * @param {string} analyseByKey - selected analyse by filter key.
 * @returns {Object[]} table columns for backend download csv and frontend table component.
 */
const getTableColumns = (
  chartMetrics,
  masteryScale,
  compareByKey,
  analyseByKey
) => {
  const compareByColumn = {
    title: CompareByKeyToNameMap[compareByKey],
    key: SortKeys.DIMENSION,
    dataIndex: SortKeys.DIMENSION,
    width: 200,
    fixed: 'left',
    sorter: true,
    render: (data) => data.name || '-',
  }
  const overallColumn = {
    title: 'Overall',
    key: SortKeys.PERFORMANCE,
    dataIndex: SortKeys.PERFORMANCE,
    width: 100,
    sorter: true,
    render: (data) => getAnalyzeByRenderData(data, analyseByKey, masteryScale),
  }
  const compareByStudentColumns = [
    {
      title: 'SIS ID',
      dataIndex: 'sisId',
      key: 'sisId',
      visibleOn: ['csv'],
      render: (_, record) => record.sisId || '',
    },
    {
      title: 'STUDENT NUMBER',
      dataIndex: 'studentNumber',
      key: 'studentNumber',
      visibleOn: ['csv'],
      render: (_, record) => record.studentNumber || '',
    },
  ]
  const testColumns = chartMetrics.map((test) => ({
    title: `${test.testName} - ${getAnalyzeByRenderData(
      test,
      analyseByKey,
      masteryScale
    )}`,
    dataIndex: test.testId,
    align: 'center',
    key: test.testId,
    render: (data) => {
      return getAnalyzeByRenderData(data, analyseByKey, masteryScale)
    },
  }))
  return [
    compareByColumn,
    overallColumn,
    ...(compareByKey === CompareByKeys.STUDENT ? compareByStudentColumns : []),
    ...testColumns,
  ]
}

// backend specific utils
const populateBackendCSV = ({
  summaryMetrics,
  detailsMetrics,
  testInfo,
  masteryScale,
  compareByKey,
  analyseByKey,
  includeHeader = true,
}) => {
  const { metrics: chartMetrics } = getChartMetrics(summaryMetrics, testInfo)
  const { metrics: tableMetrics } = getTableMetrics(detailsMetrics)
  const tableColumns = getTableColumns(
    chartMetrics,
    masteryScale,
    compareByKey,
    analyseByKey
  )
  return getCsvDataFromTableBE(tableMetrics, tableColumns, includeHeader)
}

module.exports = {
  // constants
  CHART_PAGE_SIZE,
  TABLE_PAGE_SIZE,
  SortKeys,
  SortOrders,
  SortOrdersMap,
  FilterSummaryFields,
  SharedSummaryFields,
  SharedDetailsFields,
  FilterDetailsFields,
  ComDataForDropDown,
  CompareByKeys,
  CompareByKeyToNameMap,
  CompareByDropDownData,
  AnalyseByKeys,
  AnalyseByKeyToNameMap,
  AnalyseByDropDownData,
  // transformers
  getMasteryScoreColor,
  getAnalyzeByRenderData,
  getTableColumns,
  getTableMetrics,
  getChartMetrics,
  getChartData,
  // backend specific utils
  populateBackendCSV,
}

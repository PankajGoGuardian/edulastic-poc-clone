const { round, orderBy, isEmpty, keyBy } = require('lodash')

const { percentage, getCsvDataFromTableBE } = require('../../common')
const {
  LEAST_MASTERY_SCORE,
  MASTERY_SCORE_MULTIPLIER,
  CHART_PAGE_SIZE,
  TABLE_PAGE_SIZE,
  CHART_X_AXIS_DATA_KEY,
  comDataForDropDown,
  sharedDetailsFields,
  filterDetailsFields,
  sharedSummaryFields,
  filterSummaryFields,
  compareByKeys,
  compareByKeyToNameMap,
  compareByDropDownData,
  analyseByKeys,
  analyseByKeyToNameMap,
  analyseByDropDownData,
} = require('./constants')

// common utils

const getLeastMasteryLevel = (scaleInfo = []) =>
  orderBy(scaleInfo, 'score', ['desc'])[scaleInfo.length - 1] || {
    masteryLabel: '',
    masteryName: '',
  }

const getMasteryLevel = (masteryScore, scaleInfo) => {
  const masteryLevel = scaleInfo.find((s) => s.score === round(masteryScore))
  return masteryLevel || getLeastMasteryLevel(scaleInfo)
}

// chart utils

const preProcessSummaryMetrics = ({ summaryMetricInfo }) => {
  return summaryMetricInfo.map((standard) => {
    const { totalStudents, performance } = standard
    const _performance = {
      avgScore: round(performance.totalScore / totalStudents, 2),
      totalScore: round(performance.totalMaxScore / totalStudents, 2),
      masteryScore: round(performance.totalMasteryScore / totalStudents, 2),
    }
    return { ...standard, performance: _performance }
  })
}

const getSummaryMetricInfoWithSkillInfo = (summaryMetricInfo, skillInfo) => {
  if (isEmpty(summaryMetricInfo) || isEmpty(skillInfo)) {
    return []
  }
  const skillInfoMap = keyBy(
    skillInfo.filter((item) => !!item[CHART_X_AXIS_DATA_KEY]),
    CHART_X_AXIS_DATA_KEY
  )
  return summaryMetricInfo
    .filter((item) => skillInfoMap[item._id])
    .map((item) => ({
      ...item,
      ...skillInfoMap[item._id],
    }))
}

const getChartBarData = ({ item, scaleInfo, masteryLabelInfo }) => {
  const masteryScorePercentages = {}
  const masteryScoreMap = keyBy(item.mastery, 'score')
  scaleInfo.forEach((masteryScaleItem) => {
    const label = masteryScaleItem.masteryLabel
    const masteryScoreItem = masteryScoreMap[masteryScaleItem.score]
    if (masteryScoreItem) {
      const multiplicand =
        masteryScaleItem.score === LEAST_MASTERY_SCORE
          ? -MASTERY_SCORE_MULTIPLIER
          : MASTERY_SCORE_MULTIPLIER
      masteryScorePercentages[label] =
        multiplicand *
        percentage(masteryScoreItem.stuCount, item.totalStudents, true)
    } else {
      masteryScorePercentages[label] = 0
    }
  })
  return {
    ...item,
    [CHART_X_AXIS_DATA_KEY]: item._id,
    ...masteryScorePercentages,
    masteryLabelInfo,
  }
}

const getChartData = (summaryMetricInfoWithSkillInfo, scaleInfo) => {
  if (isEmpty(summaryMetricInfoWithSkillInfo) || isEmpty(scaleInfo)) {
    return []
  }
  const masteryLabelInfo = {}
  for (const item of scaleInfo) {
    masteryLabelInfo[item.masteryLabel] = item.masteryName
  }
  return summaryMetricInfoWithSkillInfo.map((item) =>
    getChartBarData({ item, scaleInfo, masteryLabelInfo })
  )
}

// table transformers

const getAllAnalyseByPerformanceData = ({
  avgScore,
  totalScore,
  masteryScore,
  scaleInfo,
  useAbbreviation = false,
}) => {
  const masteryLevel = getMasteryLevel(masteryScore, scaleInfo)
  const masteryLevelLabel = useAbbreviation
    ? masteryLevel.masteryLabel
    : masteryLevel.masteryName
  return {
    [analyseByKeys.SCORE_PERCENT]:
      avgScore != null ? `${round(percentage(avgScore, totalScore))}%` : null,
    [analyseByKeys.RAW_SCORE]:
      avgScore != null
        ? `${round(avgScore, 2)} / ${round(totalScore, 2)}`
        : null,
    [analyseByKeys.MASTERY_SCORE]:
      masteryScore != null ? round(masteryScore, 2) : null,
    [analyseByKeys.MASTERY_LEVEL]:
      masteryScore != null ? masteryLevelLabel : null,
    color: masteryScore != null ? masteryLevel.color : null,
  }
}

const getTableRowData = ({
  dimension,
  standards,
  performance,
  scaleInfo,
  standardIds,
}) => {
  const rowData = {
    dimension: { _id: dimension._id, name: dimension.name },
    sisId: dimension.sisId,
    studentNumber: dimension.studentNumber,
  }
  rowData.performance = getAllAnalyseByPerformanceData({
    ...performance,
    // @todo: fix API output in backend to have keys avgScore and totalScore
    avgScore: performance.avg,
    totalScore: performance.total,
    scaleInfo,
  })
  for (const standardId of standardIds) {
    const standardPerformance =
      standards.find((ele) => ele._id == standardId) || {}
    rowData[standardId] = getAllAnalyseByPerformanceData({
      ...standardPerformance,
      scaleInfo,
    })
  }
  return rowData
}

const getTableData = ({ summaryMetricInfo, detailsMetricInfo, scaleInfo }) => {
  const standardIds = summaryMetricInfo.map(({ _id: standardId }) =>
    Number(standardId)
  )
  const tableData = detailsMetricInfo.map(
    ({ dimension, standards, performance }) =>
      getTableRowData({
        dimension,
        standards,
        performance,
        scaleInfo,
        standardIds,
      })
  )
  return tableData
}

const getTableColumns = ({
  summaryMetricInfoWithSkillInfo,
  scaleInfo,
  compareByKey,
  analyseByKey,
}) => {
  const compareByColumn = {
    title: compareByKeyToNameMap[compareByKey],
    key: 'dimension',
    dataIndex: 'dimension',
    width: 200,
    fixed: 'left',
    render: (data) => data.name || '-',
  }
  const compareByStudentColumns = [
    {
      title: 'SIS ID',
      key: 'sisId',
      dataIndex: 'sisId',
      width: 150,
      visibleOn: ['csv'],
    },
    {
      title: 'STUDENT NUMBER',
      key: 'studentNumber',
      dataIndex: 'studentNumber',
      width: 150,
      visibleOn: ['csv'],
    },
  ]
  const avgStandardPerformanceColumn = {
    title: 'AVG. STANDARD PERFORMANCE',
    key: 'performance',
    dataIndex: 'performance',
    width: 150,
    render: (data) => data[analyseByKey] || 'N/A',
  }

  const standardColumns = summaryMetricInfoWithSkillInfo.map(
    ({ standardId, standard, performance: standardOverallData }) => {
      const standardOverallPerformance = getAllAnalyseByPerformanceData({
        ...standardOverallData,
        scaleInfo,
        useAbbreviation: true,
      })
      return {
        title: `${standard} ${standardOverallPerformance[analyseByKey]}`,
        key: standardId,
        dataIndex: standardId,
        align: 'center',
        render: (data) => data[analyseByKey] || 'N/A',
      }
    }
  )
  return [
    compareByColumn,
    ...(compareByKey === compareByKeys.STUDENT ? compareByStudentColumns : []),
    avgStandardPerformanceColumn,
    ...standardColumns,
  ]
}

// backend specific utils

const populateBackendCSV = () => {
  // @todo
  const tableData = getTableData({})
  const tableColumns = getTableColumns({})
  return getCsvDataFromTableBE(tableData, tableColumns)
}

module.exports = {
  // constants
  CHART_PAGE_SIZE,
  TABLE_PAGE_SIZE,
  CHART_X_AXIS_DATA_KEY,
  comDataForDropDown,
  sharedDetailsFields,
  filterDetailsFields,
  sharedSummaryFields,
  filterSummaryFields,
  compareByKeys,
  compareByKeyToNameMap,
  compareByDropDownData,
  analyseByKeys,
  analyseByKeyToNameMap,
  analyseByDropDownData,
  // chart utils
  preProcessSummaryMetrics,
  getChartData,
  getSummaryMetricInfoWithSkillInfo,
  // table utils
  getAllAnalyseByPerformanceData,
  getTableData,
  getTableColumns,
  // backend utils
  populateBackendCSV,
}

const {
  groupBy,
  uniqBy,
  capitalize,
  ceil,
  orderBy,
  find,
  map,
  forEach,
  round,
  filter,
  sumBy,
  pick,
  get,
} = require('lodash')
const { produce: next } = require('immer')

const { percentage, getOverallScore, getHSLFromRange1 } = require('../common')

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| COMMON TRANSFORMERS |-----|-----|-----|----- //

const viewByMode = {
  STANDARDS: 'standard',
  DOMAINS: 'domain',
}
const sortKeysMap = {
  dimensionId: 'dimension',
  overall: 'average',
}

const analyzeByMode = {
  SCORE: 'score(%)',
  RAW_SCORE: 'rawScore',
  MASTERY_LEVEL: 'masteryLevel',
  MASTERY_SCORE: 'masteryScore',
}

const compareByMode = {
  SCHOOL: 'school',
  TEACHER: 'teacher',
  CLASS: 'class',
  GROUP: 'group',
  STUDENT: 'student',
  RACE: 'race',
  GENDER: 'gender',
  FRL_STATUS: 'frlStatus',
  ELL_STATUS: 'ellStatus',
  IEP_STATUS: 'iepStatus',
  HISPANIC_ETHINCITY: 'hispanicEthnicity',
}
const compareByModeToName = {
  [compareByMode.SCHOOL]: 'School',
  [compareByMode.TEACHER]: 'Teacher',
  [compareByMode.CLASS]: 'Class',
  [compareByMode.GROUP]: 'Group',
  [compareByMode.STUDENT]: 'Student',
  [compareByMode.RACE]: 'Race',
  [compareByMode.GENDER]: 'Gender',
  [compareByMode.FRL_STATUS]: 'FRL Status',
  [compareByMode.ELL_STATUS]: 'ELL Status',
  [compareByMode.IEP_STATUS]: 'IEP Status',
  [compareByMode.HISPANIC_ETHINCITY]: 'Hispanic Ethnicity',
}

const makeCompareByColumn = (value) => {
  const demographics = {
    race: 'race',
    gender: 'gender',
    frlStatus: 'frlStatus',
    ellStatus: 'ellStatus',
    iepStatus: 'iepStatus',
    hispanicEthnicity: 'hispanicEthnicity',
  }
  const returnObj = {
    title: compareByModeToName[value],
    dataIndex: 'dimensionId',
    key: 'dimensionId',
    fixed: 'left',
    width: 160,
    sorter: true,
  }
  return demographics[value]
    ? {
        ...returnObj,
        render: (dimensionId, item) =>
          item.dimensionName ? capitalize(item.dimensionName) : '-',
      }
    : {
        ...returnObj,
        align: 'left',
        render: (dimensionId, item) => item.dimensionName || '-',
      }
}

const compareByStudentsColumns = [
  {
    title: 'SIS ID',
    dataIndex: 'sisId',
    key: 'sisId',
    visibleOn: ['csv'],
  },
  {
    title: 'STUDENT NUMBER',
    dataIndex: 'studentNumber',
    key: 'studentNumber',
    visibleOn: ['csv'],
  },
]

const getYLabelString = (analyzeBy) => {
  switch (analyzeBy) {
    case analyzeByMode.RAW_SCORE:
      return 'Avg. Score'
    case analyzeByMode.MASTERY_LEVEL:
    case analyzeByMode.MASTERY_SCORE:
      return 'Student (%)'
    default:
      return 'Avg. Score (%)'
  }
}

const getOverallRawScore = (metrics = []) =>
  metrics.length ? sumBy(metrics, 'totalScore') / metrics.length : 0

const getLeastMasteryLevel = (scaleInfo = []) =>
  orderBy(scaleInfo, 'threshold', ['desc'])[scaleInfo.length - 1] || {
    masteryLabel: '',
    score: 0,
  }

const getMasteryLevel = (score, scaleInfo, field = 'threshold') => {
  const orderedScaleInfo = orderBy(scaleInfo, 'threshold', ['desc'])
  return (
    find(orderedScaleInfo, (info) => ceil(score) >= info[field]) ||
    getLeastMasteryLevel(scaleInfo)
  )
}

const augmentMetricInfoWithMasteryScore = (metricInfo = [], scaleInfo = []) =>
  map(metricInfo, (metric) => {
    const masteryPercentage = percentage(metric.totalScore, metric.maxScore)
    const masteryLevel = getMasteryLevel(masteryPercentage, scaleInfo)

    return {
      ...metric,
      masteryScore: masteryLevel.score,
      masteryLabel: masteryLevel.masteryLabel,
    }
  })

const getAugmentedMetricInfo = (metricInfo, scaleInfo = []) => {
  const metricsWithScale = augmentMetricInfoWithMasteryScore(
    metricInfo,
    scaleInfo
  )
  return metricsWithScale
}

const getReportWithFilteredSkills = (report, curriculumId) =>
  next(report, (draftReport) => {
    draftReport.skillInfo = filter(
      draftReport.skillInfo,
      (skill) => String(skill.curriculumId) === String(curriculumId)
    )
    draftReport.scaleInfo = get(draftReport, 'scaleInfo.scale', [])
  })

// -----|-----|-----|-----| COMMON TRANSFORMERS |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| CHART TRANSFORMERS |-----|-----|-----|----- //

const findGroupInfo = (id, viewBy, skillInfo) => {
  const isViewByStandards = viewBy == viewByMode.STANDARDS
  const dataGroup = isViewByStandards ? 'selectedStandards' : 'selectedDomains'
  const field = isViewByStandards ? 'standardId' : 'domainId'
  const groupedSkillInfo = skillInfo.reduce(
    (total, { standardId, standard, domainId, domain }) => ({
      selectedStandards: total.selectedStandards.concat({
        name: standard,
        standard,
        standardId,
      }),
      selectedDomains: total.selectedDomains.concat({
        name: domain,
        domain,
        domainId,
      }),
    }),
    {
      selectedStandards: [],
      selectedDomains: [],
    }
  )
  groupedSkillInfo.selectedDomains = uniqBy(
    groupedSkillInfo.selectedDomains,
    'domainId'
  )
  return find(groupedSkillInfo[dataGroup], (item) => item[field] == id) || {}
}

const getChartMasteryData = (report = {}, viewBy, leastScale) => {
  const {
    scaleInfo = [],
    skillInfo = [],
    performanceSummaryStats = [],
  } = report
  const groupByKey = viewBy === viewByMode.STANDARDS ? 'standardId' : 'domainId'
  const groupByScore = groupBy(scaleInfo, 'score')
  const filteredMetrics = filter(performanceSummaryStats, (metric) =>
    find(skillInfo, (skill) => skill.standardId === metric.standardId)
  )
  filteredMetrics.forEach((standardMetric) =>
    Object.assign(standardMetric, {
      masteryLabel: groupByScore[standardMetric.masteryLevel][0].masteryLabel,
    })
  )

  // group data according to the chosen viewBy
  const metricByViewBy = groupBy(filteredMetrics, groupByKey)
  const metricByViewByWithMasteryCount = {}

  // eslint-disable-next-line guard-for-in
  for (const viewByKey in metricByViewBy) {
    metricByViewByWithMasteryCount[viewByKey] = {}

    // create placeholder for each scale band to hold value and percentage
    forEach(scaleInfo, (scale) => {
      metricByViewByWithMasteryCount[viewByKey][scale.masteryLabel] = 0
      metricByViewByWithMasteryCount[viewByKey][
        `${scale.masteryLabel} Percentage`
      ] = 0
    })

    const metricByMastery = groupBy(metricByViewBy[viewByKey], 'masteryLabel')
    const percentSum = sumBy(
      metricByViewBy[viewByKey],
      (o) => +o.masteryPercentage || 0
    )

    Object.keys(metricByMastery).forEach((key) => {
      // find percentage of current scale records against total records
      const masteryScorePercentage =
        Math.round(
          (sumBy(metricByMastery[key], (o) => +o.masteryPercentage || 0) *
            100) /
            percentSum
        ) || 0
      metricByViewByWithMasteryCount[viewByKey][key] =
        metricByMastery[key].length
      // if key is not mastered mark it negative
      metricByViewByWithMasteryCount[viewByKey][`${key} Percentage`] =
        leastScale.masteryLabel === key
          ? -1 * masteryScorePercentage
          : masteryScorePercentage
    })
  }

  const parsedGroupedMetricData = Object.keys(
    metricByViewByWithMasteryCount
  ).map((id) => ({
    ...findGroupInfo(id, viewBy, skillInfo),
    ...metricByViewByWithMasteryCount[id],
  }))

  return parsedGroupedMetricData.sort((a, b) => a[groupByKey] - b[groupByKey])
}

const getChartScoreData = (report = {}, viewBy) => {
  const { performanceSummaryStats = {}, skillInfo = [] } = report
  const groupByKey = viewBy === viewByMode.STANDARDS ? 'standardId' : 'domainId'
  const filteredMetrics = filter(performanceSummaryStats, (metric) =>
    find(skillInfo, (skill) => skill.standardId === metric.standardId)
  )
  // group data according to the chosen viewBy
  const metricByViewBy = groupBy(filteredMetrics, groupByKey)

  return Object.keys(metricByViewBy).map((id) => {
    const records = metricByViewBy[id]
    const totalTotalScore = sumBy(records, 'totalScore')
    const totalMaxScore = sumBy(records, 'maxScore')
    const totalTotalStudents = sumBy(records, 'totalStudents')
    const maxScore = totalMaxScore / totalTotalStudents
    const totalScore = totalTotalScore / totalTotalStudents
    const percentScore = percentage(totalTotalScore, totalMaxScore)
    return {
      ...findGroupInfo(id, viewBy, skillInfo),
      rawScore: totalScore,
      avgScore: percentScore,
      maxScore,
      totalMaxScore,
      totalTotalScore,
      records,
      diffScore: 100 - round(percentScore),
    }
  })
}

// -----|-----|-----|-----| CHART TRANSFORMERS |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| TABLE TRANSFORMERS |-----|-----|-----|----- //

const getAggregatedMetrics = (data = {}, scaleInfo = []) => {
  const metrics = {}
  Object.keys(data).forEach((id) => {
    const totalMaxScore = sumBy(data[id], 'maxScore')
    const totalTotalStudents = sumBy(data[id], 'totalStudents')
    const totalTotalScore = sumBy(data[id], 'totalScore')
    const totalScore = totalTotalScore / totalTotalStudents
    const maxScore = totalMaxScore / totalTotalStudents
    const percentScore = percentage(totalTotalScore, totalMaxScore)
    const masteryLevel = getMasteryLevel(percentScore, scaleInfo)
    const masteryScore = masteryLevel.score
    const masteryLabel = masteryLevel.masteryLabel
    metrics[id] = {
      totalMaxScore,
      totalTotalStudents,
      totalTotalScore,
      rawScore: totalScore,
      maxScore,
      avgScore: percentScore,
      masteryLabel,
      masteryScore,
    }
  })
  return metrics
}

const getAggregatedSummaryStats = (report = {}, viewBy) => {
  const {
    performanceSummaryStats = {},
    skillInfo = [],
    scaleInfo = [],
  } = report
  const viewByKey = viewBy === viewByMode.STANDARDS ? 'standardId' : 'domainId'

  const filteredAndGroupedMetrics = pick(
    groupBy(performanceSummaryStats, viewByKey),
    map(skillInfo, viewByKey)
  )
  const aggregatedSummaryStats = getAggregatedMetrics(
    filteredAndGroupedMetrics,
    scaleInfo
  )
  return aggregatedSummaryStats
}

const analysisStandardsData = (
  compareBy,
  skillInfo,
  metricInfo = [],
  scaleInfo
) => {
  // if metricInfo is empty return empty data and totalpoints
  if (!metricInfo.length) {
    return []
  }
  const groupingField = makeCompareByColumn(compareBy).key
  const grouped = groupBy(metricInfo, groupingField)

  const data = Object.keys(grouped).map((groupId) => {
    const groupedByStandard = groupBy(grouped[groupId], 'standardId')
    return {
      ...grouped[groupId][0],
      standardMetrics: getAggregatedMetrics(groupedByStandard, scaleInfo),
    }
  })
  return data
}

const analysisDomainsData = (compareBy, skillInfo, metricInfo, scaleInfo) => {
  // if metricInfo is empty return empty data and totalpoints
  if (!metricInfo.length) {
    return []
  }
  const skillsByStandardId = groupBy(skillInfo, 'standardId')
  const domainByStandardId = skillInfo.reduce(
    (total, skill) => ({
      ...total,
      [skill.standardId]: skillsByStandardId[skill.standardId][0].domainId,
    }),
    {}
  )
  const _metricInfo = metricInfo
    .map((item) => ({
      ...item,
      domainId: domainByStandardId[item.standardId],
    }))
    .filter((item) => item.domainId)

  const groupingField = makeCompareByColumn(compareBy).key
  const grouped = groupBy(_metricInfo, groupingField)

  const data = Object.keys(grouped).map((groupId) => {
    const groupedByDomain = groupBy(grouped[groupId], 'domainId')
    return {
      ...grouped[groupId][0],
      standardMetrics: getAggregatedMetrics(groupedByDomain, scaleInfo),
    }
  })

  return data
}

const getAnalyzedTableData = (report, viewBy, compareBy) => {
  const { skillInfo = [], scaleInfo = [], metricInfo = [] } = report

  const filteredMetrics = filter(metricInfo, (metric) =>
    find(skillInfo, (skill) => skill.standardId === metric.standardId)
  )

  const augmentedMetrics = getAugmentedMetricInfo(filteredMetrics, scaleInfo)

  const _analyzedTableData =
    viewBy === viewByMode.STANDARDS
      ? analysisStandardsData(compareBy, skillInfo, augmentedMetrics, scaleInfo)
      : analysisDomainsData(compareBy, skillInfo, augmentedMetrics, scaleInfo)

  const aggSummaryStats = getAggregatedSummaryStats(report, viewBy)

  return [_analyzedTableData, aggSummaryStats]
}

const formatScore = (score, analyzeBy) => {
  switch (analyzeBy) {
    case analyzeByMode.SCORE:
      return `${Math.round(Number(score))}%`
    case analyzeByMode.RAW_SCORE:
      return round(score, 2)
    default:
      return score
  }
}

const getScoresFromRecords = (records = {}) => {
  const scoresArr = Object.keys(records)
    .filter((itemId) => records[itemId])
    .map((itemId) => ({
      totalScore: records[itemId].rawScore || records[itemId].totalScore || 0,
      maxScore: records[itemId].maxScore || 1,
    }))
  return scoresArr
}

const getAnalyzeByConfig = (analyzeBy, scaleInfo) => {
  switch (analyzeBy) {
    case analyzeByMode.MASTERY_LEVEL:
      return {
        field: 'masteryLabel',
        getColor: (standard) =>
          getMasteryLevel(standard.masteryScore, scaleInfo, 'score').color,
        getOverall: (records = {}) => {
          const scoresArr = getScoresFromRecords(records)
          const overallScore = getOverallScore(scoresArr)
          return getMasteryLevel(overallScore, scaleInfo).masteryLabel
        },
      }
    case analyzeByMode.MASTERY_SCORE:
      return {
        field: 'masteryScore',
        getColor: (standard) =>
          getMasteryLevel(standard.masteryScore, scaleInfo, 'score').color,
        getOverall: (records = {}) => {
          const scoresArr = getScoresFromRecords(records)
          const overallScore = getOverallScore(scoresArr)
          return getMasteryLevel(overallScore, scaleInfo).score
        },
      }
    case analyzeByMode.RAW_SCORE:
      return {
        field: 'rawScore',
        getColor: (standard) => getHSLFromRange1(standard.avgScore),
        getOverall: (records = {}) => {
          const scoresArr = getScoresFromRecords(records)
          const overallRawScore = getOverallRawScore(scoresArr)
          return formatScore(overallRawScore, analyzeBy)
        },
      }
    case analyzeByMode.SCORE:
    default:
      return {
        field: 'avgScore',
        getColor: (standard) => getHSLFromRange1(standard.avgScore),
        getOverall: (records = {}) => {
          const scoresArr = getScoresFromRecords(records)
          const overallScore = getOverallScore(scoresArr)
          return formatScore(overallScore, analyzeBy)
        },
      }
  }
}

const getStandardColumnsData = (
  skillInfo,
  viewBy,
  selectedStandards,
  selectedDomains
) => {
  switch (viewBy) {
    case viewByMode.STANDARDS:
      return {
        selected: selectedStandards,
        dataField: 'standardId',
        columnsData: skillInfo.sort((a, b) => a.standardId - b.standardId),
        getColumnConfig: (skill) => ({
          key: skill.standardId,
          title: skill.standard,
        }),
      }
    case viewByMode.DOMAINS:
      return {
        selected: selectedDomains,
        dataField: 'domainId',
        columnsData: uniqBy(skillInfo, 'domainId')
          .filter((o) => o.domain !== null)
          .sort((a, b) => a.domainId - b.domainId),
        getColumnConfig: (skill) => ({
          key: skill.domainId,
          title: skill.domain,
        }),
      }
    default:
    // do nothing
  }
}

// -----|-----|-----|-----| TABLE TRANSFORMERS |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| BACKEND SPECIFIC TRANSFORMERS |-----|-----|-----|----- //

const makeOverallColumn = (viewBy, analyzeByConfig) => {
  return {
    title: `Avg. ${viewBy} Performance`,
    dataIndex: 'overall',
    key: 'overall',
    render: (data, record) =>
      analyzeByConfig.getOverall(record.standardMetrics),
  }
}

const makeStandardColumns = (
  aggSummaryStats,
  standardColumnsData,
  analyzeByConfig
) => {
  const {
    selected,
    dataField,
    columnsData,
    getColumnConfig,
  } = standardColumnsData

  const _makeStandardColumnBE = (skill) => {
    const columnConfig = getColumnConfig(skill)
    const aggSummaryStat = aggSummaryStats[columnConfig.key] || {}
    const totalPoints = aggSummaryStat.totalMaxScore || 0
    const aggColumnValue = aggSummaryStat[analyzeByConfig.field] || ''
    return {
      title: `${columnConfig.title} (Points - ${parseFloat(
        totalPoints.toFixed(2)
      )}) (${analyzeByConfig.formatScore(aggColumnValue)})`,
      dataIndex: 'standardMetrics',
      key: columnConfig.key,
      render: (data, record) => {
        const standard = record.standardMetrics[columnConfig.key]
        return standard
          ? analyzeByConfig.formatScore(standard[analyzeByConfig.field])
          : 'N/A'
      },
    }
  }

  return columnsData
    .filter((skill) => selected.includes(skill[dataField]) || !selected.length)
    .map(_makeStandardColumnBE)
}

const getTableColumns = ({
  standardColumnsData,
  aggSummaryStats,
  compareBy,
  analyzeBy,
  scaleInfo,
  viewBy,
}) => {
  const analyzeByConfig = {
    ...getAnalyzeByConfig(analyzeBy, scaleInfo),
    formatScore: (score) => formatScore(score, analyzeBy),
  }
  const _tableColumns = [
    makeCompareByColumn(compareBy),
    makeOverallColumn(viewBy, analyzeByConfig),
    ...makeStandardColumns(
      aggSummaryStats,
      standardColumnsData,
      analyzeByConfig
    ),
  ]
  if (compareBy === compareByMode.STUDENT) {
    let index = 1
    for (const column of compareByStudentsColumns) {
      _tableColumns.splice(index++, 0, column)
    }
  }
  return _tableColumns
}
const getCsvDataFromTable = (tableData, tableColumns) => {
  const csvHeadings = tableColumns.map((col) => col.title || '')
  const csvData = tableData.map((record) =>
    tableColumns.map((col) => {
      const dataKey = col.dataIndex || col.key
      const data = record[dataKey] || ''
      return `${col.render ? col.render(data, record) : data}`
    })
  )
  return [csvHeadings, ...csvData]
}

const perfByStandardDownloadCSV = ({
  result: _report,
  compareBy,
  viewBy,
  analyzeBy,
  curriculumId,
  selectedStandards,
  selectedDomains,
}) => {
  // Get columns and tableData
  const report = getReportWithFilteredSkills(_report, curriculumId)
  const { scaleInfo, skillInfo } = report
  const [tableData, aggSummaryStats] = getAnalyzedTableData(
    report,
    viewBy,
    compareBy
  )
  const standardColumnsData = getStandardColumnsData(
    skillInfo,
    viewBy,
    selectedStandards,
    selectedDomains
  )
  const tableColumns = getTableColumns({
    standardColumnsData,
    aggSummaryStats,
    compareBy,
    analyzeBy,
    scaleInfo,
    viewBy,
  })
  // tranforming to the arrayCSV
  return getCsvDataFromTable(tableData, tableColumns)
}

// -----|-----|-----|-----| BACKEND SPECIFIC TRANSFORMERS |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

module.exports = {
  // common transformers
  viewByMode,
  sortKeysMap,
  analyzeByMode,
  compareByMode,
  compareByStudentsColumns,
  getReportWithFilteredSkills,
  perfByStandardDownloadCSV,
  // chart transformers
  getYLabelString,
  getChartMasteryData,
  getChartScoreData,
  // table transformers
  getAnalyzedTableData,
  formatScore,
  getAnalyzeByConfig,
  getStandardColumnsData,
  makeOverallColumn,
  makeCompareByColumn,
  compareByModeToName,
  // backend transformers
}

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
} = require('lodash')
const { produce: next } = require('immer')

const {
  percentage,
  getOverallScore,
  getHSLFromRange1,
  DemographicCompareByOptions,
  getCsvDataFromTableBE,
} = require('../common')

const { transformMetricForStudentGroups } = require('./common')

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| COMMON TRANSFORMERS |-----|-----|-----|----- //

const viewByMode = {
  STANDARDS: 'standard',
  DOMAINS: 'domain',
}

const analyzeByMode = {
  SCORE: 'score',
  RAW_SCORE: 'rawScore',
  MASTERY_LEVEL: 'masteryLevel',
  MASTERY_SCORE: 'masteryScore',
}

const compareByMode = {
  SCHOOL: 'school',
  TEACHER: 'teacher',
  CLASS: 'class',
  GROUP: 'group',
  STUDENTS: 'students',
  RACE: 'race',
  GENDER: 'gender',
  FRL_STATUS: 'frlStatus',
  ELL_STATUS: 'ellStatus',
  IEP_STATUS: 'iepStatus',
  HISPANIC_ETHINCITY: 'hispanicEthnicity',
}

const lexicSort = (field) => (a, b) =>
  a[field] >= b[field] ? (a[field] === b[field] ? 0 : 1) : -1

const compareByColumns = {
  [compareByMode.SCHOOL]: {
    title: 'School',
    dataIndex: 'schoolId',
    key: 'schoolId',
    align: 'left',
    fixed: 'left',
    width: 160,
    sorter: lexicSort('schoolName'),
    render: (schoolId, school) => school.schoolName || '-',
  },
  [compareByMode.TEACHER]: {
    title: 'Teacher',
    dataIndex: 'teacherId',
    key: 'teacherId',
    align: 'left',
    fixed: 'left',
    width: 160,
    sorter: lexicSort('teacherName'),
    render: (teacherId, teacher) => teacher.teacherName,
  },
  [compareByMode.CLASS]: {
    title: 'Class',
    dataIndex: 'groupId',
    key: 'groupId',
    align: 'left',
    fixed: 'left',
    width: 160,
    sorter: lexicSort('groupName'),
    render: (groupId, studentClass) => studentClass.groupName,
  },
  [compareByMode.GROUP]: {
    title: 'Student Group',
    dataIndex: 'groupId',
    key: 'groupId',
    align: 'left',
    fixed: 'left',
    width: 160,
    sorter: lexicSort('groupName'),
    render: (groupId, studentClass) => studentClass.groupName,
  },
  [compareByMode.STUDENTS]: {
    title: 'Student',
    dataIndex: 'studentName',
    key: 'studentId',
    align: 'left',
    fixed: 'left',
    width: 160,
    sorter: (a, b) =>
      a.studentName.toLowerCase().localeCompare(b.studentName.toLowerCase()),
  },
  [compareByMode.RACE]: {
    title: 'Race',
    dataIndex: 'race',
    key: 'race',
    fixed: 'left',
    width: 160,
    sorter: lexicSort('race'),
    render: (race) => (race ? capitalize(race) : '-'),
  },
  [compareByMode.GENDER]: {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    fixed: 'left',
    width: 160,
    render: (gender) => (gender ? capitalize(gender) : '-'),
  },
  [compareByMode.FRL_STATUS]: {
    title: 'FRL Status',
    dataIndex: 'frlStatus',
    key: 'frlStatus',
    fixed: 'left',
    width: 160,
    render: (status) => (status ? capitalize(status) : '-'),
  },
  [compareByMode.ELL_STATUS]: {
    title: 'ELL Status',
    dataIndex: 'ellStatus',
    key: 'ellStatus',
    fixed: 'left',
    width: 160,
    render: (status) => (status ? capitalize(status) : '-'),
  },
  [compareByMode.IEP_STATUS]: {
    title: 'IEP Status',
    dataIndex: 'iepStatus',
    key: 'iepStatus',
    fixed: 'left',
    width: 160,
    render: (status) => (status ? capitalize(status) : '-'),
  },
  [compareByMode.HISPANIC_ETHINCITY]: {
    title: 'Hispanic Ethnicity',
    dataIndex: 'hispanicEthnicity',
    key: 'hispanicEthnicity',
    fixed: 'left',
    width: 160,
    render: (he) => (he ? capitalize(he) : '-'),
  },
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

const augmentMetricInfoWithStudentInfo = (
  studInfo,
  teacherInfo,
  metricInfo
) => {
  const normalizedStudInfo = studInfo.reduce(
    (total, student) => ({
      ...total,
      [student.studentId]: student,
    }),
    {}
  )

  const normalizedTeacherInfo = teacherInfo.reduce(
    (total, teacher) => ({
      ...total,
      [teacher.groupId]: teacher,
    }),
    {}
  )

  return metricInfo.map((metric) => ({
    ...metric,
    ...normalizedStudInfo[metric.studentId],
    ...normalizedTeacherInfo[metric.groupId],
  }))
}

const chartFilterMetricInfo = (
  studInfo,
  metricInfo,
  teacherInfo,
  skillInfo = []
) => {
  const filteredMetrics = filter(metricInfo, (metric) =>
    find(skillInfo, (skill) => skill.standardId === metric.standardId)
  )

  const metricsWithStudent = augmentMetricInfoWithStudentInfo(
    studInfo,
    teacherInfo,
    filteredMetrics
  )

  return metricsWithStudent
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

const getReportWithFilteredSkills = (report, scaleInfo, curriculumId) =>
  next(report, (draftReport) => {
    draftReport.skillInfo = filter(
      draftReport.skillInfo,
      (skill) => String(skill.curriculumId) === String(curriculumId)
    )
    draftReport.scaleInfo =
      (draftReport.scaleInfo && draftReport.scaleInfo.scale) || scaleInfo
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

    Object.keys(metricByMastery).forEach((key) => {
      // find percentage of current scale records against total records
      const masteryScorePercentage = +(
        metricByMastery[key][0].masteryPercentage || 0
      )
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
    return [[], []]
  }
  const groupingField = compareByColumns[compareBy].key
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
    return [[], []]
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

  const groupingField = compareByColumns[compareBy].key
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

const getFormattedName = (name) => {
  const nameArr = (name || '').trim().split(' ')
  const lName = nameArr.splice(nameArr.length - 1)[0]
  return nameArr.length ? `${lName}, ${nameArr.join(' ')}` : lName
}

const getAnalyzedTableData = (report, viewBy, compareBy) => {
  const {
    studInfo = [],
    teacherInfo = [],
    skillInfo = [],
    scaleInfo = [],
    metricInfo = [],
  } = report

  let filteredMetrics
  if (compareBy === 'group') {
    const metricByStudentGroup = transformMetricForStudentGroups(
      teacherInfo,
      metricInfo
    )
    filteredMetrics = chartFilterMetricInfo(
      studInfo,
      metricByStudentGroup,
      teacherInfo,
      skillInfo
    )
  } else {
    filteredMetrics = chartFilterMetricInfo(
      studInfo,
      metricInfo,
      teacherInfo,
      skillInfo
    )
  }
  filteredMetrics = augmentMetricInfoWithMasteryScore(
    filteredMetrics,
    scaleInfo
  )
  if (DemographicCompareByOptions.includes(compareBy)) {
    filteredMetrics = orderBy(filteredMetrics, compareBy, ['asc'])
  }

  const _analyzedTableData =
    viewBy === viewByMode.STANDARDS
      ? analysisStandardsData(compareBy, skillInfo, filteredMetrics, scaleInfo)
      : analysisDomainsData(compareBy, skillInfo, filteredMetrics, scaleInfo)

  // format student names in the data & sort in ascending order
  const analyzedTableData = _analyzedTableData
    .map((d) => ({
      ...d,
      studentName: getFormattedName(`${d.firstName || ''} ${d.lastName || ''}`),
    }))
    .sort((a, b) =>
      a.studentName.toLowerCase().localeCompare(b.studentName.toLowerCase())
    )

  const aggSummaryStats = getAggregatedSummaryStats(report, viewBy)

  return [analyzedTableData, aggSummaryStats]
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

const makeOverallColumnBE = (standardColumnsData, analyzeByConfig, viewBy) => {
  const { selected, dataField } = standardColumnsData

  const getAverage = (student) => {
    const standardMetrics = Object.values(student.standardMetrics).filter(
      (metric) => selected.includes(metric[dataField]) || !selected.length
    )
    const field = analyzeByConfig.field
    const sumTotal = (total, metric) => total + metric[field]
    const overall = standardMetrics.reduce(sumTotal, 0)
    return overall / (standardMetrics.length || 1)
  }

  return {
    title: `Avg. ${viewBy} Performance`,
    dataIndex: 'overall',
    key: 'overall',
    fixed: 'left',
    width: 160,
    sorter: (a, b) => getAverage(a) - getAverage(b),
    render: (data, record) =>
      analyzeByConfig.getOverall(record.standardMetrics),
  }
}

const makeStandardColumnsBE = (
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

const populateBackendCSV = ({
  result: _report,
  scaleInfo: _scaleInfo,
  compareBy,
  viewBy,
  analyzeBy,
  curriculumId,
  selectedStandards,
  selectedDomains,
}) => {
  const report = getReportWithFilteredSkills(_report, _scaleInfo, curriculumId)

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
  const analyzeByConfig = {
    ...getAnalyzeByConfig(analyzeBy, scaleInfo),
    formatScore: (score) => formatScore(score, analyzeBy),
  }

  const _getTableColumnsBE = () => {
    const _tableColumns = [
      compareByColumns[compareBy],
      makeOverallColumnBE(standardColumnsData, analyzeByConfig, viewBy),
      ...makeStandardColumnsBE(
        aggSummaryStats,
        standardColumnsData,
        analyzeByConfig
      ),
    ]
    if (compareBy === 'students') {
      let index = 1
      for (const column of compareByStudentsColumns) {
        _tableColumns.splice(index++, 0, column)
      }
    }
    return _tableColumns
  }
  const tableColumns = _getTableColumnsBE()

  return getCsvDataFromTableBE(tableData, tableColumns)
}

// -----|-----|-----|-----| BACKEND SPECIFIC TRANSFORMERS |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

module.exports = {
  // common transformers
  viewByMode,
  analyzeByMode,
  compareByMode,
  compareByColumns,
  compareByStudentsColumns,
  getReportWithFilteredSkills,
  // chart transformers
  getYLabelString,
  getChartMasteryData,
  getChartScoreData,
  // table transformers
  getAnalyzedTableData,
  formatScore,
  getAnalyzeByConfig,
  getStandardColumnsData,
  // backend transformers
  populateBackendCSV,
}

import {
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
  mapValues,
} from 'lodash'
import next from 'immer'
import {
  percentage,
  getOverallScore,
  DemographicCompareByOptions,
} from '../../../../common/util'
import { transformMetricForStudentGroups } from '../../common/utils/transformers'

export const viewByMode = {
  STANDARDS: 'standard',
  DOMAINS: 'domain',
}

export const analyzeByMode = {
  SCORE: 'score',
  RAW_SCORE: 'rawScore',
  MASTERY_LEVEL: 'masteryLevel',
  MASTERY_SCORE: 'masteryScore',
}

export const compareByMode = {
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

export const getYLabelString = (analyzeBy) => {
  switch (analyzeBy) {
    case analyzeByMode.RAW_SCORE:
      return 'Avg. score'
    case analyzeByMode.MASTERY_LEVEL:
    case analyzeByMode.MASTERY_SCORE:
      return 'Student (%)'
    default:
      return 'Avg. score (%)'
  }
}

export const compareByColumns = {
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

export const getFormattedName = (name) => {
  const nameArr = (name || '').trim().split(' ')
  const lName = nameArr.splice(nameArr.length - 1)[0]
  return nameArr.length ? `${lName}, ${nameArr.join(' ')}` : lName
}

export const getOverallRawScore = (metrics = []) =>
  metrics.length ? sumBy(metrics, 'totalScore') / metrics.length : 0

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
  chartFilters = {},
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

const getStandardMetrics = (data = {}, scaleInfo = []) =>
  next(data, (draft) => {
    Object.keys(draft).forEach((dataId) => {
      const score = getOverallScore(draft[dataId].metric)
      const masteryLevel = getMasteryLevel(score, scaleInfo)
      draft[dataId] = {
        masteryScore: masteryLevel.score,
        masteryLabel: masteryLevel.masteryLabel,
        avgScore: score,
        rawScore: getOverallRawScore(draft[dataId].metric),
        maxScore: draft[dataId].maxScore,
        records: draft[dataId].metric,
      }
    })
  })

const analysisStandardsData = (compareBy, metricInfo = [], scaleInfo) => {
  // if metricInfo is empty return empty data and totalpoints
  if (!metricInfo.length) {
    return [[], []]
  }

  const groupingField = compareByColumns[compareBy].key

  const grouped = groupBy(metricInfo, groupingField)

  const data = Object.keys(grouped).map((groupId) => {
    const groupedByStandard = groupBy(grouped[groupId], 'standardId')

    const standardsData = {}

    Object.keys(groupedByStandard).forEach((standardId) => {
      let currentStandard = standardsData[standardId]

      currentStandard = {
        maxScore: groupedByStandard[standardId][0].maxScore,
        metric: groupedByStandard[standardId],
      }

      standardsData[standardId] = currentStandard
    })

    return {
      ...grouped[groupId][0],
      standardMetrics: getStandardMetrics(standardsData, scaleInfo),
    }
  })

  const totalPoints = mapValues(
    data[0].standardMetrics,
    (metric) => metric.maxScore
  )

  return [data, totalPoints]
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

  const groupingField = compareByColumns[compareBy].key

  const grouped = groupBy(metricInfo, groupingField)

  const data = Object.keys(grouped).map((groupId) => {
    const groupedByStandard = groupBy(grouped[groupId], 'standardId')

    const domainsData = {}

    Object.keys(groupedByStandard).forEach((standardId) => {
      const domainId = domainByStandardId[standardId]
      if (domainId) {
        let currentDomain = domainsData[domainByStandardId[standardId]]

        if (currentDomain) {
          currentDomain = {
            maxScore:
              currentDomain.maxScore +
              groupedByStandard[standardId][0].maxScore,
            metric: currentDomain.metric.concat(groupedByStandard[standardId]),
          }
        } else {
          currentDomain = {
            maxScore: groupedByStandard[standardId][0].maxScore,
            metric: groupedByStandard[standardId],
          }
        }

        domainsData[domainByStandardId[standardId]] = currentDomain
      }
    })

    return {
      ...grouped[groupId][0],
      standardMetrics: getStandardMetrics(domainsData, scaleInfo),
    }
  })

  const totalPoints = mapValues(
    data[0].standardMetrics,
    (metric) => metric.maxScore
  )

  return [data, totalPoints]
}

export const analysisParseData = (report, viewBy, compareBy, filters) => {
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
      filters,
      skillInfo
    )
  } else {
    filteredMetrics = chartFilterMetricInfo(
      studInfo,
      metricInfo,
      teacherInfo,
      filters,
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
  switch (viewBy) {
    case viewByMode.STANDARDS:
      return analysisStandardsData(compareBy, filteredMetrics, scaleInfo)
    case viewByMode.DOMAINS:
      return analysisDomainsData(
        compareBy,
        skillInfo,
        filteredMetrics,
        scaleInfo
      )
    default:
      return []
  }
}

export const getLeastMasteryLevel = (scaleInfo = []) =>
  orderBy(scaleInfo, 'threshold', ['desc'])[scaleInfo.length - 1] || {
    masteryLabel: '',
    score: 0,
  }

export const getMasteryLevel = (score, scaleInfo, field = 'threshold') => {
  const orderedScaleInfo = orderBy(scaleInfo, 'threshold', ['desc'])
  return (
    find(orderedScaleInfo, (info) => ceil(score) >= info[field]) ||
    getLeastMasteryLevel(scaleInfo)
  )
}

export const getMasteryScore = (score, scaleInfo) =>
  getMasteryLevel(score, scaleInfo).score

export const findSkillUsingStandard = (standardId, skillInfo) =>
  find(skillInfo, (skill) => skill.standardId === standardId) || {}

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

export const getChartMasteryData = (report = {}, viewBy, leastScale) => {
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

const getChartOverallRawScore = (metrics) =>
  sumBy(metrics, 'totalScore') / sumBy(metrics, 'totalStudents')

export const getChartScoreData = (report = {}, viewBy) => {
  const { performanceSummaryStats = {}, skillInfo = [] } = report
  const groupByKey = viewBy === viewByMode.STANDARDS ? 'standardId' : 'domainId'

  const filteredMetrics = filter(performanceSummaryStats, (metric) =>
    find(skillInfo, (skill) => skill.standardId === metric.standardId)
  )
  // group data according to the chosen viewBy
  const metricByViewBy = groupBy(filteredMetrics, groupByKey)

  return Object.keys(metricByViewBy).map((id) => {
    const records = metricByViewBy[id]
    const maxScore = records[0].maxScore / records[0].totalStudents
    const rawScore = getChartOverallRawScore(records)
    const avgScore = getOverallScore(records)
    return {
      ...findGroupInfo(id, viewBy, skillInfo),
      rawScore,
      avgScore,
      maxScore,
      records,
      diffScore: 100 - round(avgScore),
    }
  })
}

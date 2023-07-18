import {
  groupBy,
  sumBy,
  isEmpty,
  maxBy,
  get,
  minBy,
  round,
  sum,
  mapValues,
  isNaN,
} from 'lodash'

import {
  reportUtils,
  dataWarehouse as dataWarehouseConstants,
} from '@edulastic/constants'
import {
  EXTERNAL_SCORE_TYPES,
  compareByOptions,
  compareByOptionsInfo,
  getExternalScoreFormattedByType,
} from '../common/utils'

const {
  getProficiencyBand,
  percentage,
  TABLE_SORT_ORDER_TYPES,
} = reportUtils.common
const { getAchievementLevels } = dataWarehouseConstants

/**
 * NOTE: the constants declared here affects only the Multiple Assessment Report in Data Warehouse
 */

export const TABLE_PAGE_SIZE = 25

export const staticDropDownData = {
  filterSections: {
    TEST_FILTERS: {
      key: '0',
      title: 'Select Assessments',
    },
    CLASS_FILTERS: {
      key: '1',
      title: 'Select Classes',
    },
    PERFORMANCE_FILTERS: {
      key: '2',
      title: 'Performance',
    },
    DEMOGRAPHIC_FILTERS: {
      key: '3',
      title: 'Demographics',
    },
  },
  tagTypes: [
    { key: 'termId', tabKey: '0' },
    { key: 'testGrades', subType: 'test', tabKey: '0' },
    { key: 'testSubjects', subType: 'test', tabKey: '0' },
    { key: 'tagIds', tabKey: '0' },
    { key: 'assessmentTypes', tabKey: '0' },
    { key: 'testIds', tabKey: '0' },
    { key: 'schoolIds', tabKey: '1' },
    { key: 'teacherIds', tabKey: '1' },
    { key: 'grades', subType: 'class', tabKey: '1' },
    { key: 'subjects', subType: 'class', tabKey: '1' },
    { key: 'assignedBy', tabKey: '1' },
    { key: 'courseId', tabKey: '1' },
    { key: 'classIds', tabKey: '1' },
    { key: 'groupIds', tabKey: '1' },
    { key: 'profileId', tabKey: '2' },
    { key: 'race', tabKey: '3' },
    { key: 'gender', tabKey: '3' },
    { key: 'iepStatus', tabKey: '3' },
    { key: 'frlStatus', tabKey: '3' },
    { key: 'ellStatus', tabKey: '3' },
    { key: 'hispanicEthnicity', tabKey: '3' },
  ],
  initialFilters: {
    reportId: '',
    termId: '',
    testGrades: '',
    testSubjects: '',
    tagIds: '',
    assessmentTypes: '',
    testIds: '',
    schoolIds: '',
    teacherIds: '',
    grades: '',
    subjects: '',
    courseId: 'All',
    classIds: '',
    groupIds: '',
    profileId: '',
    externalScoreType: 'scaledScore',
    assignedBy: 'anyone',
    race: 'all',
    gender: 'all',
    iepStatus: 'all',
    frlStatus: 'all',
    ellStatus: 'all',
    hispanicEthnicity: 'all',
  },
  requestFilters: {
    reportId: '',
    termId: '',
    testSubjects: '',
    testGrades: '',
    assessmentTypes: '',
    tagIds: '',
    testIds: '',
    schoolIds: '',
    teacherIds: '',
    subjects: '',
    grades: '',
    courseId: '',
    classIds: '',
    groupIds: '',
    profileId: '',
    race: 'all',
    gender: 'all',
    iepStatus: 'all',
    frlStatus: 'all',
    ellStatus: 'all',
    hispanicEthnicity: 'all',
  },
  subjects: [
    { key: 'Mathematics', title: 'Mathematics' },
    { key: 'ELA', title: 'ELA' },
    { key: 'Science', title: 'Science' },
    { key: 'Social Studies', title: 'Social Studies' },
    { key: 'Computer Science', title: 'Computer Science' },
    { key: 'Other Subjects', title: 'Other Subjects' },
  ],
  grades: [
    { key: 'TK', title: 'PreKindergarten' },
    { key: 'K', title: 'Kindergarten' },
    { key: '1', title: 'Grade 1' },
    { key: '2', title: 'Grade 2' },
    { key: '3', title: 'Grade 3' },
    { key: '4', title: 'Grade 4' },
    { key: '5', title: 'Grade 5' },
    { key: '6', title: 'Grade 6' },
    { key: '7', title: 'Grade 7' },
    { key: '8', title: 'Grade 8' },
    { key: '9', title: 'Grade 9' },
    { key: '10', title: 'Grade 10' },
    { key: '11', title: 'Grade 11' },
    { key: '12', title: 'Grade 12' },
    { key: 'O', title: 'Other' },
  ],
  assignedBy: [
    { key: 'anyone', title: 'Anyone' },
    { key: 'me', title: 'Me' },
  ],
}

export const sortKeys = {
  COMPARE_BY: 'compareBy',
}

export const compareByMap = mapValues(compareByOptionsInfo, ({ name }) => name)

export const tableColumnsData = [
  {
    dataIndex: sortKeys.COMPARE_BY,
    key: sortKeys.COMPARE_BY,
    align: 'left',
    fixed: 'left',
    width: 200,
    sorter: true,
  },
  // next up are dynamic columns for each assessment
]

export const getCompareByOptions = (userRole) => {
  return compareByOptions.filter(
    (d) => !d.hiddenFromRole || !d.hiddenFromRole.includes(userRole)
  )
}

const groupByCompareByKey = (metricInfo, compareBy) => {
  switch (compareBy) {
    case 'school':
      return groupBy(metricInfo, 'schoolId')
    case 'student':
      return groupBy(metricInfo, 'studentId')
    case 'class':
    case 'group':
      return groupBy(metricInfo, 'groupId')
    case 'teacher':
      return groupBy(metricInfo, 'teacherId')
    case 'race':
      return groupBy(metricInfo, 'race')
    case 'gender':
      return groupBy(metricInfo, 'gender')
    case 'ellStatus':
      return groupBy(metricInfo, 'ellStatus')
    case 'iepStatus':
      return groupBy(metricInfo, 'iepStatus')
    case 'hispanicEthnicity':
      return groupBy(metricInfo, 'hispanicEthnicity')
    case 'frlStatus':
      return groupBy(metricInfo, 'frlStatus')
    case 'standard':
      return groupBy(metricInfo, 'standardId')
    default:
      return {}
  }
}

const findTestWithAverageBand = (tests) => {
  const NO_RANK = 0
  const weightedAverageRank =
    sum(
      tests.map((t) => get(t, 'band.rank', NO_RANK) * t.totalStudentCount || 0)
    ) / sumBy(tests, 'totalStudentCount')
  const item = minBy(
    tests,
    (el) => get(el, 'band.rank', NO_RANK) - weightedAverageRank
  )
  return item
}

const getWeightedAchievementLevel = (records) => {
  const weightedAverage =
    sum(
      records.map(
        (record) => (record.achievementLevel || 0) * (record.totalGraded || 0)
      )
    ) / sum(records.map((record) => parseInt(record.totalGraded || 0, 10)))

  return round(weightedAverage || 0, 2)
}

const getLineScoreForExternalData = (records, achievementLevel) => {
  const lineScoreForExternalData = (records || []).reduce((acc, record) => {
    if (record.id < achievementLevel) {
      acc += record.totalGradedPercentage
    } else if (record.id === achievementLevel) {
      acc += round(record.totalGradedPercentage / 2, 2)
    }
    return acc
  }, 0)
  return lineScoreForExternalData
}

const augmentBandData = (tests, bandInfo, externalBands) => {
  const testsWithBandInfo = tests.map((t) => {
    let band = { name: '-', color: '#010101' }
    if (t.externalTestType) {
      const achievementLevels = getAchievementLevels(
        {
          ...t,
          title: t.testName,
        },
        externalBands
      )
      band = achievementLevels.find((al) => al.active)
      return {
        ...t,
        bands: achievementLevels,
        band,
      }
    }
    band = getProficiencyBand(t.averageScorePercentage, bandInfo)
    return { ...t, band }
  })
  return testsWithBandInfo
}

const getAggregatedDataByUniqId = (metricInfo, filters = {}) => {
  const { externalScoreType } = filters
  const groupedByUniqId = groupBy(metricInfo, 'uniqId')
  return Object.keys(groupedByUniqId)
    .map((uniqId) => {
      const {
        testName = 'N/A',
        isIncomplete = false,
        ...testData
      } = groupedByUniqId[uniqId].reduce(
        (res, ele) => {
          const _isIncomplete = ele.isIncomplete || res.isIncomplete
          const _res =
            parseInt(ele.assessmentDate, 10) > res.assessmentDate ? ele : res
          return {
            ..._res,
            assessmentDate: parseInt(_res.assessmentDate, 10),
            totalTotalScore:
              (parseFloat(ele.totalScore, 10) || 0) + res.totalTotalScore,
            totalTotalLexileScore:
              parseFloat(ele.totalLexileScore, 10) + res.totalTotalLexileScore,
            totalTotalQuantileScore:
              parseFloat(ele.totalQuantileScore, 10) +
              res.totalTotalQuantileScore,
            totalMaxScore:
              (parseFloat(ele.maxScore, 10) || 0) + res.totalMaxScore,
            totalStudentCount:
              (parseInt(ele.totalStudentCount, 10) || 0) +
              parseInt(res.totalStudentCount, 10),
            isIncomplete: _isIncomplete,
          }
        },
        {
          assessmentDate: 0,
          totalTotalScore: 0,
          totalTotalLexileScore: 0,
          totalTotalQuantileScore: 0,
          totalMaxScore: 0,
          totalStudentCount: 0,
        }
      )
      const { band, bands } = findTestWithAverageBand(groupedByUniqId[uniqId])
      testData.band = band
      if (bands) testData.bands = bands
      let totalTotalScore = round(testData.totalTotalScore, 2)
      let averageScore =
        testData.totalTotalScore /
          (testData.externalTestType
            ? testData.totalStudentCount
            : testData.totalMaxScore) || 0
      let averageScorePercentage = averageScore * 100
      if (
        testData.externalTestType &&
        externalScoreType === EXTERNAL_SCORE_TYPES.LEXILE_SCORE &&
        !isNaN(testData.totalTotalLexileScore)
      ) {
        totalTotalScore = getExternalScoreFormattedByType(
          testData.totalTotalLexileScore,
          externalScoreType
        )
        const _averageScore =
          testData.totalTotalLexileScore / testData.totalStudentCount
        averageScore = getExternalScoreFormattedByType(
          _averageScore,
          externalScoreType
        )
        averageScorePercentage = _averageScore * 100
      } else if (
        testData.externalTestType &&
        externalScoreType === EXTERNAL_SCORE_TYPES.QUANTILE_SCORE &&
        !isNaN(testData.totalTotalQuantileScore)
      ) {
        totalTotalScore = getExternalScoreFormattedByType(
          testData.totalTotalQuantileScore,
          externalScoreType
        )
        const _averageScore =
          testData.totalTotalQuantileScore / testData.totalStudentCount
        averageScore = getExternalScoreFormattedByType(
          _averageScore,
          externalScoreType
        )
        averageScorePercentage = _averageScore * 100
      }
      // mix of averageScore(total/count) & averageFractionalScore(total/max)
      const _testName = testData.externalTestType
        ? testName
        : `${testName} (${testData.testType})`
      return {
        ...testData,
        testName: _testName,
        isIncomplete,
        totalTotalScore,
        averageScore,
        averageScorePercentage: round(averageScorePercentage),
      }
    })
    .sort((a, b) => b.assessmentDate - a.assessmentDate)
}

export const getTableData = (
  metricInfo = [],
  externalMetricInfo = [],
  bandInfo = [],
  externalBands = [],
  compareByKey,
  sortFilters,
  filters = {}
) => {
  // fallback to prevent intermittent crashes when bandInfo is empty
  const _metricInfo = isEmpty(bandInfo) ? [] : metricInfo
  // filter out external tests data without achievement level
  const filteredExternalMetricInfo = externalMetricInfo
    .filter((t) => t.externalTestType && t.achievementLevel)
    .map((t) => ({
      ...t,
      assessmentDate: +t.assessmentDate,
      achievementLevel: +t.achievementLevel,
    }))
  const compositeMetricInfo = [
    ..._metricInfo,
    ...filteredExternalMetricInfo,
  ].map((t) => ({
    ...t,
    // uniqId represents a combination of testId and testType
    uniqId: `${t.testId}_${t.testType || t.externalTestType}`,
    averageScorePercentage: t.externalTestType
      ? undefined
      : (t.totalScore * 100) / t.maxScore || 0,
  }))
  const compositeMetricInfoWithBandData = augmentBandData(
    compositeMetricInfo,
    bandInfo,
    externalBands
  )

  // table data for each assessment
  const groupedByCompareByKey = groupByCompareByKey(
    compositeMetricInfoWithBandData,
    compareByKey
  )
  const compareByLabelKey = compareByMap[compareByKey]
  let tableData = Object.keys(groupedByCompareByKey).map((compareByValue) => {
    const _data = groupedByCompareByKey[compareByValue]
    const tests = getAggregatedDataByUniqId(_data, filters)
    const totalStudentCount = sumBy(Object.values(tests), 'totalStudentCount')
    const [firstTest] = tests
    const compareByLabelValue = firstTest[compareByLabelKey]
    return {
      id: compareByValue,
      [compareByKey]: compareByValue,
      [compareByLabelKey]: compareByLabelValue,
      totalStudentCount,
      tests,
    }
  })
  if (sortFilters.sortKey === sortKeys.COMPARE_BY) {
    tableData = tableData.sort((a, b) => {
      return sortFilters.sortOrder === TABLE_SORT_ORDER_TYPES.ASCEND
        ? a[compareByLabelKey].localeCompare(b[compareByLabelKey])
        : b[compareByLabelKey].localeCompare(a[compareByLabelKey])
    })
  }

  return tableData
}

export const getChartData = (
  metricInfo = [],
  externalMetricInfo = [],
  bandInfo = [],
  externalBands = [],
  filters = {}
) => {
  const { externalScoreType } = filters
  // fallback to prevent intermittent crashes when bandInfo is empty
  let _metricInfo = isEmpty(bandInfo) ? [] : metricInfo
  // filter out external tests data without achievement level
  const filteredExternalMetricInfo = externalMetricInfo
    .filter((t) => t.externalTestType && t.achievementLevel)
    .map((t) => ({
      ...t,
      assessmentDate: +new Date(t.assessmentDate),
      achievementLevel: +t.achievementLevel,
    }))
  if (isEmpty(metricInfo) && isEmpty(filteredExternalMetricInfo)) {
    return []
  }
  const _bandInfo = bandInfo.sort((a, b) => b.threshold - a.threshold)

  // curate chart data for internal tests
  _metricInfo = _metricInfo.map((t) => ({
    ...t,
    // uniqId represents a combination of testId and testType
    uniqId: `${t.testId}_${t.testType}`,
  }))
  const internalGroupedByUniqId = groupBy(_metricInfo, 'uniqId')
  const internalChartData = Object.keys(internalGroupedByUniqId).map(
    (uniqId) => {
      const records = internalGroupedByUniqId[uniqId]
      const [defaultTestData] = records
      const {
        testName = 'N/A',
        isIncomplete = false,
        ...testData
      } = records.reduce(
        (res, ele) => {
          const _isIncomplete = ele.isIncomplete || res.isIncomplete
          const _res =
            parseInt(ele.assessmentDate, 10) > res.assessmentDate ? ele : res
          const _totalGraded = parseInt(ele.totalGraded || 0, 10) || 0
          const _totalScore = parseFloat(ele.totalScore || 0, 10) || 0
          const _totalMaxScore =
            parseFloat(ele.maxPossibleScore || 0) * _totalGraded
          return {
            ..._res,
            assessmentDate: parseInt(_res.assessmentDate, 10),
            isIncomplete: _isIncomplete,
            totalGraded: res.totalGraded + _totalGraded,
            totalScore: res.totalScore + _totalScore,
            totalMaxScore: res.totalMaxScore + _totalMaxScore,
          }
        },
        {
          ...defaultTestData,
          assessmentDate: 0,
          totalGraded: 0,
          totalScore: 0,
          totalMaxScore: 0,
        }
      )

      const averageScore = percentage(
        testData.totalScore,
        testData.totalMaxScore
      )
      const averageScoreBand =
        _bandInfo.find((band) => band.threshold < averageScore) || bandInfo[0]

      // curate records for each performance band
      const _records = _bandInfo.map((band) => {
        const _default = {
          totalGraded: 0,
          totalGradedPercentage: 0,
          threshold: band.threshold,
          color: band.color,
          bandName: band.name,
          aboveStandard: band.aboveStandard,
        }
        const _record = records.find((r) => r.bandScore == band.threshold) || {}
        if (parseInt(_record.totalGraded, 10)) {
          _record.totalGradedPercentage = round(
            percentage(_record.totalGraded, testData.totalGraded),
            2
          )
        }
        return { ..._default, ..._record }
      })

      return {
        ...testData,
        uniqId,
        testName: `${testName} (${testData.testType})`,
        isIncomplete,
        totalScore: round(testData.totalScore, 2),
        lineScore: round(averageScore, 2),
        averageScore: round(averageScore, 2),
        maxScore: get(maxBy(records, 'maxScore'), 'maxScore', 0),
        minScore: get(minBy(records, 'minScore'), 'minScore', 0),
        maxPossibleScore: (
          records.find((r) => r.maxPossibleScore) || records[0]
        ).maxPossibleScore,
        records: _records,
        bandName: averageScoreBand.name,
        color: averageScoreBand.color,
      }
    }
  )

  // curate chart data for external tests
  const _filteredExternalMetricInfo = filteredExternalMetricInfo.map((t) => ({
    ...t,
    // uniqId represents a combination of testId and testType
    uniqId: `${t.testId}_${t.externalTestType}`,
  }))
  const externalGroupedByUniqId = groupBy(_filteredExternalMetricInfo, 'uniqId')
  const externalChartData = Object.keys(externalGroupedByUniqId).map(
    (uniqId) => {
      const records = externalGroupedByUniqId[uniqId]
      const { testName = 'N/A', ...testData } = externalGroupedByUniqId[
        uniqId
      ].reduce(
        (res, ele) => {
          const _res =
            parseInt(ele.assessmentDate, 10) > res.assessmentDate ? ele : res
          const _totalGraded = parseInt(ele.totalGraded || 0, 10) || 0
          const _totalScore = parseFloat(ele.totalScore || 0, 10) || 0
          const _totalLexileScore = parseFloat(ele.totalLexileScore, 10)
          const _totalQuantileScore = parseFloat(ele.totalQuantileScore, 10)
          const _totalMaxScore = parseFloat(ele.maxScore || 0) * _totalGraded
          const _totalLexileMaxScore =
            parseFloat(ele.totalLexileMaxScore) * _totalGraded
          const _totalQuantileMaxScore =
            parseFloat(ele.totalQuantileMaxScore) * _totalGraded
          return {
            ..._res,
            assessmentDate: parseInt(_res.assessmentDate, 10),
            totalGraded: res.totalGraded + _totalGraded,
            totalScore: res.totalScore + _totalScore,
            totalLexileScore: res.totalLexileScore + _totalLexileScore,
            totalQuantileScore: res.totalQuantileScore + _totalQuantileScore,
            totalMaxScore: res.totalMaxScore + _totalMaxScore,
            totalLexileMaxScore: res.totalLexileMaxScore + _totalLexileMaxScore,
            totalQuantileMaxScore:
              res.totalQuantileMaxScore + _totalQuantileMaxScore,
          }
        },
        {
          assessmentDate: 0,
          totalGraded: 0,
          totalScore: 0,
          totalLexileScore: 0,
          totalQuantileScore: 0,
          totalMaxScore: 0,
          totalLexileMaxScore: 0,
          totalQuantileMaxScore: 0,
        }
      )
      testData.achievementLevel = getWeightedAchievementLevel(
        externalGroupedByUniqId[uniqId]
      )

      let totalScore = testData.totalScore
      let minScore = get(maxBy(records, 'minScore'), 'minScore', 0)
      let maxScore = get(maxBy(records, 'maxScore'), 'maxScore', 0)
      let averageScore = testData.totalScore / testData.totalGraded || 0
      if (
        externalScoreType == EXTERNAL_SCORE_TYPES.LEXILE_SCORE &&
        !isNaN(testData.totalLexileScore)
      ) {
        totalScore = getExternalScoreFormattedByType(
          testData.totalLexileScore,
          externalScoreType
        )
        minScore = getExternalScoreFormattedByType(
          get(maxBy(records, 'minLexileScore'), 'minLexileScore', 0),
          externalScoreType
        )
        maxScore = getExternalScoreFormattedByType(
          get(maxBy(records, 'maxLexileScore'), 'maxLexileScore', 0),
          externalScoreType
        )
        averageScore = getExternalScoreFormattedByType(
          testData.totalLexileScore / testData.totalGraded,
          externalScoreType
        )
      } else if (
        externalScoreType == EXTERNAL_SCORE_TYPES.QUANTILE_SCORE &&
        !isNaN(testData.totalQuantileScore)
      ) {
        totalScore = getExternalScoreFormattedByType(
          testData.totalQuantileScore,
          externalScoreType
        )
        minScore = getExternalScoreFormattedByType(
          get(maxBy(records, 'minQuantileScore'), 'minQuantileScore', 0),
          externalScoreType
        )
        maxScore = getExternalScoreFormattedByType(
          get(maxBy(records, 'maxLexileScore'), 'maxQuantileScore', 0),
          externalScoreType
        )
        averageScore = getExternalScoreFormattedByType(
          testData.totalQuantileScore / testData.totalGraded,
          externalScoreType
        )
      }

      // curate records for each performance criteria of external test
      let _records = []

      const _achievementLevels = getAchievementLevels(
        {
          ...testData,
          title: testData.testName || testName,
        },
        externalBands
      )
      testData.bands = _achievementLevels
      testData.band = _achievementLevels.find((al) => al.active)
      _records = _achievementLevels.map((band) => {
        const _default = {
          totalGraded: 0,
          totalGradedPercentage: 0,
          id: band.id,
          color: band.color,
          bandName: band.name,
        }
        const _recordsWithBands = augmentBandData(records, null, externalBands)
        const _record =
          _recordsWithBands.find((r) => r?.band?.id == band.id) || {}
        if (parseInt(_record.totalGraded, 10)) {
          _record.totalGradedPercentage = round(
            percentage(_record.totalGraded, testData.totalGraded),
            2
          )
        }
        return { ..._default, ..._record }
      })

      const lineScore = getLineScoreForExternalData(
        _records,
        round(testData.achievementLevel)
      )

      return {
        ...testData,
        uniqId,
        testName,
        totalScore,
        lineScore,
        averageScore,
        minScore,
        maxScore,
        records: _records,
      }
    }
  )

  const chartData = [...internalChartData, ...externalChartData].sort(
    (a, b) => a.assessmentDate - b.assessmentDate
  )

  return chartData
}

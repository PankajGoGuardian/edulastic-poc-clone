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
  keyBy,
} from 'lodash'

import {
  reportUtils,
  dataWarehouse as dataWarehouseConstants,
} from '@edulastic/constants'
import { TEST_TYPE_LABELS } from '@edulastic/constants/const/testTypes'
import {
  EXTERNAL_SCORE_TYPES,
  compareByOptions,
  compareByOptionsInfo,
  getExternalScoreFormattedByType,
  getTestUniqId,
} from '../common/utils'

const { getProficiencyBand, percentage } = reportUtils.common
const { getAchievementLevels } = dataWarehouseConstants

/**
 * NOTE: the constants declared here affects only the Multiple Assessment Report in Data Warehouse
 */

export const TABLE_PAGE_SIZE = 25

export const staticDropDownData = {
  filterSections: {
    STUDENT_FILTERS: {
      key: '0',
      title: 'Select Student Set',
    },
    TEST_FILTERS: {
      key: '1',
      title: 'Select Tests',
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
    { key: 'districtIds', tabKey: '0' },
    { key: 'schoolIds', tabKey: '0' },
    { key: 'teacherIds', tabKey: '0' },
    { key: 'grades', subType: 'class', tabKey: '0' },
    { key: 'subjects', subType: 'class', tabKey: '0' },
    { key: 'assignedBy', tabKey: '0' },
    { key: 'courseId', tabKey: '0' },
    { key: 'classIds', tabKey: '0' },
    { key: 'groupIds', tabKey: '0' },
    { key: 'testTermIds', subType: 'test', tabKey: '1' },
    { key: 'testGrades', subType: 'test', tabKey: '1' },
    { key: 'testSubjects', subType: 'test', tabKey: '1' },
    { key: 'tagIds', tabKey: '1' },
    { key: 'assessmentTypes', tabKey: '1' },
    { key: 'testUniqIds', tabKey: '1' },
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
    districtIds: '',
    schoolIds: '',
    teacherIds: '',
    grades: '',
    subjects: '',
    courseId: 'All',
    classIds: '',
    groupIds: '',
    assignedBy: 'anyone',
    testTermIds: '',
    testGrades: '',
    testSubjects: '',
    tagIds: '',
    assessmentTypes: '',
    testUniqIds: '',
    profileId: '',
    externalScoreType: 'scaledScore',
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
    districtIds: '',
    schoolIds: '',
    teacherIds: '',
    subjects: '',
    grades: '',
    courseId: '',
    classIds: '',
    groupIds: '',
    testTermIds: '',
    testUniqIds: '',
    testSubjects: '',
    testGrades: '',
    assessmentTypes: '',
    tagIds: '',
    profileId: '',
    race: 'all',
    gender: 'all',
    iepStatus: 'all',
    frlStatus: 'all',
    ellStatus: 'all',
    hispanicEthnicity: 'all',
    externalScoreType: '',
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
  // DISTRICT: 'districtName',
  ASSESSMENT_: 'ASSESSMENT_',
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
    case 'district':
      return groupBy(metricInfo, 'districtId')
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
  return item || {}
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
  const testsWithBandInfo = tests.map(({ ...t }) => {
    let band = { name: '-', color: '#010101' }
    if (t.externalTestType) {
      const achievementLevels = getAchievementLevels(
        { ...t, title: t.testTitle },
        externalBands
      )
      Object.assign(t, { bands: achievementLevels })
      band = achievementLevels.find((al) => al.active) || band
    } else {
      band = getProficiencyBand(t.averageScorePercentage, bandInfo) || band
    }
    Object.assign(t, { band })
    return t
  })
  return testsWithBandInfo
}

const getAggregatedDataByTestUniqId = (metricInfo, filters = {}) => {
  const { externalScoreType } = filters
  const result = {}
  const groupedByTestUniqId = groupBy(metricInfo, 'testUniqId')
  Object.keys(groupedByTestUniqId).forEach((testUniqId) => {
    const {
      testName = 'N/A',
      isIncomplete = false,
      ...testData
    } = groupedByTestUniqId[testUniqId].reduce(
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
    const { band, bands } = findTestWithAverageBand(
      groupedByTestUniqId[testUniqId]
    )
    testData.band = band
    if (bands) testData.bands = bands
    let totalTotalScore = round(testData.totalTotalScore, 2)
    const averageScaledScore =
      testData.totalTotalScore /
        (testData.externalTestType
          ? testData.totalStudentCount
          : testData.totalMaxScore) || 0
    const averageScaledScorePercentage = averageScaledScore * 100
    const averageLexileScore = !isNaN(testData.totalTotalLexileScore)
      ? testData.totalTotalLexileScore / testData.totalStudentCount
      : null
    const averageQuantileScore = !isNaN(testData.totalTotalQuantileScore)
      ? testData.totalTotalQuantileScore / testData.totalStudentCount
      : null
    let averageScore = averageScaledScore
    let averageScorePercentage = averageScaledScorePercentage
    if (
      testData.externalTestType &&
      externalScoreType === EXTERNAL_SCORE_TYPES.LEXILE_SCORE &&
      !isNaN(testData.totalTotalLexileScore)
    ) {
      totalTotalScore = getExternalScoreFormattedByType(
        testData.totalTotalLexileScore,
        externalScoreType
      )
      averageScore = getExternalScoreFormattedByType(
        averageLexileScore,
        externalScoreType
      )
      averageScorePercentage = averageLexileScore * 100
    } else if (
      testData.externalTestType &&
      externalScoreType === EXTERNAL_SCORE_TYPES.QUANTILE_SCORE &&
      !isNaN(testData.totalTotalQuantileScore)
    ) {
      totalTotalScore = getExternalScoreFormattedByType(
        testData.totalTotalQuantileScore,
        externalScoreType
      )
      averageScore = getExternalScoreFormattedByType(
        averageQuantileScore,
        externalScoreType
      )
      averageScorePercentage = averageQuantileScore * 100
    }
    // mix of averageScore(total/count) & averageFractionalScore(total/max)
    const _testName = testData.externalTestType
      ? testName
      : `${testName} (${TEST_TYPE_LABELS[testData.testType]})`
    result[testUniqId] = {
      ...testData,
      testName: _testName,
      isIncomplete,
      totalTotalScore,
      averageScore,
      averageScorePercentage: round(averageScorePercentage),
      averageScaledScore,
      averageScaledScorePercentage,
      averageLexileScore: averageLexileScore
        ? getExternalScoreFormattedByType(
            averageLexileScore,
            EXTERNAL_SCORE_TYPES.LEXILE_SCORE
          )
        : null,
      averageQuantileScore: averageQuantileScore
        ? getExternalScoreFormattedByType(
            averageQuantileScore,
            EXTERNAL_SCORE_TYPES.QUANTILE_SCORE
          )
        : null,
    }
  })
  return result
}

/**
 * Method to generate table data from table and chart api response to render table.
 * @param {Record[]} reportTableData - table api response.
 * @param {Record[]} reportChartData - chart api response.
 * @param {Record[]} feedTypes - contains supported feedTypes for the ditrict.
 * @param {Record[]} bandInfo - contains performance bands data.
 * @param {string} compareByKey - selected compare by filter key in the table.
 * @param {Record} sortFilters - contains sort filters data.
 * @param {Record} filters - contains either shared report filters or popup filters data.
 * @returns {Record[]} - transformed data for rendering the table.
 */
export const getTableData = (
  orgData,
  reportTableData,
  reportChartData,
  feedTypes,
  bandInfo = [],
  compareByKey,
  sortFilters,
  filters = {},
  isDistrictGroupAdmin
) => {
  const { metricInfo = [] } = get(reportTableData, 'data.result', {})
  const { externalBands = [] } = get(reportChartData, 'data.result', {})
  const { districts: districtsInfo = [] } = orgData?.districtGroup || {}
  const feedTypeKeys = (feedTypes || []).map(({ key }) => key)

  const filteredMetricInfo = metricInfo
    .map(({ ...item }) => {
      const testUniqId = getTestUniqId(item)

      if (feedTypeKeys.includes(item.testType)) {
        // map data for external test type
        const districtName =
          isDistrictGroupAdmin && !item.districtName
            ? districtsInfo.find((d) => d._id === item.districtId)?.name
            : item.districtName
        Object.assign(item, {
          externalTestType: item.testType,
          districtName,
          assessmentDate: +new Date(item.assessmentDate),
          achievementLevel: +item.achievementLevel,
        })
      } else {
        // map data for internal tests
        const averageScorePercentage =
          (item.totalScore * 100) / item.maxScore || 0
        Object.assign(item, { averageScorePercentage })
      }

      return { ...item, testUniqId, title: item.testTitle }
    })
    .filter(
      ({ externalTestType }) =>
        (!isEmpty(bandInfo) && !externalTestType) ||
        (!isEmpty(externalBands) && externalTestType)
    )

  const metricInfoWithBandData = augmentBandData(
    filteredMetricInfo,
    bandInfo,
    externalBands
  )

  // table data for each assessment
  const groupedByCompareByKey = groupByCompareByKey(
    metricInfoWithBandData,
    compareByKey
  )
  const compareByLabelKey = compareByMap[compareByKey]
  const tableData = Object.keys(groupedByCompareByKey).map((compareByValue) => {
    const rowData = groupedByCompareByKey[compareByValue]
    const compareByLabelValue = rowData[0][compareByLabelKey]
    const tests = getAggregatedDataByTestUniqId(rowData, filters)
    return {
      id: compareByValue,
      [compareByKey]: compareByValue,
      [compareByLabelKey]: compareByLabelValue || '',
      districtId: rowData[0].districtId,
      districtName: rowData[0].districtName,
      tests,
    }
  })

  return tableData
}

const getInternalChartData = (internalMetricInfo, bandInfo) => {
  const internalGroupedByTestUniqId = groupBy(internalMetricInfo, 'testUniqId')
  const internalChartData = Object.keys(internalGroupedByTestUniqId).map(
    (testUniqId) => {
      const records = internalGroupedByTestUniqId[testUniqId]
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
        bandInfo.find((band) => band.threshold < averageScore) || bandInfo[0]

      // curate records for each performance band
      const _records = bandInfo.map((band) => {
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
        testUniqId,
        testName: `${testName} (${TEST_TYPE_LABELS[testData.testType]})`,
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
  return internalChartData
}

const getExternalChartData = (
  externalMetricInfo,
  externalBands,
  externalScoreType
) => {
  const externalGroupedByTestUniqId = groupBy(externalMetricInfo, 'testUniqId')
  const externalChartData = Object.keys(externalGroupedByTestUniqId).map(
    (testUniqId) => {
      const records = externalGroupedByTestUniqId[testUniqId]
      const testData = externalGroupedByTestUniqId[testUniqId].reduce(
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
        externalGroupedByTestUniqId[testUniqId]
      )

      let totalScore = testData.totalScore
      let minScore = get(maxBy(records, 'minScore'), 'minScore', 0)
      let maxScore = get(maxBy(records, 'maxScore'), 'maxScore', 0)
      const averageScaledScore = testData.totalScore / testData.totalGraded || 0
      const averageLexileScore = !isNaN(testData.totalLexileScore)
        ? getExternalScoreFormattedByType(
            testData.totalLexileScore / testData.totalGraded,
            EXTERNAL_SCORE_TYPES.LEXILE_SCORE
          )
        : null
      const averageQuantileScore = !isNaN(testData.totalQuantileScore)
        ? getExternalScoreFormattedByType(
            testData.totalQuantileScore / testData.totalGraded,
            EXTERNAL_SCORE_TYPES.QUANTILE_SCORE
          )
        : null
      let averageScore = averageScaledScore
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
        averageScore = averageLexileScore
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
        averageScore = averageQuantileScore
      }

      // curate records for each performance criteria of external test
      let _records = []
      testData.title = testData.testTitle
      const _achievementLevels = getAchievementLevels(testData, externalBands)
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
        testUniqId,
        totalScore,
        lineScore,
        averageScore,
        averageScaledScore,
        averageLexileScore,
        averageQuantileScore,
        minScore,
        maxScore,
        records: _records,
      }
    }
  )
  return externalChartData
}

/**
 * Method to generate transformed chart data for rendering the chart.
 * @param {Record[]} internalMetricsForChart - contains internal test metrics.
 * @param {Record[]} externalMetricsForChart - contains external test metrics.
 * @param {Record[]} bandInfo - contains internal tests performance band info.
 * @param {Record[]} externalBands - contains external tests performance band info.
 * @param {Record} filters - contains either shared report filters or popup filters data.
 * @param {Object.<string, object>} termsKeyedById - contains terms with termId as the key
 * @returns {Record[]} - transformed chart data to render chart.
 */
export const getChartData = (
  internalMetricsForChart = [],
  externalMetricsForChart = [],
  bandInfo = [],
  externalBands = [],
  filters = {},
  termsKeyedById = {}
) => {
  const { externalScoreType } = filters
  // fallback to prevent intermittent crashes when bandInfo is empty
  const internalMetricInfo = !isEmpty(bandInfo)
    ? internalMetricsForChart.map((t) => {
        const selectedTerm = termsKeyedById[t.termId]
        return {
          ...t,
          testUniqId: getTestUniqId(t),
          termName: selectedTerm?.name,
          termEndDate: selectedTerm?.endDate,
        }
      })
    : []
  // filter out external tests data without achievement level
  const externalMetricInfo = externalMetricsForChart
    .filter((t) => t.testType && t.achievementLevel)
    .map((t) => {
      const selectedTerm = termsKeyedById[t.termId]
      return {
        ...t,
        externalTestType: t.testType,
        assessmentDate: +new Date(t.assessmentDate),
        achievementLevel: +t.achievementLevel,
        testUniqId: getTestUniqId(t),
        termName: selectedTerm?.name,
        termEndDate: selectedTerm?.endDate,
      }
    })
  if (isEmpty(internalMetricInfo) && isEmpty(externalMetricInfo)) {
    return []
  }

  // curate chart data for internal tests
  const sortedBandInfo = bandInfo.sort((a, b) => b.threshold - a.threshold)
  const internalChartData = getInternalChartData(
    internalMetricInfo,
    sortedBandInfo
  )

  // curate chart data for external tests
  const externalChartData = getExternalChartData(
    externalMetricInfo,
    externalBands,
    externalScoreType
  )

  // sort assessments by date and alphabetically
  const chartData = [...internalChartData, ...externalChartData].sort(
    (a, b) =>
      a.assessmentDate - b.assessmentDate ||
      a.testName.toLowerCase().localeCompare(b.testName.toLowerCase())
  )

  return chartData
}

/**
 * Method to get specific data i.e. incompleteTests, selectedPerformanceBand and chartData.
 * @param {Record[]} filtersData - filter api response.
 * @param {Record} sharedReportFilters -  shared report filters data for the shared reports.
 * @param {Record} settings - popup filters data.
 * @param {Record[]} reportChartData - chart api response.
 * @returns {Record} containing incompleteTests, selectedPerformanceBand and chartData.
 */

export const getChartSpecifics = (
  filtersData,
  sharedReportFilters,
  settings,
  reportChartData,
  orgData
) => {
  const { terms = [], districtGroup = {} } = orgData
  const { terms: districtGroupTerms = [] } = districtGroup
  const termsKeyedById = keyBy([...terms, ...districtGroupTerms], '_id')

  // performance band for chart should update post chart data API response
  const { bandInfo = [] } = get(filtersData, 'data.result', {})
  const selectedPerformanceBand =
    (
      bandInfo.find(
        (x) =>
          x._id === (sharedReportFilters || settings.requestFilters).profileId
      ) || bandInfo[0]
    )?.performanceBand || []

  // curate chart data from API response
  const {
    internalMetricsForChart = [],
    externalMetricsForChart = [],
    externalBands = [],
  } = get(reportChartData, 'data.result', {})
  const chartData = getChartData(
    internalMetricsForChart,
    externalMetricsForChart,
    selectedPerformanceBand,
    externalBands,
    sharedReportFilters || settings.requestFilters,
    termsKeyedById
  )

  return {
    selectedPerformanceBand,
    chartData,
  }
}

export function getTestName(data) {
  const { isIncomplete, testName, externalTestType, shortTestName } = data
  const _testName = externalTestType ? shortTestName : testName
  return isIncomplete ? `${_testName} *` : _testName
}

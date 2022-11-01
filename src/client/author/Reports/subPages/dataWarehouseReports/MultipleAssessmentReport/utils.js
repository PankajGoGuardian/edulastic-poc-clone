import {
  find,
  map,
  head,
  groupBy,
  values,
  sumBy,
  isEmpty,
  maxBy,
  get,
  minBy,
  round,
  sum,
} from 'lodash'

import {
  reportUtils,
  dataWarehouse as dataWarehouseConstants,
} from '@edulastic/constants'

const { getProficiencyBand, percentage } = reportUtils.common
const { getAchievementLevels } = dataWarehouseConstants

/**
 * NOTE: the constants declared here affects only the Multiple Assessment Report in Data Warehouse
 */

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

export const compareByMap = {
  school: 'schoolName',
  teacher: 'teacherName',
  group: 'groupName',
  student: 'studentName',
  race: 'race',
  gender: 'gender',
  ellStatus: 'ellStatus',
  iepStatus: 'iepStatus',
  frlStatus: 'frlStatus',
  standard: 'standard',
  hispanicEthnicity: 'hispanicEthnicity',
}

const compareByData = [
  { key: 'school', title: 'School', hiddenFromRole: ['teacher'] },
  { key: 'teacher', title: 'Teacher', hiddenFromRole: ['teacher'] },
  { key: 'group', title: 'Class' },
  { key: 'race', title: 'Race' },
  { key: 'gender', title: 'Gender' },
  { key: 'ellStatus', title: 'ELL Status' },
  { key: 'iepStatus', title: 'IEP Status' },
  { key: 'frlStatus', title: 'FRL Status' },
  { key: 'hispanicEthnicity', title: 'Hispanic Ethnicity' },
]

export const tableColumnsData = [
  {
    dataIndex: 'compareBy',
    key: 'compareBy',
    align: 'left',
    fixed: 'left',
    width: 200,
  },
  // next up are dynamic columns for each assessment
]

export const getCompareByOptions = (userRole) => {
  return compareByData.filter(
    (d) => !d.hiddenFromRole || !d.hiddenFromRole.includes(userRole)
  )
}

const groupByCompareByKey = (metricInfo, compareBy) => {
  switch (compareBy) {
    case 'school':
      return groupBy(metricInfo, 'schoolId')
    case 'student':
      return groupBy(metricInfo, 'studentId')
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

const augmentMetaData = (metricInfo = [], compareBy = '', metaInfo = []) => {
  switch (compareBy) {
    case 'school':
      return map(metricInfo, (metric) => {
        const relatedSchool =
          find(metaInfo, (school) => metric.id === school.schoolId) || {}
        return { ...metric, ...relatedSchool }
      })
    case 'group':
      return map(metricInfo, (metric) => {
        const relatedGroup =
          find(metaInfo, (school) => metric.id === school.groupId) || {}

        return { ...metric, ...relatedGroup }
      })
    case 'teacher':
      return map(metricInfo, (metric) => {
        const relatedTeacher =
          find(metaInfo, (school) => metric.id === school.teacherId) || {}

        return { ...metric, ...relatedTeacher }
      })
    case 'student':
      return map(metricInfo, (metric) => {
        const firstTest = head(values(metric.tests)) || {}
        const firstRecord = head(firstTest.records || []) || {}
        const { firstName = '', lastName = '', groupId = '' } = firstRecord
        return {
          ...metric,
          firstName,
          lastName,
          studentName: `${firstName} ${lastName}`,
          groupId,
        }
      })
    case 'race':
    case 'gender':
    case 'ellStatus':
    case 'iepStatus':
    case 'frlStatus':
    case 'hispanicEthnicity':
      return metricInfo
    default:
      return []
  }
}

const findTestWithAverageBand = (tests) => {
  const weightedAverageRank =
    sum(tests.map((t) => get(t, 'band.rank', 0) * t.totalStudentCount || 0)) /
    sumBy(tests, 'totalStudentCount')

  const item = minBy(tests, (el) => get(el, 'band.rank') - weightedAverageRank)
  return item
}

const augmentBandData = (tests, bandInfo) => {
  const testsWithBandInfo = tests.map((t) => {
    let band = { name: '-', color: '#010101' }
    if (t.externalTestType) {
      const achievementLevels = getAchievementLevels({
        ...t,
        title: t.testName,
        score: t.totalScore,
      })
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

const getAggregatedDataByUniqId = (metricInfo) => {
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
          totalMaxScore: 0,
          totalStudentCount: 0,
        }
      )
      const { band, bands } = findTestWithAverageBand(groupedByUniqId[uniqId])
      testData.band = band
      if (bands) testData.bands = bands
      const averageScore =
        testData.totalTotalScore /
          (testData.externalTestType
            ? testData.totalStudentCount
            : testData.totalMaxScore) || 0
      // mix of averageScore(total/count) & averageFractionalScore(total/max)
      const averageScorePercentage = averageScore * 100
      const _testName = testData.externalTestType
        ? testName
        : `${testName} (${testData.testType})`
      return {
        ...testData,
        testName: _testName,
        isIncomplete,
        averageScore: round(averageScore, 2),
        averageScorePercentage: round(averageScorePercentage, 2),
      }
    })
    .sort((a, b) => b.assessmentDate - a.assessmentDate)
}

export const getTableData = (
  metricInfo,
  externalMetricInfo,
  metaInfo,
  bandInfo,
  compareByKey
) => {
  // filter out external tests data without achievement level
  const filteredExternalMetricInfo = externalMetricInfo
    .filter((t) => t.externalTestType && t.achievementLevel)
    .map((t) => ({
      ...t,
      assessmentDate: +new Date(t.assessmentDate),
    }))
  const compositeMetricInfo = [
    ...metricInfo,
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
    bandInfo
  )

  // table data for each assessment
  const groupedByCompareByKey = groupByCompareByKey(
    compositeMetricInfoWithBandData,
    compareByKey
  )
  const _tableData = Object.keys(groupedByCompareByKey).map(
    (compareByValue) => {
      const _data = groupedByCompareByKey[compareByValue]
      const tests = getAggregatedDataByUniqId(_data)
      const totalStudentCount = sumBy(Object.values(tests), 'totalStudentCount')
      return {
        id: compareByValue,
        [compareByKey]: compareByValue,
        totalStudentCount,
        tests,
      }
    }
  )
  const tableData = augmentMetaData(_tableData, compareByKey, metaInfo)

  return tableData
}

export const getChartData = (
  metricInfo = [],
  externalMetricInfo = [],
  bandInfo = []
) => {
  // filter out external tests data without achievement level
  const filteredExternalMetricInfo = externalMetricInfo
    .filter((t) => t.externalTestType && t.achievementLevel)
    .map((t) => ({
      ...t,
      assessmentDate: +new Date(t.assessmentDate),
    }))
  if (isEmpty(metricInfo) && isEmpty(filteredExternalMetricInfo)) {
    return []
  }
  const _bandInfo = bandInfo.sort((a, b) => b.threshold - a.threshold)

  // curate chart data for internal tests
  const _metricInfo = metricInfo.map((t) => ({
    ...t,
    // uniqId represents a combination of testId and testType
    uniqId: `${t.testId}_${t.testType}`,
  }))
  const internalGroupedByUniqId = groupBy(_metricInfo, 'uniqId')
  const internalChartData = Object.keys(internalGroupedByUniqId).map(
    (uniqId) => {
      const records = internalGroupedByUniqId[uniqId]
      const {
        testName = 'N/A',
        isIncomplete = false,
        ...testData
      } = internalGroupedByUniqId[uniqId].reduce(
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
          _record.totalGradedPercentage = percentage(
            _record.totalGraded,
            testData.totalGraded
          )
        }
        return { ..._default, ..._record }
      })

      return {
        ...testData,
        uniqId,
        testName: `${testName} (${testData.testType})`,
        isIncomplete,
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
          const _totalMaxScore = parseFloat(ele.maxScore || 0) * _totalGraded
          return {
            ..._res,
            assessmentDate: parseInt(_res.assessmentDate, 10),
            totalGraded: res.totalGraded + _totalGraded,
            totalScore: res.totalScore + _totalScore,
            totalMaxScore: res.totalMaxScore + _totalMaxScore,
          }
        },
        {
          assessmentDate: 0,
          totalGraded: 0,
          totalScore: 0,
          totalMaxScore: 0,
        }
      )

      // TODO: check with Shubhangi and determine by score range
      const lineScore = 50
      const averageScore = testData.totalScore / testData.totalGraded || 0

      // curate records for each performance criteria of external test
      let _records = []

      const _achievementLevels = getAchievementLevels({
        ...testData,
        title: testData.testName || testName,
        score: testData.totalScore,
      })
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
        const _recordsWithBands = augmentBandData(records, null)
        const _record =
          _recordsWithBands.find((r) => r?.band?.id == band.id) || {}
        if (parseInt(_record.totalGraded, 10)) {
          _record.totalGradedPercentage = percentage(
            _record.totalGraded,
            testData.totalGraded
          )
        }
        return { ..._default, ..._record }
      })

      return {
        ...testData,
        uniqId,
        testName,
        lineScore,
        averageScore: round(averageScore, 2),
        maxScore: get(maxBy(records, 'maxScore'), 'maxScore', 0),
        minScore: get(minBy(records, 'minScore'), 'minScore', 0),
        records: _records,
      }
    }
  )

  const chartData = [...internalChartData, ...externalChartData].sort(
    (a, b) => b.assessmentDate - a.assessmentDate
  )

  return chartData
}

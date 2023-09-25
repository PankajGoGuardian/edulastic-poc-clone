import { lightGreen12, lightRed7 } from '@edulastic/colors'
import { isEmpty, isNull, round, sumBy } from 'lodash'
import { EXTERNAL_TEST_TYPES } from '@edulastic/constants/const/testTypes'
import { reportUtils } from '@edulastic/constants'
import { getScoreLabel } from '@edulastic/constants/const/dataWarehouse'
import {
  academicSummaryFiltersTypes,
  availableTestTypes,
  filterDetailsFields,
  sharedDetailsFields,
} from './constants'

const {
  getProficiencyBand,
  percentage,
  curateApiFiltersQuery,
  EXTERNAL_TEST_KEY_SEPARATOR,
  performanceBandKeys,
} = reportUtils.common

const { TEST_TYPE, PERFORMANCE_BAND } = academicSummaryFiltersTypes

export const getCellColor = (
  avgScore,
  achievementLevel,
  selectedPerformanceBand,
  externalTestType
) => {
  let band
  if (externalTestType) {
    band = selectedPerformanceBand.find((pb) => pb.rank === achievementLevel)
  } else {
    band = getProficiencyBand(avgScore, selectedPerformanceBand)
  }
  return band?.color
}

export const getAcademicSummaryPieChartData = (
  bandDistribution,
  selectedPerformanceBand,
  externalTestType
) => {
  if (isEmpty(bandDistribution) || isEmpty(selectedPerformanceBand)) return []
  const sortKey = externalTestType
    ? performanceBandKeys.EXTERNAL
    : performanceBandKeys.INTERNAL
  const sortedPerformanceBand = [...selectedPerformanceBand].sort(
    (a, b) => a[sortKey] - b[sortKey]
  )
  const totalStudents = sumBy(bandDistribution, ({ students }) => students)
  return sortedPerformanceBand.map((pb) => {
    let studentsPerBand
    if (externalTestType) {
      studentsPerBand = bandDistribution.find((bd) => bd.bandName === pb.name)
        ?.students
    } else {
      studentsPerBand = bandDistribution.find(
        (bd) => bd.bandThreshold === pb.threshold
      )?.students
    }
    return {
      name: pb.name,
      value: percentage(studentsPerBand, totalStudents, true),
      fill: pb.color,
    }
  })
}

export const getAcademicSummaryMetrics = (rawData, externalTestType) => {
  if (isEmpty(rawData?.result)) return {}

  const {
    avgScore,
    periodAvgScore,
    aboveStandardStudents,
    bandDistribution,
    prePeriod,
  } = rawData.result
  const showFooter = !isEmpty(prePeriod) && !isNull(periodAvgScore)
  const totalStudents = sumBy(bandDistribution, ({ students }) => students)
  let nStudentAboveStd = 0
  const avgScorePercentage = round(avgScore)
  const periodAvgScorePercentage = round(periodAvgScore)
  const scoreTrendPercentage = showFooter
    ? round(avgScorePercentage - periodAvgScorePercentage)
    : 0
  if (!externalTestType) {
    nStudentAboveStd = `${percentage(
      aboveStandardStudents,
      totalStudents,
      true
    )}%`
  }
  return {
    avgScorePercentage: getScoreLabel(avgScorePercentage, {
      externalTestType,
    }),
    nStudentAboveStd,
    scoreTrendPercentage,
    showFooter,
  }
}

export const getAttendanceSummaryMetrics = (prePeriod, postPeriod) => {
  let attendanceAvgChange = 0
  let attendanceDisruptionsChange = 0
  let chronicAbsentChange = 0
  if (!isEmpty(prePeriod.start)) {
    attendanceAvgChange = Math.round(postPeriod.avg - prePeriod.avg)
    attendanceDisruptionsChange = Math.round(
      postPeriod.attendanceDisruptionsPerc - prePeriod.attendanceDisruptionsPerc
    )
    chronicAbsentChange = Math.round(
      postPeriod.chronicAbsentPerc - prePeriod.chronicAbsentPerc
    )
  }
  const fontColor = attendanceAvgChange >= 0 ? lightGreen12 : lightRed7
  return {
    attendanceAvgChange,
    attendanceDisruptionsChange,
    chronicAbsentChange,
    fontColor,
  }
}

export const getTableApiQuery = (
  settings,
  tableFilters,
  profileId,
  academicTestType
) => {
  const { query } = curateApiFiltersQuery(
    {
      ...settings.requestFilters,
      ...tableFilters,
      profileId,
      academicTestType,
      compareBy: tableFilters.compareBy.key,
    },
    filterDetailsFields,
    sharedDetailsFields
  )
  return query
}

export const getFilteredAcademicSummaryTestTypes = (
  selectedAssessmentTypes,
  _availableTestTypes
) => {
  if (isEmpty(selectedAssessmentTypes)) return _availableTestTypes
  const selectedAssessmentTypesArray = selectedAssessmentTypes.split(',')
  return _availableTestTypes.filter(({ key }) => {
    return selectedAssessmentTypesArray.includes(
      key.split(EXTERNAL_TEST_KEY_SEPARATOR)[0]
    )
  })
}

export const getPerformanceBandList = (
  internalBands,
  externalBands,
  selectedTestType = '',
  testTypes
) => {
  const isInternalTest =
    isEmpty(selectedTestType) ||
    availableTestTypes.map(({ key }) => key).includes(selectedTestType)
  if (isInternalTest) {
    return internalBands.map(({ _id, name, performanceBand }) => ({
      key: _id,
      title: name,
      performanceBand,
    }))
  }
  const [testCategory, testTitle] = selectedTestType.split(
    EXTERNAL_TEST_KEY_SEPARATOR
  )
  const externalBand = externalBands.find(
    ({ testTitle: _testTitle, testCategory: _testCategory }) => {
      const isTestTitleFound = !testTitle || testTitle === _testTitle
      const isTestCategoryFound = testCategory === _testCategory
      return isTestCategoryFound && isTestTitleFound
    }
  )
  return testTypes
    .filter(({ key }) => key === selectedTestType)
    .map(({ key, title }) => ({
      key,
      title,
      performanceBand: externalBand.bands,
    }))
}

export function buildAcademicSummaryFilters(
  requestFilters,
  academicSummaryFilters,
  availableAcademicTestTypes,
  internalBands,
  externalBands
) {
  const { assessmentTypes, profileId } = requestFilters
  const filteredTestTypes = getFilteredAcademicSummaryTestTypes(
    assessmentTypes,
    availableAcademicTestTypes
  )
  const testType = filteredTestTypes.find(
    ({ key }) => key === academicSummaryFilters[TEST_TYPE]?.key
  )
    ? academicSummaryFilters[TEST_TYPE]
    : filteredTestTypes[0]
  const performanceBandList = getPerformanceBandList(
    internalBands,
    externalBands,
    testType.key,
    filteredTestTypes
  )
  const selectedperformanceBandId =
    profileId || academicSummaryFilters[PERFORMANCE_BAND]?.key
  const performanceBand =
    performanceBandList.find((p) => p.key === selectedperformanceBandId) ||
    performanceBandList[0]
  return { performanceBand, testType }
}

export const getAvailableAcademicTestTypesWithBands = (
  internalBands,
  externalBands
) => {
  const internalTestTypesWithBands = availableTestTypes.map((t) => {
    const [firstInternalBand] = internalBands || []
    const { performanceBand: bands = [] } = firstInternalBand || {}
    return { ...t, bands }
  })
  const externalTestTypesWithBands = externalBands.map(
    ({ testCategory, testTitle, bands }) => {
      const _testTitle =
        testCategory === EXTERNAL_TEST_TYPES.CAASPP && testTitle
          ? `- ${testTitle}`
          : ''
      return {
        key: `${testCategory}${EXTERNAL_TEST_KEY_SEPARATOR}${testTitle || ''}`,
        title: `${testCategory} ${_testTitle}`,
        bands,
        externalTestType: testCategory,
      }
    }
  )
  return [...internalTestTypesWithBands, ...externalTestTypesWithBands]
}

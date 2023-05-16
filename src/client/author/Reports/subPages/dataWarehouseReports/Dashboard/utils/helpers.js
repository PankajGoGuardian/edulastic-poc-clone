import {
  getProficiencyBand,
  percentage,
  curateApiFiltersQuery,
  EXTERNAL_TEST_KEY_SEPARATOR,
} from '@edulastic/constants/reportUtils/common'
import { lightGreen12, lightRed7 } from '@edulastic/colors'
import { isEmpty, round, sumBy } from 'lodash'
import { EXTERNAL_TEST_TYPES } from '@edulastic/constants/const/testTypes'
import {
  academicSummaryFiltersTypes,
  availableTestTypes,
  filterDetailsFields,
  sharedDetailsFields,
} from './constants'

export const getCellColor = (value, selectedPerformanceBand) => {
  const band = getProficiencyBand(value, selectedPerformanceBand)
  return band.color
}

export const getAcademicSummaryPieChartData = (
  bandDistribution,
  selectedPerformanceBand,
  isExternalTestTypeSelected
) => {
  if (isEmpty(bandDistribution) || isEmpty(selectedPerformanceBand)) return []
  const totalStudents = sumBy(bandDistribution, ({ students }) => students)
  return selectedPerformanceBand.map((pb) => {
    let studentsPerBand
    if (isExternalTestTypeSelected) {
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

export const getAcademicSummaryMetrics = (
  rawData,
  isExternalTestTypeSelected
) => {
  if (isEmpty(rawData?.result)) return {}

  const {
    avgScore,
    periodAvgScore,
    aboveStandardStudents,
    bandDistribution,
    prePeriod,
  } = rawData.result
  const showFooter = !isEmpty(prePeriod)
  const totalStudents = sumBy(bandDistribution, ({ students }) => students)
  let aboveStandardPercentage = 0
  const avgScorePercentage = round(avgScore)
  const periodAvgScorePercentage = round(periodAvgScore)
  const scoreTrendPercentage = showFooter
    ? round(avgScorePercentage - periodAvgScorePercentage)
    : 0
  if (!isExternalTestTypeSelected) {
    aboveStandardPercentage = percentage(
      aboveStandardStudents,
      totalStudents,
      true
    )
  }
  return {
    avgScorePercentage,
    aboveStandardPercentage,
    scoreTrendPercentage,
    showFooter,
  }
}

export const getAttendanceSummaryMetrics = (prePeriod, postPeriod) => {
  let attendanceAvgChange = 0
  let tardiesChange = 0
  let chronicAbsentChange = 0
  if (!isEmpty(prePeriod.start)) {
    attendanceAvgChange = Math.round(postPeriod.avg - prePeriod.avg)
    tardiesChange = Math.round(postPeriod.tardiesPerc - prePeriod.tardiesPerc)
    chronicAbsentChange = Math.round(
      postPeriod.chronicAbsentPerc - prePeriod.chronicAbsentPerc
    )
  }
  const fontColor = attendanceAvgChange >= 0 ? lightGreen12 : lightRed7
  return {
    attendanceAvgChange,
    tardiesChange,
    chronicAbsentChange,
    fontColor,
  }
}

export const getTableApiQuery = (settings, tableFilters, profileId) => {
  const { query } = curateApiFiltersQuery(
    {
      ...settings.requestFilters,
      ...tableFilters,
      profileId,
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
  search,
  academicSummaryFilters,
  availableAcademicTestTypes,
  internalBands,
  externalBands
) {
  const { TEST_TYPE } = academicSummaryFiltersTypes
  const { assessmentTypes } = search
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
    search.profileId ||
    academicSummaryFilters[academicSummaryFiltersTypes.PERFORMANCE_BAND]?.key
  const performanceBand =
    performanceBandList.find((p) => p.key === selectedperformanceBandId) ||
    performanceBandList[0]
  return { performanceBand, testType }
}

export const getAvailableAcademicTestTypes = (externalBands) => {
  const externalTestTypes = externalBands.map(({ testCategory, testTitle }) => {
    const _testTitle =
      testCategory === EXTERNAL_TEST_TYPES.CAASPP && testTitle
        ? `- ${testTitle}`
        : ''
    return {
      key: `${testCategory}${EXTERNAL_TEST_KEY_SEPARATOR}${testTitle || ''}`,
      title: `${testCategory} ${_testTitle}`,
    }
  })
  return [...availableTestTypes, ...externalTestTypes]
}

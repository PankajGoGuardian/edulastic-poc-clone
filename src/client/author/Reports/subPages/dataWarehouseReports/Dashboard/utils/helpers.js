import {
  getProficiencyBand,
  percentage,
  curateApiFiltersQuery,
} from '@edulastic/constants/reportUtils/common'
import { lightGreen12, lightRed7 } from '@edulastic/colors'
import { isEmpty, round, sumBy } from 'lodash'
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
  selectedPerformanceBand
) => {
  if (isEmpty(bandDistribution) || isEmpty(selectedPerformanceBand)) return []
  const totalStudents = sumBy(bandDistribution, ({ students }) => students)
  return selectedPerformanceBand.map((pb) => {
    const studentsPerBand = bandDistribution.find(
      (bd) => bd.bandThreshold === pb.threshold
    )?.students
    return {
      name: pb.name,
      value: percentage(studentsPerBand, totalStudents, true),
      fill: pb.color,
    }
  })
}

export const getAcademicSummaryMetrics = (rawData) => {
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
  const avgScorePercentage = round(avgScore)
  const periodAvgScorePercentage = round(periodAvgScore)
  const scoreTrendPercentage = showFooter
    ? round(avgScorePercentage - periodAvgScorePercentage)
    : 0
  const aboveStandardPercentage = percentage(
    aboveStandardStudents,
    totalStudents,
    true
  )
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

export function buildAcademicSummaryFilters(
  search,
  academicSummaryFilters,
  performanceBandList
) {
  const { TEST_TYPE } = academicSummaryFiltersTypes
  const selectedperformanceBandId =
    search.profileId ||
    academicSummaryFilters[academicSummaryFiltersTypes.PERFORMANCE_BAND]?.key
  const performanceBand =
    performanceBandList.find((p) => p.key === selectedperformanceBandId) ||
    performanceBandList[0]
  const testType = availableTestTypes.find(
    ({ key }) => key === academicSummaryFilters[TEST_TYPE]?.key
  )
    ? academicSummaryFilters[TEST_TYPE]
    : availableTestTypes[0]
  return { performanceBand, testType }
}

export const getFilteredAcademicSummaryTestTypes = (
  selectedAssessmentTypes,
  _availableTestTypes
) => {
  if (isEmpty(selectedAssessmentTypes)) return _availableTestTypes
  const selectedAssessmentTypesArray = selectedAssessmentTypes.split(',')

  return _availableTestTypes.filter(({ key }) =>
    selectedAssessmentTypesArray.includes(key)
  )
}

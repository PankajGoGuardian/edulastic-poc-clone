import {
  getProficiencyBand,
  percentage,
  curateApiFiltersQuery,
} from '@edulastic/constants/reportUtils/common'
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
  return selectedPerformanceBand.map((pb) => {
    const totalStudents = bandDistribution.find(
      (bd) => bd.bandThreshold === pb.threshold
    )?.students
    return {
      name: pb.name,
      value: totalStudents || 0,
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
  } = rawData.result

  const totalStudents = sumBy(bandDistribution, ({ students }) => students)
  const avgScorePercentage = round(avgScore * 100)
  const periodAvgScorePercentage = round(periodAvgScore * 100)
  const scoreTrendPercentage = round(
    avgScorePercentage - periodAvgScorePercentage
  )
  const aboveStandardPercentage = percentage(
    aboveStandardStudents,
    totalStudents,
    true
  )
  return {
    avgScorePercentage,
    aboveStandardPercentage,
    scoreTrendPercentage,
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

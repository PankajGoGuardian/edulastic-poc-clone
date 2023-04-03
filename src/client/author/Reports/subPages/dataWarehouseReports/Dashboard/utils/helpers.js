import React from 'react'
import moment from 'moment'
import { Tooltip } from 'antd'
import { greyThemeDark7, lightGrey17, white } from '@edulastic/colors'
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

const MAX_TITLE_LENGTH = 14

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

export const getAcademicSummaryChartLabelJSX = (props) => {
  const RADIAN = Math.PI / 180
  const { cx, cy, midAngle, outerRadius, name, value } = props
  const title = `${value}% ${name}`
  const label =
    title.length >= MAX_TITLE_LENGTH
      ? `${title.slice(0, MAX_TITLE_LENGTH - 3)}...`
      : title
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 4) * cos
  const sy = cy + (outerRadius + 4) * sin
  const circleX = cx + outerRadius * cos
  const circleY = cy + outerRadius * sin
  const mx = cx + (outerRadius + 20) * cos
  const my = cy + (outerRadius + 20) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * name.length * 15
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'
  const textX = mx + (cos >= 0 ? 1 : -1) * 10
  const textY = my - 5
  return (
    <g>
      <circle
        cx={circleX}
        cy={circleY}
        r={4}
        fill={white}
        stroke={greyThemeDark7}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={greyThemeDark7}
        fill="none"
        strokeWidth={1}
      />
      <Tooltip title={title}>
        <text
          className="label-text"
          x={textX}
          y={textY}
          textAnchor={textAnchor}
          fill={lightGrey17}
        >
          <tspan className="label-value">{label}</tspan>
        </text>
      </Tooltip>
    </g>
  )
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

export function buildRequestFilters(_settings) {
  const _requestFilters = {}
  Object.keys(_settings.requestFilters).forEach((filterType) => {
    _requestFilters[filterType] =
      _settings.requestFilters[filterType]?.toLowerCase?.() === 'all'
        ? ''
        : _settings.requestFilters[filterType]
  })
  return _requestFilters
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

export function getDateLabel(period) {
  if (!period) return ''
  const isSameYear = new Date().getFullYear() === period.year
  const dateFormat = isSameYear ? 'Do MMM.' : `Do MMM'YY`
  const prePeriodStartDate = moment([
    period.start.year,
    period.start.month,
  ]).format(dateFormat)
  return prePeriodStartDate
}

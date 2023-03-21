import React from 'react'
import next from 'immer'
import { greyThemeDark7, lightGrey17, white } from '@edulastic/colors'
import {
  getProficiencyBand,
  percentage,
  curateApiFiltersQuery,
} from '@edulastic/constants/reportUtils/common'
import qs from 'qs'
import { isEmpty, round, sumBy } from 'lodash'
import navigation from '../../../../common/static/json/navigation.json'
import { filterDetailsFields, sharedDetailsFields } from './constants'

export function computeChartNavigationLinks(settings, loc, reportId) {
  const { requestFilters } = settings
  if (navigation.locToData[loc]) {
    const arr = Object.keys(requestFilters)
    const obj = {}
    arr.forEach((item) => {
      const val = requestFilters[item] === '' ? 'All' : requestFilters[item]
      obj[item] = val
    })
    const _navigationItems = navigation.navigation[
      navigation.locToData[loc].group
    ].filter((item) => {
      // if data warehouse report is shared, only that report tab should be shown
      return !reportId || item.key === loc
    })
    return next(_navigationItems, (draft) => {
      const _currentItem = draft.find((t) => t.key === loc)
      _currentItem.location += `?${qs.stringify(obj)}`
    })
  }
  return []
}

export const getCellColor = (value, selectedPerformanceBand) => {
  const band = getProficiencyBand(value, selectedPerformanceBand)
  return band.color
}

export const getAcademicSummaryPieChartData = (
  bandDistribution,
  selectedPerformanceBand
) => {
  console.log({
    bandDistribution,
    selectedPerformanceBand,
  })
  if (isEmpty(bandDistribution) || isEmpty(selectedPerformanceBand)) return []
  return selectedPerformanceBand.map((pb) => {
    const totalStudents = bandDistribution.find(
      (bd) => bd.bandThreshold === pb.threshold
    )?.students
    return {
      name: pb.name,
      value: totalStudents,
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
  const avgScorePercentage = round(avgScore * 100, 2)
  const periodAvgScorePercentage = round(periodAvgScore * 100, 2)
  const scoreTrendPercentage = round(
    periodAvgScorePercentage - avgScorePercentage,
    2
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
      <text
        className="label-text"
        x={textX}
        y={textY}
        textAnchor={textAnchor}
        fill={lightGrey17}
      >
        <tspan className="label-value">{value}%</tspan>
        <tspan className="label-name">&nbsp;&nbsp;{name}</tspan>
      </text>
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
      _settings.requestFilters[filterType] === 'All' ||
      _settings.requestFilters[filterType] === 'all'
        ? ''
        : _settings.requestFilters[filterType]
  })
  return _requestFilters
}

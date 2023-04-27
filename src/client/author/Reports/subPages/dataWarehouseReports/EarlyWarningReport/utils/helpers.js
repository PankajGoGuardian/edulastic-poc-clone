import { lightRed5, lightGreen12, lightGrey9 } from '@edulastic/colors'
import { reportUtils } from '@edulastic/constants'
import next from 'immer'
import { sumBy, get, groupBy } from 'lodash'
import React from 'react'
import moment from 'moment'
import { RISK_TYPE_KEYS } from '@edulastic/constants/reportUtils/common'
import HorizontalBar from '../../../../common/components/HorizontalBar'
import LinkCell from '../../common/components/LinkCell'
import LargeTag from '../../common/components/LargeTag'
import {
  StyledIconCaretDown,
  StyledIconCaretUp,
} from '../../common/components/styledComponents'
import { CustomStyledCell } from '../components/common/styledComponents'
import {
  tableColumnKeys,
  tableColumnsData,
  timeframeFilterKeys,
  timeframeFilterValues,
  CHART_LABEL_KEY,
  RISK_KEYS,
} from './constants'
import { compareByKeys } from '../../common/utils'

const {
  percentage,
  DECIMAL_BASE,
  RISK_BAND_LEVELS,
  RISK_BAND_COLOR_INFO,
} = reportUtils.common

export const getWidgetCellFooterInfo = (change) => {
  let color = lightGrey9
  let Icon = null
  if (change > 0) {
    color = lightRed5
    Icon = StyledIconCaretUp
  } else if (change < 0) {
    color = lightGreen12
    Icon = StyledIconCaretDown
  }
  return [Icon, color]
}

export const getTableColumns = (
  selectedCompareBy,
  getTableDrillDownUrl,
  filters
) => {
  return next(tableColumnsData, (_columns) => {
    const dimensionColumn = _columns.find(
      (col) => col.key === tableColumnKeys.DIMENSION
    )
    dimensionColumn.title = selectedCompareBy.title
    dimensionColumn.render = (value) => {
      const url = [compareByKeys.SCHOOL, compareByKeys.TEACHER].includes(
        selectedCompareBy.key
      )
        ? getTableDrillDownUrl(value._id)
        : null
      return <LinkCell value={value} url={url} />
    }

    const highRiskColumn = _columns.find(
      (col) => col.key === tableColumnKeys.HIGH_RISK
    )
    highRiskColumn.title = (
      <CustomStyledCell color={RISK_BAND_COLOR_INFO[RISK_BAND_LEVELS.HIGH]}>
        HIGH
      </CustomStyledCell>
    )

    highRiskColumn.render = (_, { highRisk, totalStudents }) => (
      <LargeTag
        width="35px"
        textAlign="right"
        leftText={`${percentage(highRisk, totalStudents, true)}%`}
        rightText={`${highRisk} /${totalStudents}`}
      />
    )

    const mediumRiskColumn = _columns.find(
      (col) => col.key === tableColumnKeys.MEDIUM_RISK
    )
    mediumRiskColumn.title = (
      <CustomStyledCell color={RISK_BAND_COLOR_INFO[RISK_BAND_LEVELS.MEDIUM]}>
        MEDIUM
      </CustomStyledCell>
    )
    mediumRiskColumn.render = (_, { mediumRisk, totalStudents }) => (
      <LargeTag
        width="35px"
        textAlign="right"
        leftText={`${percentage(mediumRisk, totalStudents, true)}%`}
        rightText={`${mediumRisk} /${totalStudents}`}
      />
    )

    const academicRiskColumnIdx = _columns.findIndex(
      (col) => col.key === tableColumnKeys.ACADEMIC_RISK
    )
    _columns[academicRiskColumnIdx].render = (value) => {
      const academicRisk = value.academicRisk.map((b) => ({
        ...b,
        color: RISK_BAND_COLOR_INFO[b.bandLabel],
      }))
      return <HorizontalBar data={academicRisk} />
    }

    const attendanceRiskColumnIdx = _columns.findIndex(
      (col) => col.key === tableColumnKeys.ATTENDANCE_RISK
    )
    _columns[attendanceRiskColumnIdx].render = (value) => {
      const attendanceRisk = value.attendanceRisk.map((b) => ({
        ...b,
        color: RISK_BAND_COLOR_INFO[b.bandLabel],
      }))
      return <HorizontalBar data={attendanceRisk} />
    }

    if (filters.riskType === RISK_TYPE_KEYS.ACADEMIC) {
      _columns.splice(attendanceRiskColumnIdx, 1)
    }
    if (filters.riskType === RISK_TYPE_KEYS.ATTENDANCE) {
      _columns.splice(academicRiskColumnIdx, 1)
    }
  })
}

const getRiskBandStudentCount = (distribution = [], key) => {
  return distribution.find((d) => d.bandLabel === key)?.studentCount || 0
}

export const getPeriodRiskData = (period) => {
  const highRisk = getRiskBandStudentCount(
    period.distribution,
    RISK_BAND_LEVELS.HIGH
  )

  const mediumRisk = getRiskBandStudentCount(
    period.distribution,
    RISK_BAND_LEVELS.MEDIUM
  )
  return [highRisk, mediumRisk]
}

const getRiskSummaryPieChartData = (distribution = []) => {
  const totalStudentCount = sumBy(distribution, ({ studentCount }) =>
    parseInt(studentCount, DECIMAL_BASE)
  )
  return distribution.map(({ studentCount, bandLabel }) => ({
    name: bandLabel,
    value: percentage(
      parseInt(studentCount, DECIMAL_BASE),
      totalStudentCount,
      true
    ),
    fill: RISK_BAND_COLOR_INFO[bandLabel],
  }))
}

export const transformRiskSummaryData = (prePeriod, postPeriod, showFooter) => {
  if (!postPeriod?.distribution?.length) return {}
  const [postPeriodhighRisk, postPeriodMediumRisk] = getPeriodRiskData(
    postPeriod
  )
  const pieChartData = getRiskSummaryPieChartData(postPeriod.distribution)
  let highRiskChange = 0
  let mediumRiskChange = 0
  if (showFooter) {
    const [prePeriodhighRisk, prePeriodMediumRisk] = getPeriodRiskData(
      prePeriod
    )
    highRiskChange = postPeriodhighRisk - prePeriodhighRisk
    mediumRiskChange = postPeriodMediumRisk - prePeriodMediumRisk
  }
  return {
    postPeriodhighRisk: new Intl.NumberFormat().format(postPeriodhighRisk),
    highRiskChange,
    postPeriodMediumRisk: new Intl.NumberFormat().format(postPeriodMediumRisk),
    mediumRiskChange,
    pieChartData,
  }
}

const sortGroupedTimelineData = (data, timeframe) =>
  data.sort((a, b) => {
    if (a[0].year === b[0].year) {
      return a[0][timeframe] - b[0][timeframe]
    }
    return a[0].year - b[0].year
  })

export const getTimelineChartData = (rawData, filters) => {
  const { timeframe } = filters
  const timelineData = get(rawData, 'data.result', [])
  if (!timelineData.length) {
    return []
  }

  const timelineDataWithDateString = timelineData.map((timelineItem) => {
    let chartTimeLabel = ''
    let momentDate = null
    const { year, month, quarter } = timelineItem
    if (timeframe === timeframeFilterKeys.MONTHLY) {
      const date = new Date(year, month - 1)
      momentDate = moment(date)
      chartTimeLabel = momentDate.format('MMM YYYY')
    } else if (timeframe === timeframeFilterKeys.QUARTERLY) {
      chartTimeLabel = `Q${quarter} ${year}`
      momentDate = moment()
    }
    return {
      ...timelineItem,
      [CHART_LABEL_KEY]: chartTimeLabel,
      momentDate,
    }
  })

  const groupedTimelineData = Object.values(
    groupBy(timelineDataWithDateString, CHART_LABEL_KEY)
  )

  const sortedGroupedTimelineData = sortGroupedTimelineData(
    groupedTimelineData,
    timeframeFilterValues[timeframe]
  )

  const finalData = []
  sortedGroupedTimelineData.forEach((groupedData) => {
    const totalStudents = groupedData.reduce(
      (prev, curr) => prev + curr.studentCount,
      0
    )
    const studentCounts = {}
    groupedData.forEach((entry) => {
      studentCounts[entry.bandLabel.toLocaleLowerCase()] = percentage(
        entry.studentCount,
        totalStudents,
        true
      )
    })
    if (studentCounts[RISK_KEYS.LOW] === 100) {
      studentCounts[RISK_KEYS.MEDIUM] = 0
      studentCounts[RISK_KEYS.HIGH] = 0
    }
    finalData.push({
      ...groupedData[0],
      ...studentCounts,
    })
  })
  return finalData
}

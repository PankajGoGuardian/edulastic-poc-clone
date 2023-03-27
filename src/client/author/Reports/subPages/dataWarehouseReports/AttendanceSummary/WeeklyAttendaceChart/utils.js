import { reportUtils } from '@edulastic/constants'
import { sortBy } from 'lodash'
import moment from 'moment'
import { setProperties, tooltipParams } from '../../../../common/util'

const { spaceForLittleTriangle } = tooltipParams
const { percentage } = reportUtils.common

export const updateTooltipPos = (
  parentContainerRef,
  chartRef,
  tooltipRef,
  setTooltipType
) => {
  const tooltipElement = tooltipRef.current?.tooltipElementRef.current
  if (!tooltipElement) return

  const chartState = chartRef.current?.state
  if (!chartState) return

  const { width } = chartRef.current.props
  const idx = chartState.activeTooltipIndex
  const chartItems = chartState.formatedGraphicalItems
  const barchartLayer = chartItems?.[0]
  const activePoint = barchartLayer?.props?.points?.[idx]
  if (!activePoint) return

  const tooltipRect = tooltipElement.getBoundingClientRect()
  const OFFSET = 20
  const isTooltipOverflowing =
    tooltipRect.width + activePoint.x + OFFSET > width

  setTooltipType(isTooltipOverflowing ? 'left' : 'right')
  const tooltipXShift = isTooltipOverflowing
    ? `-100% - ${spaceForLittleTriangle}px - ${OFFSET}px`
    : `${spaceForLittleTriangle}px + ${OFFSET}px`
  const tooltipCssVars = {
    '--tooltip-transform': `translate(
      calc( ${activePoint.x}px + ${tooltipXShift}),
      calc( ${activePoint.y}px - 50% )`,
    '--tooltip-top': '0',
    '--tooltip-left': '0',
  }
  setProperties(parentContainerRef, tooltipCssVars)
}

export const getAttendanceChartData = (attendanceData) => {
  attendanceData = sortBy(attendanceData, 'minDate')
  const attendanceChartData = attendanceData.map((item) => ({
    week: item.weekFromTermStart,
    startDate: moment(item.minDate)
      .startOf('week')
      .add(1, 'day')
      .format('DD MMM'),
    presents: item.presentDays,
    absents: item.absentDays,
    tardies: item.tardyDays,
    total: item.totalDays,
    value1: percentage(item.attendanceValue, item.totalDays, true), // Attendance data
  }))
  return attendanceChartData
}

export const transformDataForChart = (page, pagedData) => {
  const START_X_LABEL = 'START DATE'
  const START_X_WEEK = -1

  if (page === 0) {
    return [
      {
        week: START_X_WEEK,
        startDate: START_X_LABEL,
        presents: 0,
        absents: 0,
        tardies: 0,
        total: 0,
        value: 0,
        value1: 20,
      },
      ...pagedData,
    ]
  }
  const first = pagedData[0]
  return [
    {
      ...first,
      week: START_X_WEEK,
      startDate: START_X_LABEL,
    },
    ...pagedData.slice(1),
  ]
}

export const getXTickText = (payload, _data) => {
  const week = _data[payload.index]?.week + 1
  return week ? `WEEK ${week}` : ``
}

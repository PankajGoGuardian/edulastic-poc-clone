import { round, sortBy } from 'lodash'
import moment from 'moment'
import { sortKeys } from '../utils/constants'

export const getAttendanceChartData = (attendanceData, groupBy) => {
  const _attendanceData = sortBy(attendanceData, 'minDate')
  const attendanceChartData = _attendanceData
    .map((item) => {
      if (item.fromTermStart < 0) return

      return {
        ...item,
        attendanceDisruptions:
          item.tardyDays + item.earlyDepartureDays + item.partialDays,
        [groupBy]: item.fromTermStart,
        startDate: moment(item.minDate).format('DD MMM'),
        value: round(item.attendanceRatio),
        absences: item.excusedAbsenceDays + item.unexcusedAbsenceDays,
        assessmentDate: item.minDate,
      }
    })
    .filter((item) => !!item)
  return attendanceChartData
}

export const transformDataForChart = (page, pagedData, groupBy, type) => {
  const START_X_LABEL = 'START DATE'
  const START_X_VALUE = -1
  const isAttendanceDisruptions = type === sortKeys.ATTENDANCE_DISRUPTIONS
  if (!pagedData.length) {
    return []
  }
  if (page === 0) {
    if (isAttendanceDisruptions) {
      return [...pagedData]
    }
    return [
      {
        [groupBy]: START_X_VALUE,
        startDate: START_X_LABEL,
        attendanceDisruptions: 0,
        value: 0,
        absences: 0,
      },
      ...pagedData,
    ]
  }
  const first = pagedData[0]
  if (isAttendanceDisruptions) {
    return [...pagedData.slice(1)]
  }
  return [
    {
      ...first,
      [groupBy]: START_X_VALUE,
      startDate: START_X_LABEL,
    },
    ...pagedData.slice(1),
  ]
}

export const getXTickText = (payload, _data, groupBy) => {
  const data = _data[payload.index]?.[groupBy] + 1
  return data ? `${groupBy.toUpperCase()} ${data}` : ``
}

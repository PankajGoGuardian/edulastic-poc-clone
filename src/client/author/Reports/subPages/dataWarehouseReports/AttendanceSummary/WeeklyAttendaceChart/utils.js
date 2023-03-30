import { round, sortBy } from 'lodash'
import moment from 'moment'

export const getAttendanceChartData = (attendanceData, groupBy) => {
  const _attendanceData = sortBy(attendanceData, 'minDate')
  const attendanceChartData = _attendanceData
    .map((item) => {
      if (item.fromTermStart < 0) return

      return {
        [groupBy]: item.fromTermStart,
        startDate: moment(item.minDate).format('DD MMM'),
        presents: item.presentEvents,
        absents: item.absentEvents,
        tardies: item.tardyEvents,
        total: item.totalEvents,
        value: round(item.attendanceRatio),
      }
    })
    .filter((item) => !!item)
  return attendanceChartData
}

export const transformDataForChart = (page, pagedData, groupBy) => {
  const START_X_LABEL = 'START DATE'
  const START_X_VALUE = -1
  if (!pagedData.length) {
    return []
  }
  if (page === 0) {
    return [
      {
        [groupBy]: START_X_VALUE,
        startDate: START_X_LABEL,
        presents: 0,
        absents: 0,
        tardies: 0,
        total: 0,
        value: 0,
      },
      ...pagedData,
    ]
  }
  const first = pagedData[0]
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

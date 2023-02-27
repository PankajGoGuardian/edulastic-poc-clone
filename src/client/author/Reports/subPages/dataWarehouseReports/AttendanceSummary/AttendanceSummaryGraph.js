import { useOfflinePagination } from '@edulastic/common'
import React, { useMemo } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import moment from 'moment'
import { reportUtils } from '@edulastic/constants'
import { sortBy } from 'lodash'
import { StyledAttendanceChartContainer } from '../wholeLearnerReport/components/AttendanceChart/styled-components'
import { StyledChartNavButton } from '../../../common/styled'
import { YAxisLabel } from '../../../common/components/charts/chartUtils/yAxisLabel'

const { percentage } = reportUtils.common

const hardcodedAttendanceData = [
  {
    week: 1,
    year: 2023,
    minDate: 1672617600000,
    maxDate: 1672963200000,
    totalDays: 5,
    attendanceValue: 4.5,
    presentDays: 4,
    tardyDays: 1,
    absentDays: 0,
    weekFromTermStart: 6,
  },
  {
    week: 2,
    year: 2023,
    minDate: 1673222400000,
    maxDate: 1673568000000,
    totalDays: 5,
    attendanceValue: 2.5,
    presentDays: 2,
    tardyDays: 1,
    absentDays: 2,
    weekFromTermStart: 7,
  },
  {
    week: 3,
    year: 2023,
    minDate: 1673827200000,
    maxDate: 1674172800000,
    totalDays: 5,
    attendanceValue: 2.5,
    presentDays: 2,
    tardyDays: 2,
    absentDays: 1,
    weekFromTermStart: 8,
  },
  {
    week: 4,
    year: 2023,
    minDate: 1674432000000,
    maxDate: 1674777600000,
    totalDays: 5,
    attendanceValue: 2.5,
    presentDays: 2,
    tardyDays: 1,
    absentDays: 2,
    weekFromTermStart: 9,
  },
  {
    week: 5,
    year: 2023,
    minDate: 1675036800000,
    maxDate: 1675296000000,
    totalDays: 4,
    attendanceValue: 2,
    presentDays: 1,
    tardyDays: 2,
    absentDays: 1,
    weekFromTermStart: 10,
  },
  {
    week: 28,
    year: 2022,
    minDate: 1657756800000,
    maxDate: 1657843200000,
    totalDays: 2,
    attendanceValue: 1.5,
    presentDays: 1,
    tardyDays: 1,
    absentDays: 0,
    weekFromTermStart: -19,
  },
  {
    week: 29,
    year: 2022,
    minDate: 1658102400000,
    maxDate: 1658448000000,
    totalDays: 5,
    attendanceValue: 2,
    presentDays: 3,
    tardyDays: 1,
    absentDays: 1,
    weekFromTermStart: -18,
  },
  {
    week: 30,
    year: 2022,
    minDate: 1658707200000,
    maxDate: 1659052800000,
    totalDays: 5,
    attendanceValue: 4.5,
    presentDays: 4,
    tardyDays: 1,
    absentDays: 0,
    weekFromTermStart: -17,
  },
  {
    week: 31,
    year: 2022,
    minDate: 1659312000000,
    maxDate: 1659830400000,
    totalDays: 7,
    attendanceValue: 4,
    presentDays: 3,
    tardyDays: 2,
    absentDays: 2,
    weekFromTermStart: -16,
  },
  {
    week: 32,
    year: 2022,
    minDate: 1659916800000,
    maxDate: 1660435200000,
    totalDays: 7,
    attendanceValue: 5,
    presentDays: 4,
    tardyDays: 2,
    absentDays: 1,
    weekFromTermStart: -15,
  },
  {
    week: 33,
    year: 2022,
    minDate: 1660521600000,
    maxDate: 1660867200000,
    totalDays: 5,
    attendanceValue: 2.5,
    presentDays: 1,
    tardyDays: 3,
    absentDays: 1,
    weekFromTermStart: -14,
  },
  {
    week: 34,
    year: 2022,
    minDate: 1661212800000,
    maxDate: 1661472000000,
    totalDays: 4,
    attendanceValue: 3.5,
    presentDays: 3,
    tardyDays: 1,
    absentDays: 0,
    weekFromTermStart: -13,
  },
  {
    week: 35,
    year: 2022,
    minDate: 1661731200000,
    maxDate: 1662076800000,
    totalDays: 5,
    attendanceValue: 3,
    presentDays: 2,
    tardyDays: 2,
    absentDays: 1,
    weekFromTermStart: -12,
  },
  {
    week: 36,
    year: 2022,
    minDate: 1662336000000,
    maxDate: 1662681600000,
    totalDays: 5,
    attendanceValue: 3,
    presentDays: 1,
    tardyDays: 2,
    absentDays: 2,
    weekFromTermStart: -11,
  },
  {
    week: 37,
    year: 2022,
    minDate: 1662940800000,
    maxDate: 1663286400000,
    totalDays: 5,
    attendanceValue: 4.5,
    presentDays: 5,
    tardyDays: 0,
    absentDays: 0,
    weekFromTermStart: -10,
  },
  {
    week: 38,
    year: 2022,
    minDate: 1663545600000,
    maxDate: 1663891200000,
    totalDays: 5,
    attendanceValue: 3.5,
    presentDays: 3,
    tardyDays: 1,
    absentDays: 1,
    weekFromTermStart: -9,
  },
  {
    week: 39,
    year: 2022,
    minDate: 1664150400000,
    maxDate: 1664496000000,
    totalDays: 5,
    attendanceValue: 3.5,
    presentDays: 3,
    tardyDays: 2,
    absentDays: 0,
    weekFromTermStart: -8,
  },
  {
    week: 40,
    year: 2022,
    minDate: 1664755200000,
    maxDate: 1665100800000,
    totalDays: 5,
    attendanceValue: 3.5,
    presentDays: 1,
    tardyDays: 3,
    absentDays: 1,
    weekFromTermStart: -7,
  },
  {
    week: 41,
    year: 2022,
    minDate: 1665360000000,
    maxDate: 1665705600000,
    totalDays: 5,
    attendanceValue: 2.5,
    presentDays: 2,
    tardyDays: 2,
    absentDays: 1,
    weekFromTermStart: -6,
  },
  {
    week: 42,
    year: 2022,
    minDate: 1665964800000,
    maxDate: 1666310400000,
    totalDays: 5,
    attendanceValue: 3.5,
    presentDays: 2,
    tardyDays: 2,
    absentDays: 1,
    weekFromTermStart: -5,
  },
  {
    week: 43,
    year: 2022,
    minDate: 1666569600000,
    maxDate: 1666915200000,
    totalDays: 5,
    attendanceValue: 3,
    presentDays: 3,
    tardyDays: 1,
    absentDays: 1,
    weekFromTermStart: -4,
  },
  {
    week: 44,
    year: 2022,
    minDate: 1667174400000,
    maxDate: 1667520000000,
    totalDays: 5,
    attendanceValue: 4,
    presentDays: 3,
    tardyDays: 2,
    absentDays: 0,
    weekFromTermStart: -3,
  },
  {
    week: 45,
    year: 2022,
    minDate: 1667779200000,
    maxDate: 1668124800000,
    totalDays: 5,
    attendanceValue: 5,
    presentDays: 4,
    tardyDays: 1,
    absentDays: 0,
    weekFromTermStart: -2,
  },
  {
    week: 46,
    year: 2022,
    minDate: 1668384000000,
    maxDate: 1668729600000,
    totalDays: 5,
    attendanceValue: 3.5,
    presentDays: 3,
    tardyDays: 1,
    absentDays: 1,
    weekFromTermStart: -1,
  },
  {
    week: 47,
    year: 2022,
    minDate: 1668988800000,
    maxDate: 1669334400000,
    totalDays: 5,
    attendanceValue: 4,
    presentDays: 3,
    tardyDays: 2,
    absentDays: 0,
    weekFromTermStart: 0,
  },
  {
    week: 48,
    year: 2022,
    minDate: 1669593600000,
    maxDate: 1669939200000,
    totalDays: 5,
    attendanceValue: 2.5,
    presentDays: 1,
    tardyDays: 3,
    absentDays: 1,
    weekFromTermStart: 1,
  },
  {
    week: 49,
    year: 2022,
    minDate: 1670198400000,
    maxDate: 1670544000000,
    totalDays: 5,
    attendanceValue: 3,
    presentDays: 2,
    tardyDays: 2,
    absentDays: 1,
    weekFromTermStart: 2,
  },
  {
    week: 50,
    year: 2022,
    minDate: 1670803200000,
    maxDate: 1671148800000,
    totalDays: 5,
    attendanceValue: 3,
    presentDays: 2,
    tardyDays: 2,
    absentDays: 1,
    weekFromTermStart: 3,
  },
  {
    week: 51,
    year: 2022,
    minDate: 1671408000000,
    maxDate: 1671753600000,
    totalDays: 5,
    attendanceValue: 3.5,
    presentDays: 3,
    tardyDays: 1,
    absentDays: 1,
    weekFromTermStart: 4,
  },
  {
    week: 52,
    year: 2022,
    minDate: 1672012800000,
    maxDate: 1672358400000,
    totalDays: 5,
    attendanceValue: 4,
    presentDays: 3,
    tardyDays: 2,
    absentDays: 0,
    weekFromTermStart: 5,
  },
]

const getAttendanceChartData = (attendanceData) => {
  attendanceData = sortBy(attendanceData, 'minDate')
  const attendanceChartData = attendanceData.map((item) => ({
    week: `Week ${item.weekFromTermStart}`,
    startDate: moment(item.minDate)
      .startOf('week')
      .add(1, 'day')
      .format('D/M/YYYY'),
    presents: item.presentDays,
    absents: item.absentDays,
    tardies: item.tardyDays,
    total: item.totalDays,
    value1: percentage(item.attendanceValue, item.totalDays, true), // Attendance data
    value2: percentage(
      item.totalDays - item.attendanceValue,
      item.totalDays,
      true
    ), // Average score data
  }))
  return attendanceChartData
}

const transformData = (page, pagedData) => {
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

function AttendanceSummaryGraph() {
  const attendanceChartData = useMemo(() => {
    const _attendanceChartData = getAttendanceChartData(hardcodedAttendanceData)
    return _attendanceChartData
  }, [hardcodedAttendanceData])

  const {
    next: nextPage,
    prev: prevPage,
    pagedData,
    page,
    totalPages,
  } = useOfflinePagination({
    defaultPage: 0,
    data: attendanceChartData,
    lookbackCount: 1,
    pageSize: 8,
    backFillLastPage: true,
  })

  const hasPreviousPage = page !== 0
  const hasNextPage = page < totalPages - 1

  const renderData = transformData(page, pagedData)

  return (
    <StyledAttendanceChartContainer>
      <StyledChartNavButton
        type="primary"
        shape="circle"
        icon="caret-left"
        IconBtn
        className="navigator navigator-left"
        onClick={prevPage}
        style={{
          visibility: hasPreviousPage ? 'visible' : 'hidden',
        }}
      />
      <StyledChartNavButton
        type="primary"
        shape="circle"
        icon="caret-right"
        IconBtn
        className="navigator navigator-right"
        onClick={nextPage}
        style={{
          visibility: hasNextPage ? 'visible' : 'hidden',
        }}
      />
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          width={730}
          height={250}
          data={renderData}
          margin={{ top: 0, right: 50, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="week"
            xAxisId="0"
            tickMargin={20}
            interval={0}
            tickLine={false}
            label={{ fill: 'red', fontSize: 20 }}
          />
          <XAxis
            dataKey="startDate"
            xAxisId="1"
            tickLine={false}
            dy={-7}
            tickMargin={20}
            interval={0}
            axisLine={false}
            label={{ fill: 'red', fontSize: 20 }}
          />
          <YAxis
            type="number"
            domain={[0, 100]}
            label={
              <YAxisLabel
                data={{
                  value: 'PERCENTAGE',
                  angle: -90,
                  dx: 50,
                  fontSize: 14,
                }}
              />
            }
          />
          <Line type="monotone" dataKey="value1" stroke="#9FC6D2" />
          <Line
            type="monotone"
            dataKey="value2"
            stroke="#B5B5B5"
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </StyledAttendanceChartContainer>
  )
}

export default AttendanceSummaryGraph

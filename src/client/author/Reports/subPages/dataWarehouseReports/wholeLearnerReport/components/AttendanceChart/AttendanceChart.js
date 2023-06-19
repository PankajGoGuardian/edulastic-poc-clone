/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useMemo, useRef, useState } from 'react'
import { get, isArray } from 'lodash'
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  CartesianGrid,
} from 'recharts'

import { useOfflinePagination } from '@edulastic/common'
import { YAxisLabel } from '../../../../../common/components/charts/chartUtils/yAxisLabel'
import { CustomChartXTick } from '../../../../../common/components/charts/chartUtils/customChartXTick'
import {
  ResetButtonClear,
  StyledChartNavButton,
  StyledCustomChartTooltipDark,
} from '../../../../../common/styled'
import SectionLabel from '../../../../../common/components/SectionLabel'
import SectionDescription from '../../../../../common/components/SectionDescription'
import { StyledAttendanceChartContainer } from './styled-components'
import {
  CustomDot,
  getTooltipJSX,
  updateTooltipPos,
} from '../../../../../common/chart-utils'

const getXTickText = (payload, _data) => {
  const week = _data[payload.index]?.week + 1
  return week ? `WEEK ${week}` : ''
}

const CustomizedLabel = (props) => {
  const { x, y, stroke, value, index } = props
  if (index === 0) return null

  return (
    <text
      x={x}
      y={y}
      dy={-10}
      fill={stroke}
      fontSize={10}
      fontWeight={800}
      textAnchor="middle"
    >
      {`${value}%`}
    </text>
  )
}

const interventionsData = [
  {
    _id: '6442caecfd8f7451449779e5',
    interventionCriteria: {
      applicableTo: {
        testTypes: ['homework'],
        subjects: ['Computer Science'],
      },
      target: {
        measureType: 'averageScore',
        metric: '10',
      },
    },
    studentGroupIds: ['6440f9b3f469bb458ffe6f98'],
    relatedGoalIds: ['6442bc6dfd8f7451449779e4'],
    termId: '6380b568070dd1000810a161',
    name: 'Test 111',
    type: 'academic',
    owner: 'Test 111',
    description: 'Test 111',
    startDate: 1682035200000,
    endDate: 1658169000000,
    comment: 'Test 111',
    createdBy: '6380b641c7c5680008011311',
    districtId: '6380b567070dd1000810a15b',
    userRole: 'district-admin',
    status: 'IN_PROGRESS',
    createdAt: 1682098924540,
    updatedAt: 1682098924540,
    __v: 0,
    active: 1,
  },
]

const convertDate = (dateStr) => {
  if (!dateStr) {
    return
  }
  const [day, month, year] = dateStr.split('/')
  const timeStamp = new Date(year, month - 1, day).getTime()
  return timeStamp
}

const getInterventionsGroup = (
  currentAssessmentDate,
  aheadAssessmentDate,
  interventions
) => {
  if (
    isArray(interventions) &&
    interventions.length &&
    currentAssessmentDate &&
    aheadAssessmentDate
  ) {
    return interventions.filter(({ endDate }) => {
      return endDate < aheadAssessmentDate && endDate > currentAssessmentDate
    })
  }
  return []
}

const withHasInterventions = (data) => {
  return data.map((item, index) => {
    const { startDate: currentAssessmentDate } = item || {}
    const { startDate: aheadAssessmentDate } = get(data, [index + 1], {})
    return {
      ...item,
      interventionsGroup: getInterventionsGroup(
        convertDate(currentAssessmentDate),
        convertDate(aheadAssessmentDate),
        interventionsData
      ),
    }
  })
}

const AttendanceChart = ({
  attendanceChartData,
  onResetClick = () => {},
  filter = {},
  showInterventions,
}) => {
  const parentContainerRef = useRef(null)
  const tooltipRef = useRef(null)
  const [tooltipType, setTooltipType] = useState('right')

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
  const chartRef = useRef(null)

  const hasPreviousPage = page !== 0
  const hasNextPage = page < totalPages - 1
  const START_X_LABEL = 'START DATE'
  const START_X_WEEK = -1 // i.e before all weeks

  const renderData = useMemo(() => {
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
  }, [page, pagedData])

  const getTooltipContent = (payload) => {
    updateTooltipPos(parentContainerRef, chartRef, tooltipRef, setTooltipType)

    return getTooltipJSX(payload)
  }

  const hasFilters = Object.keys(filter).length > 0
  const data = withHasInterventions(renderData)
  return (
    <StyledAttendanceChartContainer ref={parentContainerRef}>
      <SectionLabel $margin="30px 0px 10px 0px" style={{ fontSize: '18px' }}>
        Weekly Attendance
      </SectionLabel>
      <SectionDescription>
        Correlate academic performance with attendance.
      </SectionDescription>
      <ResetButtonClear
        onClick={onResetClick}
        style={{ visibility: hasFilters ? 'visible' : 'hidden' }}
      >
        Reset
      </ResetButtonClear>
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
          data={data}
          margin={{ top: 10, right: 50, left: 20, bottom: 10 }}
          ref={chartRef}
        >
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            strokeWidth={1}
          />
          <XAxis
            dataKey="week"
            xAxisId="0"
            tick={
              <CustomChartXTick
                data={data}
                getXTickText={getXTickText}
                fontWeight={600}
                showInterventions={showInterventions}
              />
            }
            tickMargin={20}
            interval={0}
            tickLine={false}
          />
          <XAxis
            dataKey="startDate"
            xAxisId="1"
            tickLine={false}
            dy={-7}
            tickMargin={20}
            interval={0}
            axisLine={false}
          />
          <YAxis
            type="number"
            domain={[0, 100]}
            tick={{ fill: '#010101' }}
            tickCount={6}
            tickMargin={2}
            label={
              <YAxisLabel
                data={{
                  value: 'AVG ATTENDANCE %',
                  angle: -90,
                  dx: 25,
                  fontSize: 14,
                  translateYDiffValue: 20,
                }}
              />
            }
          />
          <Tooltip
            cursor={false}
            content={
              <StyledCustomChartTooltipDark
                ref={tooltipRef}
                getJSX={getTooltipContent}
                useBarIndex={false}
                tooltipType={tooltipType}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#707070"
            strokeDasharray="5 5"
            label={CustomizedLabel}
            dot={<CustomDot />}
            activeDot={<CustomDot active />}
          />
        </LineChart>
      </ResponsiveContainer>
    </StyledAttendanceChartContainer>
  )
}

export default AttendanceChart

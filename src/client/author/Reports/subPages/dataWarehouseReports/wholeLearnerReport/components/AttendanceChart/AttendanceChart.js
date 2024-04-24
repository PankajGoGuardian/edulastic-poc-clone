/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useEffect, useMemo, useRef, useState } from 'react'
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
import { LAST_PAGE_INDEX } from '@edulastic/constants/reportUtils/common'
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
import { CustomXAxisTickTooltipContainer } from '../../../../../common/components/charts/styled-components'
import { useResetAnimation } from '../../../../../common/hooks/useResetAnimation'

const getXTickText = (payload, _data) => {
  const week = _data[payload.index]?.week + 1
  return week ? `WEEK ${week}` : ''
}

const CustomizedLabel = (props) => {
  const { x, y, stroke, value, index, useAttendanceAbsence } = props
  if (index === 0) return null
  const label = useAttendanceAbsence ? value : `${value}%`

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
      {label}
    </text>
  )
}

// print width for chart for A4 size & in landscape mode
const PRINT_WIDTH = 1500

const AttendanceChart = ({
  isPrinting,
  attendanceChartData,
  onResetClick = () => {},
  pageSize = 8,
  filter = {},
  showInterventions,
  interventionsData,
  filtersData,
}) => {
  // NOTE workaround to fix labels not rendering due to interrupted animation
  // ref: https://github.com/recharts/react-smooth/issues/44
  const [animate, onAnimationStart, setAnimate] = useResetAnimation()
  const parentContainerRef = useRef(null)
  const tooltipRef = useRef(null)
  const [tooltipType, setTooltipType] = useState('right')

  const { useAttendanceAbsence = false } = filtersData?.data?.result || {}

  useEffect(() => setAnimate(true), [attendanceChartData])

  const {
    next: nextPage,
    prev: prevPage,
    pagedData,
    page,
    totalPages,
  } = useOfflinePagination({
    defaultPage: LAST_PAGE_INDEX,
    data: attendanceChartData,
    lookbackCount: 1,
    pageSize,
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
          totalAbsence: 0,
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
  const xTickToolTipWidth = 200

  const [xAxisTickTooltipData, setXAxisTickTooltipData] = useState({
    visibility: 'hidden',
    x: null,
    y: null,
    content: null,
  })

  const getTooltipContent = (payload) => {
    updateTooltipPos(parentContainerRef, chartRef, tooltipRef, setTooltipType)
    return getTooltipJSX(payload, useAttendanceAbsence)
  }

  const hasFilters = Object.keys(filter).length > 0

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
        onClick={() => {
          prevPage()
          setAnimate(true)
        }}
        style={{
          visibility: hasPreviousPage ? 'visible' : 'hidden',
          padding: 0,
        }}
      />
      <StyledChartNavButton
        type="primary"
        shape="circle"
        icon="caret-right"
        IconBtn
        className="navigator navigator-right"
        onClick={() => {
          nextPage()
          setAnimate(true)
        }}
        style={{
          visibility: hasNextPage ? 'visible' : 'hidden',
          padding: 0,
        }}
      />
      <CustomXAxisTickTooltipContainer
        x={xAxisTickTooltipData.x}
        y={xAxisTickTooltipData.y}
        visibility={xAxisTickTooltipData.visibility}
        color={xAxisTickTooltipData.color}
        width={xTickToolTipWidth}
      >
        {xAxisTickTooltipData.content}
      </CustomXAxisTickTooltipContainer>
      <ResponsiveContainer
        width={isPrinting ? PRINT_WIDTH : '100%'}
        height={400}
      >
        <LineChart
          width={730}
          height={250}
          data={renderData}
          margin={{ top: 20, right: 50, left: 20, bottom: 10 }}
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
                data={renderData}
                getXTickText={getXTickText}
                fontWeight={600}
                interventionsData={interventionsData}
                showInterventions={showInterventions}
                setXAxisTickTooltipData={setXAxisTickTooltipData}
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
            tick={{ fill: '#010101' }}
            tickCount={6}
            tickMargin={2}
            label={
              <YAxisLabel
                data={{
                  value: useAttendanceAbsence
                    ? 'TOTAL ABSENCE'
                    : 'AVG ATTENDANCE %',
                  angle: -90,
                  dx: 25,
                  fontSize: 14,
                  translateYDiffValue: 20,
                }}
              />
            }
            {...(useAttendanceAbsence ? {} : { domain: [0, 100] })}
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
            dataKey={useAttendanceAbsence ? 'totalAbsence' : 'value'}
            // `key` is changed to force remount, otherwise recharts won't update the chart on `dataKey` change
            key={useAttendanceAbsence ? 'totalAbsence' : 'value'}
            stroke="#707070"
            strokeDasharray="5 5"
            label={
              <CustomizedLabel useAttendanceAbsence={useAttendanceAbsence} />
            }
            dot={<CustomDot />}
            activeDot={<CustomDot active />}
            isAnimationActive={animate}
            onAnimationStart={onAnimationStart}
          />
        </LineChart>
      </ResponsiveContainer>
    </StyledAttendanceChartContainer>
  )
}

export default AttendanceChart

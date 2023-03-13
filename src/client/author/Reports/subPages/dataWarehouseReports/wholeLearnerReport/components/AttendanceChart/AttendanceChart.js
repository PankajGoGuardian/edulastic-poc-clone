/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useMemo, useRef, useState } from 'react'
import {
  Dot,
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
  TooltipRow,
  TooltipRowTitle,
  TooltipRowValue,
} from '../../../../../common/styled'
import SectionLabel from '../../../../../common/components/SectionLabel'
import SectionDescription from '../../../../../common/components/SectionDescription'
import { setProperties, tooltipParams } from '../../../../../common/util'
import { StyledAttendanceChartContainer } from './styled-components'

const { spaceForLittleTriangle } = tooltipParams

const getXTickText = (payload, _data) => {
  const week = _data[payload.index]?.week + 1
  return week ? `WEEK ${week}` : ''
}

const TooltipRowItem = ({ title = '', value = '' }) => (
  <TooltipRow>
    <TooltipRowTitle>{title}</TooltipRowTitle>
    <TooltipRowValue>{value}</TooltipRowValue>
  </TooltipRow>
)

const getTooltipJSX = (payload) => {
  if (payload && payload.length) {
    const tooltipData = payload[0].payload
    if (!tooltipData || tooltipData.week === -1) return null
    const { presents, absents, tardies, total } = tooltipData
    const tooltipText = (
      <div>
        <TooltipRowItem
          title="No. of"
          value={`Presents - ${presents}/${total}`}
        />
        <TooltipRowItem
          title="No. of"
          value={`Absents - ${absents}/${total}`}
        />
        <TooltipRowItem
          title="No. of"
          value={`Tardies - ${tardies}/${total}`}
        />
      </div>
    )
    return tooltipText
  }
  return null
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

const CustomDot = (props) => {
  const { active, ...restProps } = props
  const { index } = restProps
  if (index === 0) return null
  const activeProps = active
    ? {}
    : {
        strokeWidth: 1.5,
        r: 6,
        strokeDasharray: '',
      }
  return <Dot {...restProps} {...activeProps} />
}

const AttendanceChart = ({
  attendanceChartData,
  onResetClick = () => {},
  filter = {},
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

  const updateTooltipPos = () => {
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

  const getTooltipContent = (payload) => {
    updateTooltipPos()
    // console.log(chartRef)
    return getTooltipJSX(payload)
  }

  const hasFilters = Object.keys(filter).length > 0

  return (
    <StyledAttendanceChartContainer ref={parentContainerRef}>
      <SectionLabel $margin="30px 0px 10px 0px">Weekly Attendance</SectionLabel>
      <SectionDescription>
        Correlate academic performance with attendance
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
          data={renderData}
          margin={{ top: 0, right: 50, left: 20, bottom: 10 }}
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

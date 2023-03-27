import { useOfflinePagination } from '@edulastic/common'
import React, { useMemo, useRef, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { StyledAttendanceChartContainer } from '../../wholeLearnerReport/components/AttendanceChart/styled-components'
import {
  StyledChartNavButton,
  StyledCustomChartTooltipDark,
} from '../../../../common/styled'
import { YAxisLabel } from '../../../../common/components/charts/chartUtils/yAxisLabel'
import { CustomChartXTick } from '../../../../common/components/charts/chartUtils/customChartXTick'
import { hardcodedAttendanceData } from './constants'
import {
  CustomDot,
  CustomizedLabel,
  getTooltipJSX,
  yAxisTick,
} from './CustomElements'
import {
  getAttendanceChartData,
  getXTickText,
  transformDataForChart,
  updateTooltipPos,
} from './utils'

function AttendanceSummaryGraph() {
  const attendanceChartData = useMemo(() => {
    const _attendanceChartData = getAttendanceChartData(hardcodedAttendanceData)
    return _attendanceChartData
  }, [hardcodedAttendanceData])

  const [tooltipType, setTooltipType] = useState('right')
  const tooltipRef = useRef(null)
  const chartRef = useRef(null)
  const parentContainerRef = useRef(null)

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
  const renderData = transformDataForChart(page, pagedData)

  const getTooltipContent = (payload) => {
    updateTooltipPos(parentContainerRef, chartRef, tooltipRef, setTooltipType)
    return getTooltipJSX(payload)
  }

  return (
    <StyledAttendanceChartContainer
      strokeOpacity={1}
      height="420px"
      ref={parentContainerRef}
    >
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
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={730}
          height="100%"
          data={renderData}
          margin={{ top: 0, right: 50, left: 20, bottom: 10 }}
          ref={chartRef}
        >
          <CartesianGrid stroke="#EFEFEF" />
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
            axisLine={false}
          />
          <XAxis
            dataKey="startDate"
            xAxisId="1"
            dy={-7}
            tickMargin={20}
            tickLine={false}
            interval={0}
            axisLine={false}
            label={{ fill: 'red', fontSize: 20 }}
          />
          <YAxis
            type="number"
            domain={[0, 100]}
            tick={yAxisTick}
            tickCount={6}
            tickLine={false}
            axisLine={false}
            label={
              <YAxisLabel
                data={{
                  value: 'PERCENTAGE',
                  angle: -90,
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
            dataKey="value1"
            stroke="#9FC6D2"
            label={CustomizedLabel}
            dot={<CustomDot />}
            activeDot={<CustomDot active />}
          />
        </LineChart>
      </ResponsiveContainer>
    </StyledAttendanceChartContainer>
  )
}

export default AttendanceSummaryGraph

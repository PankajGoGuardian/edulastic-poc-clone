import { useOfflinePagination } from '@edulastic/common'
import React, { useMemo, useRef, useState } from 'react'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { LAST_PAGE_INDEX } from '@edulastic/constants/reportUtils/common'
import { StyledAttendanceChartContainer } from '../../wholeLearnerReport/components/AttendanceChart/styled-components'
import { StyledChartNavButton } from '../../../../common/styled'
import { CustomChartXTick } from '../../../../common/components/charts/chartUtils/customChartXTick'
import { CustomizedLabel, yAxisTick } from './CustomElements'
import {
  getAttendanceChartData,
  getXTickText,
  transformDataForChart,
} from './utils'
import { CustomDot } from '../../../../common/chart-utils'
import DynamicChartTooltip from '../../../../common/components/DynamicChartTooltip'
import { sheetSize } from '../utils/constants'
import { useResetAnimation } from '../../../../common/hooks/useResetAnimation'
import { StyledResponsiveContainer } from '../styled-component'
import { CustomXAxisTickTooltipContainer } from '../../../../common/components/charts/styled-components'

const YAxisLabel = ({ data, viewBox }) => {
  return (
    <text
      className="recharts-text recharts-label"
      x={0}
      y={viewBox.height / 2 + viewBox.y - (data.rightMargin || 0)}
      textAnchor="middle"
      dominantBaseline="hanging"
      transform={`rotate(${data.angle}, ${0}, ${
        viewBox.height / 2 + viewBox.y
      }) translate(${0}, ${
        viewBox.width / 1.5 - (data.translateYDiffValue || 0)
      })`}
      style={{ fontSize: `${data.fontSize}px`, fill: data.fill || 'black' }}
    >
      <tspan>{data.value}</tspan>
    </text>
  )
}

function AttendanceSummaryGraph({
  attendanceData,
  groupBy,
  showInterventions,
  interventionList,
}) {
  const attendanceChartData = useMemo(() => {
    const _attendanceChartData = getAttendanceChartData(attendanceData, groupBy)
    return _attendanceChartData
  }, [attendanceData])

  const xTickToolTipWidth = 200
  const parentContainerRef = useRef(null)
  const chartRef = useRef(null)
  const tooltipRef = useRef(null)
  const [animate, onAnimationStart, setAnimate] = useResetAnimation()
  const [xAxisTickTooltipData, setXAxisTickTooltipData] = useState({
    visibility: 'hidden',
    x: null,
    y: null,
    content: null,
  })

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
    pageSize: sheetSize,
    backFillLastPage: true,
  })

  const hasPreviousPage = page !== 0
  const hasNextPage = page < totalPages - 1
  const renderData = useMemo(
    () => transformDataForChart(page, pagedData, groupBy),
    [page, pagedData, groupBy]
  )

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
        onClick={() => {
          prevPage()
          setAnimate(true)
        }}
        style={{
          marginTop: -30,
          marginLeft: 0,
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
          marginTop: -30,
          marginRight: 0,
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
      <StyledResponsiveContainer width="100%" height="100%">
        <LineChart
          width={730}
          height="100%"
          data={renderData}
          margin={{ top: 0, right: 50, left: 20, bottom: 10 }}
          ref={chartRef}
        >
          <CartesianGrid stroke="#EFEFEF" />
          <XAxis
            xAxisId="0"
            dataKey={groupBy}
            tick={
              <CustomChartXTick
                data={renderData}
                getXTickText={(payload, _data) =>
                  getXTickText(payload, _data, groupBy)
                }
                fontWeight={600}
                showInterventions={showInterventions}
                interventionsData={interventionList}
                setXAxisTickTooltipData={setXAxisTickTooltipData}
                isAttendanceSummary
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
            ticks={[0, 20, 40, 60, 80, 100]}
            tick={yAxisTick}
            padding={{ top: 10 }}
            tickCount={6}
            tickLine={false}
            axisLine={false}
            label={
              <YAxisLabel
                data={{
                  value: 'PERCENTAGE',
                  angle: -90,
                  fontSize: 14,
                  rightMargin: 5,
                }}
              />
            }
          />
          <Tooltip
            cursor={false}
            content={
              <DynamicChartTooltip
                tooltipRef={tooltipRef}
                parentContainerRef={parentContainerRef}
                chartRef={chartRef}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#9FC6D2"
            label={<CustomizedLabel stroke="#9FC6D2" />}
            dot={<CustomDot />}
            activeDot={<CustomDot active />}
            isAnimationActive={animate}
            onAnimationStart={onAnimationStart}
          />
        </LineChart>
      </StyledResponsiveContainer>
    </StyledAttendanceChartContainer>
  )
}

export default React.memo(AttendanceSummaryGraph)

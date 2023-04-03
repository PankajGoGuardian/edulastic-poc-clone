import { useOfflinePagination } from '@edulastic/common'
import React, { useMemo, useRef } from 'react'
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
import { StyledChartNavButton } from '../../../../common/styled'
import { YAxisLabel } from '../../../../common/components/charts/chartUtils/yAxisLabel'
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

function AttendanceSummaryGraph({ attendanceData, groupBy }) {
  const attendanceChartData = useMemo(() => {
    const _attendanceChartData = getAttendanceChartData(attendanceData, groupBy)
    return _attendanceChartData
  }, [attendanceData])

  const parentContainerRef = useRef(null)
  const chartRef = useRef(null)
  const tooltipRef = useRef(null)

  const {
    next: nextPage,
    prev: prevPage,
    pagedData,
    page,
    totalPages,
  } = useOfflinePagination({
    defaultPage: Math.ceil(attendanceChartData.length / sheetSize) - 1,
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
            xAxisId="0"
            dataKey={groupBy}
            tick={
              <CustomChartXTick
                data={renderData}
                getXTickText={(payload, _data) =>
                  getXTickText(payload, _data, groupBy)
                }
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
          />
        </LineChart>
      </ResponsiveContainer>
    </StyledAttendanceChartContainer>
  )
}

export default React.memo(AttendanceSummaryGraph)

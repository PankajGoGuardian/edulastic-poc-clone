import { useOfflinePagination } from '@edulastic/common'
import React, { useMemo, useRef, useEffect, useState } from 'react'
import { IconInfo } from '@edulastic/icons'
import { blueButton } from '@edulastic/colors'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
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

const CustomizedDot = (props: any) => {
  const { cx, cy } = props

  return (
    <IconInfo
      fill={blueButton}
      x={cx - 10}
      y={cy - 10}
      width={20}
      height={20}
    />
  )
}

function AttendanceSummaryGraph({ attendanceData, groupBy, interventionList }) {
  const [interventionsData, setInterventionsData] = useState([])
  const attendanceChartData = useMemo(() => {
    const _attendanceChartData = getAttendanceChartData(attendanceData, groupBy)
    return _attendanceChartData
  }, [attendanceData])

  useEffect(() => {
    let current = 0
    let interventions = interventionList
    attendanceChartData.forEach((data) => {
      if (data.index === 1) {
        current = data.assessmentDate
      } else {
        interventions = interventions.reduce((acc, ele) => {
          if (
            ele.endDate >= current &&
            ele.endDate <= data.assessmentDate &&
            !ele.index
          ) {
            acc.push({
              ...ele,
              index: data.index - 0.5,
            })
          } else {
            acc.push(ele)
          }
          return acc
        }, [])
        current = data.assessmentDate
      }
    })
    setInterventionsData(interventions)
  }, [attendanceChartData, interventionList])

  const parentContainerRef = useRef(null)
  const chartRef = useRef(null)
  const tooltipRef = useRef(null)
  const [animate, onAnimationStart, setAnimate] = useResetAnimation()

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
        onClick={() => {
          prevPage()
          setAnimate(true)
        }}
        style={{
          marginTop: -30,
          marginLeft: 0,
          visibility: hasPreviousPage ? 'visible' : 'hidden',
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
        }}
      />
      <StyledResponsiveContainer width="100%" height="100%">
        <LineChart
          width={730}
          height="100%"
          margin={{ top: 0, right: 50, left: 20, bottom: 10 }}
          ref={chartRef}
        >
          <CartesianGrid stroke="#EFEFEF" />
          <XAxis
            type="number"
            tick={
              <CustomChartXTick
                data={renderData}
                getXTickText={(payload, _data) =>
                  getXTickText(payload, _data, groupBy)
                }
                fontWeight={600}
                subTickKey="startDate"
              />
            }
            tickCount={renderData.length}
            tickMargin={20}
            dataKey="index"
            tickLine={false}
            axisLine={false}
          />
          {/* <XAxis
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
          /> */}
          {/* <XAxis
            dataKey="startDate"
            xAxisId="1"
            dy={-7}
            tickMargin={20}
            tickLine={false}
            interval={0}
            axisLine={false}
            label={{ fill: 'red', fontSize: 20 }}
          /> */}
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
                interventionList={interventionsData}
              />
            }
          />
          <Line
            type="monotone"
            data={renderData}
            dataKey="value"
            stroke="#9FC6D2"
            label={<CustomizedLabel stroke="#9FC6D2" />}
            dot={<CustomDot />}
            activeDot={<CustomDot active />}
            isAnimationActive={animate}
            onAnimationStart={onAnimationStart}
          />
          <Line
            type="monotone"
            data={interventionsData}
            dataKey="__v"
            dot={<CustomizedDot />}
            stroke="#efefef"
          />
        </LineChart>
      </StyledResponsiveContainer>
    </StyledAttendanceChartContainer>
  )
}

export default React.memo(AttendanceSummaryGraph)

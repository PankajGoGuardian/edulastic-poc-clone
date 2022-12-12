/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useMemo, useRef, useState } from 'react'
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
} from 'recharts'

import styled from 'styled-components'
import { Row, Typography } from 'antd'
import { YAxisLabel } from '../../../../common/components/charts/chartUtils/yAxisLabel'
import { CustomChartXTick } from '../../../../common/components/charts/chartUtils/customChartXTick'
import {
  ResetButtonClear,
  StyledChartNavButton,
  StyledCustomChartTooltipDark,
  TooltipRow,
  TooltipRowTitle,
  TooltipRowValue,
} from '../../../../common/styled'
import { DashedLine } from '../../common/styled'

export const AttendanceChart = ({
  attendanceChartData,
  backendPagination,
  setBackendPagination,
  onResetClick = () => {},
  filter = {},
}) => {
  const pageSize = 8
  const parentContainerRef = useRef(null)
  const [pagination, setPagination] = useState({
    startIndex: 0,
    endIndex: pageSize - 1,
  })
  const getXTickText = (payload, _data) => {
    const week = _data[payload.index]?.week + 1 || '-'
    return `WEEK ${week}`
  }

  const getTooltipPosition = () => {
    return { x: 0, y: 0 }
  }

  const TooltipRowItem = ({ title = '', value = '' }) => (
    <TooltipRow>
      <TooltipRowTitle>{title}</TooltipRowTitle>
      <TooltipRowValue>{value}</TooltipRowValue>
    </TooltipRow>
  )

  const chartData = useMemo(() => [...attendanceChartData], [pagination])

  const renderData = useMemo(
    () =>
      chartData.slice(pagination.startIndex, pagination.startIndex + pageSize),
    [pagination, attendanceChartData]
  )

  const scrollLeft = () => {
    let diff
    if (pagination.startIndex > 0) {
      if (pagination.startIndex >= pageSize) {
        diff = pageSize
      } else {
        diff = pagination.startIndex
      }
      setPagination({
        startIndex: pagination.startIndex - diff,
        endIndex: pagination.endIndex - diff,
      })
    }
  }

  const scrollRight = () => {
    let diff
    if (pagination.endIndex < chartData.length - 1) {
      if (chartData.length - 1 - pagination.endIndex >= pageSize) {
        diff = pageSize
      } else {
        diff = chartData.length - 1 - pagination.endIndex
      }
      setPagination({
        startIndex: pagination.startIndex + diff,
        endIndex: pagination.endIndex + diff,
      })
    }
  }

  const getTooltipJSX = (payload) => {
    if (payload && payload.length) {
      const tooltipData = payload[0].payload
      if (!tooltipData) return null
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
    const { x, y, stroke, value } = props

    return (
      <text
        x={x}
        y={y}
        dy={-10}
        fill={stroke}
        fontSize={12}
        textAnchor="middle"
        stroke="#383838"
      >
        {`${value}%`}
      </text>
    )
  }

  // chart navigation visibility and control
  const chartNavLeftVisibility = backendPagination
    ? backendPagination.page > 1
    : !(pagination.startIndex == 0)
  const chartNavRightVisibility = backendPagination
    ? backendPagination.page < backendPagination.pageCount
    : !(chartData.length <= pagination.endIndex + 1)
  const chartNavLeftClick = () =>
    backendPagination
      ? setBackendPagination({
          ...backendPagination,
          page: backendPagination.page - 1,
        })
      : scrollLeft()
  const chartNavRightClick = () =>
    backendPagination
      ? setBackendPagination({
          ...backendPagination,
          page: backendPagination.page + 1,
        })
      : scrollRight()

  return (
    <StyledChartContainer ref={parentContainerRef}>
      <Row type="flex" style={{ margin: '32px 0', alignItems: 'center' }}>
        <Typography.Title style={{ margin: 0 }} level={3}>
          Year to Date - Attendance
        </Typography.Title>
        <DashedLine />
      </Row>
      <ResetButtonClear
        onClick={onResetClick}
        style={
          Object.keys(filter).length > 0
            ? { visibility: 'visible' }
            : { visibility: 'hidden' }
        }
      >
        Reset
      </ResetButtonClear>
      <StyledChartNavButton
        type="primary"
        shape="circle"
        icon="caret-left"
        IconBtn
        className="navigator navigator-left"
        onClick={chartNavLeftClick}
        style={{
          visibility: chartNavLeftVisibility ? 'visible' : 'hidden',
        }}
      />
      <StyledChartNavButton
        type="primary"
        shape="circle"
        icon="caret-right"
        IconBtn
        className="navigator navigator-right"
        onClick={chartNavRightClick}
        style={{
          visibility: chartNavRightVisibility ? 'visible' : 'hidden',
        }}
      />
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          width={730}
          height={250}
          data={renderData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            xAxisId={0}
            dataKey="week"
            tick={
              <CustomChartXTick
                data={renderData}
                getXTickText={getXTickText}
                fontWeight={600}
              />
            }
            tickLine={false}
            tickMargin={20}
            interval="preserveStartEnd"
          />
          <YAxis
            type="number"
            domain={[0, 110]}
            tick={false}
            label={
              <YAxisLabel
                data={{
                  value: 'ATTENDENCE',
                  angle: -90,
                  dx: 25,
                  fontSize: 14,
                }}
              />
            }
          />
          <Tooltip
            cursor={false}
            position={() => getTooltipPosition}
            content={
              <StyledCustomChartTooltipDark
                getJSX={getTooltipJSX}
                style={{
                  left: '0px',
                  bottom: '50%',
                  transform: 'rotate(90deg)',
                }}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#707070"
            strokeDasharray="5 5"
            label={CustomizedLabel}
            dot={{ strokeWidth: 1.5, r: 6, strokeDasharray: '' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </StyledChartContainer>
  )
}

const StyledChartContainer = styled.div`
  padding: 10px;
  position: relative;

  .navigator-left {
    left: 5px;
    top: 50%;
  }

  .navigator-right {
    right: 5px;
    top: 50%;
  }

  .recharts-wrapper .recharts-cartesian-grid-horizontal line:first-child,
  .recharts-wrapper .recharts-cartesian-grid-horizontal line:last-child {
    stroke-opacity: 0;
  }

  .recharts-yAxis {
    .recharts-text {
      tspan {
        white-space: pre;
      }
    }
  }
  & .recharts-wrapper > .recharts-tooltip-wrapper {
    transform: var(tooltip-transform) !important;
    top: var(tooltip-top) !important;
    left: var(tooltip-left) !important;
    visibility: visible !important;
    transition: all 400ms ease 0s;
  }
`

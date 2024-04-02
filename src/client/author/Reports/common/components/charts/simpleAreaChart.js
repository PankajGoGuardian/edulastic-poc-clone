import React, { useState, useMemo } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import {
  ComposedChart,
  XAxis,
  YAxis,
  Area,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  LabelList,
  Legend,
} from 'recharts'

import { StyledCustomChartTooltip, StyledChartNavButton } from '../../styled'
import { CustomXAxisTickTooltipContainer } from './styled-components'

import { getPrintingState } from '../../../ducks'

import {
  CustomChartXTick,
  calculateXCoordinateOfXAxisToolTip,
} from './chartUtils/customChartXTick'

const SimpleAreaChart = ({
  margin = { top: 0, right: 60, left: 60, bottom: 0 },
  legendWrapperStyle = { top: -10 },
  xTickTooltipPosition = 420,
  xTickToolTipWidth = 110,
  data = [],
  pageSize: _pageSize,
  xAxisDataKey,
  xTickFormatter,
  chartDataKey,
  yDomain = [0, 110],
  ticks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  yTickFormatter,
  yAxisLabel = '',
  areaProps = { stroke: '#8884d8', fill: '#8884d8' },
  areaDotProps = false,
  areaActiveDotProps = {},
  lineChartDataKey,
  lineYDomain = [0, 110],
  lineTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  lineYTickFormatter,
  lineYAxisLabel = '',
  lineProps = {},
  lineDotProps = {},
  lineActiveDotProps = {},
  getXTickText,
  getTooltipJSX = () => null,
  TooltipCursor = false,
  isPrinting,
  printWidth,
  overflowStyle = 'hidden',
  backendPagination, // structure: { page: x, pageSize: y, pageCount: z }
  setBackendPagination,
  isLeftPaginated,
}) => {
  const pageSize = _pageSize || backendPagination?.pageSize || 7
  const [pagination, setPagination] = useState({
    startIndex:
      isLeftPaginated && data.length > pageSize ? data.length - pageSize : 0,
    endIndex: isLeftPaginated ? data.length - 1 : pageSize - 1,
  })
  const [isDotActive, setIsDotActive] = useState(false)
  const [xAxisTickTooltipData, setXAxisTickTooltipData] = useState({
    visibility: 'hidden',
    x: null,
    y: null,
    content: null,
  })
  const [activeLegend, setActiveLegend] = useState(null)

  const chartData = useMemo(
    () => data.slice(pagination.startIndex, pagination.startIndex + pageSize),
    [pagination, data]
  )

  const constants = {
    COLOR_BLACK: '#010101',
    TICK_FILL: { fill: '#010101', fontWeight: 'normal' },
    Y_AXIS_LABEL: { value: yAxisLabel.toUpperCase(), angle: -90, dx: -55 },
    LINE_Y_AXIS_LABEL: {
      value: lineYAxisLabel.toUpperCase(),
      angle: -90,
      dx: 50,
    },
    INTERVAL: lineChartDataKey ? 0 : 'preserveEnd',
  }

  const legendPayload = [
    {
      id: chartDataKey,
      dataKey: chartDataKey,
      color: areaProps.fill,
      value: yAxisLabel,
      type: 'rect',
    },
    {
      id: lineChartDataKey,
      dataKey: lineChartDataKey,
      color: lineProps.stroke,
      value: lineYAxisLabel,
      type: 'line',
    },
  ]

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
    if (pagination.endIndex < data.length - 1) {
      if (data.length - 1 - pagination.endIndex >= pageSize) {
        diff = pageSize
      } else {
        diff = data.length - 1 - pagination.endIndex
      }
      setPagination({
        startIndex: pagination.startIndex + diff,
        endIndex: pagination.endIndex + diff,
      })
    }
  }

  const renderToolTipCursor = () =>
    isDotActive ? (
      <TooltipCursor lineYDomain={lineYDomain} yDomain={yDomain} />
    ) : null

  const onXAxisTickTooltipMouseOver = (payload) => {
    const { coordinate } = payload
    let content
    if (getXTickText) {
      content = getXTickText(payload, chartData)
    } else {
      content = payload.value
    }

    data = {
      visibility: 'visible',
      x: `${calculateXCoordinateOfXAxisToolTip(
        coordinate,
        xTickToolTipWidth
      )}px`,
      y: `${xTickTooltipPosition}px`,
      content,
    }
    setXAxisTickTooltipData(data)
  }

  const onXAxisTickTooltipMouseOut = () => {
    setXAxisTickTooltipData({
      visibility: 'hidden',
      x: null,
      y: null,
      content: null,
    })
  }

  const onLegendMouseEnter = ({ dataKey }) => setActiveLegend(dataKey)
  const onLegendMouseLeave = () => setActiveLegend(null)

  // chart navigation visibility and control
  const chartNavLeftVisibility = backendPagination
    ? backendPagination.page > 1
    : !(pagination.startIndex <= 0)
  const chartNavRightVisibility = backendPagination
    ? backendPagination.page < backendPagination.pageCount
    : !(pagination.endIndex >= data.length - 1)
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
    <StyledChartContainer overflowStyle={overflowStyle}>
      <StyledChartNavButton
        type="primary"
        shape="circle"
        icon="caret-left"
        IconBtn
        className="navigator navigator-left"
        onClick={chartNavLeftClick}
        style={{
          visibility: chartNavLeftVisibility ? 'visible' : 'hidden',
          padding: 0,
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
        width={isPrinting ? printWidth || 1024 : '100%'}
        height={400}
      >
        <ComposedChart
          width={730}
          height={400}
          data={chartData}
          margin={margin}
        >
          <CartesianGrid vertical={false} strokeWidth={0.5} />
          <XAxis
            dataKey={xAxisDataKey}
            tick={
              <CustomChartXTick data={chartData} getXTickText={getXTickText} />
            }
            interval={0}
            tickFormatter={xTickFormatter}
            axisLine={{
              stroke: '#E5E5E5',
            }}
            tickLine={false}
            onMouseOver={onXAxisTickTooltipMouseOver}
            onMouseOut={onXAxisTickTooltipMouseOut}
          />
          <YAxis
            type="number"
            interval={constants.INTERVAL}
            domain={yDomain}
            tick={constants.TICK_FILL}
            ticks={ticks}
            tickFormatter={yTickFormatter}
            label={constants.Y_AXIS_LABEL}
            axisLine={false}
            tickLine={{
              stroke: '#4A4A4A',
            }}
            tickSize="9"
            tickMargin="6"
            style={{ transform: 'translate(-25px)' }}
          />
          <Tooltip
            cursor={
              typeof TooltipCursor === 'boolean'
                ? TooltipCursor
                : renderToolTipCursor()
            }
            content={<StyledCustomChartTooltip getJSX={getTooltipJSX} />}
          />
          <Legend
            wrapperStyle={legendWrapperStyle}
            align="right"
            verticalAlign="top"
            onMouseEnter={onLegendMouseEnter}
            onMouseLeave={onLegendMouseLeave}
            payload={legendPayload}
          />
          <Area
            opacity={activeLegend && activeLegend !== chartDataKey ? 0.2 : 1}
            type="monotone"
            dataKey={chartDataKey}
            {...areaProps}
            dot={areaDotProps}
            activeDot={areaActiveDotProps}
          >
            <LabelList dataKey={chartDataKey} position="top" offset={7} />
          </Area>
          {lineChartDataKey ? (
            <YAxis
              type="number"
              interval={constants.INTERVAL}
              yAxisId="lineChart"
              domain={lineYDomain || null}
              label={constants.LINE_Y_AXIS_LABEL}
              ticks={lineTicks}
              orientation="right"
              tickFormatter={lineYTickFormatter}
              axisLine={false}
              tickLine={{
                stroke: '#4A4A4A',
              }}
              tickSize="9"
              tickMargin="6"
              style={{ transform: 'translate(20px)' }}
            />
          ) : null}
          {lineChartDataKey ? (
            <Line
              opacity={
                activeLegend && activeLegend !== lineChartDataKey ? 0.2 : 1
              }
              activeDot={{
                onMouseOver: () => setIsDotActive(true),
                onMouseLeave: () => setIsDotActive(false),
                r: 5,
                ...lineDotProps,
                ...lineActiveDotProps,
              }}
              yAxisId="lineChart"
              type="linear"
              isAnimationActive={!isPrinting}
              dataKey={lineChartDataKey}
              dot={lineDotProps}
              {...lineProps}
            />
          ) : null}
        </ComposedChart>
      </ResponsiveContainer>
    </StyledChartContainer>
  )
}

export default connect(
  (state) => ({
    isPrinting: getPrintingState(state),
  }),
  null
)(SimpleAreaChart)

const StyledChartContainer = styled.div`
  padding: 10px;
  overflow: ${(props) => props.overflowStyle};
  position: relative;

  .recharts-cartesian-axis-ticks {
    font-size: 12px;
  }

  .navigator-left {
    left: 0px;
    margin-left: 0px;
  }

  .navigator-right {
    right: 5px;
  }

  .recharts-wrapper .recharts-cartesian-grid-horizontal line:first-child,
  .recharts-wrapper .recharts-cartesian-grid-horizontal line:last-child {
    stroke-opacity: 0;
  }
`

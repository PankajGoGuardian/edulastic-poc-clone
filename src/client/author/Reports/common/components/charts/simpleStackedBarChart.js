/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useState, useMemo, useEffect } from 'react'
import {
  ComposedChart,
  Bar as _Bar,
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Brush,
  ReferenceLine,
  Legend,
} from 'recharts'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { getPrintingState } from '../../../ducks'
import { StyledCustomChartTooltip, StyledChartNavButton } from '../../styled'
import { CustomXAxisTickTooltipContainer } from './styled-components'
import {
  CustomChartXTick,
  calculateXCoordinateOfXAxisToolTip,
} from './chartUtils/customChartXTick'
import withAnimationInfo from './chartUtils/withAnimationInfo'

const Bar = withAnimationInfo(_Bar)

const _yTickFormatter = (val) => `${val}%`

const LabelText = (props) => {
  const {
    x,
    y,
    width,
    height,
    value,
    formatter,
    onBarMouseOver,
    onBarMouseLeave,
    index,
    startIndex,
  } = props
  return (
    <g
      className="asd-asd"
      onMouseOver={onBarMouseOver()}
      onMouseLeave={onBarMouseLeave()}
    >
      <text
        x={x + width / 2}
        y={y + height}
        textAnchor="middle"
        dominantBaseline="text-after-edge"
      >
        {formatter(value, index, startIndex, x, y)}
      </text>
    </g>
  )
}

const SimpleStackedBarChartComponent = ({
  margin = { top: 0, right: 60, left: 60, bottom: 0 },
  legendWrapperStyle = { top: -10 },
  xTickTooltipPosition = 420,
  xTickToolTipWidth = 110,
  pageSize: _pageSize,
  data = [],
  yDomain = [0, 110],
  ticks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  xAxisDataKey,
  bottomStackDataKey,
  bottomStackDataUnit,
  bottomStackBarProps = {},
  topStackDataKey,
  topStackDataUnit,
  topStackBarProps = {},
  onBarClickCB,
  onResetClickCB,
  getXTickText,
  getTooltipJSX = () => null,
  TooltipCursor = false,
  yAxisLabel = '',
  yTickFormatter = _yTickFormatter,
  barsLabelFormatter = _yTickFormatter,
  filter = {},
  referenceLineY = null,
  lineYDomain = [0, 110],
  lineChartDataKey = false,
  lineProps = {},
  lineDotProps = {},
  lineActiveDotProps = {},
  lineTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  lineYTickFormatter = _yTickFormatter,
  lineYAxisLabel = '',
  isBarClickable = false,
  isPrinting,
  printWidth,
  overflowStyle = 'hidden',
  backendPagination, // structure: { page: x, pageSize: y, pageCount: z }
  setBackendPagination,
  showLegend = false,
  setVisibleIndices,
  carousel,
  setPageNo,
  pageNo,
  tablePageSize,
  totalRows,
  chartBackNavigation,
  setChartBackNavigation,
}) => {
  const pageSize = _pageSize || backendPagination?.pageSize || 7
  const [pagination, setPagination] = useState({
    startIndex: 0,
    endIndex: pageSize - 1,
  })
  const [copyData, setCopyData] = useState(null)
  const [barIndex, setBarIndex] = useState(null)
  const [isDotActive, setDotActive] = useState(false)
  const [xAxisTickTooltipData, setXAxisTickTooltipData] = useState({
    visibility: 'hidden',
    x: null,
    y: null,
    content: null,
  })
  const [activeLegend, setActiveLegend] = useState(null)

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

  const onSetVisibleIndices = (startIndex, endIndex) => {
    setPagination({
      startIndex,
      endIndex,
    })
    if (setVisibleIndices) {
      setVisibleIndices({
        startIndex,
        endIndex,
      })
    }
  }

  if (data !== copyData) {
    onSetVisibleIndices(0, pageSize - 1)
    setCopyData(data)
  }

  const legendPayload = showLegend
    ? [
        {
          id: bottomStackDataKey,
          dataKey: bottomStackDataKey,
          color: bottomStackBarProps.fill,
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
    : []

  const chartData = useMemo(() => [...data], [pagination])

  useEffect(() => {
    if (carousel && chartBackNavigation) {
      setChartBackNavigation(false)
      const startIndex = chartData.length - pageSize
      const endIndex = chartData.length - 1
      onSetVisibleIndices(startIndex, endIndex)
    }
  }, [])

  const scrollLeft = () => {
    let diff
    if (pagination.startIndex > 0) {
      if (pagination.startIndex >= pageSize) {
        diff = pageSize
      } else {
        diff = pagination.startIndex
      }
      const startIndex = pagination.startIndex - diff
      const endIndex = pagination.endIndex - diff
      onSetVisibleIndices(startIndex, endIndex)
    } else if (carousel && pageNo > 1) {
      setChartBackNavigation(true)
      setPageNo((_pageNo) => --_pageNo)
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
      const startIndex = pagination.startIndex + diff
      const endIndex = pagination.endIndex + diff
      onSetVisibleIndices(startIndex, endIndex)
    } else if (carousel && totalRows > tablePageSize * pageNo) {
      setPageNo((_pageNo) => ++_pageNo)
    }
  }

  const onBarClick = (args) => {
    onBarClickCB(args[xAxisDataKey], args)
  }

  const onResetClick = () => {
    onResetClickCB()
  }

  const onBarMouseOver = (index) => () => {
    setBarIndex(index)
  }

  const onBarMouseLeave = () => () => {
    setBarIndex(null)
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

  const onLegendMouseEnter = ({ dataKey }) => setActiveLegend(dataKey)
  const onLegendMouseLeave = () => setActiveLegend(null)

  const onXAxisTickTooltipMouseOut = () => {
    setXAxisTickTooltipData({
      visibility: 'hidden',
      x: null,
      y: null,
      content: null,
    })
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
    <StyledStackedBarChartContainer
      data-testid="StyledStackedBarChartContainer"
      overflowStyle={overflowStyle}
      clickable={isBarClickable}
    >
      <a
        onClick={onResetClick}
        style={
          Object.keys(filter).length > 0
            ? { visibility: 'visible' }
            : { visibility: 'hidden' }
        }
      >
        Reset
      </a>
      <StyledChartNavButton
        type="primary"
        shape="circle"
        icon="caret-left"
        IconBtn
        className="navigator navigator-left"
        onClick={chartNavLeftClick}
        style={{
          visibility:
            chartNavLeftVisibility || (carousel && pageNo > 1)
              ? 'visible'
              : 'hidden',
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
          visibility:
            chartNavRightVisibility ||
            (carousel && totalRows > tablePageSize * pageNo)
              ? 'visible'
              : 'hidden',
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
            axisLine={{
              stroke: '#E5E5E5',
            }}
            tickLine={false}
            onMouseOver={onXAxisTickTooltipMouseOver}
            onMouseOut={onXAxisTickTooltipMouseOut}
          />
          <YAxis
            type="number"
            yAxisId="barChart"
            domain={yDomain}
            tick={constants.TICK_FILL}
            ticks={ticks}
            interval={constants.INTERVAL}
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
          <Brush
            dataKey={xAxisDataKey}
            height={0}
            width={0}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
          />
          <Bar
            dataKey={bottomStackDataKey}
            yAxisId="barChart"
            stackId="a"
            unit={bottomStackDataUnit}
            isAnimationActive={!isPrinting}
            onClick={onBarClick}
            barSize={45}
            onMouseOver={onBarMouseOver(1)}
            onMouseLeave={onBarMouseLeave(null)}
            {...bottomStackBarProps}
            opacity={
              activeLegend && activeLegend !== bottomStackDataKey ? 0.2 : 1
            }
          />
          <Bar
            dataKey={topStackDataKey}
            yAxisId="barChart"
            stackId="a"
            unit={topStackDataUnit}
            onClick={onBarClick}
            isAnimationActive={!isPrinting}
            barSize={45}
            onMouseOver={onBarMouseOver(1)}
            onMouseLeave={onBarMouseLeave(null)}
            {...topStackBarProps}
          >
            <LabelList
              dataKey={bottomStackDataKey}
              position="insideBottom"
              fill="#010101"
              unit={bottomStackDataUnit}
              offset={5}
              onMouseOver={onBarMouseOver(1)}
              onMouseLeave={onBarMouseLeave(null)}
              content={
                <LabelText
                  startIndex={pagination.startIndex}
                  onBarMouseOver={onBarMouseOver}
                  onBarMouseLeave={onBarMouseLeave}
                  formatter={barsLabelFormatter}
                />
              }
            />
            {chartData.map((entry) => (
              <Cell
                radius={[10, 10, 0, 0]}
                key={entry[xAxisDataKey]}
                fill="#e5e5e5"
              />
            ))}
          </Bar>
          {lineChartDataKey ? (
            <YAxis
              yAxisId="lineChart"
              domain={lineYDomain || null}
              label={constants.LINE_Y_AXIS_LABEL}
              ticks={lineTicks}
              orientation="right"
              interval={constants.INTERVAL}
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
                onMouseOver: () => {
                  setDotActive(true)
                  setBarIndex(1)
                },
                onMouseLeave: () => {
                  setDotActive(false)
                  setBarIndex(null)
                },
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
          {referenceLineY > 0 ? (
            <ReferenceLine
              yAxisId="barChart"
              y={referenceLineY}
              stroke="#010101"
            />
          ) : null}
          {showLegend && (
            <Legend
              wrapperStyle={legendWrapperStyle}
              align="right"
              verticalAlign="top"
              onMouseEnter={onLegendMouseEnter}
              onMouseLeave={onLegendMouseLeave}
              payload={legendPayload}
            />
          )}
          <Tooltip
            cursor={
              typeof TooltipCursor === 'boolean'
                ? TooltipCursor
                : renderToolTipCursor()
            }
            content={
              <StyledCustomChartTooltip
                getJSX={getTooltipJSX}
                barIndex={barIndex}
              />
            }
          />
        </ComposedChart>
      </ResponsiveContainer>
    </StyledStackedBarChartContainer>
  )
}

export const SimpleStackedBarChart = connect(
  (state) => ({
    isPrinting: getPrintingState(state),
  }),
  null
)(SimpleStackedBarChartComponent)

const StyledStackedBarChartContainer = styled.div`
  padding: 10px;
  overflow: ${(props) => props.overflowStyle};

  .recharts-surface {
    overflow: ${(props) => props.overflowStyle};
  }

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
  .recharts-rectangle {
    cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')}!important;
  }
`

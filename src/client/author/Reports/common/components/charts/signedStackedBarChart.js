/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useState, useMemo, useEffect } from 'react'
import {
  BarChart,
  Bar as _Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Legend,
  ReferenceLine,
} from 'recharts'
import { isEmpty, findLast } from 'lodash'
import styled from 'styled-components'
import {
  StyledCustomChartTooltip,
  StyledChartNavButton,
  ResetButtonClear,
} from '../../styled'
import { CustomXAxisTickTooltipContainer } from './styled-components'
import {
  CustomChartXTick,
  calculateXCoordinateOfXAxisToolTip,
} from './chartUtils/customChartXTick'
import { YAxisLabel } from './chartUtils/yAxisLabel'
import withAnimationInfo from './chartUtils/withAnimationInfo'

const Bar = withAnimationInfo(_Bar)

const _barsLabelFormatter = (val) => {
  if (val !== 0) {
    return `${val}%`
  }
  return ''
}

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
    bdIndex,
  } = props
  return (
    <g
      className="asd-asd"
      onMouseOver={onBarMouseOver(bdIndex)}
      onMouseLeave={onBarMouseLeave(bdIndex)}
    >
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {formatter(value)}
      </text>
    </g>
  )
}

export const SignedStackedBarChart = ({
  margin = { top: 0, right: 60, left: 60, bottom: 0 },
  legendWrapperStyle = { top: -10 },
  xTickTooltipPosition = 420,
  xTickToolTipWidth = 200,
  pageSize: _pageSize,
  barsData,
  data = [],
  yDomain = [-100, 110],
  ticks = [-100, -81, -54, -27, 27, 54, 81, 110],
  xAxisDataKey,
  onBarClickCB,
  onResetClickCB,
  getXTickText,
  getTooltipJSX,
  yAxisLabel = '',
  yTickFormatter = (val) => `${val}%`,
  barsLabelFormatter = _barsLabelFormatter,
  referenceLine = 0,
  filter = {},
  legendPayload,
  backendPagination, // structure: { page: x, pageSize: y, pageCount: z }
  setBackendPagination,
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
  const [activeLegend, setActiveLegend] = useState(null)
  const [xAxisTickTooltipData, setXAxisTickTooltipData] = useState({
    visibility: 'hidden',
    x: null,
    y: null,
    content: null,
  })

  const constants = {
    COLOR_BLACK: '#010101',
    TICK_FILL: { fill: '#010101', fontWeight: 'bold' },
    Y_AXIS_LABEL: {
      value: yAxisLabel.toUpperCase(),
      angle: -90,
      dx: 25,
      fontSize: 14,
    },
  }

  if (data !== copyData) {
    setPagination({
      startIndex: 0,
      endIndex: pageSize - 1,
    })
    setCopyData(data)
  }

  const chartData = useMemo(() => [...data], [pagination])

  const renderData = useMemo(
    () =>
      chartData.slice(pagination.startIndex, pagination.startIndex + pageSize),
    [pagination, data]
  )

  useEffect(() => {
    if (carousel && chartBackNavigation) {
      setChartBackNavigation(false)
      const startIndex = chartData.length - pageSize
      const endIndex = chartData.length - 1
      setPagination({ startIndex, endIndex })
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
      setPagination({
        startIndex: pagination.startIndex - diff,
        endIndex: pagination.endIndex - diff,
      })
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
      setPagination({
        startIndex: pagination.startIndex + diff,
        endIndex: pagination.endIndex + diff,
      })
    } else if (carousel && totalRows > tablePageSize * pageNo) {
      setPageNo((_pageNo) => ++_pageNo)
    }
  }

  const onBarClick = (args) => {
    onBarClickCB(args[xAxisDataKey])
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

  const onLegendMouseEnter = ({ dataKey }) => setActiveLegend(dataKey)
  const onLegendMouseLeave = () => setActiveLegend(null)

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

  const barKeys = useMemo(() =>
    barsData.map((bdItem, bdIndex) => ({ key: bdItem.key, idx: bdIndex }))
  )
  const isRoundBar = (barData, bdIndex) => {
    const positive = barKeys.filter((ite) => barData[ite.key] > 0)
    const negative = barKeys.filter((ite) => barData[ite.key] < 0)
    return (
      findLast(positive)?.idx === bdIndex || findLast(negative)?.idx === bdIndex
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
    <StyledSignedStackedBarChartContainer>
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
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          width={730}
          height={400}
          data={renderData}
          stackOffset="sign"
          margin={margin}
        >
          <CartesianGrid vertical={false} strokeWidth={0.5} />
          <XAxis
            dataKey={xAxisDataKey}
            tick={
              <CustomChartXTick data={renderData} getXTickText={getXTickText} />
            }
            interval={0}
            onMouseOver={onXAxisTickTooltipMouseOver}
            onMouseOut={onXAxisTickTooltipMouseOut}
          />
          <YAxis
            type="number"
            domain={yDomain}
            tick={constants.TICK_FILL}
            ticks={ticks}
            tickFormatter={yTickFormatter}
            label={<YAxisLabel data={constants.Y_AXIS_LABEL} />}
          />
          <Tooltip
            cursor={false}
            content={
              <StyledCustomChartTooltip
                getJSX={getTooltipJSX}
                barIndex={barIndex}
              />
            }
          />
          <Legend
            wrapperStyle={legendWrapperStyle}
            align="right"
            verticalAlign="top"
            onMouseEnter={onLegendMouseEnter}
            onMouseLeave={onLegendMouseLeave}
            payload={legendPayload}
          />
          <ReferenceLine y={referenceLine} stroke={constants.COLOR_BLACK} />
          {barsData.map((bdItem, bdIndex) => {
            let fillOpacity = 1

            if (activeLegend && activeLegend !== bdItem.key) {
              fillOpacity = 0.2
            }

            return (
              <Bar
                key={bdItem.key}
                dataKey={bdItem.key}
                name={bdItem.name}
                stackId={bdItem.stackId}
                fill={bdItem.fill}
                unit={bdItem.unit}
                onClick={onBarClick}
                barSize={45}
                onMouseOver={onBarMouseOver(bdIndex)}
                onMouseLeave={onBarMouseLeave(bdIndex)}
              >
                <LabelList
                  dataKey={bdItem.key}
                  position="inside"
                  fill="#010101"
                  offset={5}
                  onMouseOver={onBarMouseOver(bdIndex)}
                  onMouseLeave={onBarMouseLeave(bdIndex)}
                  content={
                    <LabelText
                      onBarMouseOver={onBarMouseOver}
                      onBarMouseLeave={onBarMouseLeave}
                      bdIndex={bdIndex}
                      formatter={barsLabelFormatter}
                    />
                  }
                />
                {renderData.map((cdItem) =>
                  filter[cdItem[xAxisDataKey]] || isEmpty(filter) ? (
                    <Cell
                      radius={
                        isRoundBar(cdItem, bdIndex)
                          ? [10, 10, 0, 0]
                          : [0, 0, 0, 0]
                      }
                      key={cdItem[xAxisDataKey]}
                      fill={bdItem.fill}
                      fillOpacity={fillOpacity}
                    />
                  ) : (
                    <Cell
                      radius={
                        isRoundBar(cdItem, bdIndex)
                          ? [10, 10, 0, 0]
                          : [0, 0, 0, 0]
                      }
                      key={cdItem[xAxisDataKey]}
                      fill="#c0c0c0"
                    />
                  )
                )}
              </Bar>
            )
          })}
        </BarChart>
      </ResponsiveContainer>
    </StyledSignedStackedBarChartContainer>
  )
}

const StyledSignedStackedBarChartContainer = styled.div`
  padding: 10px;
  overflow: hidden;

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
`

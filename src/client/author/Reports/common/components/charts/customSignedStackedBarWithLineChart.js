/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useState, useMemo, useRef } from 'react'
import {
  ComposedChart,
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
  Line,
} from 'recharts'
import { isEmpty, findLast } from 'lodash'

import { greyLight1 } from '@edulastic/colors'
import { useOfflinePagination } from '@edulastic/common'
import { LAST_PAGE_INDEX } from '@edulastic/constants/reportUtils/common'

import {
  StyledCustomChartTooltipDark,
  StyledChartNavButton,
  ResetButtonClear,
} from '../../styled'
import {
  CustomXAxisTickTooltipContainer,
  StyledSignedStackedBarChartContainer,
} from './styled-components'
import {
  CustomChartXTick,
  calculateXCoordinateOfXAxisToolTip,
} from './chartUtils/customChartXTick'
import { YAxisLabel } from './chartUtils/yAxisLabel'
import withAnimationInfo from './chartUtils/withAnimationInfo'
import {
  setProperties,
  tooltipParams,
  getHoveredBarDimensions,
  formatDate,
  getChartDataBasedOnSchoolYear,
} from '../../util'
import { getFGColor } from '../../../../src/utils/util'

const Bar = withAnimationInfo(_Bar)

const {
  maxTooltipHeight,
  tooltipWidth,
  spaceForLittleTriangle,
  navButtonMargin,
  xAxisHeight,
} = tooltipParams

const _barsLabelFormatter = (val) => {
  if (val !== 0) {
    return `${val}%`
  }
  return ''
}

const LabelText = ({
  position,
  x,
  y,
  offsetX = 0,
  offsetY = 0,
  width,
  height,
  value,
  formatter,
  onBarMouseOver,
  onBarMouseLeave,
  bdIndex,
  payload,
  style = {},
}) => {
  return (
    <g
      className="asd-asd"
      onMouseOver={onBarMouseOver(bdIndex, true)}
      onMouseLeave={onBarMouseLeave(bdIndex)}
      style={{ pointerEvents: 'none' }}
    >
      <text
        x={x + width / 2 + offsetX}
        y={y + (position === 'inside' ? height / 2 : 0) + offsetY}
        textAnchor="middle"
        dominantBaseline="middle"
        style={style}
      >
        {formatter(value, payload)}
      </text>
    </g>
  )
}

const LineDot = ({ cx, cy, dotProps }) => {
  return (
    <circle cx={cx} cy={cy} r={3} fill="#ffffff" opacity={0.2} {...dotProps} />
  )
}

const ActiveLineDot = ({ cx, cy }) => {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={3}
      fill="#ffffff"
      stroke="#ffffff"
      strokeWidth={2}
    />
  )
}

export const SignedStackedBarWithLineChart = ({
  margin = { top: 0, right: 60, left: 60, bottom: 0 },
  legendProps = {
    wrapperStyle: { top: -10 },
  },
  xTickTooltipPosition = 420,
  xTickToolTipWidth = 200,
  pageSize: _pageSize,
  barsData,
  data = [],
  yDomain = [-100, 110],
  xAxisDataKey,
  lineDataKey,
  lineProps = {},
  onBarClickCB,
  onResetClickCB,
  getXTickText,
  getXTickTooltipText,
  getXTickTagText,
  getTooltipJSX,
  getRightTooltipJSX,
  yAxisLabel = '',
  yTickFormatter = (val) => `${val}%`,
  barsLabelFormatter = _barsLabelFormatter,
  referenceLine = 0,
  filter = {},
  hasRoundedBars = true,
  isSignedChart = true,
  hideYAxis = false,
  hideCartesianGrid = false,
  hideLegend = false,
  hasBarTopLabels = false,
  hasBarInsideLabels = true,
  backendPagination, // structure: { page: x, pageSize: y, pageCount: z }
  setBackendPagination,
  showInterventions,
  interventionsData,
}) => {
  const pageSize = _pageSize || backendPagination?.pageSize || 7
  const parentContainerRef = useRef(null)
  const tooltipPayload = useRef(0)
  const topTooltipRef = useRef(null)
  const sideTooltipRef = useRef(null)
  const [showLeftTooltip, setShowLeftTooltip] = useState(false)
  const [tooltipArrowMargin, setTooltipArrowMargin] = useState(0)
  const [activeLegend, setActiveLegend] = useState(null)
  const [xAxisTickTooltipData, setXAxisTickTooltipData] = useState({
    visibility: 'hidden',
    x: null,
    y: null,
    content: null,
  })

  const [fillOpacity, setFillOpacity] = useState({ bar: 1, line: 0.2 })
  const [dotProps, setDotProps] = useState({})

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

  const modifiedData = useMemo(() => {
    return getChartDataBasedOnSchoolYear(data)
  }, [data])

  const {
    next: nextPage,
    prev: prevPage,
    pagedData,
    page,
    totalPages,
  } = useOfflinePagination({
    defaultPage: LAST_PAGE_INDEX,
    data: modifiedData,
    lookbackCount: 0,
    pageSize,
    backFillLastPage: true,
  })

  const onBarClick = (args) => {
    onBarClickCB(args[xAxisDataKey])
  }

  const onResetClick = () => {
    onResetClickCB()
  }

  const updateBottomTooltipPosition = (
    hoveredBarDimensions,
    parentContainerDimensions
  ) => {
    const { width, x } = hoveredBarDimensions
    const { parentContainerHeight } = parentContainerDimensions

    const bottomTooltipProperties = {
      '--first-tooltip-transform': `translate(calc(${
        x + width / 2
      }px - 50%), ${parentContainerHeight}px)`,
      '--first-tooltip-top': '0',
      '--first-tooltip-left': '0',
    }
    setProperties(parentContainerRef, bottomTooltipProperties)
  }

  const updateSideTooltipPosition = (
    hoveredBarDimensions,
    parentContainerDimensions
  ) => {
    const { height, width, x, y } = hoveredBarDimensions
    const {
      parentContainerHeight,
      parentContainerWidth,
    } = parentContainerDimensions

    const xn = x + width + spaceForLittleTriangle + tooltipWidth
    const isLeftTooltip = parentContainerWidth - xn < 0
    const xRight = isLeftTooltip
      ? x - (tooltipWidth + width + 2 * spaceForLittleTriangle)
      : x
    setShowLeftTooltip(isLeftTooltip)

    const yn = y + height / 2 - 30
    let overlap = yn + maxTooltipHeight / 2 - parentContainerHeight
    setTooltipArrowMargin(overlap - 12)
    if (overlap < 0) {
      overlap = 0
      setTooltipArrowMargin(-spaceForLittleTriangle)
    }

    const sideTooltipProperties = {
      '--second-tooltip-transform': `translate(${
        xRight + 2 * spaceForLittleTriangle + width
      }px, calc(${y + height / 2 + 48 - overlap}px - 50% )`,
      '--second-tooltip-top': '0',
      '--second-tooltip-left': '0',
    }
    setProperties(parentContainerRef, sideTooltipProperties)
  }

  const updateTooltipPosition = (hoveredBarDimensions) => {
    if (!parentContainerRef.current) return
    const parentContainerDimensions = {
      parentContainerWidth:
        parentContainerRef.current.offsetWidth - navButtonMargin,
      parentContainerHeight:
        parentContainerRef.current.offsetHeight - xAxisHeight,
    }
    // set properties for top tooltip
    updateBottomTooltipPosition(hoveredBarDimensions, parentContainerDimensions)

    // set properties for right/left tooltip
    updateSideTooltipPosition(hoveredBarDimensions, parentContainerDimensions)
  }

  const onBarMouseOver = (index) => (event) => {
    topTooltipRef.current?.updateBarIndex(index)
    sideTooltipRef.current?.updateBarIndex(index)
    if (isEmpty(event)) return
    let d = { x: event.x, y: event.y, width: event.width, height: event.height }
    // To handle updating tooltip position when the labels are hovered.
    // the label does not contain x,y coordinate relative to chart container.
    // label's parent element contains x,y coordinate relative to chart container.
    if (!isEmpty(event.target)) d = getHoveredBarDimensions(event)
    updateTooltipPosition(d)
  }

  const onBarMouseLeave = () => () => {
    topTooltipRef.current?.resetBarIndex()
    sideTooltipRef.current?.resetBarIndex()
  }

  const handleLineMouseEnter = () => {
    setFillOpacity({ bar: 0.2, line: 1 })
    setDotProps({ stroke: '#000000', strokeWidth: 1, opacity: 1 })
  }

  const handleLineMouseLeave = () => {
    setFillOpacity({ bar: 1, line: 0.2 })
    setDotProps({})
  }

  const onLegendMouseEnter = ({ dataKey }) => setActiveLegend(dataKey)
  const onLegendMouseLeave = () => setActiveLegend(null)

  const setLegendMargin = (value) => {
    return <span style={{ marginRight: '30px' }}>{value}</span>
  }

  const onXAxisTickTooltipMouseOver = (payload) => {
    const { coordinate, index } = payload
    let content
    if (getXTickTooltipText) {
      content = getXTickTooltipText(payload, pagedData)
    } else if (getXTickText) {
      const testName = getXTickText(payload, pagedData)
      const test = pagedData[index]
      content = (
        <>
          <span>{testName}</span>
          <br />
          <span>Date: {formatDate(test.assessmentDate)}</span>
        </>
      )
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
    if (hasRoundedBars) {
      const positive = barKeys.filter((ite) => barData[ite.key] > 0)
      const negative = barKeys.filter((ite) => barData[ite.key] < 0)
      return (
        findLast(positive)?.idx === bdIndex ||
        findLast(negative)?.idx === bdIndex
      )
    }
    return false
  }

  // chart navigation visibility and control
  const hasPreviousPage = page !== 0
  const hasNextPage = page < totalPages - 1
  const chartNavLeftVisibility = backendPagination
    ? backendPagination.page > 1
    : hasPreviousPage
  const chartNavRightVisibility = backendPagination
    ? backendPagination.page < backendPagination.pageCount
    : hasNextPage

  const chartNavLeftClick = () =>
    backendPagination
      ? setBackendPagination({
          ...backendPagination,
          page: backendPagination.page - 1,
        })
      : prevPage()
  const chartNavRightClick = () =>
    backendPagination
      ? setBackendPagination({
          ...backendPagination,
          page: backendPagination.page + 1,
        })
      : nextPage()

  return (
    <StyledSignedStackedBarChartContainer ref={parentContainerRef}>
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
        <ComposedChart
          width={730}
          height={400}
          data={pagedData}
          stackOffset="sign"
          margin={margin}
        >
          {!hideCartesianGrid ? (
            <CartesianGrid vertical={false} strokeWidth={0.5} />
          ) : null}

          <XAxis
            dataKey={xAxisDataKey}
            tick={
              <CustomChartXTick
                data={pagedData}
                getXTickText={getXTickText}
                getXTickTagText={getXTickTagText}
                fontWeight={600}
                setXAxisTickTooltipData={setXAxisTickTooltipData}
                showInterventions={showInterventions}
                interventionsData={interventionsData}
              />
            }
            tickLine={false}
            tickMargin={20}
            stroke={greyLight1}
            interval={0}
            onMouseOver={onXAxisTickTooltipMouseOver}
            onMouseOut={onXAxisTickTooltipMouseOut}
          />

          {!hideYAxis ? (
            <YAxis
              type="number"
              domain={yDomain}
              tick={false}
              stroke={false}
              tickFormatter={yTickFormatter}
              label={<YAxisLabel data={constants.Y_AXIS_LABEL} />}
            />
          ) : null}
          <Tooltip
            cursor={false}
            content={
              <StyledCustomChartTooltipDark
                ref={topTooltipRef}
                getJSX={(payload, active) => {
                  tooltipPayload.current = [payload, active]
                  return getTooltipJSX(payload, active)
                }}
                tooltipType="bottom"
              />
            }
          />
          {!hideLegend ? (
            <Legend
              align="right"
              verticalAlign="top"
              onMouseEnter={onLegendMouseEnter}
              onMouseLeave={onLegendMouseLeave}
              {...legendProps}
              formatter={setLegendMargin}
            />
          ) : null}
          {isSignedChart ? (
            <ReferenceLine y={referenceLine} stroke={constants.COLOR_BLACK} />
          ) : null}
          {barsData.map((bdItem, bdIndex) => {
            let barFillOpacity = fillOpacity.bar
            if (activeLegend && activeLegend !== bdItem.key) {
              barFillOpacity = 0.2
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
                onMouseOver={onBarMouseOver(bdIndex, true)}
                onMouseLeave={onBarMouseLeave(bdIndex)}
              >
                {hasBarTopLabels ? (
                  <LabelList
                    dataKey={bdItem.topLabelKey}
                    position="top"
                    fill="#010101"
                    onMouseOver={onBarMouseOver(bdIndex, true)}
                    onMouseLeave={onBarMouseLeave(bdIndex)}
                    content={
                      <LabelText
                        position="top"
                        onBarMouseOver={onBarMouseOver}
                        onBarMouseLeave={onBarMouseLeave}
                        bdIndex={bdIndex}
                        formatter={barsLabelFormatter}
                        offsetY={-30}
                      />
                    }
                  />
                ) : null}
                {hasBarInsideLabels ? (
                  <LabelList
                    dataKey={bdItem.insideLabelKey}
                    position="inside"
                    fill="#010101"
                    onMouseOver={onBarMouseOver(bdIndex)}
                    onMouseLeave={onBarMouseLeave(bdIndex)}
                    content={
                      <LabelText
                        position="inside"
                        onBarMouseOver={onBarMouseOver}
                        onBarMouseLeave={onBarMouseLeave}
                        bdIndex={bdIndex}
                        formatter={barsLabelFormatter}
                        style={{
                          opacity: barFillOpacity,
                          fill: getFGColor(bdItem.fill),
                        }}
                      />
                    }
                  />
                ) : null}
                {pagedData.map((cdItem) => {
                  const bgColor =
                    cdItem.additionalData?.[bdItem.key]?.fill ||
                    cdItem.fill ||
                    bdItem.fill
                  const fgColor =
                    cdItem.additionalData?.[bdItem.key]?.stroke ||
                    cdItem.stroke ||
                    getFGColor(bgColor)
                  return filter[cdItem[xAxisDataKey]] || isEmpty(filter) ? (
                    <Cell
                      radius={
                        isRoundBar(cdItem, bdIndex)
                          ? [10, 10, 0, 0]
                          : [0, 0, 0, 0]
                      }
                      key={cdItem[xAxisDataKey]}
                      fill={bgColor}
                      fillOpacity={
                        cdItem.additionalData?.[bdItem.key]?.fillOpacity ||
                        cdItem.fillOpacity ||
                        barFillOpacity
                      }
                      stroke={fgColor}
                      strokeOpacity={
                        cdItem.additionalData?.[bdItem.key]?.strokeOpacity ||
                        cdItem.strokeOpacity ||
                        barFillOpacity
                      }
                      strokeWidth={
                        cdItem.additionalData?.[bdItem.key]?.strokeWidth ||
                        cdItem.strokeWidth ||
                        0
                      }
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
                })}
              </Bar>
            )
          })}
          {lineDataKey ? (
            // Visible line
            <Line
              dataKey={lineDataKey}
              strokeOpacity={fillOpacity.line}
              {...lineProps}
              dot={<LineDot dotProps={dotProps} />}
              activeDot={<ActiveLineDot />}
            />
          ) : null}
          {lineDataKey ? (
            // invisible line defining activation/hover area for Visible line
            <Line
              dataKey={lineDataKey}
              strokeOpacity={0}
              onMouseEnter={handleLineMouseEnter}
              onMouseLeave={handleLineMouseLeave}
              {...lineProps}
              strokeDasharray={undefined}
              stroke="rgba(0,0,0,0)"
              strokeWidth={
                lineProps.strokeWidthActive || (lineProps.strokeWidth || 1) + 10
              }
              dot={<LineDot dotProps={dotProps} />}
              activeDot={<ActiveLineDot />}
            />
          ) : null}
        </ComposedChart>
      </ResponsiveContainer>
      <Tooltip
        cursor={false}
        content={
          <StyledCustomChartTooltipDark
            ref={sideTooltipRef}
            getJSX={(payload, active) => {
              payload = tooltipPayload.current?.[0]
              active = tooltipPayload.current?.[1]
              return getRightTooltipJSX(payload, active)
            }}
            tooltipType={showLeftTooltip ? 'left' : 'right'}
            tooltipArrowMargin={tooltipArrowMargin}
          />
        }
      />
    </StyledSignedStackedBarChartContainer>
  )
}

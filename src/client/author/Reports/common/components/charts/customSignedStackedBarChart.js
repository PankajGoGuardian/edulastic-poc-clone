/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useState, useMemo, useRef, useEffect } from 'react'
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

import { greyLight1 } from '@edulastic/colors'
import { useOfflinePagination } from '@edulastic/common'
import { LAST_PAGE_INDEX } from '@edulastic/constants/reportUtils/common'
import {
  StyledCustomChartTooltipDark,
  StyledChartNavButton,
  ResetButtonClear,
  StyledCustomChartTooltip,
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
  getChartDataBasedOnSchoolYear,
  formatDate,
} from '../../util'
import { getFGColor } from '../../../../src/utils/util'

const Bar = withAnimationInfo(_Bar)

const { spaceForLittleTriangle, spaceForPercentageLabel } = tooltipParams

const _barsLabelFormatter = (val) => {
  if (val !== 0) {
    return `${val}%`
  }
  return ''
}

const LabelText = ({
  x,
  y,
  width,
  height,
  value,
  formatter,
  onBarMouseOver,
  onBarMouseLeave,
  bdIndex,
  payload,
  style,
  yOffset = 0,
  xOffset = 0,
}) => {
  return (
    <g
      className="asd-asd"
      onMouseOver={onBarMouseOver(bdIndex, true)}
      onMouseLeave={onBarMouseLeave(bdIndex)}
      style={{ pointerEvents: 'none' }}
    >
      <text
        x={x + (xOffset || width / 2)}
        y={y + (yOffset || height / 2)}
        textAnchor="middle"
        dominantBaseline="middle"
        style={style}
      >
        {formatter(value, payload, height)}
      </text>
    </g>
  )
}

export const SignedStackedBarChart = ({
  margin = { top: 0, right: 60, left: 60, bottom: 0 },
  width = '100%',
  legendProps = {
    wrapperStyle: { top: -10 },
  },
  xTickTooltipPosition = 420,
  xTickToolTipWidth = 200,
  pageSize: _pageSize,
  barsData,
  data = [],
  settings,
  yDomain = [-100, 110],
  ticks = [-100, -81, -54, -27, 27, 54, 81, 110],
  xAxisDataKey,
  onBarClickCB,
  onResetClickCB,
  getXTickText,
  getXTickTooltipText,
  getXTickTagText,
  getTooltipJSX,
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
  preLabelContent = null,
  interventionsData,
  showInterventions,
  // NOTE props used for the workaround to fix labels not rendering due to interrupted animation
  // ref: https://github.com/recharts/react-smooth/issues/44
  animate = true,
  onAnimationStart = () => {},
  setAnimate = () => {},
  handleMouseOver = null,
  onMouseBarLeave = null,
  hideOnlyYAxis = false,
  barSize,
  referenceLines = [],
  tickMargin = 20,
  tooltipType = 'top',
  responsiveContainerHeight = 400,
  xAxisFontWeight = 600,
  startFromLast = false,
  tick = false,
  yTickLine,
  yAxisStyle = null,
  needWhiteBackgroundToolTip = false,
}) => {
  const pageSize = _pageSize || backendPagination?.pageSize || 7
  const parentContainerRef = useRef(null)
  const tooltipRef = useRef(null)
  const [activeLegend, setActiveLegend] = useState(null)
  const [xAxisTickTooltipData, setXAxisTickTooltipData] = useState({
    visibility: 'hidden',
    x: null,
    y: null,
    content: null,
  })

  const modifiedData = useMemo(() => {
    return getChartDataBasedOnSchoolYear(data)
  }, [data])

  const {
    next: nextPage,
    prev: prevPage,
    pagedData,
    page,
    totalPages,
    setPage,
  } = useOfflinePagination({
    defaultPage: LAST_PAGE_INDEX,
    data: modifiedData,
    lookbackCount: 0,
    pageSize,
    backFillLastPage: true,
  })

  useEffect(() => {
    if (settings) {
      setPage(LAST_PAGE_INDEX)
      setAnimate(true)
    }
  }, [settings?.frontEndFilters?.testTypes])

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

  const onBarClick = (args) => {
    onBarClickCB(args[xAxisDataKey])
  }

  const onResetClick = () => {
    onResetClickCB()
  }

  const updateTooltipPosition = (hoveredBarDimensions) => {
    if (!parentContainerRef.current) return
    const { width: barWidth, x, y, height } = hoveredBarDimensions
    let tooltipProperties = {
      '--first-tooltip-transform': `translate(${
        x + barWidth / 2 - 100
      }px, calc(${
        y - spaceForLittleTriangle - spaceForPercentageLabel
      }px - 100% ))`,
      '--first-tooltip-top': '0',
      '--first-tooltip-left': '0',
    }
    if (tooltipType === 'left') {
      tooltipProperties = {
        '--first-tooltip-transform': `translate(${x + barWidth / 2}px, calc(${
          y + 75 + height / 2
        }px - 100% ))`,
        '--first-tooltip-top': '0',
        '--first-tooltip-left': '0',
      }
    }

    setProperties(parentContainerRef, tooltipProperties)
  }

  const onBarMouseOver = (index, category) => (event) => {
    tooltipRef.current?.updateBarIndex(index)
    if (isEmpty(event)) return
    let d = {
      x: event.x,
      y: event.testType === 'External Assessment' ? 50 : event.y,
      width: event.width,
      height: event.height,
    }
    // To handle updating tooltip position when the labels are hovered.
    // the label does not contain x,y coordinate relative to chart container.
    // label's parent element contains x,y coordinate relative to chart container.
    if (!isEmpty(event.target)) d = getHoveredBarDimensions(event)
    updateTooltipPosition(d)
    if (handleMouseOver) {
      handleMouseOver(category)
    }
  }

  const onBarMouseLeave = () => () => {
    tooltipRef.current?.resetBarIndex()
    if (onMouseBarLeave) {
      onMouseBarLeave()
    }
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

  let chartNavLeftVisibility = backendPagination
    ? backendPagination.page > 1
    : hasPreviousPage
  let chartNavRightVisibility = backendPagination
    ? backendPagination.page < backendPagination.pageCount
    : hasNextPage

  if (startFromLast)
    [chartNavLeftVisibility, chartNavRightVisibility] = [
      chartNavRightVisibility,
      chartNavLeftVisibility,
    ]

  const chartNavLeftClick = () => {
    if (backendPagination) {
      setBackendPagination({
        ...backendPagination,
        page: startFromLast
          ? backendPagination.page + 1
          : backendPagination.page - 1,
      })
    } else {
      prevPage()
      setAnimate(true)
    }
  }
  const chartNavRightClick = () => {
    if (backendPagination) {
      setBackendPagination({
        ...backendPagination,
        page: startFromLast
          ? backendPagination.page - 1
          : backendPagination.page + 1,
      })
    } else {
      nextPage()
      setAnimate(true)
    }
  }

  const tooltipContent = needWhiteBackgroundToolTip ? (
    <StyledCustomChartTooltip
      ref={tooltipRef}
      getJSX={getTooltipJSX}
      // tooltipType={tooltipType}
    />
  ) : (
    <StyledCustomChartTooltipDark
      ref={tooltipRef}
      getJSX={getTooltipJSX}
      tooltipType={tooltipType}
    />
  )

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
      {preLabelContent}
      <ResponsiveContainer width={width} height={responsiveContainerHeight}>
        <BarChart
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
                fontWeight={xAxisFontWeight}
                interventionsData={interventionsData}
                showInterventions={showInterventions}
                setXAxisTickTooltipData={setXAxisTickTooltipData}
              />
            }
            tickLine={false}
            tickMargin={tickMargin}
            stroke={greyLight1}
            interval={0}
            onMouseOver={onXAxisTickTooltipMouseOver}
            onMouseOut={onXAxisTickTooltipMouseOut}
          />
          {!hideYAxis ? (
            <YAxis
              type="number"
              axisLine={!hideOnlyYAxis}
              domain={yDomain}
              tick={tick}
              tickLine={yTickLine}
              stroke={greyLight1}
              ticks={ticks}
              tickFormatter={yTickFormatter}
              label={<YAxisLabel data={constants.Y_AXIS_LABEL} />}
              style={yAxisStyle}
            />
          ) : null}
          <Tooltip cursor={false} content={tooltipContent} />
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
          {referenceLines.length &&
            referenceLines.map((line) => (
              <ReferenceLine y={line.ref} stroke={line.stroke} dx={line.dx} />
            ))}
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
                barSize={barSize || 45}
                onMouseOver={onBarMouseOver(bdIndex, bdItem, true)}
                onMouseLeave={onBarMouseLeave(bdIndex)}
                isAnimationActive={animate}
                onAnimationStart={onAnimationStart}
              >
                {hasBarTopLabels ? (
                  <LabelList
                    dataKey={bdItem.topLabelKey}
                    position="top"
                    fill="#010101"
                    onMouseOver={onBarMouseOver(bdIndex, bdItem, true)}
                    onMouseLeave={onBarMouseLeave(bdIndex)}
                  />
                ) : null}
                {hasBarInsideLabels ? (
                  <LabelList
                    dataKey={bdItem.insideLabelKey}
                    position={bdItem.position || 'inside'}
                    fill="#010101"
                    offset={5}
                    onMouseOver={onBarMouseOver(bdIndex)}
                    onMouseLeave={onBarMouseLeave(bdIndex)}
                    content={
                      <LabelText
                        position="inside"
                        onBarMouseOver={onBarMouseOver}
                        onBarMouseLeave={onBarMouseLeave}
                        bdIndex={bdIndex}
                        formatter={barsLabelFormatter}
                        style={{ fill: getFGColor(bdItem.fill) }}
                      />
                    }
                  />
                ) : null}
                {pagedData.map((cdItem) =>
                  filter[cdItem[xAxisDataKey]] || isEmpty(filter) ? (
                    <Cell
                      radius={
                        isRoundBar(cdItem, bdIndex)
                          ? [10, 10, 0, 0]
                          : [0, 0, 0, 0]
                      }
                      key={cdItem[xAxisDataKey]}
                      fill={
                        cdItem.additionalData?.[bdItem.key]?.fill ||
                        cdItem.fill ||
                        bdItem.fill
                      }
                      fillOpacity={
                        cdItem.additionalData?.[bdItem.key]?.fillOpacity ||
                        cdItem.fillOpacity ||
                        fillOpacity
                      }
                      stroke={
                        cdItem.additionalData?.[bdItem.key]?.stroke ||
                        cdItem.stroke ||
                        null
                      }
                      strokeOpacity={
                        cdItem.additionalData?.[bdItem.key]?.strokeOpacity ||
                        cdItem.strokeOpacity ||
                        fillOpacity
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
                )}
              </Bar>
            )
          })}
        </BarChart>
      </ResponsiveContainer>
    </StyledSignedStackedBarChartContainer>
  )
}

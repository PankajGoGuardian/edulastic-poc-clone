/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useState, useMemo, useEffect, useRef } from 'react'
import {
  BarChart,
  Bar as _Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts'
import { isEmpty, findLast, startCase } from 'lodash'

import { greyLight1 } from '@edulastic/colors'
import styled from 'styled-components'
import {
  StyledCustomChartTooltipDark,
  StyledChartNavButton,
  CustomXAxisTickTooltipContainer,
  ResetButtonClear,
} from '../../styled'
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
}) => {
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
        {formatter(value, payload)}
      </text>
    </g>
  )
}

export const GroupedStackedBarChart = ({
  margin = { top: 20, right: 60, left: 10, bottom: 50 },
  // legendProps = {
  //   wrapperStyle: { top: -10 },
  // },
  // xTickTooltipPosition = 420,
  // xTickToolTipWidth = 200,
  pageSize: _pageSize,
  barsData,
  data = [],
  // yDomain = [0, 110],
  // ticks = [-100, -81, -54, -27, 27, 54, 81, 110],
  primaryXAxisDataKey,
  secondaryXAxisDataKey,
  // onBarClickCB,
  // onResetClickCB,
  getXTickText,
  // getXTickTagText,
  getTooltipJSX,
  getRightTooltipJSX,
  yAxisLabel = '',
  // yTickFormatter = (val) => `${val}%`,
  barsLabelFormatter = _barsLabelFormatter,
  // referenceLine = 0,
  filter = {},
  hasRoundedBars = true,
  // isSignedChart = true,
  // hideYAxis = false,
  // hideCartesianGrid = false,
  // hideLegend = false,
  hasBarTopLabels = true,
  hasBarInsideLabels = true,
  backendPagination, // structure: { page: x, pageSize: y, pageCount: z }
  // setBackendPagination,
}) => {
  const pageSize = _pageSize || backendPagination?.pageSize || 7
  const [pagination, setPagination] = useState({
    startIndex: 0,
    endIndex: pageSize - 1,
  })
  const [barIndex, setBarIndex] = useState(null)
  const tooltipPayload = useRef(0)
  const [secondaryAxisName, setSecondaryAxisName] = useState('')
  // const [activeLegend, setActiveLegend] = useState(null)
  // const [xAxisTickTooltipData, setXAxisTickTooltipData] = useState({
  //   visibility: 'hidden',
  //   x: null,
  //   y: null,
  //   content: null,
  // })
  const [hoveredBarDimensions, setHoveredBarDimensions] = useState({
    x: 0,
    y: 0,
    width: 0,
  })

  useEffect(() => {
    const tooltip = document.querySelector('.recharts-tooltip-wrapper')

    if (!tooltip) return
    const tooltipHeight = tooltip.getBoundingClientRect().height
    const tooltipWidth = tooltip.getBoundingClientRect().width
    const spaceForLittleTriangle = 15
    const spaceForPercentageLabel = 25

    tooltip.style = `
      transform: translate(${hoveredBarDimensions?.x}px, ${
      hoveredBarDimensions?.y
    }px);
      pointer-events: none;  
      position: absolute;
      top: -${
        tooltipHeight + spaceForLittleTriangle + spaceForPercentageLabel
      }px;
      left: -${tooltipWidth / 2 - hoveredBarDimensions?.width / 2}px;
      transition: all 400ms ease 0s;
    `
    const tooltipRight = document.querySelector(
      '.recharts-tooltip-wrapper-bottom'
    )

    if (!tooltipRight) return
    const barHeight = 100

    tooltipRight.style = `
      transform: translate(${hoveredBarDimensions?.x}px, ${
      hoveredBarDimensions?.y
    }px);
      pointer-events: none;  
      position: absolute;
      top: ${
        barHeight / 2 - spaceForLittleTriangle - spaceForPercentageLabel
      }px;
      left: ${hoveredBarDimensions?.width + 2 * spaceForLittleTriangle}px;
      transition: all 400ms ease 0s;
    `
  }, [hoveredBarDimensions])

  const constants = {
    COLOR_BLACK: '#010101',
    Y_AXIS_LABEL: {
      value: yAxisLabel.toUpperCase(),
      angle: -90,
      fontSize: 14,
    },
  }

  const chartData = useMemo(() => [...data], [pagination])

  const renderData = useMemo(
    () =>
      chartData.slice(pagination.startIndex, pagination.startIndex + pageSize),
    [pagination, data]
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

  // const onBarClick = (args) => {
  //   onBarClickCB(args[xAxisDataKey])
  // }

  // const onResetClick = () => {
  //   onResetClickCB()
  // }

  const onBarMouseOver = (index, key, shouldUpdateHoveredBar = false) => (
    event
  ) => {
    setBarIndex(index)
    if (!isEmpty(event) && shouldUpdateHoveredBar) {
      let d
      // To handle updating tooltip position when the label on top of the bar is hovered.
      // the label does not contain x,y coordinate relative to chart container.
      // label's parent element contains x,y coordinate relative to chart container.
      if (!isEmpty(event.target)) {
        const attributes = event?.target?.parentNode?.attributes
        const width = +attributes.width.nodeValue
        d = {
          x: +attributes.x.nodeValue - width / 2,
          y: +attributes.y.nodeValue,
          width,
        }
      } else {
        d = {
          x: event?.x,
          y: event?.y,
          width: event?.width,
        }
      }
      setHoveredBarDimensions(d)
    }
  }

  const onBarMouseLeave = () => () => {
    setBarIndex(null)
  }

  // const onLegendMouseEnter = ({ dataKey }) => setActiveLegend(dataKey)
  // const onLegendMouseLeave = () => setActiveLegend(null)

  // const setLegendMargin = (value) => {
  //   return <span style={{ marginRight: '30px' }}>{value}</span>
  // }

  // const onXAxisTickTooltipMouseOver = (payload) => {
  //   const { coordinate } = payload
  //   let content
  //   if (getXTickText) {
  //     content = getXTickText(payload, renderData)
  //   } else {
  //     content = payload.value
  //   }

  //   data = {
  //     visibility: 'visible',
  //     x: `${calculateXCoordinateOfXAxisToolTip(
  //       coordinate,
  //       xTickToolTipWidth
  //     )}px`,
  //     y: `${xTickTooltipPosition}px`,
  //     content,
  //   }
  //   setXAxisTickTooltipData(data)
  // }

  // const onXAxisTickTooltipMouseOut = () => {
  //   setXAxisTickTooltipData({
  //     visibility: 'hidden',
  //     x: null,
  //     y: null,
  //     content: null,
  //   })
  // }

  const barKeys = useMemo(
    () =>
      barsData.map((bdItem, bdIndex) => ({ key: bdItem.key, idx: bdIndex })),
    [barsData]
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

  const renderRubricsTick = (tickProps) => {
    const { x, y, payload } = tickProps
    const { value } = payload

    return (
      <text x={x} y={y + 40} textAnchor="middle" fontSize={20}>
        {startCase(value)}
      </text>
    )
  }

  // chart navigation visibility and control
  // const chartNavLeftVisibility = backendPagination
  //   ? backendPagination.page > 1
  //   : !(pagination.startIndex == 0)

  // const chartNavRightVisibility = backendPagination
  //   ? backendPagination.page < backendPagination.pageCount
  //   : !(chartData.length <= pagination.endIndex + 1)

  // const chartNavLeftClick = () =>
  //   backendPagination
  //     ? setBackendPagination({
  //         ...backendPagination,
  //         page: backendPagination.page - 1,
  //       })
  //     : scrollLeft()
  // const chartNavRightClick = () =>
  //   backendPagination
  //     ? setBackendPagination({
  //         ...backendPagination,
  //         page: backendPagination.page + 1,
  //       })
  //     : scrollRight()

  return (
    <StyledSignedStackedBarChartContainer>
      {/* <ResetButtonClear
        onClick={onResetClick}
        style={
          Object.keys(filter).length > 0
            ? { visibility: 'visible' }
            : { visibility: 'hidden' }
        }
      >
        Reset
      </ResetButtonClear> */}
      {/* <StyledChartNavButton
        type="primary"
        shape="circle"
        icon="caret-left"
        IconBtn
        className="navigator navigator-left"
        onClick={chartNavLeftClick}
        style={{
          visibility: chartNavLeftVisibility ? 'visible' : 'hidden',
        }}
      /> */}
      {/* <StyledChartNavButton
        type="primary"
        shape="circle"
        icon="caret-right"
        IconBtn
        className="navigator navigator-right"
        onClick={chartNavRightClick}
        style={{
          visibility: chartNavRightVisibility ? 'visible' : 'hidden',
        }}
      /> */}
      {/* <CustomXAxisTickTooltipContainer
        x={xAxisTickTooltipData.x}
        y={xAxisTickTooltipData.y}
        visibility={xAxisTickTooltipData.visibility}
        color={xAxisTickTooltipData.color}
        width={xTickToolTipWidth}
      >
        {xAxisTickTooltipData.content}
      </CustomXAxisTickTooltipContainer> */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          width={730}
          height={400}
          data={renderData}
          stackOffset="sign"
          margin={margin}
        >
          <XAxis
            dataKey={primaryXAxisDataKey}
            tick={
              <CustomChartXTick
                data={renderData}
                getXTickText={getXTickText}
                // getXTickTagText={getXTickTagText}
                fontWeight={600}
              />
            }
            tickLine={false}
            tickMargin={20}
            stroke={greyLight1}
            interval={0}
            // onMouseOver={onXAxisTickTooltipMouseOver}
            // onMouseOut={onXAxisTickTooltipMouseOut}
          />
          <XAxis
            padding={{ top: 0 }}
            dataKey={secondaryXAxisDataKey}
            axisLine={false}
            tickLine={false}
            interval={0}
            tick={renderRubricsTick}
            xAxisId="rubric-name"
          />
          <YAxis
            axisLine={false}
            tick={false}
            domain={[0, 100]}
            label={<YAxisLabel data={constants.Y_AXIS_LABEL} />}
          />
          <Tooltip
            cursor={false}
            position={{ x: hoveredBarDimensions.x, y: hoveredBarDimensions.y }}
            content={
              <StyledCustomChartTooltipDark
                getJSX={(payload, active) => {
                  tooltipPayload.current = [payload, active]
                  return getTooltipJSX(payload, active)
                }}
                barIndex={barIndex}
              />
            }
          />
          {barsData.map((bdItem, bdIndex) => {
            // let fillOpacity = 1

            // if (activeLegend && activeLegend !== bdItem.key) {
            //   fillOpacity = 0.2
            // }

            return (
              <Bar
                key={bdItem.key}
                dataKey={bdItem.key}
                name={bdItem.name}
                stackId={bdItem.stackId}
                fill={bdItem.fill}
                unit={bdItem.unit}
                isAnimationActive={false}
                // onClick={onBarClick}
                barSize={40}
                maxBarSize={40}
                onMouseOver={onBarMouseOver(bdIndex, bdItem.key, true)}
                onMouseLeave={onBarMouseLeave(bdIndex)}
              >
                <LabelList
                  dataKey={bdItem.topLabelKey}
                  position="top"
                  fill="#010101"
                  onMouseOver={onBarMouseOver(bdIndex, bdItem.key, true)}
                  onMouseLeave={onBarMouseLeave(bdIndex)}
                />
                <LabelList
                  dataKey={bdItem.insideLabelKey}
                  position="inside"
                  fill="#010101"
                  offset={5}
                  onMouseOver={onBarMouseOver(bdIndex, bdItem.key)}
                  onMouseLeave={onBarMouseLeave(bdIndex)}
                  content={
                    <LabelText
                      position="inside"
                      onBarMouseOver={onBarMouseOver}
                      onBarMouseLeave={onBarMouseLeave}
                      bdIndex={bdIndex}
                      formatter={barsLabelFormatter}
                    />
                  }
                />
                {renderData.map((cdItem) =>
                  filter[cdItem[primaryXAxisDataKey]] || isEmpty(filter) ? (
                    <Cell
                      radius={
                        isRoundBar(cdItem, bdIndex)
                          ? [10, 10, 0, 0]
                          : [0, 0, 0, 0]
                      }
                      key={cdItem[primaryXAxisDataKey]}
                      fill={bdItem.fill}
                      // fillOpacity={
                      //   cdItem.additionalData?.[bdItem.key]?.fillOpacity ||
                      //   cdItem.fillOpacity ||
                      //   fillOpacity
                      // }
                      stroke={
                        cdItem.additionalData?.[bdItem.key]?.stroke ||
                        cdItem.stroke ||
                        null
                      }
                      // strokeOpacity={
                      //   cdItem.additionalData?.[bdItem.key]?.strokeOpacity ||
                      //   cdItem.strokeOpacity ||
                      //   fillOpacity
                      // }
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
                      key={cdItem[primaryXAxisDataKey]}
                      fill="#c0c0c0"
                    />
                  )
                )}
              </Bar>
            )
          })}
        </BarChart>
      </ResponsiveContainer>
      <Tooltip
        cursor={false}
        position={{
          x: hoveredBarDimensions.x,
          y: hoveredBarDimensions.y,
        }}
        content={
          <StyledCustomChartTooltipDark
            getJSX={(payload, active) => {
              payload = tooltipPayload.current?.[0]
              active = tooltipPayload.current?.[1]
              return getRightTooltipJSX(payload, active)
            }}
            barIndex={barIndex}
            style={{
              left: '-15px',
              bottom: '50%',
              transform: 'rotate(90deg)',
            }}
          />
        }
      />
    </StyledSignedStackedBarChartContainer>
  )
}

const StyledSignedStackedBarChartContainer = styled.div`
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
`

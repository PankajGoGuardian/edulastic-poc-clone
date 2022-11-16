/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useState, useMemo, useEffect } from 'react'
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
import { isEmpty, findLast } from 'lodash'

import { greyLight1 } from '@edulastic/colors'
import {
  StyledCustomChartTooltipDark,
  StyledChartNavButton,
  CustomXAxisTickTooltipContainer,
  StyledSignedStackedBarChartContainer,
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
  pageSize: _pageSize,
  barsData,
  data = [],
  primaryXAxisDataKey,
  getXTickText,
  getXTickFill,
  getTooltipJSX,
  yAxisLabel = '',
  barsLabelFormatter = _barsLabelFormatter,
  filter = {},
  hasRoundedBars = true,
  backendPagination,
  xTickToolTipWidth = 200,
  xTickTooltipPosition = 400,
}) => {
  const pageSize = _pageSize || backendPagination?.pageSize || 7
  const [pagination, setPagination] = useState({
    startIndex: 0,
    endIndex: pageSize - 1,
  })
  const [xAxisTickTooltipData, setXAxisTickTooltipData] = useState({
    visibility: 'hidden',
    x: null,
    y: null,
    content: null,
  })
  const [barIndex, setBarIndex] = useState(null)
  const [hoveredBarDimensions, setHoveredBarDimensions] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const tooltip = document.querySelector('.recharts-tooltip-wrapper')

    if (!tooltip) return
    const tooltipHeight = tooltip.getBoundingClientRect().height

    const spaceForLittleTriangle = 15

    tooltip.style = `
      transform: translate(${hoveredBarDimensions?.x}px, ${
      hoveredBarDimensions?.y
    }px);
      pointer-events: none;  
      position: absolute;
      top: -${tooltipHeight / 2 - hoveredBarDimensions.height / 2}px;
      left: ${hoveredBarDimensions?.width + spaceForLittleTriangle}px;
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

  const onBarMouseOver = (index) => (event) => {
    setBarIndex(index)
    if (!isEmpty(event)) {
      let d
      // To handle updating tooltip position when the labels are hovered.
      // the label does not contain x,y coordinate relative to chart container.
      // label's parent element contains x,y coordinate relative to chart container.
      if (!isEmpty(event.target)) {
        const attributes = event?.target?.attributes
        const width = 45
        d = {
          x: +attributes.x.nodeValue - width / 2,
          y: +attributes.y.nodeValue,
          width,
          height: 0, // check again
        }
      } else {
        d = {
          x: event?.x,
          y: event?.y,
          width: event?.width,
          height: event?.height,
        }
      }
      setHoveredBarDimensions(d)
    }
  }

  const onBarMouseLeave = () => () => {
    setBarIndex(null)
  }

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

  const onXAxisTickTooltipMouseOver = (payload) => {
    const { coordinate } = payload
    let content
    if (getXTickText) {
      content = getXTickText(payload, renderData)
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

  // chart navigation visibility and control
  const chartNavLeftVisibility = backendPagination
    ? backendPagination.page > 1
    : !(pagination.startIndex == 0)

  const chartNavRightVisibility = backendPagination
    ? backendPagination.page < backendPagination.pageCount
    : !(chartData.length <= pagination.endIndex + 1)

  return (
    <StyledSignedStackedBarChartContainer>
      <StyledChartNavButton
        type="primary"
        shape="circle"
        icon="caret-left"
        IconBtn
        className="navigator navigator-left"
        onClick={scrollLeft}
        hidden={!chartNavLeftVisibility}
      />
      <StyledChartNavButton
        type="primary"
        shape="circle"
        icon="caret-right"
        IconBtn
        className="navigator navigator-right"
        onClick={scrollRight}
        hidden={!chartNavRightVisibility}
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
          <XAxis
            dataKey={primaryXAxisDataKey}
            tick={
              <CustomChartXTick
                data={renderData}
                getXTickText={getXTickText}
                getXTickFill={getXTickFill}
                fontWeight={600}
              />
            }
            tickLine={false}
            tickMargin={20}
            stroke={greyLight1}
            interval={0}
            onMouseOver={onXAxisTickTooltipMouseOver}
            onMouseOut={onXAxisTickTooltipMouseOut}
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
                getJSX={getTooltipJSX}
                barIndex={barIndex}
                style={{
                  left: '-15px',
                  bottom: '50%',
                  transform: 'rotate(90deg)',
                }}
              />
            }
          />
          {barsData.map((bdItem, bdIndex) => {
            return (
              <Bar
                key={bdItem.key}
                dataKey={bdItem.key}
                name={bdItem.name}
                stackId={bdItem.stackId}
                fill={bdItem.fill}
                unit={bdItem.unit}
                barSize={45}
                maxBarSize={45}
                onMouseOver={onBarMouseOver(bdIndex)}
                onMouseLeave={onBarMouseLeave(bdIndex)}
              >
                <LabelList
                  dataKey={bdItem.insideLabelKey}
                  position="inside"
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
                      stroke={
                        cdItem.additionalData?.[bdItem.key]?.stroke ||
                        cdItem.stroke ||
                        null
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
    </StyledSignedStackedBarChartContainer>
  )
}

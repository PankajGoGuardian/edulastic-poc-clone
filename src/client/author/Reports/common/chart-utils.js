import React from 'react'
import { Dot } from 'recharts'
import { TooltipRow, TooltipRowTitle, TooltipRowValue } from './styled'
import { setProperties, tooltipParams } from './util'

const { spaceForLittleTriangle } = tooltipParams

export const updateTooltipPos = (
  parentContainerRef,
  chartRef,
  tooltipRef,
  setTooltipType
) => {
  const tooltipElement = tooltipRef.current?.tooltipElementRef.current
  if (!tooltipElement) return

  const chartState = chartRef.current?.state
  if (!chartState) return

  const { width } = chartRef.current.props
  const idx = chartState.activeTooltipIndex
  const chartItems = chartState.formatedGraphicalItems
  const barchartLayer = chartItems?.[0]
  const activePoint = barchartLayer?.props?.points?.[idx]
  if (!activePoint) return

  const tooltipRect = tooltipElement.getBoundingClientRect()
  const OFFSET = 20
  const isTooltipOverflowing =
    tooltipRect.width + activePoint.x + OFFSET > width

  setTooltipType(isTooltipOverflowing ? 'left' : 'right')
  const tooltipXShift = isTooltipOverflowing
    ? `-100% - ${spaceForLittleTriangle}px - ${OFFSET}px`
    : `${spaceForLittleTriangle}px + ${OFFSET}px`
  const tooltipCssVars = {
    '--tooltip-transform': `translate(
      calc( ${activePoint.x}px + ${tooltipXShift}),
      calc( ${activePoint.y}px - 50% )`,
    '--tooltip-top': '0',
    '--tooltip-left': '0',
  }
  setProperties(parentContainerRef, tooltipCssVars)
}

const TooltipRowItem = ({ title = '', value = '' }) => (
  <TooltipRow style={{ flexDirection: 'column' }}>
    <TooltipRowTitle>{title}</TooltipRowTitle>
    <TooltipRowValue>{value}</TooltipRowValue>
  </TooltipRow>
)

export const getTooltipJSX = (payload, interventionList) => {
  if (payload && payload.length) {
    const tooltipData = payload[0].payload
    if (!tooltipData || tooltipData.week === -1 || tooltipData.month === -1)
      return null

    const { presents, absents, tardies, total, index } = tooltipData
    let tooltipText = (
      <div>
        <TooltipRowItem
          title="No. of Present events - "
          value={`${presents}/${total}`}
        />
        <TooltipRowItem
          title="No. of Absent events - "
          value={`${absents}/${total}`}
        />
        <TooltipRowItem
          title="No. of Tardies - "
          value={`${tardies}/${total}`}
        />
      </div>
    )
    if (!Number.isInteger(index)) {
      tooltipText = (
        <div>
          {interventionList
            .filter((a) => a.index === index)
            .map((item) => (
              <TooltipRowItem title="Intervention Name - " value={item.name} />
            ))}
        </div>
      )
    }

    return tooltipText
  }
  return null
}

export const CustomDot = (props) => {
  const { active, ...restProps } = props
  const { index } = restProps
  if (index === 0) return null
  const activeProps = active
    ? {}
    : {
        strokeWidth: 1.5,
        r: 6,
        strokeDasharray: '',
      }
  return <Dot {...restProps} {...activeProps} />
}

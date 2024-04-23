import React from 'react'
import { Dot } from 'recharts'
import { EduIf } from '@edulastic/common'
import { isNull } from 'lodash'
import { percentage } from '@edulastic/constants/reportUtils/common'
import { TooltipRow, TooltipRowTitle, TooltipRowValue } from './styled'
import { setProperties, tooltipParams } from './util'
import { ATTENDANCE_EVENT_CATEGORY_LABELS } from '../subPages/dataWarehouseReports/common/utils/constants'

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

export const getTooltipJSX = (payload, showAbsents = false) => {
  if (payload && payload.length) {
    const tooltipData = payload[0].payload
    if (!tooltipData || tooltipData.week === -1 || tooltipData.month === -1)
      return null
    const tooltipContent = Object.keys(ATTENDANCE_EVENT_CATEGORY_LABELS)
      .filter((category) => !!tooltipData[category])
      .map((category) => {
        const studentPercentInCategory = percentage(
          tooltipData[category],
          tooltipData.totalDays,
          true
        )
        const value = showAbsents
          ? tooltipData[category]
          : `${studentPercentInCategory}%`
        return (
          <EduIf condition={!isNull(tooltipData[category])} key={category}>
            <TooltipRowItem
              title={`${ATTENDANCE_EVENT_CATEGORY_LABELS[category]} - `}
              value={value}
            />
          </EduIf>
        )
      })
    if (!tooltipContent.length) return null
    return <div>{tooltipContent}</div>
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

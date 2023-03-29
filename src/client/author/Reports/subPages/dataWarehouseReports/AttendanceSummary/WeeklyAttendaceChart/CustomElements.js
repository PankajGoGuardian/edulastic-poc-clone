import React from 'react'
import { Dot } from 'recharts'
import {
  TooltipRow,
  TooltipRowTitle,
  TooltipRowValue,
} from '../../../../common/styled'
import { yAxisTickValues } from '../utils/constants'

const TooltipRowItem = ({ title = '', value = '' }) => (
  <TooltipRow>
    <TooltipRowTitle>{title}</TooltipRowTitle>
    <TooltipRowValue>{value}</TooltipRowValue>
  </TooltipRow>
)

export const getTooltipJSX = (payload) => {
  if (payload && payload.length) {
    const tooltipData = payload[0].payload
    if (!tooltipData || tooltipData.week === -1) return null

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

export const CustomizedLabel = (props) => {
  const { x, y, value, stroke, index } = props

  if (index === 0) return null

  const labelWidth = 40
  const labelHeight = 15
  const isLabelOverFlowing = y - labelHeight - 10 < 10

  const rectx = x - labelWidth + 20
  const recty = isLabelOverFlowing ? y + labelHeight : y - labelHeight - 10
  const newY = isLabelOverFlowing ? y + 30 : y - 10

  return (
    <g>
      <rect
        x={rectx}
        y={recty}
        width={labelWidth}
        height={labelHeight}
        fill={stroke}
      />
      <text
        x={x}
        y={newY}
        dy={-4}
        fill="#5D5D5D"
        fontSize={10}
        fontWeight="bold"
        textAnchor="middle"
      >
        {value}%
      </text>
    </g>
  )
}

export const yAxisTick = (props) => {
  const { payload, x, y } = props
  const { value } = payload
  if (!yAxisTickValues.includes(value)) return null

  return (
    <g>
      <text
        x={x - 7}
        y={y + 10}
        dy={-5}
        fill="#5D5D5D"
        fontSize={10}
        fontWeight="bold"
        textAnchor="middle"
      >
        {value}%
      </text>
    </g>
  )
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

import React from 'react'
import { yAxisTickValues } from '../utils/constants'

export const CustomizedLabel = (props) => {
  const { x, y, value, stroke, index } = props

  if (index === 0) return null

  const labelWidth = 42
  const labelHeight = 28
  const isLabelOverFlowing = y - labelHeight - 10 < 10

  const rectx = x - labelWidth + 20
  const recty = isLabelOverFlowing ? y + labelHeight - 18 : y - labelHeight - 10
  const newY = isLabelOverFlowing ? y + labelHeight + 8 : y - 12
  const textX = x

  return (
    <g>
      <rect
        x={rectx}
        y={recty}
        width={labelWidth}
        height={labelHeight}
        fill={stroke}
        rx="5px"
      />
      <text
        x={textX}
        y={newY}
        dy={-7}
        fill="#5D5D5D"
        fontSize={14}
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

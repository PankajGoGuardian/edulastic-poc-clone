import React from 'react'
import { yAxisTickValues } from '../utils/constants'

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

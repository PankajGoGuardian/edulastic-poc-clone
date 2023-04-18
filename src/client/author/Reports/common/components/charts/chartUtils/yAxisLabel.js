import React from 'react'

export const YAxisLabel = ({ data, viewBox }) => {
  return (
    <text
      className="recharts-text recharts-label"
      x={0}
      y={viewBox.height / 2 + viewBox.y}
      textAnchor="middle"
      dominantBaseline="hanging"
      transform={`rotate(${data.angle}, ${0}, ${
        viewBox.height / 2 + viewBox.y
      }) translate(${0}, ${
        viewBox.width / 1.5 - (data.translateYDiffValue || 0)
      })`}
      style={{ fontSize: `${data.fontSize}px`, fill: data.fill || 'black' }}
    >
      <tspan>{data.value}</tspan>
    </text>
  )
}

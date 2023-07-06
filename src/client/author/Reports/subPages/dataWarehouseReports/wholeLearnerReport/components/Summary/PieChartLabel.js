import React from 'react'

const PieChartLabel = ({ cx, cy, score }) => {
  return (
    <g>
      <text x={cx} y={cy} dy={5} textAnchor="middle">
        {score}%
      </text>
    </g>
  )
}

export default PieChartLabel

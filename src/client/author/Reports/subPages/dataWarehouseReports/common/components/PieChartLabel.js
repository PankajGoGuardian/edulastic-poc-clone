import { greyThemeDark7, lightGrey17, white } from '@edulastic/colors'
import { DEGREE_TO_RADIAN } from '@edulastic/constants/reportUtils/common'
import { Tooltip } from 'antd'
import React from 'react'

const PieChartLabel = ({ cx, cy, midAngle, outerRadius, name, value }) => {
  const maxTitleLenght = 14
  const title = `${value}% ${name}`
  const label =
    title.length >= maxTitleLenght
      ? `${title.slice(0, maxTitleLenght - 3)}...`
      : title
  const sin = Math.sin(-DEGREE_TO_RADIAN * midAngle)
  const cos = Math.cos(-DEGREE_TO_RADIAN * midAngle)
  const sx = cx + (outerRadius + 4) * cos
  const sy = cy + (outerRadius + 4) * sin
  const circleX = cx + outerRadius * cos
  const circleY = cy + outerRadius * sin
  const mx = cx + (outerRadius + 20) * cos
  const my = cy + (outerRadius + 20) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * name.length * 20
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'
  const textX = mx + (cos >= 0 ? 1 : -1) * 10
  const textY = my - 5
  return (
    <g>
      <circle
        cx={circleX}
        cy={circleY}
        r={4}
        fill={white}
        stroke={greyThemeDark7}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={greyThemeDark7}
        fill="none"
        strokeWidth={1}
      />
      <Tooltip title={title}>
        <text
          className="label-text"
          x={textX}
          y={textY}
          textAnchor={textAnchor}
          fill={lightGrey17}
        >
          <tspan className="label-value">{label}</tspan>
        </text>
      </Tooltip>
    </g>
  )
}

export default PieChartLabel

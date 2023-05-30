import { greyThemeDark7, lightGrey17, white } from '@edulastic/colors'
import { DEGREE_TO_RADIAN } from '@edulastic/constants/reportUtils/common'
import { Tooltip } from 'antd'
import { max } from 'lodash'
import React from 'react'
import { PIE_CHART_LABEL_THRESHOLD } from '../utils'
import { TooltipContent } from './PieChartTooltip'

const PieChartLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  name,
  value,
  fill,
}) => {
  if (value <= PIE_CHART_LABEL_THRESHOLD) return null
  const maxFirstLineCharLength = 5
  const maxSecondLineCharLength = 10
  const nameArr = name.split(' ')
  const showSecondLine =
    nameArr[0].length > maxFirstLineCharLength || nameArr.length > 1
  let secondLineText = ''
  const firstLineText =
    nameArr[0].length > maxFirstLineCharLength
      ? `${value}%`
      : `${value}% ${nameArr[0]}`
  if (showSecondLine) {
    const secondLineValues =
      nameArr[0].length > maxFirstLineCharLength ? nameArr : nameArr.slice(1)
    const secondLine = secondLineValues.join(' ')
    secondLineText =
      secondLine.length > maxSecondLineCharLength
        ? `${secondLine.slice(0, maxSecondLineCharLength - 3)}...`
        : secondLine
  }

  const maxLabelLength = max([firstLineText.length, secondLineText.length])

  const sin = Math.sin(-DEGREE_TO_RADIAN * midAngle)
  const cos = Math.cos(-DEGREE_TO_RADIAN * midAngle)
  const sx = cx + (outerRadius + 4) * cos
  const sy = cy + (outerRadius + 4) * sin
  const circleX = cx + outerRadius * cos
  const circleY = cy + outerRadius * sin
  const mx = cx + (outerRadius + 26) * cos
  const my = cy + (outerRadius + 26) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * maxLabelLength * 10
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
      <Tooltip
        title={<TooltipContent value={value} name={name} color={fill} />}
      >
        <text
          x={textX}
          y={showSecondLine ? textY - 15 : textY}
          textAnchor={textAnchor}
          fill={lightGrey17}
        >
          <tspan>{firstLineText}</tspan>
        </text>
      </Tooltip>
      <Tooltip
        title={<TooltipContent value={value} name={name} color={fill} />}
      >
        <text x={textX} y={textY} textAnchor={textAnchor} fill={lightGrey17}>
          <tspan>{secondLineText}</tspan>
        </text>
      </Tooltip>
    </g>
  )
}

export default PieChartLabel

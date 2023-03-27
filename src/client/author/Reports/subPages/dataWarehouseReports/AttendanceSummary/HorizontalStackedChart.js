import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
} from 'recharts'
import { map } from 'lodash'
import { percentage } from '@edulastic/constants/reportUtils/common'
import { Tooltip } from 'antd'
import { StyledHorizontalStackedBarChartContainer } from '../../multipleAssessmentReport/PreVsPost/common/styledComponents'
import { data } from './AttendanceDistribution'

const renderCustomizedLabel = (studentsCount, color) => (props) => {
  const { value, x, y, width, height } = props
  const labelText = percentage(value, studentsCount, true)
  const fill = labelText <= 10 ? color : ''
  const labelToRender = labelText == 0 ? '' : `${labelText}%`
  const xLabelOffset = 10
  const yLabelOffset = 4
  const tooltipTextX = x + width / 2 - xLabelOffset
  const tooltipTextY = y + height / 2 + yLabelOffset
  return (
    <Tooltip title={labelToRender}>
      <text fontSize="10px" fill={fill} x={tooltipTextX} y={tooltipTextY}>
        {labelToRender}
      </text>
    </Tooltip>
  )
}

const HorizontalStackedBarChart = ({ studentsCount = 10 }) => {
  return (
    <StyledHorizontalStackedBarChartContainer>
      <ResponsiveContainer height={40} width={188}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 0, bottom: 0 }}
          stackOffset="expand"
        >
          <XAxis hide type="number" />
          <YAxis type="category" hide dataKey="" fontSize="12" />
          {map(data, (pb) => (
            <Bar
              dataKey={pb.name}
              fill={pb.color}
              stackId="a"
              barSize={40}
              key={pb.name}
            >
              <LabelList
                dataKey={pb.name}
                position="center"
                content={renderCustomizedLabel(studentsCount, pb.color)}
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </StyledHorizontalStackedBarChartContainer>
  )
}

export default HorizontalStackedBarChart

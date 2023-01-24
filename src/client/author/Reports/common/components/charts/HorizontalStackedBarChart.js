import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
} from 'recharts'
import { percentage } from '@edulastic/constants/reportUtils/common'
import { map } from 'lodash'

const renderCustomizedLabel = (studentsCount, selectedAnalyseBy) => (props) => {
  const { value, x, y, width, height } = props
  return (
    <text x={x + width / 2 - 12} y={y + height / 2 + 4}>
      {value === 0
        ? ''
        : selectedAnalyseBy === 'rawScore'
        ? value
        : `${percentage(value, studentsCount, true)}%`}
    </text>
  )
}

const HorizontalStackedBarChart = ({
  data,
  studentsCount,
  selectedPerformanceBand,
  selectedAnalyseBy,
}) => {
  return (
    <div style={{ margin: '10px 35px' }}>
      <ResponsiveContainer height={40} width={188}>
        <BarChart layout="vertical" data={data} margin={{ top: 0, bottom: 0 }}>
          <XAxis hide type="number" />
          <YAxis
            type="category"
            hide
            dataKey="name"
            stroke="#FFFFFF"
            fontSize="12"
          />
          {map(selectedPerformanceBand, (pb) => (
            <Bar dataKey={pb.name} fill={pb.color} stackId="a" barSize={40}>
              <LabelList
                dataKey={pb.name}
                position="center"
                content={renderCustomizedLabel(
                  studentsCount,
                  selectedAnalyseBy
                )}
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default HorizontalStackedBarChart

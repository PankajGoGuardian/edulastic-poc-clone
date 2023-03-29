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
import styled from 'styled-components'

const renderCustomizedLabel = (color) => (props) => {
  const { x, width, value } = props
  if (!value) {
    return null
  }
  return (
    <g>
      <text
        x={x + width / 2}
        y={20}
        fill={color}
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={10}
      >
        {`${value}%`}
      </text>
    </g>
  )
}

const HorizontalStackedBarChart = ({ data }) => {
  // distribution type names
  let tableData = {
    Tardy: 0,
    Present: 0,
    Absent: 0,
    Excused: 0,
    Late: 0,
  }
  for (const val of data) {
    tableData[`${val.name}`] = val.value
  }
  tableData = [tableData]
  return (
    <ChartContainer>
      <ResponsiveContainer height={40} width={300}>
        <BarChart
          layout="vertical"
          data={tableData}
          margin={{ top: 0, bottom: 0 }}
          stackOffset="expand"
        >
          <XAxis hide type="number" />
          <YAxis type="category" hide dataKey="" fontSize="12" />
          {map(data, (item) => {
            return (
              <Bar
                dataKey={item.name}
                fill={item.color}
                fillOpacity={0.5}
                stackId="a"
                barSize={40}
                key={item.name}
              >
                <LabelList
                  dataKey={item.name}
                  content={renderCustomizedLabel(item.color)}
                />
              </Bar>
            )
          })}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

export default HorizontalStackedBarChart

const ChartContainer = styled.div``

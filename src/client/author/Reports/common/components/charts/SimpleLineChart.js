import React, { memo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { themeLightGrayColor, fadedBlack, lightGrey18 } from '@edulastic/colors'
import { startCase } from 'lodash'
import { FlexContainer } from '@edulastic/common'
import { YAxisLabel } from './chartUtils/yAxisLabel'
import { ChartLegendPill, ChartLegendItem } from './styled-components'

const SimpleLineChart = ({
  data,
  xAxisLabelKey,
  lines,
  xAxisTicks,
  xAxisInterval = 'preserveEnd',
  yAxisLabel,
}) => {
  const yAxisTickFormatter = (value) => `${value}%`
  const xAxisTickFormatter = (value) => value.toUpperCase()
  const tooltipFormatter = (value, name) => [`${value}%`, startCase(name)]

  const renderLegend = (props) => {
    const { payload } = props

    return (
      <FlexContainer justifyContent="flex-end">
        {payload.map(({ value, color }, index) => {
          return (
            <ChartLegendItem key={`item-${index}`}>
              <ChartLegendPill color={color} />
              {`${value} RISK`.toUpperCase()}
            </ChartLegendItem>
          )
        })}
      </FlexContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 10,
          bottom: 5,
        }}
      >
        <CartesianGrid vertical={false} stroke={themeLightGrayColor} />
        <Legend content={renderLegend} />
        <XAxis
          dataKey={xAxisLabelKey}
          stroke={themeLightGrayColor}
          tickLine={false}
          tick={{ strokeWidth: 0.8, stroke: fadedBlack, fill: fadedBlack }}
          tickFormatter={xAxisTickFormatter}
          padding={{ left: 50 }}
          interval={xAxisInterval}
        />
        <YAxis
          padding={{ top: 45, right: 20 }}
          ticks={xAxisTicks}
          stroke={themeLightGrayColor}
          tickFormatter={yAxisTickFormatter}
          tickLine={false}
          tick={{ strokeWidth: 0.5, stroke: fadedBlack, fill: fadedBlack }}
          label={
            <YAxisLabel
              data={{
                value: yAxisLabel,
                angle: -90,
                translateYDiffValue: 30,
                fill: lightGrey18,
              }}
            />
          }
        />
        <Tooltip formatter={tooltipFormatter} />
        {lines.map(({ dataKey, stroke }) => (
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={stroke}
            dot={{ r: 5 }}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export default memo(SimpleLineChart)

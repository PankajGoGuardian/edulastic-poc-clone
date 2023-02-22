import React from 'react'
import { PieChart, Pie, ResponsiveContainer } from 'recharts'
import { PieChartWrapper } from '../../styled'

const SimplePieChart = ({ data, getChartLabelJSX }) => {
  return (
    <PieChartWrapper>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            label={getChartLabelJSX}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={30}
            outerRadius={70}
            dataKey="value"
          />
        </PieChart>
      </ResponsiveContainer>
    </PieChartWrapper>
  )
}

export default SimplePieChart

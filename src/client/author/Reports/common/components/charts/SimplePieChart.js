import React from 'react'
import { PieChart, Pie, ResponsiveContainer } from 'recharts'
import { PieChartWrapper } from '../../styled'

const SimplePieChart = ({
  data,
  innerRadius = 30,
  outerRadius = 75,
  getChartLabelJSX,
}) => {
  const filteredData = data.filter((d) => d.value)
  return (
    <PieChartWrapper>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            label={getChartLabelJSX}
            data={filteredData}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            dataKey="value"
            style={{ filter: 'drop-shadow(5px 10px 18px #00000030)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </PieChartWrapper>
  )
}

export default React.memo(SimplePieChart)

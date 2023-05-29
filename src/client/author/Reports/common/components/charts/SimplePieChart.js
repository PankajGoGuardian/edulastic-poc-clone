import React from 'react'
import { PieChart, Pie, ResponsiveContainer, Tooltip } from 'recharts'
import { PieChartWrapper } from '../../styled'
import { PieChartTooltip } from '../../../subPages/dataWarehouseReports/common/components/PieChartTooltip'

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
            labelLine={null}
            data={filteredData}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            style={{ filter: 'drop-shadow(5px 10px 18px #00000030)' }}
          />
          <Tooltip content={<PieChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </PieChartWrapper>
  )
}

export default React.memo(SimplePieChart)

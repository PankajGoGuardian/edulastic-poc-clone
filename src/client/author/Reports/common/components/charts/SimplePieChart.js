import React from 'react'
import { PieChart, Pie, ResponsiveContainer, Tooltip } from 'recharts'
import { PieChartWrapper } from '../../styled'
import { useResetAnimation } from '../../hooks/useResetAnimation'

const SimplePieChart = ({
  data,
  innerRadius = 30,
  outerRadius = 75,
  center = { x: '50%', y: '50%' },
  width = '400px',
  height = '320px',
  label = null,
  tooltip = null,
  chartStyles = { filter: 'drop-shadow(5px 10px 18px #00000030)' },
}) => {
  const [animate, onAnimationStart] = useResetAnimation()
  const filteredData = data.filter((d) => d.value)
  return (
    <PieChartWrapper $width={width} $height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            label={label}
            labelLine={null}
            data={filteredData}
            cx={center.x}
            cy={center.y}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            style={chartStyles}
            isAnimationActive={animate}
            onAnimationStart={onAnimationStart}
          />
          {tooltip && <Tooltip content={tooltip} />}
        </PieChart>
      </ResponsiveContainer>
    </PieChartWrapper>
  )
}

export default React.memo(SimplePieChart)

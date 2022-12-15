import React from 'react'
import { Pie, PieChart, ResponsiveContainer, Label, Tooltip } from 'recharts'
import styled from 'styled-components'
import { StyledCustomChartTooltipDark } from '../../../../common/styled'

export const SimplePieChartComponent = ({
  pieChartData,
  label,
  showTooltip = true,
  getTooltipJSX = null,
  selTooltip = false,
}) => {
  return (
    <ResponsiveContainer width="100%" minWidth={83} minHeight={83}>
      <PieChartWrapper>
        {showTooltip && (
          <Tooltip
            position={{ x: -60, y: selTooltip ? -140 : -100 }}
            cursor={false}
            content={<StyledCustomChartTooltipDark getJSX={getTooltipJSX} />}
          />
        )}
        <Pie
          name="name"
          data={pieChartData}
          labelLine={false}
          innerRadius={25}
          outerRadius={40}
          dataKey="count"
          label={pieChartData.oun}
        >
          <Label value={label} position="center" />
        </Pie>
      </PieChartWrapper>
    </ResponsiveContainer>
  )
}

export default SimplePieChartComponent

const PieChartWrapper = styled(PieChart)`
  margin-top: 0px;
`

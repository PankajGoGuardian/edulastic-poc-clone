import React from 'react'
import { Pie, PieChart, ResponsiveContainer, Label, Tooltip } from 'recharts'
import styled from 'styled-components'
import {
  StyledCustomChartTooltipDark,
  TooltipRow,
  TooltipRowTitle,
  TooltipRowValue,
  ColorBandRow,
  ColorCircle,
} from '../../../../common/styled'

export const SimplePieChartComponent = ({
  pieChartData,
  label,
  showTooltip,
}) => {
  const getTooltipJSX = (payload) => {
    if (payload && payload.length && showTooltip) {
      return (
        <div>
          <TooltipRow>
            <TooltipRowValue>{`${payload[0].payload.count}/${payload[0].payload.sum}`}</TooltipRowValue>
            <TooltipRowTitle>&nbsp;assessments are in</TooltipRowTitle>
          </TooltipRow>
          <ColorBandRow>
            <ColorCircle color={payload[0].payload.fill} />
            <TooltipRowValue>{payload[0].payload.name}</TooltipRowValue>
          </ColorBandRow>
        </div>
      )
    }
    return false
  }

  return (
    <ResponsiveContainer width="100%" minWidth={83} minHeight={83}>
      <PieChartWrapper>
        <Tooltip
          position={{ x: -60, y: -100 }}
          cursor={false}
          content={<StyledCustomChartTooltipDark getJSX={getTooltipJSX} />}
        />
        <Pie
          name="name"
          data={pieChartData}
          labelLine={false}
          innerRadius={25}
          outerRadius={40}
          dataKey="count"
          label={pieChartData.oun}
        >
          <Label value={`${label}%`} position="center" />
        </Pie>
      </PieChartWrapper>
    </ResponsiveContainer>
  )
}

export default SimplePieChartComponent

const PieChartWrapper = styled(PieChart)`
  margin-top: 0px;
`

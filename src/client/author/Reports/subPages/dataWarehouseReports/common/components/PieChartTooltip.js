import React from 'react'

import { FlexContainer } from '@edulastic/common'
import { PIE_CHART_LABEL_THRESHOLD } from '@edulastic/constants/reportUtils/dataWarehouseReports'

import { TooltipContainer } from './styledComponents'
import { ColorCircle, TooltipRowValue } from '../../../../common/styled'

export const TooltipContent = ({ value, name, color }) => (
  <>
    <FlexContainer marginBottom="5px" justifyContent="left">
      {value}%
    </FlexContainer>
    <FlexContainer>
      <ColorCircle color={color} />
      <TooltipRowValue>{name}</TooltipRowValue>
    </FlexContainer>
  </>
)

export const PieChartTooltip = ({ payload }) => {
  const tooltipProperties = payload[0]
  if (
    tooltipProperties &&
    tooltipProperties.value <= PIE_CHART_LABEL_THRESHOLD
  ) {
    const {
      name,
      value,
      payload: { fill },
    } = tooltipProperties
    return (
      <TooltipContainer>
        <TooltipContent value={value} name={name} color={fill} />
      </TooltipContainer>
    )
  }
  return null
}

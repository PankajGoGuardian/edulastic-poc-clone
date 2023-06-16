import React, { useCallback, useState } from 'react'
import { StyledCustomChartTooltipDark } from '../styled'
import { getTooltipJSX, updateTooltipPos } from '../chart-utils'

export default function DynamicChartTooltip({
  tooltipRef,
  parentContainerRef,
  chartRef,
  interventionList = [],
  ...restProps
}) {
  const [tooltipType, setTooltipType] = useState('right')
  const getTooltipContent = useCallback(
    (payload) => {
      updateTooltipPos(parentContainerRef, chartRef, tooltipRef, setTooltipType)
      return getTooltipJSX(payload, interventionList)
    },
    [parentContainerRef, chartRef, tooltipRef, setTooltipType]
  )
  return (
    <StyledCustomChartTooltipDark
      ref={tooltipRef}
      getJSX={getTooltipContent}
      useBarIndex={false}
      tooltipType={tooltipType}
      {...restProps}
    />
  )
}

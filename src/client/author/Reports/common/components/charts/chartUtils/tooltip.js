import React from 'react'
import Row from "antd/es/row";
import Col from "antd/es/col";

export const CustomChartTooltip = (props) => {
  const { className, payload, getJSX, barIndex } = props
  if (barIndex !== null) {
    const tooltip = getJSX(payload, barIndex)
    return tooltip ? (
      <div className={`chart-tooltip ${className}`}>{tooltip}</div>
    ) : (
      <div />
    )
  }
  return null
}

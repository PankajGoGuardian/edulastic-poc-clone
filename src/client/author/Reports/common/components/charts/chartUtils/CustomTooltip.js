import React, { forwardRef, useImperativeHandle, useState } from 'react'

export const CustomTooltip = forwardRef((props, ref) => {
  const { className, payload, getJSX } = props
  const [barIndex, setBarIndex] = useState(null)
  const updateBarIndex = (idx) => {
    setBarIndex(idx)
  }

  const resetBarIndex = () => {
    setBarIndex(null)
  }

  useImperativeHandle(ref, () => ({
    updateBarIndex,
    resetBarIndex,
  }))
  if (barIndex !== null) {
    const tooltip = getJSX(payload, barIndex)
    return tooltip ? (
      <div className={`chart-tooltip ${className}`}>{tooltip}</div>
    ) : (
      <div />
    )
  }
  return null
})

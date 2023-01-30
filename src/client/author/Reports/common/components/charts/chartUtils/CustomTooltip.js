import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

export const CustomTooltip = forwardRef((props, ref) => {
  const { className, payload, getJSX, useBarIndex = true } = props
  const [barIndex, setBarIndex] = useState(null)
  const tooltipElementRef = useRef()
  const updateBarIndex = (idx) => {
    setBarIndex(idx)
  }

  const resetBarIndex = () => {
    setBarIndex(null)
  }

  useImperativeHandle(ref, () => ({
    updateBarIndex,
    resetBarIndex,
    tooltipElementRef,
  }))
  if (useBarIndex && barIndex === null) return null
  const tooltip = getJSX(payload, barIndex)
  if (tooltip)
    return (
      <div ref={tooltipElementRef} className={`chart-tooltip ${className}`}>
        {tooltip}
      </div>
    )
  return <div />
})

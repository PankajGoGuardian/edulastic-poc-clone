import React from 'react'
import { useTheme } from 'styled-components'
import { getFGColor } from '../../../../../../src/utils/util'

const PerformanceMatrixRowHeader = ({ text, color }) => {
  const theme = useTheme()
  const extraStyles = theme.dynamicFGColor
    ? {
        color: getFGColor(color),
      }
    : {}
  return (
    <div className="section-matrix-row">
      <div className="section-matrix-row-text">{text}</div>
      <div
        className="section-matrix-row-bar"
        style={{ backgroundColor: color, ...extraStyles }}
      />
    </div>
  )
}

export default PerformanceMatrixRowHeader

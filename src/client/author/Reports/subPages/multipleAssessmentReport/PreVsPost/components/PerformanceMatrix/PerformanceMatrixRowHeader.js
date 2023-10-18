import React from 'react'
import { getFGColor } from '../../../../../../src/utils/util'

const PerformanceMatrixRowHeader = ({ text, color, dynamicColor }) => {
  const extraStyles = dynamicColor
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

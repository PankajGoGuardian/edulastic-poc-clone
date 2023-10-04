import React from 'react'
import { getFGColor } from '../../../../../../src/utils/util'

const PerformanceMatrixRowHeader = ({ text, color }) => (
  <div className="section-matrix-row">
    <div className="section-matrix-row-text">{text}</div>
    <div
      className="section-matrix-row-bar"
      style={{ backgroundColor: color, color: getFGColor(color) }}
    />
  </div>
)

export default PerformanceMatrixRowHeader

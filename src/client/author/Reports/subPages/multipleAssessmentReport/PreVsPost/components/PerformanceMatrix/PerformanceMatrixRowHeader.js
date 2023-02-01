import React from 'react'

const PerformanceMatrixRowHeader = ({ text, color }) => (
  <div className="section-matrix-row">
    <div className="section-matrix-row-text">{text}</div>
    <div
      className="section-matrix-row-bar"
      style={{ backgroundColor: color }}
    />
  </div>
)

export default PerformanceMatrixRowHeader

import React from 'react'

const PerformanceMatrixColumnHeader = ({ value, change, color }) => (
  <div className="section-matrix-col">
    <div className="section-matrix-col-text">{value}</div>
    <div className="section-matrix-col-text">{change}</div>
    <div
      className="section-matrix-col-bar"
      style={{ backgroundColor: color }}
    />
  </div>
)

export default PerformanceMatrixColumnHeader

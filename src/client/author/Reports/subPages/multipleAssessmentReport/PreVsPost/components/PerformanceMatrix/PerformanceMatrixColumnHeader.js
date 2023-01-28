import React from 'react'

const PerformanceMatrixColumnHeader = ({ key, text, color }) => (
  <div key={key} className="section-matrix-col">
    <div className="section-matrix-col-text">{text}</div>
    <div
      className="section-matrix-col-bar"
      style={{ backgroundColor: color }}
    />
  </div>
)

export default PerformanceMatrixColumnHeader

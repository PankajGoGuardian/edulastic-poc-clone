import { EduIf } from '@edulastic/common'
import React from 'react'

const PerformanceMatrixColumnHeader = ({
  value,
  change,
  color,
  isSamePerformanceBand = true,
}) => (
  <div className="section-matrix-col">
    <div className="section-matrix-col-text">{value}</div>
    <EduIf condition={isSamePerformanceBand}>
      <div className="section-matrix-col-text">{change}</div>
    </EduIf>
    <div
      className="section-matrix-col-bar"
      style={{ backgroundColor: color }}
    />
  </div>
)

export default PerformanceMatrixColumnHeader

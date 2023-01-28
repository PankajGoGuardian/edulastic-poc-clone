import React from 'react'

const PerformanceMatrixCell = ({ key, className, text, color, onClick }) => {
  return (
    <div
      style={{
        backgroundColor: color,
      }}
      key={key}
      className={`section-matrix-cell ${className}`}
      onClick={onClick}
    >
      {text}
    </div>
  )
}

export default PerformanceMatrixCell

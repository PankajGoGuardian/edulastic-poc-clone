import React from 'react'

const PerformanceMatrixCell = ({ className, text, onClick }) => {
  return (
    <div className={`section-matrix-cell ${className}`} onClick={onClick}>
      {text}
    </div>
  )
}

export default PerformanceMatrixCell

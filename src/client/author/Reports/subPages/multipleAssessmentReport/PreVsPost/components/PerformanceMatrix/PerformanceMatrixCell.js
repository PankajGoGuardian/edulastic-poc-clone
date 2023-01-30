import React from 'react'

const PerformanceMatrixCell = ({
  key,
  className,
  text,
  color,
  selected,
  onClick,
}) => {
  const style = { backgroundColor: color }
  if (!selected) {
    style.filter = 'grayscale(100%)'
  }
  return (
    <div
      style={style}
      key={key}
      className={`section-matrix-cell ${className}`}
      onClick={onClick}
    >
      {text}
    </div>
  )
}

export default PerformanceMatrixCell

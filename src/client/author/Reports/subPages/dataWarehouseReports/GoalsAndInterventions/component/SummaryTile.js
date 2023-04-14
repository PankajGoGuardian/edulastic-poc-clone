import React from 'react'
import styled from 'styled-components'

const SummaryTile = ({ id, text, unit, color, border }) => {
  return (
    <StyleButton
      key={id}
      style={{ background: color, border: border || 'none' }}
    >
      <p>{text}</p>
      <b>{unit}</b>
    </StyleButton>
  )
}

const StyleButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  height: 60px;
  border-radius: 4px;
  p {
    color: #2f4151;
    font-size: 12px;
  }
  b {
    font-size: 14px;
    color: #555555;
  }
`

export default SummaryTile

import React from 'react'
import styled from 'styled-components'
import { summaryTileColors } from '../../../constants/common'

const SummaryTile = ({
  id,
  text,
  unit,
  color,
  border,
  textColor = summaryTileColors.BLUE_TEXT,
}) => {
  return (
    <StyleButton
      key={id}
      style={{
        background: color,
        border: border || 'none',
        color: textColor,
        textTransform: border ? 'uppercase' : 'initial',
        fontSize: border ? '14px' : '12px',
      }}
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
  min-width: 10vw;
  border-radius: 4px;
  p {
    font-weight: 600;
  }
  b {
    font-weight: 700;
    font-size: 16px;
  }
`

export default SummaryTile

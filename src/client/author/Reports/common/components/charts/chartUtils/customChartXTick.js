import React from 'react'
import { StyledAxisTickText } from '../../../styled'

export const CustomChartXTick = (props) => {
  const { x, y, payload, data, getXTickText, width, visibleTicksCount } = props

  const tickWidth = Math.floor(width / visibleTicksCount)

  let text = getXTickText ? getXTickText(payload, data) : payload.value

  if (text && text.length > 25 && tickWidth < 80) {
    if (text[19] === ' ') text = text.substr(0, 24)
    else text = text.substr(0, 25)
    text += '...'
  }

  if (tickWidth < 80 && text.length > 10) {
    text = `${text.substr(0, 7)}...`
  } else if (tickWidth < 100 && text.length > 15) {
    text = `${text.substr(0, 12)}...`
  } else if (text.length > 20) {
    text = `${text.substr(0, 17)}...`
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <StyledAxisTickText
        textAnchor="middle"
        verticalAnchor="start"
        width={tickWidth}
      >
        {text}
      </StyledAxisTickText>
    </g>
  )
}

// here we are subtracting tooltipWidth/2
export const calculateXCoordinateOfXAxisToolTip = (
  coordinate,
  xTickToolTipWidth
) => Math.round(coordinate, 3) - xTickToolTipWidth / 2

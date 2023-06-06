import React, { useLayoutEffect, useRef, useState } from 'react'
import { StyledAxisTickText } from '../../../styled'

const EXTERNAL_TAG_PADDING = 2

export const CustomChartXTick = (props) => {
  const {
    x,
    y,
    payload,
    data,
    getXTickText,
    getXTickTagText,
    getXTickFill,
    width,
    fontWeight,
    visibleTicksCount,
  } = props

  const tickWidth = Math.floor(width / visibleTicksCount)

  let text = getXTickText ? getXTickText(payload, data) : payload.value
  const fill = getXTickFill ? getXTickFill(payload, data) : 'black'

  const tagText = getXTickTagText ? getXTickTagText(payload, data) : ''

  const tagTextRef = useRef(null)
  const [tagWidth, setTagWidth] = useState(0)

  useLayoutEffect(() => {
    if (tagTextRef.current) {
      const tagRectWidth = tagTextRef.current.wordsWithComputedWidth[0].width
      setTagWidth(tagRectWidth + EXTERNAL_TAG_PADDING)
    }
  }, [tagText])

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
        fontWeight={fontWeight}
        fill={fill}
      >
        {text}
      </StyledAxisTickText>
      {tagText ? (
        <>
          <rect
            x={-(tagWidth / 2)}
            y={24}
            rx={10}
            width={tagWidth}
            height={20}
            fill="black"
          />
          <StyledAxisTickText
            ref={tagTextRef}
            y={30}
            textAnchor="middle"
            verticalAnchor="start"
            width={tickWidth}
            fontSize="12px"
            fontWeight="bold"
            fill="white"
          >
            {tagText.toUpperCase()}
          </StyledAxisTickText>
        </>
      ) : null}
    </g>
  )
}

// here we are subtracting tooltipWidth/2
export const calculateXCoordinateOfXAxisToolTip = (
  coordinate,
  xTickToolTipWidth
) => Math.round(coordinate, 3) - xTickToolTipWidth / 2

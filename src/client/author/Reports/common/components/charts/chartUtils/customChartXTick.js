import React, { useLayoutEffect, useRef, useState } from 'react'
// import { IconInfo } from '@edulastic/icons'
// import { blueButton } from '@edulastic/colors'
// import { get, isArray } from 'lodash'
// import { Tooltip } from 'recharts'
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
    subTickKey = '',
  } = props

  // const [tooltipVisible, setTooltipVisible] = useState(false)

  const tickWidth = Math.floor(width / visibleTicksCount)

  // const { assessmentDate: currentAssessmentDate } = get(
  //   data,
  //   [payload.index],
  //   {}
  // )

  // const { assessmentDate: aheadAssessmentDate } = get(
  //   data,
  //   [payload.index + 1],
  //   {}
  // )

  // const interventionsGroup = getInterventionsGroup(
  //   currentAssessmentDate,
  //   aheadAssessmentDate,
  //   interventionsData
  // )

  let text = getXTickText ? getXTickText(payload, data) : payload.value
  let fill = getXTickFill ? getXTickFill(payload, data) : 'black'

  const tagText = getXTickTagText ? getXTickTagText(payload, data) : ''

  let subText = ''
  if (
    subTickKey.length > 0 &&
    data[payload.value] &&
    data[payload.value][subTickKey]
  ) {
    subText = data[payload.value][subTickKey]
    fill = '#666'
  }

  // const handleMouseEnter = () => {
  //   setTooltipVisible(true)
  // }

  // const handleMouseLeave = () => {
  //   setTooltipVisible(false)
  // }

  const tagTextRef = useRef(null)
  const [tagWidth, setTagWidth] = useState(0)

  // const InformationIcon = () => {
  //   const componentWidth = 14
  //   const componentHeight = 14
  //   const widthBtwCoord = Math.floor(width / (visibleTicksCount - 1))
  //   const infoIconPosX = x + widthBtwCoord / 2 - componentWidth / 2
  //   const infoIconPosy = y - componentHeight * 2.5

  //   return isArray(interventionsGroup) && interventionsGroup.length ? (
  //     <g
  //       transform={`translate(${infoIconPosX},${infoIconPosy})`}
  //       onMouseEnter={handleMouseEnter}
  //       onMouseLeave={handleMouseLeave}
  //     >
  //       {/* Tooltip */}
  //       <IconInfo
  //         fill={blueButton}
  //         width={componentWidth}
  //         height={componentHeight}
  //       />
  //       {/* {tooltipVisible && ( */}
  //       <Tooltip textAnchor="middle" fill="blue">
  //         {interventionsGroup.map(({ name }) => name).join('\n')}
  //       </Tooltip>
  //       {/*  )} */}
  //     </g>
  //   ) : null
  // }

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
    <>
      {/**
       * Todos:
       * Show only when the intervention is available between range
       * Show all the interventions in tooltip
       */}
      {/* <InformationIcon /> */}

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
      {subTickKey.length > 0 && (
        <g transform={`translate(${x},${y + 20})`}>
          <StyledAxisTickText
            textAnchor="middle"
            verticalAnchor="start"
            fontSize={14}
            fill={fill}
          >
            {subText}
          </StyledAxisTickText>
        </g>
      )}
    </>
  )
}

// here we are subtracting tooltipWidth/2
export const calculateXCoordinateOfXAxisToolTip = (
  coordinate,
  xTickToolTipWidth
) => Math.round(coordinate, 3) - xTickToolTipWidth / 2

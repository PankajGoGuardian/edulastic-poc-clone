import React from 'react'
import { measureTextWithImage } from '@edulastic/common'
import { Popover } from 'antd'

export function WithPopover({
  children,
  userAnswer,
  containerDimensions,
  fontSize,
  checkAnswer,
  getContent = () => {},
}) {
  const {
    scrollWidth: contentWidth,
    scrollHeight: contentHeight,
  } = measureTextWithImage({
    text: userAnswer,
    style: { fontSize },
    targetChild: 'p',
    childStyle: { display: 'inline' },
  })
  const { height: containerHeight, width: containerWidth } = containerDimensions

  const indexBoxWidth = checkAnswer ? 0 : 40
  const heightOverflow = contentHeight > parseInt(containerHeight, 10)
  const widthOverflow =
    contentWidth + indexBoxWidth > parseInt(containerWidth, 10)
  const showPopover = heightOverflow || widthOverflow

  if (showPopover) {
    const popoverContent = getContent(true)
    return (
      <Popover
        placement="bottomLeft"
        content={popoverContent}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
      >
        {children}
      </Popover>
    )
  }
  return children
}

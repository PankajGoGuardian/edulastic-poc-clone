import React from 'react'
import { Popover } from 'antd'
import PropTypes from 'prop-types'

import { response } from '@edulastic/constants'
import { MathSpan, measureTextWithImage } from '@edulastic/common'

import { AnswerBoxItem } from './styled/AnswerBoxItem'

export function AnswerBox({ btnStyle, index, numeration, centerText, label }) {
  const {
    scrollHeight: contentHeight,
    scrollWidth: contentWidth,
  } = measureTextWithImage({ text: label })
  const { height: containerHeight, maxWidth: maxContainerWidth } = btnStyle

  const heightOverflow = contentHeight >= containerHeight
  const widthOverflow = contentWidth >= maxContainerWidth
  const showPopover = heightOverflow || widthOverflow

  const getContent = (inPopover) => (
    <AnswerBoxItem
      key={index}
      height={containerHeight}
      inPopover={inPopover}
      verticallyCentered={!heightOverflow}
      style={{
        ...btnStyle,
        height: inPopover ? 'auto' : containerHeight,
        minHeight: containerHeight,
        overflow: inPopover && 'auto',
        maxWidth: inPopover ? response.popoverMaxWidth : response.maxWidth,
      }}
    >
      <div className="index" style={{ alignSelf: 'stretch' }}>
        {numeration}
      </div>
      <div className="text" style={{ justifyContent: centerText && 'center' }}>
        <MathSpan dangerouslySetInnerHTML={{ __html: label }} />
      </div>
    </AnswerBoxItem>
  )

  const content = getContent(false)

  if (showPopover) {
    const popoverContent = getContent(true)

    return (
      <Popover content={popoverContent} placement="bottomLeft">
        {content}
      </Popover>
    )
  }

  return content
}

AnswerBox.propTypes = {
  btnStyle: PropTypes.object.isRequired,
  index: PropTypes.bool.isRequired,
  numeration: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  centerText: PropTypes.bool,
  label: PropTypes.string.isRequired,
}

AnswerBox.defaultProps = {
  centerText: false,
}

import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Popover } from 'antd'
import styled from 'styled-components'
import {
  MathSpan,
  ScrollContext,
  measureTextWithImage,
} from '@edulastic/common'

const AnswerContainer = ({
  answer,
  fontSize,
  height: containerHeight,
  width: containerWidth,
}) => {
  const {
    scrollWidth: contentWidth,
    scrollHeight: contentHeight,
  } = measureTextWithImage({
    text: answer,
    style: { fontSize },
    targetChild: 'p',
    childStyle: { display: 'inline' },
  })
  const { getScrollElement } = useContext(ScrollContext)
  const widthOverflow = contentWidth > parseInt(containerWidth, 10) - 10
  const heightOveflow = contentHeight >= parseInt(containerHeight, 10)
  const showPopover = widthOverflow || heightOveflow

  const content = (
    <MathSpan
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        fontSize,
      }}
      dangerouslySetInnerHTML={{ __html: answer }}
    />
  )

  const getPopupContainer = (triggerNode) => {
    const scrollEl = getScrollElement()
    if (scrollEl) {
      return scrollEl
    }
    return triggerNode.parentNode
  }

  if (showPopover) {
    return (
      <Popover
        placement="bottomLeft"
        content={<PopoverWrapper>{content}</PopoverWrapper>}
        getPopupContainer={getPopupContainer}
      >
        {content}
      </Popover>
    )
  }

  return <Container>{content}</Container>
}

AnswerContainer.propTypes = {
  answer: PropTypes.string.isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

export default AnswerContainer

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  img.fr-dii {
    margin: 0px !important;
    max-width: 100%;
  }
`

const PopoverWrapper = styled.div`
  display: flex;
  height: 100%;
  width: max-content;

  img.fr-dii {
    margin: 0px !important;
    max-width: inherit;
  }
`

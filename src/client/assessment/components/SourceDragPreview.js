import React, { useRef, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { DragLayer } from 'react-dnd'
import { white, dashBorderColor } from '@edulastic/colors'
import { ScrollContext } from '@edulastic/common'

function collect(monitor, { isResetOffset }) {
  return {
    sourceOffset: isResetOffset
      ? monitor.getDifferenceFromInitialOffset()
      : monitor.getSourceClientOffset(),
  }
}

function useDragScroll(sourceOffset) {
  const interval = useRef(null)
  const scrollContext = useContext(ScrollContext)
  const scrollEl = scrollContext.getScrollElement()
  // /TODO: fix once perfect scroll-bar is fixed
  const containerBottom = window.innerHeight - 50
  const containerTop = scrollEl?.offsetTop + 20

  // scroll the page when dragging element reaches top of the view port..
  useEffect(() => {
    if (scrollEl) {
      const yOffset = sourceOffset?.y
      if (
        !interval.current &&
        scrollEl.scrollBy &&
        (yOffset < containerTop || yOffset > containerBottom)
      ) {
        const scrollBy = yOffset < containerTop ? -10 : 10
        interval.current = setInterval(() => scrollEl.scrollBy(0, scrollBy), 50)
      } else if (
        interval.current &&
        ((yOffset > containerTop && yOffset < containerBottom) || !sourceOffset)
      ) {
        clearInterval(interval.current)
        interval.current = null
      }
    }
  }, [sourceOffset])
}

const DragPreview = ({ isDragging, children, sourceOffset }) => {
  useDragScroll(sourceOffset)

  if (!isDragging || !sourceOffset) {
    return null
  }

  return (
    <PreviewContainer
      style={{ width: 'auto' }}
      left={sourceOffset && sourceOffset.x}
      top={sourceOffset && sourceOffset.y}
    >
      {children}
    </PreviewContainer>
  )
}

DragPreview.propTypes = {
  isDragging: PropTypes.bool,
  sourceOffset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  children: PropTypes.node.isRequired,
}

DragPreview.defaultProps = {
  isDragging: false,
  sourceOffset: {},
}

export default DragLayer(collect)(DragPreview)

const PreviewContainer = styled.div.attrs(({ left, top }) => ({
  style: {
    transform: `translate(${left || 0}px, ${top || 0}px)`,
  },
}))`
  background: ${white};
  border: 2px ${dashBorderColor} dotted;
  padding: 8px 20px;
  position: fixed;
  opacity: 0.5;
  z-index: 1000;
  left: 0;
  top: 0;
  transition: none;
  pointer-events: none;
`

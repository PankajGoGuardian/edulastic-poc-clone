import React, { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { getSelectionRect } from '@edulastic/common'

const pickerWidth = 212 // width of color picker, and will not change.

// returns the position of popover based on user selection.
const getStyles = ({
  windowWidth,
  selectionTop,
  selectionLeft,
  selectionWidth,
  selectionHeight,
}) => {
  // Adding zIndex to color picker
  const style = { position: 'fixed', zIndex: 9999 }

  style.left = selectionLeft + selectionWidth / 2 - pickerWidth / 2
  style.top = selectionTop + 32 // 16px below text

  // If the popover is placed beyond the left edge of the screen align
  // with left edge
  if (style.left < 0) {
    style.left = 0
    // if the popover is placed beyond the right edge align with the
    // right edge of the screen
  } else if (style.left + pickerWidth > windowWidth) {
    style.left = windowWidth - pickerWidth
  }

  // if the popover is placed above the frame, position below selection instead
  if (style.top < 0) {
    style.top = selectionTop + selectionHeight + 5
  }

  return style
}

const HighlightPopover = ({
  children,
  isOpen,
  getContainer,
  onTextUnselect,
  onTextSelect,
  onMouseUp,
}) => {
  const [containerStyle, updateContainerStyle] = useState(null)
  const [isPressed, toggleIsPressed] = useState(false)
  const [isTextSelected, toggleIsTextSelected] = useState(false)
  const container = getContainer()

  const mouseClickHandler = useCallback(
    (e) => {
      if (container && !container.contains(e.target)) {
        onTextUnselect && onTextUnselect()
      }
    },
    [container]
  )

  const updatePosition = useCallback(() => {
    const browserSelection = document.getSelection()
    const selectionPosition = getSelectionRect(window)
    if (
      selectionPosition != null &&
      container != null &&
      browserSelection != null &&
      container.contains(browserSelection.anchorNode) === true &&
      container.contains(browserSelection.focusNode) === true
    ) {
      if (browserSelection.isCollapsed === false) {
        onTextSelect && onTextSelect()
        toggleIsTextSelected(true)
      } else {
        onTextUnselect && onTextUnselect()
        toggleIsTextSelected(false)
      }

      const style = getStyles({
        windowWidth: window.innerWidth,
        selectionTop: selectionPosition.top,
        selectionLeft: selectionPosition.left,
        selectionWidth: selectionPosition.width,
        selectionHeight: selectionPosition.height,
      })

      updateContainerStyle(style)
    } else if (isTextSelected) {
      onTextUnselect && onTextUnselect()
      toggleIsTextSelected(false)
    }
  }, [container])

  const mouseUpHandler = useCallback(() => {
    onMouseUp()
    updatePosition()
    toggleIsPressed(false)
    document.removeEventListener('mouseup', mouseUpHandler)
    document.removeEventListener('touchend', mouseUpHandler, {
      passive: false,
    })

    container.removeEventListener('mousemove', updatePosition)
    container.removeEventListener('touchmove', updatePosition, {
      passive: false,
    })
  }, [container])

  const mouseDownHandler = useCallback(() => {
    updatePosition()
    toggleIsPressed(true)

    document.addEventListener('mouseup', mouseUpHandler)
    document.addEventListener('touchend', mouseUpHandler, { passive: false })

    container.addEventListener('mousemove', updatePosition)
    container.addEventListener('touchmove', updatePosition, {
      passive: false,
    })
  }, [container])

  useEffect(() => {
    if (container) {
      document.addEventListener('click', mouseClickHandler)
      container.addEventListener('mousedown', mouseDownHandler)
      container.addEventListener('touchstart', mouseDownHandler, {
        passive: false,
      })
    }
    return () => {
      if (container) {
        document.removeEventListener('click', mouseClickHandler)
        container.removeEventListener('mousedown', mouseDownHandler)
        container.removeEventListener('touchstart', mouseDownHandler, {
          passive: false,
        })
      }
    }
  }, [container])

  let style = {}
  if (containerStyle !== null) {
    style = { ...containerStyle, pointerEvents: isPressed ? 'none' : 'auto' }
  }

  // This makes it flexible to use whatever element is wanted (div, ul, etc)
  const content =
    isOpen &&
    containerStyle &&
    React.cloneElement(React.Children.only(children), { style })

  return createPortal(content, document.body)
}

HighlightPopover.propTypes = {
  children: PropTypes.node.isRequired,
  selectionEl: PropTypes.instanceOf(Element),
  onTextSelect: PropTypes.func,
  onTextUnselect: PropTypes.func,
  isOpen: PropTypes.bool,
}

HighlightPopover.defaultProps = {
  isOpen: false,
  selectionEl: null,
  onTextSelect: () => null,
  onTextUnselect: () => null,
}

export default HighlightPopover

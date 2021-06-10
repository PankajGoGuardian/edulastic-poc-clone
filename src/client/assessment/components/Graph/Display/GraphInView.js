import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const normalizeRect = (rect) => {
  if (rect.width === undefined) {
    rect.width = rect.right - rect.left
  }

  if (rect.height === undefined) {
    rect.height = rect.bottom - rect.top
  }

  return rect
}

const roundRectDown = (rect) => {
  return {
    top: Math.floor(rect.top),
    left: Math.floor(rect.left),
    bottom: Math.floor(rect.bottom),
    right: Math.floor(rect.right),
  }
}

const GraphInView = ({
  children,
  isPartial,
  minTopValue,
  delay,
  className,
}) => {
  const node = useRef()
  const timer = useRef()
  const [isVisible, setIsVisible] = useState(false)
  /**
   * Check if the element is within the visible viewport
   */
  const check = useCallback(() => {
    if (!node.current || isVisible) {
      return
    }
    const contRect = {
      top: 0,
      left: 0,
      bottom: window.innerHeight || document.documentElement.clientHeight,
      right: window.innerWidth || document.documentElement.clientWidth,
    }

    const elRect = normalizeRect(
      roundRectDown(node.current.getBoundingClientRect())
    )
    const visibilityRect = {
      top: elRect.top >= contRect.top,
      left: elRect.left >= contRect.left,
      bottom: elRect.bottom <= contRect.bottom,
      right: elRect.right <= contRect.right,
    }

    let visible =
      visibilityRect.top &&
      visibilityRect.left &&
      visibilityRect.bottom &&
      visibilityRect.right
    if (isPartial) {
      const partialVisible =
        elRect.top <= contRect.bottom &&
        elRect.bottom >= contRect.top &&
        elRect.left <= contRect.right &&
        elRect.right >= contRect.left

      visible =
        minTopValue > 0
          ? partialVisible && elRect.top <= contRect.bottom - minTopValue
          : partialVisible
    }

    if (visible) {
      setIsVisible(visible)
    }
  }, [isPartial, minTopValue])

  useEffect(() => {
    if (isVisible) {
      clearInterval(timer.current)
    }
  }, [isVisible])

  useEffect(() => {
    timer.current = setInterval(check, delay || 10)
    return () => {
      clearInterval(timer.current)
    }
  }, [])

  return (
    <GraphWrapper ref={node} className={className}>
      {isVisible && children}
    </GraphWrapper>
  )
}

GraphInView.propTypes = {
  children: PropTypes.node.isRequired,
  isPartial: PropTypes.bool,
  minTopValue: PropTypes.number,
  delay: PropTypes.number,
}

GraphInView.defaultProps = {
  minTopValue: 0,
  isPartial: true,
  delay: 50,
}

export default GraphInView

const GraphWrapper = styled.div`
  min-height: 100px;
`

import React, { useRef, useEffect, useCallback, useContext } from 'react'
import { ScrollContext } from '@edulastic/common'
import { throttle } from 'lodash'

const ScrollContainer = ({ className, style, reportScrollTop, children }) => {
  const containerRef = useRef(null)
  const ScrollContextConfig = useContext(ScrollContext)
  const scrollElement = ScrollContextConfig.getScrollElement()

  if (!scrollElement) {
    return null
  }

  const reportScroll = useCallback(
    throttle(() => {
      reportScrollTop(
        Math.max(0, scrollElement.scrollTop - containerRef.current.offsetTop)
      )
    }, 500),
    [reportScrollTop]
  )

  useEffect(() => {
    scrollElement.addEventListener('scroll', reportScroll)
    return () => scrollElement.removeEventListener('scroll', reportScroll)
  }, [reportScroll])

  return (
    <div
      ref={containerRef}
      style={{
        ...style,
        width: '100%',
        overflow: 'visible',
      }}
      className={className}
    >
      {React.Children.map(children, (child, index) => {
        if (index === 0) {
          return React.cloneElement(child, {
            className: `${child.className || ''}`,
            style: {
              ...child.props.style,
              maxHeight: `${window.innerHeight}px`,
            },
          })
        }

        return child
      })}
    </div>
  )
}

export default ScrollContainer

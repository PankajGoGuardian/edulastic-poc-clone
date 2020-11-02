import React, { useRef, useEffect, useCallback } from 'react'
import './style.css'

let scrollWrapperId = null

export const setScrollWrapperId = (id) => {
  scrollWrapperId = id
}

const ScrollContainer = ({ className, style, reportScrollTop, children }) => {
  const elRef = useRef(null)
  const lastOffsetTopRef = useRef(0)
  const scrollWrapper = scrollWrapperId
    ? document.querySelector(`#${scrollWrapperId}`)
    : window
  const getScrollYPosition = () =>
    scrollWrapperId ? scrollWrapper.scrollTop : scrollWrapper.scrollY

  const reportScroll = useCallback(() => {
    reportScrollTop(Math.max(0, getScrollYPosition() - elRef.current.offsetTop))
  }, [reportScrollTop])

  useEffect(() => {
    scrollWrapper.addEventListener('scroll', reportScroll)
    return () => scrollWrapper.removeEventListener('scroll', reportScroll)
  }, [reportScroll])

  useEffect(() => {
    lastOffsetTopRef.current = elRef.current.offsetTop
    const offsetCheckInterval = setInterval(() => {
      const offsetTop = elRef.current.offsetTop
      if (offsetTop !== lastOffsetTopRef.current) {
        lastOffsetTopRef.current = offsetTop
        reportScroll()
      }
    }, 500)

    return () => clearInterval(offsetCheckInterval)
  }, [elRef.current])

  return (
    <div
      ref={elRef}
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
            className: `${child.className || ''} theDiv`,
            // style: {
            //   ...child.props.style,
            //   maxHeight: "100vh"
            // }
          })
        }

        return child
      })}
    </div>
  )
}

export default ScrollContainer

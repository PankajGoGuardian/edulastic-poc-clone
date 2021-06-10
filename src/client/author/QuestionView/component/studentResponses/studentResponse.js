import React, { useRef, useEffect } from 'react'

const StudentResponse = ({ children }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef?.current) {
      const MainContentWrapper = containerRef.current.parentElement
      const setPosition = () => {
        if (
          MainContentWrapper.scrollTop > 330 &&
          !Array.from(containerRef.current.classList).includes(
            'fixed-response-sub-header'
          )
        ) {
          containerRef.current.classList.add('fixed-response-sub-header')
        } else if (
          MainContentWrapper.scrollTop <= 330 &&
          Array.from(containerRef.current.classList).includes(
            'fixed-response-sub-header'
          )
        ) {
          containerRef.current.classList.remove('fixed-response-sub-header')
        }
      }
      MainContentWrapper.addEventListener('scroll', setPosition)
      return () => MainContentWrapper.removeEventListener('scroll', setPosition)
    }
  }, [containerRef])

  return <div ref={containerRef}>{children}</div>
}

export default StudentResponse

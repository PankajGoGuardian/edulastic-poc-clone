import { useEffect } from 'react'

const scrollZoomedContainer = (className, target, index) => {
  const zoomWrapper = document.querySelector('.zoomed-container-wrapper')
  zoomWrapper
    ?.getElementsByClassName(className)
    ?.[index]?.scrollTo(0, target?.scrollTop)
}

const handleScrollEvents = (shouldAttach) => {
  const unZoomed = document.getElementsByClassName(
    'unzoom-container-wrapper'
  )[0]
  if (unZoomed) {
    ;['test-item-col', 'scrollbar-container'].forEach((className) => {
      const containers = unZoomed?.getElementsByClassName(className) || []
      for (let i = 0; i < containers.length; i++) {
        if (shouldAttach) {
          containers[i].addEventListener('scroll', (e) => {
            scrollZoomedContainer(className, e.target, i)
          })
        } else {
          scrollZoomedContainer(className, containers[i], i)
        }
      }
    })
  }
}

export const useMagnifierScroll = (contentChanged, isDragging, enable) => {
  useEffect(() => {
    handleScrollEvents()
  }, [contentChanged])

  useEffect(() => {
    if (enable) {
      handleScrollEvents(true)
    } else {
      // TODO: remove scroll events
    }
  }, [enable])

  useEffect(() => {
    if (isDragging) {
      handleScrollEvents()
    }
  })

  return null
}

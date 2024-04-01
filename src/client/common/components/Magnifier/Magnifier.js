import React, { useState, useEffect, useRef } from 'react'
import { isSEB } from '@edulastic/common'
import { useMagnifierScroll } from './useMagnifierScroll'
import { useMagnifierEvents } from './useMagnifierEvents'
import { normalizeTouchEvent } from './helpers'
import { ZoomedWrapper, ZoomedContentWrapper, MagnifierOverlay } from './styled'
import { isWindows } from '../../../platform'

export const Magnifier = ({
  children,
  windowWidth,
  windowHeight,
  enable,
  config: { width, height, scale },
  zoomedContent: ZoomedContent,
  offset,
  contentChanged,
}) => {
  const [setting, setSetting] = useState({
    pos: { x: windowWidth / 2 - width / 2, y: windowHeight / 2 - height / 2 },
    dragging: false,
    rel: null,
    windowWidth,
    windowHeight,
  })
  const clickedClassName = useRef()
  const magnifierRef = useRef()
  const unzoomRef = useRef()
  const isSEBBrowserWindows = isSEB() && isWindows()

  // JIRA: EV-39387 Magnifier not working in SEB Browser
  const onMouseMoveSEBWindows = (e) => {
    if (offset.top <= e.pageY) {
      setSetting({
        ...setting,
        pos: {
          x: e.pageX,
          y: e.pageY,
        },
      })
    }
    e.stopPropagation()
    e.preventDefault()
  }

  const onMouseMove = (e) => {
    if (isSEBBrowserWindows) {
      onMouseMoveSEBWindows(e)
    } else {
      if (!setting.dragging) {
        return
      }
      if (window.isIOS || window.isMobileDevice) normalizeTouchEvent(e)
      if (offset.top <= e.pageY - setting.rel.y) {
        setSetting({
          ...setting,
          pos: {
            x: e.pageX - setting.rel.x,
            y: e.pageY - setting.rel.y,
          },
        })
      }
      e.stopPropagation()
      e.preventDefault()
    }
  }

  const onMouseUp = (e) => {
    setSetting({
      ...setting,
      dragging: false,
    })
    e.stopPropagation()
    e.preventDefault()
  }

  const onMouseDown = (e) => {
    if (e.button !== 0) {
      return
    }
    if (window.isIOS || window.isMobileDevice) normalizeTouchEvent(e)
    const pos = magnifierRef.current.getBoundingClientRect()
    setSetting({
      ...setting,
      dragging: true,
      rel: {
        x: e.pageX - pos.left,
        y: e.pageY - pos.top,
      },
    })
    // add Mouse move and up event on clicking the magnifier wrapper
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('touchmove', onMouseMove, { passive: false })
    document.addEventListener('mouseup', onMouseUp)

    e.stopPropagation()
    e.preventDefault()
  }

  const handleDragElements = () => {
    const dragElements = document.querySelectorAll(
      '.zoomed-container-wrapper .react-draggable'
    )
    if (dragElements.length > 0) {
      document
        .querySelectorAll('.unzoom-container-wrapper .react-draggable')
        .forEach((elm, i) => {
          dragElements[i].style.transform = elm.style.transform
        })
    }
  }

  const handleHints = () => {
    const dragElements = document.querySelectorAll(
      '.zoomed-container-wrapper .hint-container'
    )
    if (dragElements.length > 0) {
      document
        .querySelectorAll('.unzoom-container-wrapper .hint-container')
        .forEach((elm, i) => {
          dragElements[i].innerHTML = elm.innerHTML
        })
    }
  }

  const hideElements = (e) => {
    // THis work to copy dom if any attached event fired before

    const className = clickedClassName.current
    if (className) {
      // copy after some time as to wait to fully render main container
      setTimeout(() => {
        const elm = document.querySelector(
          `.unzoom-container-wrapper .${className}`
        )
        const zoomedElm = document.querySelector(
          `.zoomed-container-wrapper .${className}`
        )
        if (elm && (e.target !== elm || !elm.contains(e.target))) {
          if (zoomedElm) {
            document.querySelector(
              `.zoomed-container-wrapper`
            ).innerHTML = document.querySelector(
              `.unzoom-container-wrapper`
            ).innerHTML
          }
        }
      }, 1000)
    }
  }

  useMagnifierScroll(contentChanged, setting.dragging, enable)

  const [attachEvents, removeEvents] = useMagnifierEvents()

  useEffect(() => {
    if (setting.dragging) {
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('touchmove', onMouseMove, { passive: false })
      document.addEventListener('mouseup', onMouseUp)
      handleDragElements()
      handleHints()
    }
    if (
      setting.windowWidth !== windowWidth ||
      setting.windowHeight !== windowHeight
    ) {
      setSetting({
        ...setting,
        windowWidth,
        windowHeight,
        pos: {
          x: windowWidth / 2 - width / 2,
          y: windowHeight / 2 - height / 2,
        },
      })
    }

    return () => {
      document?.removeEventListener('mousemove', onMouseMove)
      document?.removeEventListener('touchmove', onMouseMove, {
        passive: false,
      })
      document?.removeEventListener('mouseup', onMouseUp)
    }
  })

  useEffect(() => {
    document.addEventListener('click', hideElements)
    // This is to attach events to dom elements after some moment
    setTimeout(attachEvents, 1000)
    return () => {
      document.removeEventListener('click', hideElements)
      // This is to deattach events to dom elements after some moment
      removeEvents()
    }
  }, [])

  useEffect(() => {
    if (enable) {
      const zoomWrapper = document.querySelector('.zoomed-container-wrapper')

      if (unzoomRef.current && !ZoomedContent) {
        setTimeout(() => {
          zoomWrapper.textContent = ''
          unzoomRef.current.childNodes.forEach((node) => {
            zoomWrapper.appendChild(node.cloneNode(true))
          })
        }, 10)
      }
    }
  }, [enable, contentChanged])

  return (
    <>
      <div className="unzoom-container-wrapper" ref={unzoomRef}>
        {children}
      </div>
      {enable && (
        <ZoomedWrapper
          ref={magnifierRef}
          onMouseDown={onMouseDown}
          onTouchStart={onMouseDown}
          id="magnifier-wrapper"
          magnifierWidth={width}
          magnifierHeight={height}
          pos={setting.pos}
        >
          <ZoomedContentWrapper
            scale={scale}
            windowHeight={windowHeight}
            windowWidth={windowWidth}
            pos={setting.pos}
            top={offset.top}
            left={offset.left}
            width={width}
            className="zoomed-container-wrapper"
          >
            {ZoomedContent && <ZoomedContent />}
          </ZoomedContentWrapper>
          <MagnifierOverlay magnifierWidth={width} magnifierHeight={height} />
        </ZoomedWrapper>
      )}
    </>
  )
}

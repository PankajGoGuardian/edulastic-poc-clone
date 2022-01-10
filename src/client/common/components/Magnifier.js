import React, { useState, useEffect, useRef } from 'react'
import { withWindowSizes } from '@edulastic/common'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { themes } from '../../theme'

const {
  playerSkin: { magnifierBorderColor },
} = themes

const copyDomOnClickOfElements = [
  'question-select-dropdown',
  'answer-math-input-field',
  'ant-select-selection',
  'graph-toolbar-right li',
  'graph-toolbar-left li',
  'left-collapse-btn',
  'right-collapse-btn',
  'mq-editable-field',
  'froala-wrapper .fr-command',
]

const copyDomOnHoverOfElements = ['parcc-question-list', 'ant-dropdown-trigger']

const copyDomOnBlurOfElements = ['ant-input']

const copyDomOnScrollOfElements = ['froala-wrapper .fr-wrapper']

const normalizeTouchEvent = (e) => {
  Object.defineProperties(e, {
    pageX: {
      writable: true,
    },
    pageY: {
      writable: true,
    },
    clientX: {
      writable: true,
    },
    clientY: {
      writable: true,
    },
  })
  if (e?.targetTouches) {
    e.pageX = e.targetTouches[0].pageX
    e.pageY = e.targetTouches[0].pageY
    e.clientX = e.targetTouches[0].clientX
    e.clientY = e.targetTouches[0].clientY
  }
}

const Magnifier = ({
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

  const handleScroll = (e) => {
    if (enable) {
      document
        .getElementsByClassName('test-item-col')[1]
        ?.scrollTo(0, e.target.scrollTop)
    }
  }

  const onMouseMove = (e) => {
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

  const handleSidebarScroll = (e) =>
    document
      .getElementsByClassName('scrollbar-container')[1]
      ?.scrollTo(0, e.target.scrollTop)

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

  const scrollQuestionLIst = (e) =>
    document
      .querySelector(
        '.zoomed-container-wrapper .question-select-dropdown .ant-select-dropdown-menu'
      )
      ?.scrollTo(0, e.target.scrollTop)

  const scrollParccReviewList = (e) =>
    document
      .querySelector('.zoomed-container-wrapper .parcc-question-list .ant-menu')
      ?.scrollTo(0, e.target.scrollTop)

  const scrollSabcQuestionList = (e) =>
    document
      .querySelector(
        '.zoomed-container-wrapper .sabc-header-question-list .ant-dropdown-menu'
      )
      ?.scrollTo(0, e.target.scrollTop)

  const scrollElement = (className, index) => {
    const cls = className
    const i = index
    return (e) => {
      const elms = document.querySelectorAll(
        `.zoomed-container-wrapper .${cls}`
      )
      elms[i]?.scrollTo(0, e.target.scrollTop)
    }
  }

  /*
    TODO: Refactor copyDom mutations to remove duplication from src/client/assessment/themes/AssessmentPlayerTestlet/PlayerContent.js
  */
  const cloneDom = (className) => {
    // THis work to clone main container to zoomed container on any specific event happened.
    const cls = className
    return () => {
      clickedClassName.current = cls
      const mainWrapper = document.querySelector('.zoomed-container-wrapper')
      if (mainWrapper) {
        // copy after some time as to wait to fully render main container
        setTimeout(() => {
          mainWrapper.innerHTML =
            document.querySelector('.unzoom-container-wrapper')?.innerHTML ||
            '---'
          if (className === 'question-select-dropdown') {
            const headerQuestionWrapper = document.querySelector(
              '.unzoom-container-wrapper .question-select-dropdown .ant-select-dropdown-menu'
            )
            headerQuestionWrapper?.addEventListener(
              'scroll',
              scrollQuestionLIst
            )
            // scroll after copy dom
            setTimeout(
              () =>
                scrollQuestionLIst({
                  target: document.querySelector(
                    '.unzoom-container-wrapper .question-select-dropdown .ant-select-dropdown-menu'
                  ),
                }),
              100
            )
          } else if (className === 'parcc-question-list') {
            const headerParccQUestionList = document.querySelector(
              '.unzoom-container-wrapper .parcc-question-list .ant-menu'
            )
            headerParccQUestionList?.addEventListener(
              'scroll',
              scrollParccReviewList
            )
            // scroll after copy dom
            setTimeout(
              () =>
                scrollParccReviewList({
                  target: document.querySelector(
                    '.unzoom-container-wrapper .parcc-question-list .ant-menu'
                  ),
                }),
              100
            )
          } else if (className === 'ant-dropdown-trigger') {
            const headerParccQUestionList = document.querySelector(
              '.unzoom-container-wrapper .sabc-header-question-list .ant-dropdown-menu'
            )
            headerParccQUestionList?.addEventListener(
              'scroll',
              scrollSabcQuestionList
            )
            // scroll after copy dom
            setTimeout(
              () =>
                scrollSabcQuestionList({
                  target: document.querySelector(
                    '.unzoom-container-wrapper .sabc-header-question-list .ant-dropdown-menu'
                  ),
                }),
              100
            )
          }
        }, 1000)
      }
    }
  }

  const removeAttachedEvents = () => {
    copyDomOnClickOfElements.forEach((className) => {
      const elms = document.querySelectorAll(
        `.unzoom-container-wrapper .${className}`
      )
      elms.forEach((elm) => {
        if (elm) {
          elm.removeEventListener('click', cloneDom(className))
        }
      })
    })

    copyDomOnHoverOfElements.forEach((className) => {
      const elms = document.querySelectorAll(
        `.unzoom-container-wrapper .${className}`
      )
      elms.forEach((elm) => {
        if (elm) {
          elm.removeEventListener('mouseenter', cloneDom(className))
          elm.removeEventListener('mouseleave', cloneDom(className))
        }
      })
    })
    copyDomOnBlurOfElements.forEach((className) => {
      const elms = document.querySelectorAll(
        `.unzoom-container-wrapper .${className}`
      )
      elms.forEach((elm) => {
        if (elm) {
          elm.removeEventListener('blur', cloneDom(className))
        }
      })
    })

    copyDomOnScrollOfElements.forEach((className, i) => {
      const elms = document.querySelectorAll(
        `.unzoom-container-wrapper .${className}`
      )
      elms.forEach((elm) => {
        if (elm) {
          elm.removeEventListener('scroll', scrollElement(className, i))
        }
      })
    })
  }

  const attachEvents = () => {
    copyDomOnClickOfElements.forEach((className) => {
      const elms = document.querySelectorAll(
        `.unzoom-container-wrapper .${className}`
      )
      elms.forEach((elm) => {
        if (elm) {
          elm.addEventListener('click', cloneDom(className))
        }
      })
    })
    copyDomOnHoverOfElements.forEach((className) => {
      const elms = document.querySelectorAll(
        `.unzoom-container-wrapper .${className}`
      )
      elms.forEach((elm) => {
        if (elm) {
          elm.addEventListener('mouseenter', cloneDom(className))
          elm.addEventListener('mouseleave', cloneDom(className))
        }
      })
    })
    copyDomOnBlurOfElements.forEach((className) => {
      const elms = document.querySelectorAll(
        `.unzoom-container-wrapper .${className}`
      )
      elms.forEach((elm) => {
        if (elm) {
          elm.addEventListener('blur', cloneDom(className))
        }
      })
    })

    copyDomOnScrollOfElements.forEach((className, i) => {
      const elms = document.querySelectorAll(
        `.unzoom-container-wrapper .${className}`
      )
      elms.forEach((elm) => {
        if (elm) {
          elm.addEventListener('scroll', scrollElement(className, i))
        }
      })
    })
  }

  useEffect(() => {
    if (setting.dragging) {
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('touchmove', onMouseMove, { passive: false })
      document.addEventListener('mouseup', onMouseUp)
      handleSidebarScroll({
        target: document.getElementsByClassName('scrollbar-container')[0],
      })
      handleScroll({
        target: document.getElementsByClassName('test-item-col')[0],
      })
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
    const container = document.getElementsByClassName('test-item-col')[0]
    container?.addEventListener('scroll', handleScroll)
    const sideBar = document.getElementsByClassName('scrollbar-container')[0]
    sideBar?.addEventListener('scroll', handleSidebarScroll)
    document.addEventListener('click', hideElements)

    // This is to attach events to dom elements after some moment
    setTimeout(attachEvents, 1000)

    return () => {
      container?.removeEventListener('scroll', handleScroll)
      sideBar?.removeEventListener('scroll', handleSidebarScroll)
      document.removeEventListener('click', hideElements)

      // This is to deattach events to dom elements after some moment
      removeAttachedEvents()
    }
  }, [])

  useEffect(() => {
    if (enable) {
      const unZoomed = document.getElementsByClassName('test-item-col')[0]
      const zoomWrapper = document.querySelector('.zoomed-container-wrapper')

      if (unzoomRef.current && zoomWrapper && !ZoomedContent) {
        setTimeout(() => {
          zoomWrapper.textContent = ''
          unzoomRef.current.childNodes.forEach((node) => {
            zoomWrapper.appendChild(node.cloneNode(true))
          })
        }, 10)
      }

      if (unZoomed) {
        handleScroll({
          target: unZoomed,
        })
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

Magnifier.defaultProps = {
  enable: false,
  config: {
    width: 182,
    height: 182,
    scale: 2,
  },
  offset: {
    top: 0,
    left: 0,
  },
}

Magnifier.propTypes = {
  children: PropTypes.node.isRequired,
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  enable: PropTypes.bool,
  offset: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
  }),
  config: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    scale: PropTypes.number.isRequired,
  }),
}

const enhance = compose(
  withWindowSizes,
  connect((state) => ({
    contentChanged: state.testPlayer.contentChanged,
  }))
)

export default enhance(Magnifier)

const ZoomedWrapper = styled.div.attrs(({ pos }) => ({
  style: {
    left: pos.x,
    top: pos.y,
  },
}))`
  border: 1px solid ${magnifierBorderColor};
  width: ${({ magnifierWidth }) => magnifierWidth}px;
  height: ${({ magnifierHeight }) => magnifierHeight}px;
  border-radius: 5px;
  position: fixed;
  overflow: hidden;
  z-index: 1050;
  cursor: move;
  background: white;

  main {
    .test-item-preview {
      overflow: auto !important;
      .classification-preview {
        * {
          overflow: visible !important;
        }
      }
    }
  }
`

const ZoomedContentWrapper = styled.div.attrs(({ scale, pos, left, top }) => ({
  style: {
    left: -(scale * pos.x) - left,
    top: -(scale * pos.y) - top,
  },
}))`
  overflow: visible;
  position: absolute;
  display: block;
  transform: ${({ scale }) => `scale(${scale})`};
  width: ${({ windowWidth }) => windowWidth}px;
  height: ${({ windowHeight }) => windowHeight}px;
  transform-origin: left top;
  user-select: none;
  margin-left: ${({ width, scale }) => `-${width / scale}px`};
`

const MagnifierOverlay = styled.div`
  position: absolute;
  z-index: 1500;
  width: ${({ magnifierWidth }) => magnifierWidth}px;
  height: ${({ magnifierHeight }) => magnifierHeight}px;
`

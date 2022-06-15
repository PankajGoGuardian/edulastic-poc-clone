import { useRef } from 'react'
import {
  copyDomOnClickOfElements,
  copyDomOnHoverOfElements,
  copyDomOnBlurOfElements,
  copyDomOnScrollOfElements,
} from './constants'

export const useMagnifierEvents = () => {
  const clickedClassName = useRef()

  const scrollParccReviewList = (e) =>
    document
      .querySelector('.zoomed-container-wrapper .parcc-question-list .ant-menu')
      ?.scrollTo(0, e.target.scrollTop)

  const scrollQuestionLIst = (e) =>
    document
      .querySelector(
        '.zoomed-container-wrapper .question-select-dropdown .ant-select-dropdown-menu'
      )
      ?.scrollTo(0, e.target.scrollTop)

  const scrollSabcQuestionList = (e) =>
    document
      .querySelector(
        '.zoomed-container-wrapper .sabc-header-question-list .ant-dropdown-menu'
      )
      ?.scrollTo(0, e.target.scrollTop)

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

  const removeEvents = () => {
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

  return [attachEvents, removeEvents]
}

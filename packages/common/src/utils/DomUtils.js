export function offset(el, scrollElement) {
  if (!el) {
    return
  }
  if (!scrollElement) {
    scrollElement = window
  }
  const rect = el.getBoundingClientRect()
  let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop
  if (scrollElement && scrollElement != window) {
    scrollTop = scrollElement.scrollTop
    scrollLeft = scrollElement.scrollLeft
  }
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
    height: rect.height,
    width: rect.height,
  }
}

const isSmoothScrollSupported =
  'scrollBehavior' in document.documentElement.style

/**
 * @param {Element} el
 */
export function scrollTo(el, subtractScroll = 0, scrollEl) {
  if (!scrollEl) {
    scrollEl = window
  }
  const { top = 0 } = offset(el, scrollEl) || {}
  if (isSmoothScrollSupported) {
    // behavior:auto|smooth|initial|inherit
    scrollEl.scrollTo({ top: top - subtractScroll, left: 0, behavior: 'auto' })
  } else {
    scrollEl.scrollTo(0, top - subtractScroll)
  }
}

export const isDOMElement = (element) => {
  return typeof element.type === 'string'
}

export const injectIdToElementForAccessibility = (inputId) => {
  if (window.$) {
    const jq = window.$
    const dataId = jq(`div[data-id='${inputId}']`).attr('data-id')
    if (dataId) {
      jq(`div[data-id='${inputId}']`).attr('id', dataId)
      jq(`div[data-id='${inputId}']`).removeAttr('data-id')
    }
  }
}

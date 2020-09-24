export function offset(el,scrollElement) {
  if (!el) {
    return;
  }
  const rect = el.getBoundingClientRect();
  let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if(scrollElement != window){
    scrollTop = scrollElement.scrollTop;
    scrollLeft = scrollElement.scrollLeft;
  }
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft, height: rect.height, width: rect.height };
}

const isSmoothScrollSupported = "scrollBehavior" in document.documentElement.style;

/**
 * @param {Element} el
 */
export function scrollTo(el, subtractScroll = 0,scrollEl) {
  if(!scrollEl){
    scrollEl = window;
  }
  const { top = 0 } = offset(el,scrollEl) || {};
  if (isSmoothScrollSupported) {
    // behavior:auto|smooth|initial|inherit
    console.log('top',top);
    scrollEl.scrollTo({ top: top - subtractScroll, left: 0, behavior: "auto" });
  } else {
    scrollEl.scrollTo(0, top - subtractScroll);
  }
}

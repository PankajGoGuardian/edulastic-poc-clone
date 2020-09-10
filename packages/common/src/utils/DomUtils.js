export function offset(el) {
  if (!el) {
    return;
  }
  const rect = el.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft, height: rect.height, width: rect.height };
}

const isSmoothScrollSupported = "scrollBehavior" in document.documentElement.style;

/**
 * @param {Element} el
 */
export function scrollTo(el, subtractScroll = 0) {
  const { top = 0 } = offset(el) || {};
  if (isSmoothScrollSupported) {
    // behavior:auto|smooth|initial|inherit
    window.scrollTo({ top: top - subtractScroll, left: 0, behavior: "auto" });
  } else {
    window.scrollTo(0, top - subtractScroll);
  }
}

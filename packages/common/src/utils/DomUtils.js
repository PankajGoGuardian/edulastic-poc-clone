export function offset(el) {
  if (!el) {
    return;
  }
  const rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

const isSmoothScrollSupported = "scrollBehavior" in document.documentElement.style;

/**
 * @param {Element} el
 */
export function scrollTo(el) {
  const { top } = offset(el);
  if (isSmoothScrollSupported) {
    window.scrollTo({ top, left: 0, behavior: "smooth" });
  } else {
    window.scrollTo(0, top);
  }
}

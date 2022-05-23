export const normalizeTouchEvent = (e) => {
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

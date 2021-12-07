const isBrowser =
  typeof window !== 'undefined' && typeof window.document !== 'undefined'

const isNode =
  typeof process !== 'undefined' &&
  process.versions != null &&
  process.versions.node != null

const isDebugTool =
  typeof process === 'object' && typeof process['sendToConsole'] === 'function'

export function imShow(canvas, data, cv) {
  if (isBrowser) {
    cv.imShow(canvas, data)
  }
}

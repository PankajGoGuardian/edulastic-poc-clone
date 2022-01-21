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
    cv.imshow(canvas, data)
  }
}

export function sendInstructions(instructions) {
  if (process['sendInstructions']) {
    process['sendInstructions'](instructions)
  } else if (isBrowser) {
    const event = new CustomEvent('instructions', { detail: instructions })
    window.dispatchEvent(event)
  }
}

const bPrefixes = ['Moz', 'Webkit', 'O', 'ms']

function kebabToTitleCase(str) {
  let out = ''
  let shouldCapitalize = true
  for (let i = 0; i < str.length; i++) {
    if (shouldCapitalize) {
      out += str[i].toUpperCase()
      shouldCapitalize = false
    } else if (str[i] === '-') {
      shouldCapitalize = true
    } else {
      out += str[i]
    }
  }
  return out
}

export function browserPrefixToKey(prop, prefix) {
  return prefix ? `${prefix}${kebabToTitleCase(prop)}` : prop
}

export function getPrefix(prop) {
  // Checking specifically for 'window.document' is for pseudo-browser server-side
  // environments that define 'window' as the global context.
  // E.g. React-rails (see https://github.com/reactjs/react-rails/pull/84)
  if (typeof window === 'undefined' || typeof window.document === 'undefined')
    return ''

  const style = window.document.documentElement.style

  if (prop in style) return ''

  for (let i = 0; i < bPrefixes.length; i++) {
    if (browserPrefixToKey(prop, bPrefixes[i]) in style) return bPrefixes[i]
  }

  return ''
}
const browserPrefix = getPrefix()

export function offsetXYFromParent(evt, offsetParent) {
  const isBody = offsetParent === offsetParent.ownerDocument.body
  const offsetParentRect = isBody
    ? { left: 0, top: 0 }
    : offsetParent.getBoundingClientRect()

  const x = evt.clientX + offsetParent.scrollLeft - offsetParentRect.left
  const y = evt.clientY + offsetParent.scrollTop - offsetParentRect.top

  return { x, y }
}

export function findInArray(array, callback) {
  for (let i = 0, length = array.length; i < length; i++) {
    if (callback.apply(callback, [array[i], i, array])) return array[i]
  }
}

export function getTouchIdentifier(e) {
  if (e.targetTouches && e.targetTouches[0])
    return e.targetTouches[0].identifier
  if (e.changedTouches && e.changedTouches[0])
    return e.changedTouches[0].identifier
}

export function getTouch(e, identifier) {
  return (
    (e.targetTouches &&
      findInArray(e.targetTouches, (t) => identifier === t.identifier)) ||
    (e.changedTouches &&
      findInArray(e.changedTouches, (t) => identifier === t.identifier))
  )
}

export function findDOMNode(draggable) {
  const node = draggable.findDOMNode()
  if (!node) {
    console.log('Draggable: Unmounted during event!')
  }
  return node
}

export function getControlPosition(e, touchIdentifier, draggableCore) {
  const touchObj =
    typeof touchIdentifier === 'number' ? getTouch(e, touchIdentifier) : null
  if (typeof touchIdentifier === 'number' && !touchObj) return null // not the right touch
  const node = findDOMNode(draggableCore)

  if (!node) {
    return null
  }

  const offsetParent =
    draggableCore.props.offsetParent ||
    node.offsetParent ||
    node.ownerDocument.body
  return offsetXYFromParent(touchObj || e, offsetParent)
}

export function getBoundPosition(e, touchIdentifier, draggableCore) {
  const touchObj =
    typeof touchIdentifier === 'number' ? getTouch(e, touchIdentifier) : null
  if (typeof touchIdentifier === 'number' && !touchObj) return null // not the right touch
  const node = findDOMNode(draggableCore)
  return offsetXYFromParent(touchObj || e, node)
}

export function getTranslation({ x, y }, positionOffset, unitSuffix) {
  let translation = `translate(${x}${unitSuffix},${y}${unitSuffix})`
  if (positionOffset) {
    const defaultX = `${
      typeof positionOffset.x === 'string'
        ? positionOffset.x
        : positionOffset.x + unitSuffix
    }`
    const defaultY = `${
      typeof positionOffset.y === 'string'
        ? positionOffset.y
        : positionOffset.y + unitSuffix
    }`
    translation = `translate(${defaultX}, ${defaultY})${translation}`
  }
  return translation
}

export function createCSSTransform(controlPos, positionOffset) {
  const translation = getTranslation(controlPos, positionOffset, 'px')
  return {
    key: browserPrefixToKey('transform', browserPrefix),
    value: translation,
  }
}

import { groupBy, difference, isEmpty } from 'lodash'
import questionType from '@edulastic/constants/const/questionType'
import * as Sentry from '@sentry/browser'

import { FRACTION_FORMATS } from '../constants/constantsForQuestions'

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

export const getFontSize = (fontSize, withRem = true) => {
  switch (fontSize) {
    case 'small':
      return withRem ? '0.6875rem' : '11px'
    case 'normal':
      return withRem
        ? window.innerWidth < 1366
          ? '0.8125rem'
          : '0.875rem'
        : '16px'
    case 'large':
      return withRem ? '1.0625rem' : '17px' // 16PX = 1REM (BASE)
    case 'xlarge':
      return withRem ? '1.25rem' : '20px'
    case 'xxlarge':
      return withRem ? '1.5rem' : '24px'
    default:
      return window.innerWidth < 1366 ? '16px' : withRem ? '1rem' : '16px'
  }
}

export const getStylesFromUiStyleToCssStyle = (uiStyle) => {
  const cssStyles = {}
  Object.keys(uiStyle || {}).forEach((item) => {
    const value = uiStyle[item]
    switch (item) {
      case 'fontsize':
        cssStyles.fontSize = getFontSize(value, true)
        break
      case 'minWidth':
        cssStyles.minWidth = `${value}px`
        break
      case 'minHeight':
        cssStyles.minHeight = `${value}px`
        break
      case 'widthpx':
        cssStyles.width = `${value}px`
        break
      case 'heightpx':
        cssStyles.height = `${value}px`
        break
      case 'transparentBackground':
        if (value) cssStyles.background = 'transparent'
        break
      case 'responseFontScale':
        if (value === 'boosted') {
          if (uiStyle.fontsize) {
            const fontSize = getFontSize(uiStyle.fontsize, true)
            if (fontSize.includes('rem')) {
              cssStyles.fontScale = `${parseFloat(fontSize) * 1.5}rem`
            } else {
              cssStyles.fontScale = `${parseFloat(fontSize) * 1.5}px`
            }
            cssStyles.fontWeight = 600
          } else {
            cssStyles.fontScale = '1.5rem'
            cssStyles.fontWeight = 600
          }
        }
        break
      default:
        break
    }
  })
  if (cssStyles.fontScale) {
    cssStyles.fontSize = cssStyles.fontScale
    delete cssStyles.fontScale
  }
  return cssStyles
}

export const fromStringToNumberPx = (value) =>
  typeof value === 'string' ? +value.slice(0, -2) : value
export const topAndLeftRatio = (
  styleNumber,
  imagescale,
  fontsize,
  smallSize
) => {
  const getValueWithRatio = (newRatio) =>
    smallSize ? styleNumber / 2 : styleNumber * newRatio

  if (!imagescale) {
    return getValueWithRatio(1)
  }

  switch (fontsize) {
    case 'large':
      return getValueWithRatio(1.2)
    case 'xlarge':
      return getValueWithRatio(1.5)
    case 'xxlarge':
      return getValueWithRatio(1.7)
    case 'small':
      return getValueWithRatio(0.8)
    default:
      return getValueWithRatio(1)
  }
}

export const calculateRatio = (imagescale, fontsize, imageWidth) => {
  if (!imagescale) {
    return imageWidth * 1
  }

  switch (fontsize) {
    case 'large':
      return imageWidth * 1.2
    case 'xlarge':
      return imageWidth * 1.5
    case 'xxlarge':
      return imageWidth * 1.7
    case 'small':
      return imageWidth * 0.8
    default:
      return imageWidth * 1
  }
}

export const preventEvent = (e) => {
  e.preventDefault()
}

export const getInputSelection = (el) => {
  let start = 0

  let end = 0

  let normalizedValue

  let range

  let textInputRange

  let len

  let endRange

  if (
    typeof el.selectionStart === 'number' &&
    typeof el.selectionEnd === 'number'
  ) {
    start = el.selectionStart
    end = el.selectionEnd
  } else {
    range = document.selection.createRange()

    if (range && range.parentElement() === el) {
      len = el.value.length
      normalizedValue = el.value.replace(/\r\n/g, '\n')

      // Create a working TextRange that lives only in the input
      textInputRange = el.createTextRange()
      textInputRange.moveToBookmark(range.getBookmark())

      // Check if the start and end of the selection are at the very end
      // of the input, since moveStart/moveEnd doesn't return what we want
      // in those cases
      endRange = el.createTextRange()
      endRange.collapse(false)

      if (textInputRange.compareEndPoints('StartToEnd', endRange) > -1) {
        // eslint-disable-next-line no-multi-assign
        start = end = len
      } else {
        start = -textInputRange.moveStart('character', -len)
        start += normalizedValue.slice(0, start).split('\n').length - 1

        if (textInputRange.compareEndPoints('EndToEnd', endRange) > -1) {
          end = len
        } else {
          end = -textInputRange.moveEnd('character', -len)
          end += normalizedValue.slice(0, end).split('\n').length - 1
        }
      }
    }
  }

  return {
    start,
    end,
  }
}

/**
 * Convert UI alignment row standards to Mongo alignment domains
 *
 * @param {Array} alignmentRowStandards - alignment row standards from UI
 * @returns {Array} - alignment domains for Mongo
 */
export const alignmentStandardsFromUIToMongo = (alignmentRowStandards) => {
  if (!alignmentRowStandards || alignmentRowStandards.length === 0) return []
  const grouped = groupBy(alignmentRowStandards, 'tloId')
  const domainIds = Object.keys(grouped)
  return domainIds.map((id) => {
    const allStandards = grouped[id]
    const standards = allStandards.map(
      ({ _id, curriculumId, identifier, grades, description, level }) => ({
        id: _id,
        curriculumId,
        name: identifier,
        grades,
        description,
        level,
      })
    )

    return {
      name: allStandards[0].tloIdentifier,
      id: allStandards[0].tloId,
      description: allStandards[0].tloDescription,
      standards,
    }
  })
}

/**
 * Convert Mongo alignment domains to UI alignment row standards
 *
 * @param {Array} alignmentDomains - alignment domains from Mongo
 * @returns {Object} - alignment row standards and grades for UI
 */
export const alignmentStandardsFromMongoToUI = (alignmentDomains) => {
  const alignmentRowStandards = []
  const grades = []
  alignmentDomains.forEach((alignmentDomain) => {
    alignmentDomain.standards.forEach((standard) => {
      const standardGrades = standard.grades.filter(
        (grade) => grades.indexOf(grade) === -1
      )
      grades.push(...standardGrades)
      alignmentRowStandards.push({
        description: standard.description,
        grades: standard.grades,
        identifier: standard.name,
        level: standard.level,
        tloDescription: alignmentDomain.name,
        tloId: alignmentDomain.id,
        _id: standard.id,
        curriculumId: standard.curriculumId,
      })
    })
  })
  return { standards: alignmentRowStandards, grades }
}

export const getSpellCheckAttributes = (isSpellCheck = false) => ({
  spellCheck: isSpellCheck,
  autoComplete: isSpellCheck,
  autoCorrect: isSpellCheck,
  autoCapitalize: isSpellCheck,
})

/* align with getJustification
 * @param {string} pos
 */
export const getDirection = (pos) => {
  switch (pos) {
    case 'bottom':
      return 'column'
    case 'top':
      return 'column-reverse'
    case 'right':
      return 'row'
    case 'left':
      return 'row-reverse'
    default:
      return 'column'
  }
}

/**
 * justify-content value depends on direction
 * @param {string} pos
 */
export const getJustification = (pos) => {
  switch (pos) {
    case 'right':
      return 'flex-start'
    case 'left':
      return 'flex-end'
    default:
      return 'flex-start'
  }
}

/**
 * User is able to enter  only variables used in 'RESTRICT VARIABLES USED TO'
 */

export const mathValidateVariables = (val, options) => {
  if (
    !options ||
    (!options.allowedVariables && !options.allowNumericOnly) ||
    !val
  )
    return val

  const { allowNumericOnly, allowedVariables } = options
  let newVal = val

  if (allowNumericOnly) {
    newVal = newVal.replace(/\b([a-zA-Z]+)\b/gm, '')
    return newVal
  }

  if (!allowedVariables) return newVal

  const validVars = allowedVariables.split(',').map((segment) => segment.trim())
  if (validVars.length === 0) return newVal

  const foundVars = []
  const varReg = /\b([a-zA-Z]+)\b/gm
  let m
  do {
    m = varReg.exec(newVal)
    if (m) {
      foundVars.push({ str: m[0], segments: m[0].split('') })
    }
  } while (m)

  for (const variable of foundVars) {
    const varsToExclude = difference(variable.segments, validVars)
    if (!isEmpty(varsToExclude)) {
      let newStr = variable.str
      for (const varToexclude of varsToExclude) {
        const excludeReg = new RegExp(`${varToexclude}`, 'gm')
        newStr = newStr.replace(excludeReg, '')
      }

      const excludeReg = new RegExp(`\\b${variable.str}\\b`, 'gm')
      newVal = newVal.replace(excludeReg, newStr)
    }
  }

  return newVal
}

export const getStemNumeration = (stemNumeration, index) => {
  let indexStr = index + 1
  switch (stemNumeration) {
    case 'lowercase': {
      indexStr = ALPHABET[index]
      break
    }
    case 'uppercase': {
      indexStr = ALPHABET[index]?.toUpperCase()
      break
    }
    case 'numerical': {
      indexStr = index + 1
      break
    }
    default:
  }
  return indexStr
}

export const convertNumberToFraction = (value, fractionFormat) => {
  const result = {
    main: null,
    sup: null,
    sub: null,
  }

  const strValue = value.toString()
  const numValue = parseFloat(strValue)
  const indexOfDot = strValue.indexOf('.')
  if (
    Number.isNaN(numValue) ||
    numValue.toString().length !== strValue.length ||
    indexOfDot === -1
  ) {
    result.main = value
    return result
  }

  const countDecimals = strValue.length - indexOfDot - 1
  let sub = +`1${Array.from({ length: countDecimals }, () => 0).join('')}`

  if (fractionFormat === FRACTION_FORMATS.fraction) {
    let sup = value * sub
    while (sup % 5 === 0 && sub % 5 === 0) {
      sup /= 5
      sub /= 5
    }
    while (sup % 2 === 0 && sub % 2 === 0) {
      sup /= 2
      sub /= 2
    }
    result.sub = +sub.toFixed(0)
    result.sup = +sup.toFixed(0)
    return result
  }

  if (fractionFormat === FRACTION_FORMATS.mixedFraction) {
    const main = Math.trunc(value)
    let sup = Math.abs((value * sub) % sub)
    while (sup % 5 === 0 && sub % 5 === 0) {
      sup /= 5
      sub /= 5
    }
    while (sup % 2 === 0 && sub % 2 === 0) {
      sup /= 2
      sub /= 2
    }
    if (main !== 0) {
      result.main = main
    }
    result.sub = +sub.toFixed(0)
    result.sup = +sup.toFixed(0)
    return result
  }

  result.main = value
  return result
}

export const fractionStringToNumber = (fString) => {
  const str = fString.toString().trim().replace(/\s+/g, ' ')
  if (str.indexOf('/') === -1) {
    return parseFloat(fString)
  }

  let split = str.split('/')
  let lastIndex = split.length - 1
  split = [split[lastIndex - 1].trim(), split[lastIndex].trim()]
  const sub = parseFloat(split[1])

  if (Number.isNaN(sub) || sub <= 0) {
    return NaN
  }

  if (split[0].indexOf(' ') === -1) {
    const sup = parseFloat(split[0])
    return sup / sub
  }

  split = split[0].split(' ')
  lastIndex = split.length - 1
  split = [split[lastIndex - 1].trim(), split[lastIndex].trim()]

  const main = parseFloat(split[0])
  const sup = parseFloat(split[1])

  return +(main + sup / sub).toFixed(8)
}

export const createStandardTextStyle = (props) => {
  const fontSize =
    props?.fontSize || `${props?.theme?.common?.standardFont || '14px'}`

  return `
      font-size: ${fontSize};
  `
}

export const normalizeTouchEvent = (e) => {
  e.preventDefault()
  e.stopPropagation()
  if (e?.nativeEvent?.changedTouches?.length) {
    e.clientX = e.nativeEvent.changedTouches[0].clientX
    e.clientY = e.nativeEvent.changedTouches[0].clientY
  }
}

export function isiOS() {
  return (
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document) ||
    (!window.MSStream && /iPad|iPhone|iPod/.test(navigator.userAgent))
  )
}

/**
 * shows the “Remember to hide the scratchpad to answer other parts of this question”
 * message in case the item is multipart, whenever we click on show scratchpad
 * @param {object} item the current item displayed in the player
 * @returns flag whether to show the message or not
 */
export function showScratchpadInfoNotification(item) {
  if (!item) {
    return false
  }

  const { multipartItem: isMultipart = false, data: { questions } = {} } =
    item || {}

  if (isMultipart && Array.isArray(questions)) {
    const isHighlightImageType = (ques) =>
      ques.type === questionType.HIGHLIGHT_IMAGE
    const allHighLight =
      questions.length > 0 && questions.every(isHighlightImageType)
    if (!allHighLight) {
      return true
    }
  }
  return false
}

const key = {
  fullscreenEnabled: 0,
  fullscreenElement: 1,
  requestFullscreen: 2,
  exitFullscreen: 3,
  fullscreenchange: 4,
  fullscreenerror: 5,
  fullscreen: 6,
}

const webkit = [
  'webkitFullscreenEnabled',
  'webkitFullscreenElement',
  'webkitRequestFullscreen',
  'webkitExitFullscreen',
  'webkitfullscreenchange',
  'webkitfullscreenerror',
  '-webkit-full-screen',
]

const moz = [
  'mozFullScreenEnabled',
  'mozFullScreenElement',
  'mozRequestFullScreen',
  'mozCancelFullScreen',
  'mozfullscreenchange',
  'mozfullscreenerror',
  '-moz-full-screen',
]

const ms = [
  'msFullscreenEnabled',
  'msFullscreenElement',
  'msRequestFullscreen',
  'msExitFullscreen',
  'MSFullscreenChange',
  'MSFullscreenError',
  '-ms-fullscreen',
]

const vendor =
  ('fullscreenEnabled' in document && Object.keys(key)) ||
  (webkit[0] in document && webkit) ||
  (moz[0] in document && moz) ||
  (ms[0] in document && ms) ||
  []

export const Fscreen = {
  requestFullscreen: (element) => {
    try {
      const returnValue = element[vendor[key.requestFullscreen]]()
      if (returnValue?.then) {
        returnValue?.catch((_e) => {
          console.warn('fullscreen error', _e)
          Sentry.captureMessage('fullScreenIssue', 'debug')
        })
      }
    } catch (e) {
      console.warn('fullscreen error')
      Sentry.captureException(e)
    }
  },
  requestFullscreenFunction: (element) =>
    element[vendor[key.requestFullscreen]],
  get exitFullscreen() {
    try {
      return document[vendor[key.exitFullscreen]].bind(document)
    } catch (e) {
      // fullscreen api not supported in this device
      // so, returning noop function
      return () => {}
    }
  },
  safeExitfullScreen: () => {
    try {
      const returnVal = Fscreen.exitFullscreen()
      if (returnVal?.catch) {
        returnVal.catch((e) => {
          console.warn('fullscreen exit error', e)
        })
      }
    } catch (err) {
      console.warn('fullscreen exit error', err)
    }
  },
  get fullscreenPseudoClass() {
    return `:${vendor[key.fullscreen]}`
  },
  addEventListener: (type, handler, options) =>
    document.addEventListener(vendor[key[type]], handler, options),
  removeEventListener: (type, handler, options) =>
    document.removeEventListener(vendor[key[type]], handler, options),
  get fullscreenEnabled() {
    return Boolean(document[vendor[key.fullscreenEnabled]])
  },
  // eslint-disable-next-line no-empty-function
  set fullscreenEnabled(val) {},
  get fullscreenElement() {
    return document[vendor[key.fullscreenElement]]
  },
  // eslint-disable-next-line no-empty-function
  set fullscreenElement(val) {},
  get onfullscreenchange() {
    return document[`on${vendor[key.fullscreenchange]}`.toLowerCase()]
  },
  set onfullscreenchange(handler) {
    // eslint-disable-next-line no-return-assign
    return (document[
      `on${vendor[key.fullscreenchange]}`.toLowerCase()
    ] = handler)
  },
  get onfullscreenerror() {
    return document[`on${vendor[key.fullscreenerror]}`.toLowerCase()]
  },
  set onfullscreenerror(handler) {
    // eslint-disable-next-line no-return-assign
    return (document[
      `on${vendor[key.fullscreenerror]}`.toLowerCase()
    ] = handler)
  },
}

export const isTouchDevice = () => {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  )
}

export const getUserMedia = (constraints) =>
  navigator.mediaDevices.getUserMedia({ ...constraints })

export const getItemIdQuestionIdKey = ({ itemId, questionId }) => {
  return `${itemId}_${questionId}`
}

export const hasUnsavedAiItems = (itemGroups = []) =>
  itemGroups.some(({ items }) => items.some(({ unsavedItem }) => unsavedItem))

export const handlePreventKeyDown = (e) => {
  const keyCode = window.event ? e.which : e.keyCode
  // check ctrl + d and command + d key
  if (
    (window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) &&
    keyCode == 68
  ) {
    e?.preventDefault()
    return false
  }
}

export const isImmersiveReaderEnabled = (
  showImmersiveReader,
  accommodations
) => {
  /* Considering accommodation.ir only when Immersive Reader in test setting is not set 
    otherwise Immersive Reader of test setting will override student acommodations */
  if (showImmersiveReader === undefined) {
    return accommodations?.ir === 'yes'
  }
  return showImmersiveReader
}

export const isSpeechToTextEnabled = (showSpeechToText, accommodations) => {
  if (showSpeechToText === undefined) {
    return accommodations?.stt === 'yes'
  }
  return showSpeechToText
}

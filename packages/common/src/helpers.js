/* eslint-disable */
import { get, round, isNaN, isString, omit, isEqual } from 'lodash'
import { notification } from '@edulastic/common'
import * as Sentry from '@sentry/browser'
import { fileApi, onerosterApi } from '@edulastic/api'
import { aws, question } from '@edulastic/constants'
import { useLayoutEffect } from 'react'
import { replaceLatexesWithMathHtml } from './utils/mathUtils'
import AppConfig from '../../../src/app-config'

export function useLayoutEffectDebounced(func, values, time) {
  useLayoutEffect(() => {
    let db = setTimeout(() => {
      func()
    }, time)

    return () => clearTimeout(db)
  }, values)
}

export const isSEB = () => window.navigator.userAgent.includes('SEB')

export function handleChromeOsSEB(e) {
  const isChromeOs = /(CrOS)/.test(window.navigator.userAgent)
  if (isChromeOs) {
    if (e) {
      e.preventDefault()
    }
    notification({
      msg: `This Assignment has been assigned with Safe Exam Browser which is not supported on this device. Please contact your instructor to update the settings for the assignment or use a compatible device(Mac/iPad/Windows).`,
      duration: 7,
    })
  }
  return isChromeOs
}

export const ALPHABET = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
]

export const BLOCK_LEVEL_TAGS = [
  'TABLE',
  'TR',
  'TD',
  'UL',
  'LI',
  'OL',
  'DIV',
  'ADDRESS',
  'FIELDSET',
  'FIGCAPTION',
  'FORM',
  'DIALOG',
  'HR',
  'DT ',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'ARTICLE',
  'MAIN',
  'ASIDE',
  'FIGURE',
  'NAV',
  'BLOCKQUOTE',
  'DETAILS',
  'PRE',
  'DL',
  'HEADER',
  'SECTION',
  'HGROUP',
]

const REGEXP = /[xy]/g
const PATTERN = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'

/**
 * Generate a univierally unique identifier
 *
 * @return {String}
 */
const uuid = () =>
  PATTERN.replace(REGEXP, (c) => {
    let r = (Math.random() * 16) | 0
    let v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })

const getDisplayName = (WrappedComponent) =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component'

export const isChrome = /chrome/gi.test(window.navigator.userAgent)

const getPaginationInfo = ({ page, limit, count }) => ({
  from: (page - 1) * limit + 1,
  to: limit * page > count ? count : limit * page,
})

const getNumeration = (index, type) => {
  const char = ALPHABET[index]

  if (!char) return index + 1

  switch (type) {
    case 'number':
      return index + 1
    case 'upper-alpha':
    case 'uppercase':
      return char.toUpperCase()
    case 'lower-alpha':
    case 'lowercase':
      return char.toLowerCase()
    default:
      return index + 1
  }
}

const isEmpty = (str) => {
  str = typeof str === 'string' ? str.trim() : ''
  return str === '<p><br></p>' || str === ''
}

function isBlobData(file) {
  let isBinary = false
  if (file instanceof Blob && !(file instanceof File)) {
    // even file objects are instance of Blob
    // need to consider that as well while checking
    isBinary = true
  }
  return isBinary
}

export function convertBlobToFile(blob) {
  if (blob) {
    let fileExtension = 'png'
    const { type: fileType = '' } = blob
    if (fileType.includes('image/')) {
      fileExtension = fileType.split('image/')[1]
    }
    const options = {
      type: fileType,
    }
    const name = `pasted-image-${Date.now()}.${fileExtension}`
    const file = new File([blob], name, options)
    return file
  }
  return null
}

export function convertStringToFile(str, name) {
  const blob = new Blob([str], { type: 'text/plain;charset=utf-8' })
  const file = new File([blob], name || `scratchpad-${Date.now()}.text`)
  return file
}

const s3Folders = Object.values(aws.s3Folders)
/**
 * upload a file to s3 using signed url
 * @param {file} file
 */
export const uploadToS3 = async (
  file,
  folder,
  progressCallback,
  cancelUpload,
  subFolder = '',
  ignoreCDN = false,
  data = ''
) => {
  if (!file) {
    throw new Error('file is missing')
  }
  if (!folder || !s3Folders.includes(folder)) {
    throw new Error('folder is invalid')
  }
  let fileToUpload = file
  // image was pasted
  if (isBlobData(fileToUpload)) {
    fileToUpload = convertBlobToFile(file) // create new file with the BLOB data
  }
  if (isString(file)) {
    // this case will come from scratchpad
    // create new file with the string
    fileToUpload = convertStringToFile(file)
  }

  let { name: fileName } = fileToUpload
  fileName = fileName.replace(/[^a-zA-Z0-9-_. ]/g, '')
  let result
  if (folder === aws.s3Folders.ONEROSTER) {
    result = await onerosterApi.getSignedUrl(fileName, folder, data)
  } else {
    result = await fileApi.getSignedUrl(fileName, folder, subFolder)
  }
  const formData = new FormData()
  const { fields = {}, url, cdnUrl } = result

  Object.keys(fields).forEach((item) => {
    formData.append(item, fields[item])
  })

  formData.append('file', file)

  if (!progressCallback) {
    progressCallback = () => {}
  }
  if (!cancelUpload) {
    cancelUpload = () => {}
  }

  await fileApi.uploadBySignedUrl(url, formData, progressCallback, cancelUpload)
  if (ignoreCDN) {
    //expecting to return s3 url only for bubble sheet/omr uploads
    if (
      folder !== aws.s3Folders.WEBCAM_OMR_UPLOADS &&
      folder !== aws.s3Folders.BUBBLE_SHEETS
    ) {
      Sentry.withScope((scope) => {
        scope.setExtra('content', {
          folder,
          url: `${url}/${fields.key}`,
        })
        Sentry.captureException(new Error('Content using s3 url'))
      })
    }
    return `${url}/${fields.key}`
  }
  return `${cdnUrl}/${fields.key}`
}

function addProps() {
  $(this).attr('resprops', '{{resProps}}')
  const id = $(this).attr('id')
  $(this).attr('key', id)
  const text = $('<div>').append($(this).clone()).html()
  $(this).replaceWith(text)
}

export const removeCommentsFromHtml = (content = '') => {
  if (typeof content !== 'string') return content
  return content.replace(/(<|&lt;)!--[\s\S]*?--(>|&gt;)/g, '')
}

const removeStyleTags = (content = '') => {
  if (typeof content !== 'string') return content
  return content.replace(/<style type\=\"text\/css\">[\s\S]*?<\/style>/g, '')
}

const sanitizeSelfClosingTags = (inputString) => {
  const _inputString =
    typeof inputString === 'number' ? inputString.toString() : inputString

  const sanitizedString =
    _inputString &&
    _inputString
      .replace(/<hr>/g, '<hr/>')
      .replace(/<br(.*?)>/g, '<br/>')
      .replace(/(<img("[^"]*"|[^\/">])*)>/gi, '$1/>')
      .replace(
        /allowfullscreen="true"><\/iframe>/,
        "allowfullscreen=''></iframe>"
      )
      .replace(/<meta[\s\S]*?>/g, '') // removes meta tag
      .replace(/(<col(?!group)[^/>]*)(>)/g, '$1/$2') // replace <col> tag with self closing col tag | EV-26330
      .replace(/controls=""/g, 'controls')
  return removeStyleTags(removeCommentsFromHtml(sanitizedString))
}

const replaceForJsxParser = (inputString) =>
  inputString &&
  inputString
    .replace(/"{{resProps/g, '{resProps')
    .replace(/resProps}}"/g, 'resProps}')
    .replace(/"{{lineHeight/g, '{lineHeight')
    .replace(/lineHeight}}"/g, 'lineHeight}')

const escapeCurlyBraces = (node) => {
  if (
    node &&
    (node.textContent.includes('{') || node.textContent.includes('}'))
  ) {
    node.textContent = node.textContent.replace(/([{}]+)/g, "{'$1'}")
  }
}

const processCurlyBraces = (nodes) => {
  if (nodes.prop('tagName') !== 'IFRAME' && nodes.contents().length) {
    nodes.contents().each((index, node) => {
      if (node.nodeType === 3) {
        escapeCurlyBraces(node)
      } else {
        processCurlyBraces($(node))
      }
    })
  } else {
    escapeCurlyBraces(nodes[0])
  }
  return nodes
}

const parseTemplate = (tmpl) => {
  let temp = ` ${tmpl}`.slice(1)
  if (!window.$) {
    return ''
  }
  const parsedHTML = $('<div />').html(temp)
  // Clean v1 math content for jsx parser
  $(parsedHTML)
    .find('.MathJax')
    .each(function () {
      $(this).replaceWith(`<span>${$(this).html()}</span>`)
    })

  $(parsedHTML)
    .find('textinput, mathinput, textdropdown, response, mathunit')
    .each(addProps)

  $(parsedHTML)
    .find('.input__math')
    .each(function () {
      const latex = $(this).attr('data-latex')
      $(this).replaceWith(
        `<mathspan lineheight={{lineHeight}} latex="${latex}" />`
      )
    })

  temp = $(processCurlyBraces($(parsedHTML))).html()

  return replaceForJsxParser(sanitizeSelfClosingTags(temp))
}

export const getResponsesCount = (element) =>
  $(element).find('textinput, textdropdown, mathinput, mathunit').length

const closeBtn =
  '<span contenteditable="false" class="paragraph-number-remove">x</span>'

export const reIndexResponses = (htmlStr) => {
  const parsedHTML = $('<div />').html(htmlStr)
  if (
    !$(parsedHTML).find(
      'textinput, mathinput, mathunit, textdropdown, response, paragraphnumber'
    ).length
  ) {
    return htmlStr
  }

  const existingUUIDs = {}

  $(parsedHTML)
    .find(
      'textinput, mathinput, mathunit, textdropdown, response, paragraphnumber'
    )
    .each(function (index) {
      $(this).find('span').remove('span')

      let id = $(this).attr('id') || uuid()

      if (existingUUIDs[id]) {
        id = uuid()
      }

      if (id) {
        existingUUIDs[id] = true
      }

      $(this).attr({ id, key: id })
      $(this).attr('responseIndex', index + 1)
      $(this).attr('contenteditable', false)

      if ($(this).context.nodeName === 'PARAGRAPHNUMBER') {
        $(this).html(`${index + 1}${closeBtn}`)
      }

      const text = $('<div>').append($(this).clone()).html()

      $(this).replaceWith(text)
    })

  return $(parsedHTML).html()
}

export const isValidUpdate = (prevContent = '', currentContent = '') => {
  const uuidPattern = /id="(\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12})"/g
  const prevIds = prevContent.match(uuidPattern)
  const newIds = currentContent.match(uuidPattern)
  return isEqual(prevIds, newIds)
}

const tagMapping = {
  img: '[image]',
  mathunit: ' ',
  mathinput: ' ',
  textinput: ' ',
  textdropdown: ' ',
  response: ' ',
  br: ' ',
}

export const sanitizeForReview = (stimulus) => {
  if (!window.$) return stimulus
  if (!stimulus || !stimulus.trim().length) return question.DEFAULT_STIMULUS
  const jqueryEl = $('<p>').append(stimulus)
  // remove br tag also
  // span needs to be checked because if we use matrix it comes as span tag (ref: EV-10640)
  const tagsToRemove = [
    'mathinput',
    'mathunit',
    'textinput',
    'textdropdown',
    'img',
    'table',
    'response',
    'br',
    'span',
  ]
  let tagFound = false
  tagsToRemove.forEach((tagToRemove) => {
    jqueryEl.find(tagToRemove).each(function () {
      const elem = $(this).context
      // replace if tag is not span
      // span comes when we use italic or bold
      const shouldReplace = elem.nodeName !== 'SPAN' // sanitize other tags (mainly input responses) from stimulus except span
      const latex = elem.getAttribute('data-latex')
      // sanitize span only if matrix is rendered using a span tag
      // do no sanitize if span does not have latex (in case we use bold or italic)
      if (elem.nodeName === 'SPAN' && latex && latex.includes('matrix')) {
        $(this).replaceWith(` [matrix] `)
      }
      if (shouldReplace) {
        if (tagMapping[tagToRemove]) {
          $(this).replaceWith(` ${tagMapping[tagToRemove]} `)
        } else {
          $(this).replaceWith(`  [${tagToRemove}] `)
        }
      }
      tagFound = true
    })
  })
  // to remove any text after ...
  // Hiding video and replacing with text [video]
  jqueryEl.find('p').each(function () {
    const elem = $(this)
    const hasMath = elem.find('.input__math').length > 0
    const text = elem.text().trim().length > 0
    const video = elem.html().includes('fr-video')
    if ((!text && !hasMath && !video) || text === '...') {
      elem.remove()
    } else if (video) {
      elem.replaceWith('[video]')
    }
  })

  jqueryEl.find('iframe').each(function () {
    const elem = $(this)
    elem.replaceWith(['[resource]'])
  })

  jqueryEl.find('a').each(function () {
    const elem = $(this)
    const textValue = elem.text()
    elem.replaceWith(textValue)
  })

  let splitJquery = jqueryEl.html()

  if (tagFound) {
    const firstIndexOf = jqueryEl.html().indexOf('...')
    if (firstIndexOf != -1) {
      splitJquery = jqueryEl.html().substr(0, firstIndexOf + 3)
    }
    if (splitJquery === '...') {
      splitJquery = question.DEFAULT_STIMULUS
    }
  }
  // TODO: Fix me,
  // I am trying to get text from first paragraph
  // but what if there is no text in the first paragraph

  // if (splitJquery.includes("</p>")) {
  //   splitJquery = `${splitJquery.substr(0, splitJquery.indexOf("</p>"))} </p>`;
  // }
  const returnValue = sanitizeSelfClosingTags(splitJquery)
  return returnValue
}

export const removeIndexFromTemplate = (tmpl) => {
  const temp = ` ${tmpl}`.slice(1)
  if (!window.$) {
    return temp
  }
  const parsedHTML = $('<div />').html(temp)
  $(parsedHTML)
    .find('textinput, mathinput, mathunit, textdropdown, response')
    .each(function () {
      $(this).removeAttr('responseindex')
      $(this).removeAttr('contenteditable')
    })
  return sanitizeString($(parsedHTML).html())
}

export const allowedImageFileTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
]

export const allowedFileTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/ogg',
]

export const beforeUpload = (file, type) => {
  const isVideoFile = type === 'video'
  const isAllowedType = allowedFileTypes.includes(file.type)
  if (!isAllowedType) {
    notification({ messageKey: 'imageTypeError' })
  }
  const withinSizeLimit = isVideoFile
    ? file.size / 1024 / 1024 < 25
    : file.size / 1024 / 1024 < 2
  if (!withinSizeLimit) {
    notification({
      messageKey: isVideoFile ? 'videoSizeError' : 'imageSizeError',
    })
  }
  return isAllowedType && withinSizeLimit
}

export const calculateWordsCount = (ele) =>
  $('<div>')
    .html(ele)
    .text()
    .split(/\W/g)
    .filter((i) => !!i.trim()).length
export const canInsert = (element) => element.contentEditable !== 'false'

const getPoints = (item) => {
  if (!item) {
    return 0
  }
  if (item.itemLevelScoring && !isNaN(item.itemLevelScore)) {
    return item.itemLevelScore
  }

  return get(item, ['data', 'questions'], []).reduce(
    (acc, q) =>
      acc +
      (q.scoringDisabled
        ? 0
        : get(q, ['validation', 'validResponse', 'score'], 0)),
    0
  )
}

const getQuestionLevelScore = (item, questions, totalMaxScore, newMaxScore) => {
  const questionScore = {}
  const maxScore = newMaxScore || totalMaxScore
  if (item.itemLevelScoring === true || item.isLimitedDeliveryType === true) {
    questions?.forEach((o, i) => {
      if (i === 0) {
        questionScore[o.id] = item.isLimitedDeliveryType ? 1 : maxScore
      } else {
        questionScore[o.id] = 0
      }
    })
  } else {
    let currentTotal = 0
    questions.forEach((o, i) => {
      if (i === questions.length - 1) {
        questionScore[o.id] = round(maxScore - currentTotal, 2)
      } else {
        const score = round(
          get(o, ['validation', 'validResponse', 'score'], 0) *
            (maxScore / totalMaxScore),
          2
        )
        questionScore[o.id] = score
        currentTotal += score
      }
    })
  }
  return questionScore
}

export const getSelection = () => {
  let sel = ''
  if (window.getSelection) {
    sel = window.getSelection()
  } else if (document.getSelection) {
    sel = document.getSelection()
  } else if (document.selection) {
    sel = document.selection.createRange()
  }
  return sel
}

export const clearSelection = () => {
  if (window.getSelection) {
    window.getSelection().removeAllRanges()
  } else if (document.selection) {
    document.selection.empty()
  }
}

export const getRangeAtFirst = () => {
  const selection = getSelection()
  if (!selection.rangeCount) {
    console.log('Unable to find a native DOM range from the current selection.')
    return
  }

  return selection.getRangeAt(0)
}

/**
 * @param {string | null} parent container class name
 * @param {string} className class name of new element, default is 'token active-word
 * @param {string} tag new element tag name, default is span
 * @returns {boolean}
 */
export const highlightSelectedText = (
  parentClass,
  className = 'token active-word',
  tag = 'span',
  style,
  prevRange = null
) => {
  const range = prevRange || getRangeAtFirst()
  if (!range) {
    return
  }

  const {
    endContainer,
    endOffset,
    startContainer,
    startOffset,
    commonAncestorContainer,
  } = range

  if (startOffset === endOffset) {
    clearSelection()
    return
  }

  const cloned = range.cloneContents()
  const childNodeNames = [...get(cloned, 'childNodes', {})]
    .map((childElement) => childElement.tagName)
    .filter((x) => x)
  const hasBlockedNode = BLOCK_LEVEL_TAGS.some((n) =>
    childNodeNames.includes(n)
  )

  if (hasBlockedNode) {
    clearSelection()
    return
  }

  if (get(commonAncestorContainer, 'offsetParent.tagName', null) === 'TABLE') {
    notification({ messageKey: 'selectionError' })
    clearSelection()
    return
  }

  if (
    (endContainer && endContainer.parentNode.className === className) ||
    (startContainer && startContainer.parentNode.className === className)
  ) {
    notification({ messageKey: 'selectionError' })
    clearSelection()
    return
  }

  if (
    parentClass &&
    !startContainer.parentNode.classList.contains(parentClass) &&
    !endContainer.parentNode.classList.contains(parentClass)
  ) {
    clearSelection()
    return
  }

  try {
    const node = document.createElement(tag)
    const fragment = range.extractContents()

    node.setAttribute('class', className)
    if (style && style.background) {
      node.style.background = style.background
    }

    node.appendChild(fragment)
    range.insertNode(node)

    clearSelection()
    return node
  } catch (err) {
    notification({ messageKey: 'selectionError' })
    clearSelection()
  }
}

// In Chrome, the client rects will include the entire bounds of all nodes that
// begin (have a start tag) within the selection, even if the selection does
// not overlap the entire node. To resolve this, we split the range at each
// start tag and join the client rects together.
// https://code.google.com/p/chromium/issues/detail?id=324437
/* eslint-disable consistent-return */
export const getRangeClientRectsChrome = (range) => {
  const tempRange = range.cloneRange()
  const clientRects = []

  for (
    let ancestor = range.endContainer;
    ancestor != null;
    ancestor = ancestor.parentNode
  ) {
    // If we've climbed up to the common ancestor, we can now use the
    // original start point and stop climbing the tree.
    const atCommonAncestor = ancestor === range.commonAncestorContainer
    if (atCommonAncestor) {
      tempRange.setStart(range.startContainer, range.startOffset)
    } else {
      tempRange.setStart(tempRange.endContainer, 0)
    }
    const rects = Array.from(tempRange.getClientRects())
    clientRects.push(rects)
    if (atCommonAncestor) {
      clientRects.reverse()
      return [].concat(...clientRects)
    }
    tempRange.setEndBefore(ancestor)
  }
}

/**
 * Like range.getClientRects() but normalizes for browser bugs.
 */
export const getRangeClientRects = isChrome
  ? getRangeClientRectsChrome
  : (range) => Array.from(range.getClientRects())

/**
 * Like range.getBoundingClientRect() but normalizes for browser bugs.
 */
export const getRangeBoundingClientRect = (range) => {
  // "Return a DOMRect object describing the smallest rectangle that includes
  // the first rectangle in list and all of the remaining rectangles of which
  // the height or width is not zero."
  // http://www.w3.org/TR/cssom-view/#dom-range-getboundingclientrect
  const rects = getRangeClientRects(range)
  let top = 0
  let right = 0
  let bottom = 0
  let left = 0

  if (rects.length) {
    // If the first rectangle has 0 width, we use the second, this is needed
    // because Chrome renders a 0 width rectangle when the selection contains
    // a line break.
    if (rects.length > 1 && rects[0].width === 0) {
      ;({ top, right, bottom, left } = rects[1])
    } else {
      ;({ top, right, bottom, left } = rects[0])
    }

    for (let ii = 1; ii < rects.length; ii++) {
      const rect = rects[ii]
      if (rect.height !== 0 && rect.width !== 0) {
        top = Math.min(top, rect.top)
        right = Math.max(right, rect.right)
        bottom = Math.max(bottom, rect.bottom)
        left = Math.min(left, rect.left)
      }
    }
  }

  return {
    top,
    right,
    bottom,
    left,
    width: right - left,
    height: bottom - top,
  }
}

/**
 * Return the bounding ClientRect for the visible DOM selection, if any.
 * In cases where there are no selected ranges or the bounding rect is
 * temporarily invalid, return null.
 */
export const getSelectionRect = (global) => {
  const selection = global.getSelection()
  if (!selection.rangeCount) {
    return null
  }

  const range = selection.getRangeAt(0)
  const boundingRect = getRangeBoundingClientRect(range)
  const { top, right, bottom, left } = boundingRect

  // When a re-render leads to a node being removed, the DOM selection will
  // temporarily be placed on an ancestor node, which leads to an invalid
  // bounding rect. Discard this state.
  if (top === 0 && right === 0 && bottom === 0 && left === 0) {
    return null
  }

  return boundingRect
}

export const decodeHTML = (str) => {
  if (!window.$) {
    return str
  }
  const jQuery = window.$
  return jQuery('<div>').html(str).html()
}

export const rgbToHexc = (orig) => {
  const rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i)
  return rgb && rgb.length === 4
    ? `#${`0${parseInt(rgb[1], 10).toString(16)}`.slice(-2)}${`0${parseInt(
        rgb[2],
        10
      ).toString(16)}`.slice(-2)}${`0${parseInt(rgb[3], 10).toString(
        16
      )}`.slice(-2)}`
    : orig
}

export const hexToRGB = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16)

  const g = parseInt(hex.slice(3, 5), 16)

  const b = parseInt(hex.slice(5, 7), 16)

  if (alpha) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  return `rgb(${r}, ${g}, ${b})`
}

export const getAlpha = (color) => {
  const regexValuesFromRgbaColor = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/

  return color.match(regexValuesFromRgbaColor) !== null
    ? +color.match(regexValuesFromRgbaColor).slice(-1) * 100
    : 100
}

export const formatBytes = (bytes = 0, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const isMobileDevice = () => {
  const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ')
  const mq = (query) => window.matchMedia(query).matches

  if (
    'ontouchstart' in window ||
    (window.DocumentTouch && document instanceof DocumentTouch)
  ) {
    return true
  }

  const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('')
  return mq(query)
}

/**
 * this function is not considering border width
 * @param {string} text string for measuring width and height
 * @param {object} style styles for text, it can be styles of parent element or null
 * @return {object} calculated width and height of text
 */
export const measureText = (text, style = {}, tag1 = 'div', tag2 = 'span') => {
  const fakeEm = document.createElement(tag1)
  const innerEm = document.createElement(tag2)
  document.body.appendChild(fakeEm)
  if (style.fontSize) {
    fakeEm.style.fontSize = style.fontSize
  }

  if (style.padding) {
    fakeEm.style.padding = style.padding
  }

  if (style.height) {
    fakeEm.style.height = style.height
  }

  if (style.letterSpacing) {
    fakeEm.style.letterSpacing = style.letterSpacing
  }

  if (style.lineHeight) {
    fakeEm.style.lightingColor = style.lineHeight
  }

  if (style.maxWidth) {
    fakeEm.style.maxWidth = `${style.maxWidth}px`
  }

  fakeEm.style.position = 'absolute'
  fakeEm.style.left = '-1000px'
  fakeEm.style.top = '-1000px'
  fakeEm.style.visibility = 'hidden'

  innerEm.innerHTML = replaceLatexesWithMathHtml(text)
  fakeEm.appendChild(innerEm)

  /**
   * +10 will be ellipsis width
   */
  const result = {
    width: fakeEm.offsetWidth + 10,
    height: fakeEm.offsetHeight,
    scrollWidth: fakeEm.scrollWidth + 10,
    scrollHeight: fakeEm.scrollHeight,
  }

  document.body.removeChild(fakeEm)
  return result
}

export const getFormattedAttrId = (inputString) => {
  if (!inputString) return ''

  const matchBlankSpaces = /[\s]+/g
  const matchHiphens = /[-]+/g
  return inputString
    .replace(matchBlankSpaces, '-') // replace space+ to hyphen
    .replace(matchHiphens, '-') // replace hyphen+ single hyphen
    .toLowerCase()
}

export const templateHasImage = (template) => {
  let hasImage = false
  if (window.$) {
    const fakeEm = window.$('<div/>', {})
    fakeEm.append(template)
    hasImage = fakeEm.find('img').length > 0
  }
  return hasImage
}

export const templateHasMath = (template) => {
  let hasMath = false
  if (window.$) {
    const fakeEm = window.$('<div/>', {})
    fakeEm.append(template)
    hasMath = fakeEm.find('.input__math').length > 0
  }
  return hasMath
}

export const getImageUrl = (template) => {
  let url = ''
  if (window.$) {
    const jqueryEl = window.$(template)
    jqueryEl.find('img').each(function () {
      url = this.getAttribute('src')
    })
  }
  return url
}

export const getImageDimensions = (url) =>
  new Promise((resolve) => {
    const image = new Image()
    image.onload = function () {
      resolve({ height: this.naturalHeight, width: this.naturalWidth })
    }
    image.src = url
  })

export const toggleChatDisplay = (mode) => {
  // If the chat is initiated then both the elements embeddedServiceSidebar, embeddedServiceHelpButton
  // would be there in DOM and embeddedServiceHelpButton will be hidden, otherwise only
  // embeddedServiceHelpButton will be there in the DOM
  if (document.querySelector('.embeddedServiceSidebar')) {
    // once opened and minimised / after initiating the chat, toggling only this should be fine
    const style = document.querySelector('.embeddedServiceSidebar').style
    if (mode === 'show') {
      style.display = ''
    } else {
      style.display = 'none'
    }
  } else if (document.querySelector('.embeddedServiceHelpButton')) {
    // shown before opening the widget / initiating the chat, toggling only this should be fine
    const style = document.querySelector('.embeddedServiceHelpButton').style
    if (mode === 'show') {
      style.display = ''
    } else {
      style.display = 'none'
    }
  }
}

export const hasMediaDevice = async (deviceKind) => {
  let mediaDevices = navigator.mediaDevices
  if (!mediaDevices || !mediaDevices.enumerateDevices) {
    return false
  }

  const devices = await mediaDevices.enumerateDevices()

  return devices.some((device) => device.kind === deviceKind)
}

/** A small utiltiy to help Resolve promises sequentially */
const executePromisesInSequence = (promises) =>
  promises.reduce(
    (agg, promise) =>
      agg.then((result) => promise.then(Array.prototype.concat.bind(result))),
    Promise.resolve([])
  )

// some migrated questions has html symbols like &lt;
// we need to replace them with html code.

export const sanitizeString = (str) =>
  (str || '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')

// Used when we want to spread all the props(...rest) but some.
export const getSanitizedProps = (props, blackListedProps) => {
  return omit(props, blackListedProps)
}

export const captureSentryException = (err, extraData) => {
  // Ignore BE's business errors
  if (!err || (err && [409, 302, 422, 403].includes(err.status))) {
    return
  }

  Sentry.withScope((scope) => {
    if (extraData) {
      scope.setExtra('extraData', extraData)
    }
    Sentry.captureException(err)
  })
}

const removeImageTags = (text = '') => {
  if (typeof text !== 'string') return text
  return text.replace(/<img[^>]+\>/gi, '')
}

export const removeHTMLTags = (text = '') => {
  if (typeof text !== 'string') return text
  return text
    .trim()
    .replace(/(<([^>]+)>)/gi, '')
    .replace(/&lt;|&#60;/g, '<')
    .replace(/&gt;|&#62;/g, '>')
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&amp;|&#38;/g, '&')
}

export const replaceLatexTemplate = (str) => {
  return str.replace(
    /#{(.*?)#}/g,
    '<span class="input__math" data-latex="$1"></span>'
  )
}

export const removeTokenFromHtml = (str) => {
  const tokenArr = []
  const regex = new RegExp(
    '<span(.*?)class="token active-word"(.*?)>(.*?)</span>',
    'g'
  )
  let match = regex.exec(str)

  while (match !== null) {
    tokenArr.push(match.splice(3))
    match = regex.exec(str)
  }

  tokenArr.forEach((elem) => {
    const replaceStr = elem.splice(0)
    str = str.replace(
      new RegExp(
        `<span(.*?)class="token active-word"(.*?)>${replaceStr}</span>`
      ),
      replaceStr
    )
  })
  return str
}

export const getYoutubeId = (url, opts) => {
  if (!opts) {
    opts = { fuzzy: true }
  }

  if (/youtu\.?be/.test(url)) {
    // Look first for known patterns
    const patterns = [
      /youtu\.be\/([^#&?]{11})/,
      /\?v=([^#&?]{11})/,
      /&v=([^#&?]{11})/,
      /embed\/([^#&?]{11})/,
      /\/v\/([^#&?]{11})/,
    ]

    const embedPattern = /d\/(\w+)\?rel=\d+"/

    for (let i = 0; i < patterns.length; ++i) {
      if (patterns[i].test(url)) {
        return patterns[i].exec(url)[1]
      }
    }

    if (embedPattern.test(url)) {
      return embedPattern.exec(url)[1]
    }

    if (opts.fuzzy) {
      // If that fails, break it apart by certain characters and look
      // for the 11 character key
      const tokens = url.split(/[\/\&\?=#\.\s]/g)
      for (let i = 0; i < tokens.length; ++i) {
        if (/^[^#&?]{11}$/.test(tokens[i])) {
          return tokens[i]
        }
      }
    }
  }

  return null
}

export const formatFileSize = (size) => {
  if (size < 1024) {
    return `${size} Byte`
  }
  if (size >= 1024 && size < 1024 * 1024) {
    return `${round(size / 1024, 2)} KB`
  }
  if (size >= 1024 * 1024) {
    return `${round(size / 1024 / 1024, 2)} MB`
  }
  return `${round(size / 1024 / 1024 / 1024, 2)} GB`
}

export const triggerEvent = (el, eventName, options) => {
  try {
    if (el && eventName) {
      var event
      if (window.CustomEvent) {
        event = new CustomEvent(eventName, options)
      } else {
        event = document.createEvent('CustomEvent')
        event.initCustomEvent(eventName, true, true, options)
      }
      el.dispatchEvent(event)
    }
  } catch (e) {
    console.error('Error while triggering event ', eventName, el)
  }
}

export default {
  removeImageTags,
  sanitizeSelfClosingTags,
  getDisplayName,
  getPaginationInfo,
  getNumeration,
  isEmpty,
  uploadToS3,
  parseTemplate,
  reIndexResponses,
  sanitizeForReview,
  canInsert,
  getPoints,
  getQuestionLevelScore,
  removeIndexFromTemplate,
  calculateWordsCount,
  formatBytes,
  isMobileDevice,
  measureText,
  getFormattedAttrId,
  getSelectionRect,
  toggleChatDisplay,
  executePromisesInSequence,
  sanitizeString,
  uuid,
  getSanitizedProps,
  captureSentryException,
  replaceLatexTemplate,
  hasMediaDevice,
  removeTokenFromHtml,
  getYoutubeId,
  formatFileSize,
  triggerEvent,
}

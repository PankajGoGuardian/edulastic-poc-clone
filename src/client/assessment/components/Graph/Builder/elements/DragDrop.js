import { replaceLatexesWithMathHtml } from '@edulastic/common/src/utils/mathUtils'
import { IconCloseTextFormat } from '@edulastic/icons/src/IconClose'
import { IconCorrectTextFormat } from '@edulastic/icons/src/IconCorrect'

import { clamp } from 'lodash'
import { CONSTANT } from '../config'
import { defaultPointParameters } from '../settings'
import { Point } from '.'
import { disableSnapToGrid, enableSnapToGrid } from '../utils'
import { MIN_SNAP_SIZE } from '../config/constants'

const deleteIconPattern =
  '<svg id="{iconId}" class="delete-drag-drop" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.728 16.702">' +
  '<g id="{iconId}" transform="translate(-40.782 .5)">' +
  '<path id="{iconId}" d="M48.889.522V0H45.4v.522h-4.12v2.112h11.73V.522z" />' +
  '<path id="{iconId}" d="M57.546 80.756h8.939l.642-12.412H56.9zm5.486-9.511h1.107v6.325h-1.107zm-3.14 0H61v6.325h-1.108z"transform="translate(-14.87 -65.054)"/>' +
  '</g>' +
  '</svg>'

const IconClose = `<svg class="drag-drop-icon drag-drop-icon-incorrect" ${IconCloseTextFormat.substring(
  5
)}`
const IconCorrect = `<svg class="drag-drop-icon drag-drop-icon-correct" ${IconCorrectTextFormat.substring(
  5
)}`

const BOX_MIN_WIDTH = 50
const BOX_MIN_HEIGHT = 32

function onHoverMark() {
  if (this.rendNode && window.$) {
    const images = $(this.rendNode).find('img')
    const content = $(this.rendNode).find('.drag-drop-content')
    if (images.length > 0 && content.length) {
      const dataWidth = content.attr('data-width')
      const dataHeight = content.attr('data-height')
      content.css('min-width', `${dataWidth}px`)
      content.css('min-height', `${dataHeight}px`)
      images.css('max-width', '100%')
      this.board.fullUpdate()
    }
  }
}

function onLeaveMark() {
  if (this.rendNode) {
    const images = $(this.rendNode).find('img')
    const content = $(this.rendNode).find('.drag-drop-content')
    if (images.length > 0 && content.length) {
      content.css('min-width', `${BOX_MIN_WIDTH}px`)
      content.css('min-height', `${BOX_MIN_HEIGHT}px`)
      images.css('max-width', '2rem')
      this.board.fullUpdate()
    }
  }
}

const jxgType = 101

/**
 * this point will show while dragging value over the board
 * and then will get removed after release the value from the board
 */
let pointForDrag = null

function drawPoint(board, object, settings) {
  const pointParams =
    board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters()

  const {
    fixed = false,
    snapSizeX = pointParams.snapSizeX,
    snapSizeY = pointParams.snapSizeY,
  } = settings
  const { x, y, priorityColor } = object

  const point = board.$board.create('point', [x, y], {
    ...pointParams,
    ...Point.getColorParams(priorityColor || board.priorityColor),
    fixed,
    snapSizeX,
    snapSizeY,
  })

  return point
}

function create(board, object, settings) {
  // causing crash issue otherwise
  if (!object.x) {
    object.x = 0
  }
  if (!object.y) {
    object.y = 0
  }
  const { fixed = false } = settings

  const { id = null, x, y, text, customOptions = {}, dimensions = {} } = object
  const { width = 110, height = 32 } = dimensions

  const point = drawPoint(board, object, settings)

  let content = replaceLatexesWithMathHtml(text)

  if (!fixed) {
    const deleteIconId = `drag-drop-delete-${id}`
    content += deleteIconPattern.replace(/{iconId}/g, deleteIconId)
  }

  let cssClass = 'fr-box drag-drop'
  let conentClassName = 'drag-drop-content'
  let icon = ''
  if (customOptions.isCorrect) {
    conentClassName += ' drag-drop-content-correct'
    cssClass += ' correct'
    icon = IconCorrect
  } else if (customOptions.isCorrect === false) {
    conentClassName += ' drag-drop-content-incorrect'
    cssClass += ' incorrect'
    icon = IconClose
  }

  conentClassName = `class="${conentClassName}"`

  const contentStyle = `style="
    min-width: ${BOX_MIN_WIDTH}px;
    min-height: ${BOX_MIN_HEIGHT}px;
  "`

  const triangle = "<div class='drag-drop-content-triangle'></div"

  content = `<div ${contentStyle} ${conentClassName} data-width="${width}" data-height="${height}">${content}${icon}${triangle}</div>`

  const mark = board.$board.create('text', [x, y, content], {
    ...(board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters()),
    anchorX: 'left', // this setting cause offset flickering
    anchorY: 'bottom',
    cssClass,
    highlightCssClass: cssClass,
    fixed,
    parse: false,
  })

  // fix offset flickering
  setTimeout(() => {
    mark.rendNode.childNodes[0].style.opacity = 1
  })

  const newElement = board.$board.create('group', [point, mark], {
    id,
  })

  const dragHandler = () => {
    // don't use e.movementX === 0 && e.movementY === 0
    // movementX and movementY are always zero on Safari
    // it seems like the bug is in JSXGraph library
    // https://snapwiz.atlassian.net/browse/EV-19969
    // https://snapwiz.atlassian.net/browse/EV-23207

    disableSnapToGrid(point)
    disableSnapToGrid(mark)
    newElement.dragged = true
    board.dragged = true
  }

  const upHandler = () => {
    if (newElement.dragged) {
      newElement.dragged = false
      enableSnapToGrid(board, point)
      enableSnapToGrid(board, mark)
      board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE)
    }
  }

  if (!fixed) {
    point.on('up', upHandler)
    point.on('drag', dragHandler)
    mark.on('up', upHandler)
    mark.on('drag', dragHandler)
  }

  mark.on('over', onHoverMark)
  mark.on('out', onLeaveMark)

  newElement.type = jxgType
  newElement.labelHTML = text
  newElement.dimensions = dimensions

  return newElement
}

function movePointForDrag(board, object) {
  if (!pointForDrag) {
    pointForDrag = drawPoint(board, object, {
      snapSizeX: MIN_SNAP_SIZE,
      snapSizeY: MIN_SNAP_SIZE,
    })
  } else {
    const { x, y } = object
    pointForDrag.moveTo([x, y])
  }
}

function removePointForDrag(board) {
  if (pointForDrag) {
    board.$board.removeObject(pointForDrag)
    pointForDrag = null
  }
}

const getClampedCoords = (value, bounds) => clamp(value, bounds[0], bounds[1])

function getConfig(element) {
  const [xMin, yMax, xMax, yMin] = element.board.getBoundingBox()
  const p = element.parents[0]
  const x = element.coords[p].usrCoords[1]
  const y = element.coords[p].usrCoords[2]

  const clampedX = getClampedCoords(x, [xMin, xMax])
  const clampedY = getClampedCoords(y, [yMin, yMax])

  if (clampedX !== x || clampedY !== y) {
    element.translationPoints[0].moveTo([clampedX, clampedY])
    element.translationPoints[1].moveTo([clampedX, clampedY])
  }
  const { dimensions = { height: 32, width: 110 } } = element
  return {
    _type: element.type,
    type: CONSTANT.TOOLS.DRAG_DROP,
    x: clampedX,
    y: clampedY,
    id: element.id,
    text: element.labelHTML,
    label: false,
    dimensions,
  }
}

export default {
  jxgType,
  create,
  movePointForDrag,
  removePointForDrag,
  getConfig,
}

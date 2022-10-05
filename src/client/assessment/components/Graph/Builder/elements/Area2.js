import JXG from 'jsxgraph'
import { isArray } from 'lodash'
import { CONSTANT } from '../config'
import { getLineFunc } from '../utils'

const jxgType = 108

function getColorParams(color) {
  return {
    fillColor: '#fff',
    strokeColor: color,
    highlightStrokeColor: color,
    highlightFillColor: '#fff',
  }
}

function rnd(num) {
  return +num.toFixed(3)
}

function updateShading(board, areaPoint, shapes) {
  const usrX = rnd(areaPoint.X())
  const usrY = rnd(areaPoint.Y())

  if (isArray(shapes)) {
    shapes.forEach((shape) => {
      switch (shape.type) {
        case JXG.OBJECT_TYPE_LINE: {
          const [point1, point2] = Object.values(shape.ancestors)
          const func = getLineFunc(
            { x: point1.X(), y: point1.Y() },
            { x: point2.X(), y: point2.Y() }
          )
          let inverse = func(usrX, usrY) > 0

          if (point1.X() < point2.X()) {
            inverse = !inverse
          }

          if (point1.X() === point2.X() && point1.Y() > point2.Y()) {
            inverse = !inverse
          }

          const ineq = board.$board.create('inequality', [shape], { inverse })
          board.inequalities.push(ineq)
          break
        }
        default:
          break
      }
    })
  }
}

function create(board, object, settings = {}) {
  const { fixed = false } = settings
  const { x, y, id = null, priorityColor } = object
  const areaPoint = board.$board.create('point', [x, y], {
    ...getColorParams(priorityColor || '#434B5D'),
    showInfoBox: false,
    size: 7,
    snapToGrid: false,
    label: {
      visible: false,
    },
    fixed,
    id,
  })

  if (!fixed) {
    areaPoint.on('up', () => {
      if (areaPoint.dragged) {
        areaPoint.dragged = false
        board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE)
      }
    })

    areaPoint.on('drag', () => {
      // don't use e.movementX === 0 && e.movementY === 0
      // movementX and movementY are always zero on Safari
      // it seems like the bug is in JSXGraph library
      // https://snapwiz.atlassian.net/browse/EV-19969
      // https://snapwiz.atlassian.net/browse/EV-23207

      areaPoint.dragged = true
      board.dragged = true
    })
  }

  areaPoint.type = jxgType

  return areaPoint
}

function onHandler() {
  return (board, event) => {
    const coords = board.getCoords(event).usrCoords
    const object = {
      x: coords[1],
      y: coords[2],
    }
    // TODO: should check if we can draw area point
    // if (canDrawAreaByPoint(board, object)) {
    return create(board, object)
    // }
  }
}

function getConfig(area) {
  return {
    _type: area.type,
    type: CONSTANT.TOOLS.AREA2,
    id: area.id,
    x: area.coords.usrCoords[1],
    y: area.coords.usrCoords[2],
  }
}

function updateShadingsForAreaPoints(board, shapes) {
  const areaPoints = shapes.filter((el) => el.type === jxgType)
  areaPoints.forEach((areaPoint) => updateShading(board, areaPoint, shapes))
}

function setAreaForEquation(board, equation) {
  console.log(!!board, !!equation)
}

export default {
  jxgType,
  create,
  onHandler,
  getConfig,
  updateShadingsForAreaPoints,
  setAreaForEquation,
}

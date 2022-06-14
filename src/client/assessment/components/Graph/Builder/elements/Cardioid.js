import JXG from 'jsxgraph'
import { CONSTANT } from '../config'
import { Point } from '.'
import { nameGen, colorGenerator } from '../utils'
import mathstrings from '../config/mathstrings.json'

const jxgType = 107

const makeCallback = (point) => (phi) => {
  if (Math.abs(point.X()) > Math.abs(point.Y())) {
    return (-point.X() / 2) * (1 - Math.cos(phi))
  }
  return (-point.Y() / 2) * (1 - Math.sin(phi))
}

function createPoint(board, p, color) {
  const object = {
    x: p.x,
    y: p.y,
    label: p.label,
    labelIsVisible: true,
    pointIsVisible: true,
    id: null,
  }
  const conf = { size: 4, fillColor: color }
  const point = Point.create(board, object, conf)

  point.on('drag', () => {
    if (Math.abs(point.X()) > Math.abs(point.Y())) {
      point.setPosition(JXG.COORDS_BY_USER, [point.X(), 0])
    } else {
      point.setPosition(JXG.COORDS_BY_USER, [0, point.Y()])
    }
  })

  point.on('up', () => {
    board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE)
  })

  return point
}

function drawCardioidObj(board, obj, settings = {}) {
  const { fixed = true } = settings
  const { x, y, priorityColor, baseColor, dashed = false, label } = obj
  const currentColor = priorityColor || board.priorityColor || baseColor
  const coords = Point.getPointCoordsForPolar(
    board.polarIntersections,
    [x, y],
    true
  )

  const point = createPoint(
    board,
    { x: coords[0], y: coords[1], label },
    currentColor
  )

  const cardioid = board.$board.create(
    'curve',
    [makeCallback(point), [0, 0], 0, 2 * Math.PI],
    {
      fixed,
      strokewidth: 2,
      dash: dashed ? 2 : 0,
      strokeColor: currentColor,
      highlightStrokeColor: currentColor,
    }
  )
  if (!fixed) {
    cardioid.on('drag', () => {
      board.dragged = true
    })
  }
  cardioid.type = jxgType
  cardioid.point = point
  cardioid.addParents(point)
  cardioid.labelHTML = label
  cardioid.dashed = obj.dashed

  cardioid.r = coords[3] // radius was needed for the evalautor
  cardioid.t = mathstrings[`latex_${coords[2]}`] // theta needed for the evalautor
  return cardioid
}

function onHandler(board, event) {
  const coords = board.getCoords(event).usrCoords
  const object = {
    labelIsVisible: true,
    x: Math.abs(coords[1]) > Math.abs(coords[2]) ? coords[1] : 0,
    y: Math.abs(coords[1]) > Math.abs(coords[2]) ? 0 : coords[2],
    label: nameGen(board.elements),
    baseColor: colorGenerator(board.elements.length),
  }

  return drawCardioidObj(board, object)
}

function loadObject(board, object, settings) {
  return drawCardioidObj(board, object, settings)
}

function getConfig(jxgObj) {
  return {
    _type: jxgObj.type,
    id: jxgObj.id,
    type: CONSTANT.TOOLS.CARDIOID,
    label: jxgObj.labelHTML || false,
    baseColor: jxgObj.baseColor,
    dashed: jxgObj.dashed,
    labelIsVisible: jxgObj.labelIsVisible,
    x: jxgObj.point.X(),
    y: jxgObj.point.Y(),
    r: jxgObj.r,
    t: jxgObj.t,
  }
}

export default {
  jxgType,
  onHandler,
  getConfig,
  create: loadObject,
  makeCallback,
}

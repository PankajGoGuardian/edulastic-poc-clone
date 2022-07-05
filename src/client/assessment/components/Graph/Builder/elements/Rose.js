import JXG from 'jsxgraph'
import { CONSTANT } from '../config'
import { Point } from '.'
import { nameGen, colorGenerator } from '../utils'
import mathstrings from '../config/mathstrings.json'

const jxgType = 106

const makeCallback = (point) => (phi) => {
  const r = Math.sqrt(point.X() ** 2 + point.Y() ** 2)
  const rad = Math.atan2(point.Y(), point.X())
  const deg = rad * (180 / Math.PI)
  const k = Math.round(deg > 0 ? 180 / deg : 0)

  return r * Math.cos(k * phi)
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
    const polarCoords = Point.getPointCoordsForPolar(
      board.polarIntersections,
      [point.X(), point.Y()],
      true
    )
    if (polarCoords[2] >= 90) {
      point.setPosition(JXG.COORDS_BY_USER, [p.x, p.y])
    }
  })

  point.on('up', () => {
    board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE)
  })

  return point
}

function drawRose(board, obj, settings = {}) {
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

  const roseObj = board.$board.create(
    'curve',
    [makeCallback(point), [0, 0], 0, () => 2 * Math.PI],
    {
      fixed,
      strokewidth: 2,
      dash: dashed ? 2 : 0,
      strokeColor: currentColor,
      highlightStrokeColor: currentColor,
    }
  )

  if (!fixed) {
    roseObj.on('drag', () => {
      board.dragged = true
    })
  }
  roseObj.type = jxgType
  roseObj.point = point
  roseObj.labelHTML = label
  roseObj.addParents(point)
  roseObj.dashed = obj.dashed
  roseObj.r = coords[3] // radius was needed for the evalautor
  roseObj.t = mathstrings[`latex_${coords[2]}`] // theta needed for the evalautor
  return roseObj
}

function onHandler(board, event) {
  const coords = board.getCoords(event).usrCoords
  const polarCoords = Point.getPointCoordsForPolar(
    board.polarIntersections,
    [coords[1], coords[2]],
    true
  )
  if (polarCoords[2] >= 90) {
    return
  }
  const object = {
    labelIsVisible: true,
    x: polarCoords[0],
    y: polarCoords[1],
    label: nameGen(board.elements),
    baseColor: colorGenerator(board.elements.length),
  }
  return drawRose(board, object)
}

function loadObject(board, object, settings) {
  return drawRose(board, object, settings)
}

function getConfig(jxgObj) {
  return {
    _type: jxgObj.type,
    id: jxgObj.id,
    type: CONSTANT.TOOLS.ROSE,
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

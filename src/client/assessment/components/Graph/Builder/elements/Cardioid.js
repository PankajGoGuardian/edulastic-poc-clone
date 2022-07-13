import JXG from 'jsxgraph'
import { CONSTANT } from '../config'
import { Point } from '.'
import { nameGen, colorGenerator } from '../utils'

const jxgType = 107

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
    point.setPosition(JXG.COORDS_BY_USER, [point.X(), 0])
  })

  return point
}

function drawCardioidObj(board, obj, settings = {}) {
  const { fixed = true } = settings
  const { x, y, priorityColor, baseColor, dashed = false, label } = obj
  const currentColor = priorityColor || board.priorityColor || baseColor

  const point = createPoint(board, { x, y, label }, currentColor)

  const cardioid = board.$board.create(
    'curve',
    [(phi) => (-point.X() / 2) * (1 - Math.cos(phi)), [0, 0], 0, 2 * Math.PI],
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
  return cardioid
}

function onHandler(board, event) {
  const coords = board.getCoords(event).usrCoords
  const object = {
    labelIsVisible: true,
    x: coords[1],
    y: 0,
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
  }
}

export default {
  jxgType,
  onHandler,
  getConfig,
  create: loadObject,
}

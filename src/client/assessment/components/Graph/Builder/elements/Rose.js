import JXG from 'jsxgraph'
import { CONSTANT } from '../config'
import { Point } from '.'
import { nameGen, colorGenerator } from '../utils'

const jxgType = 106

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

function drawRose(board, obj, settings = {}) {
  const { fixed = true } = settings
  const { x, y, priorityColor, baseColor, dashed = false, label } = obj
  const currentColor = priorityColor || board.priorityColor || baseColor

  const point = createPoint(board, { x, y, label }, currentColor)

  const roseObj = board.$board.create(
    'curve',
    [(phi) => point.X() * Math.cos(2 * phi), [0, 0], 0, () => 2 * Math.PI],
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

  return roseObj
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
  return drawRose(board, object)
}

function loadObject(board, object, settings) {
  return drawRose(board, object, settings)
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

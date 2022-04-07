import { CONSTANT } from '../config'
import { Point } from '.'
import { colorGenerator } from '../utils'

const jxgType = 106

let tempPoints = []

function getColorParams(color) {
  return {
    // fillColor: color,
    strokeColor: color,
    highlightStrokeColor: color,
    // highlightFillColor: color,
  }
}

function drawRose(board, obj, settings = {}) {
  const k = 2
  const l = 2
  const { priorityColor, points, baseColor, dashed = false } = obj
  const [point1, point2] = points

  const { fixed = false } = settings

  const rose = board.$board.create(
    'curve',
    [
      (phi) => (point2.X() - point1.X()) * Math.cos(k * phi),
      [point1.X(), point1.Y()],
      0,
      () => l * Math.PI,
    ],
    {
      fixed,
      strokewidth: 2,
      dash: dashed ? 2 : 0,
      ...getColorParams(priorityColor || board.priorityColor || baseColor),
    }
  )

  rose.on('drag', () => {
    board.dragged = true
  })

  rose.type = jxgType
  rose.ancestors = {
    [point1.id]: point1,
    [point2.id]: point2,
  }
  rose.addParents(points)
  return rose
}

function onHandler(board, event) {
  const point = Point.onHandler(board, event)
  point.isTemp = true
  tempPoints.push(point)

  if (tempPoints.length === 2) {
    tempPoints.forEach((p) => {
      p.isTemp = false
    })

    const obj = {
      label: false,
      labelIsVisible: true,
      points: tempPoints,
      baseColor: colorGenerator(board.elements.length),
    }

    const roseObj = drawRose(board, obj)
    tempPoints = []
    return roseObj
  }
}

function loadObject(board, object, settings) {
  const { points } = object
  const pointObjs = points.map((obj) => Point.create(board, obj))
  const obj = {
    ...object,
    points: pointObjs,
  }
  const roseObj = drawRose(board, obj, settings)
  return roseObj
}

function getConfig(roseObj) {
  return {
    _type: roseObj.type,
    id: roseObj.id,
    type: CONSTANT.TOOLS.ROSE,
    label: roseObj.labelHTML || false,
    baseColor: roseObj.baseColor,
    dashed: roseObj.dashed,
    labelIsVisible: roseObj.labelIsVisible,
    points: Object.keys(roseObj.ancestors).map((n) =>
      Point.getConfig(roseObj.ancestors[n])
    ),
  }
}

function clean(board) {
  const result = tempPoints.length > 0
  tempPoints.forEach((point) => board.$board.removeObject(point))
  tempPoints = []
  return result
}

function getTempPoints() {
  return tempPoints
}

export default {
  jxgType,
  clean,
  onHandler,
  getConfig,
  create: loadObject,
  getTempPoints,
}

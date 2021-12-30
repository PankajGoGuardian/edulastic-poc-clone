import { CONSTANT } from '../config'
import { Point } from '.'
import { colorGenerator } from '../utils'

const jxgType = 107

let tempPoints = []

function getColorParams(color) {
  return {
    // fillColor: color,
    strokeColor: color,
    highlightStrokeColor: color,
    // highlightFillColor: color,
  }
}

function drawCardioidObj(board, obj, settings = {}) {
  const { priorityColor, points, baseColor, dashed = false } = obj
  const [point1, point2] = points

  const { fixed = false } = settings

  const cardioid = board.$board.create(
    'curve',
    [
      (phi) => (-(point2.X() - point1.X()) / 2) * (1 - Math.cos(phi)),
      [point1.X(), point1.Y()],
      0,
      2 * Math.PI,
    ],
    {
      fixed,
      strokewidth: 2,
      dash: dashed ? 2 : 0,
      ...getColorParams(priorityColor || board.priorityColor || baseColor),
    }
  )

  cardioid.on('drag', () => {
    board.dragged = true
  })

  cardioid.type = jxgType
  cardioid.ancestors = {
    [point1.id]: point1,
    [point2.id]: point2,
  }
  cardioid.addParents(points)
  return cardioid
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

    const cardioidObj = drawCardioidObj(board, obj)
    tempPoints = []
    return cardioidObj
  }
}

function loadObject(board, object, settings) {
  const { points } = object
  const pointObjs = points.map((obj) => Point.create(board, obj))
  const obj = {
    ...object,
    points: pointObjs,
  }
  const cardioidObj = drawCardioidObj(board, obj, settings)
  return cardioidObj
}

function getConfig(cardioidObj) {
  return {
    _type: cardioidObj.type,
    id: cardioidObj.id,
    type: CONSTANT.TOOLS.CARDIOID,
    label: cardioidObj.labelHTML || false,
    baseColor: cardioidObj.baseColor,
    dashed: cardioidObj.dashed,
    labelIsVisible: cardioidObj.labelIsVisible,
    points: Object.keys(cardioidObj.ancestors).map((n) =>
      Point.getConfig(cardioidObj.ancestors[n])
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

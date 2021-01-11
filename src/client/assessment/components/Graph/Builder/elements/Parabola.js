import { Point } from '.'
import { CONSTANT } from '../config'
import { handleSnap, colorGenerator, setLabel } from '../utils'
import { getLabelParameters } from '../settings'

const jxgType = 101

const defaultConfig = {
  fixed: false,
  strokeWidth: 2,
  highlightStrokeWidth: 2,
}

const direction = (p1, p2) => {
  if (p2.Y() - p1.Y() > 0 && p2.X() - p1.X() > 0) {
    return 1
  }
  if (p2.Y() - p1.Y() < 0 && p2.X() - p1.X() > 0) {
    return 2
  }
  if (p2.Y() - p1.Y() < 0 && p2.X() - p1.X() < 0) {
    return 3
  }
  return 4
}

const makeCallbackX = (p1, p2) => (x) => {
  if ([2, 4].includes(direction(p1, p2))) {
    const a = (1 / (p2.Y() - p1.Y()) ** 2) * (p2.X() - p1.X())
    return a * (x - p1.Y()) ** 2 + p1.X()
  }
  return x
}

const makeCallbackY = (p1, p2) => (y) => {
  if ([1, 3].includes(direction(p1, p2))) {
    const a = (1 / (p2.X() - p1.X()) ** 2) * (p2.Y() - p1.Y())
    return a * (y - p1.X()) ** 2 + p1.Y()
  }
  return y
}

let tempToolPoints = []

function getColorParams(color) {
  return {
    fillColor: 'transparent',
    strokeColor: color,
    highlightStrokeColor: color,
    highlightFillColor: 'transparent',
  }
}

function create(board, object, parabolaPoints, settings = {}) {
  const { labelIsVisible = true, fixed = false } = settings

  const { id = null, label, baseColor, priorityColor, dashed = false } = object

  const params = {
    ...defaultConfig,
    ...getColorParams(priorityColor || board.priorityColor || baseColor),
    label: {
      ...getLabelParameters(jxgType),
      visible: labelIsVisible,
    },
    dash: dashed ? 2 : 0,
    fixed,
    id,
  }

  const newLine = board.$board.create(
    'curve',
    [makeCallbackX(...parabolaPoints), makeCallbackY(...parabolaPoints)],
    params
  )

  newLine.type = jxgType
  newLine.labelIsVisible = object.labelIsVisible
  newLine.baseColor = object.baseColor
  newLine.dashed = object.dashed

  newLine.addParents(parabolaPoints)
  newLine.ancestors = {
    [parabolaPoints[0].id]: parabolaPoints[0],
    [parabolaPoints[1].id]: parabolaPoints[1],
  }

  if (!fixed) {
    handleSnap(newLine, Object.values(newLine.ancestors), board)
    board.handleStackedElementsMouseEvents(newLine)
  }

  if (labelIsVisible) {
    setLabel(newLine, label)
  }

  return newLine
}

function onHandler() {
  return (board, event) => {
    const newPoint = Point.onHandler(board, event)
    newPoint.isTemp = true
    tempToolPoints.push(newPoint)
    if (tempToolPoints.length === 2) {
      tempToolPoints.forEach((point) => {
        point.isTemp = false
      })
      const object = {
        label: false,
        labelIsVisible: true,
        baseColor: colorGenerator(board.elements.length),
      }
      const newLine = create(board, object, tempToolPoints)
      tempToolPoints = []
      return newLine
    }
  }
}

function clean(board) {
  const result = tempToolPoints.length > 0
  tempToolPoints.forEach((point) => board.$board.removeObject(point))
  tempToolPoints = []
  return result
}

function getConfig(parabola) {
  return {
    _type: parabola.type,
    type: CONSTANT.TOOLS.PARABOLA,
    id: parabola.id,
    label: parabola.labelHTML || false,
    labelIsVisible: parabola.labelIsVisible,
    baseColor: parabola.baseColor,
    dashed: parabola.dashed,
    points: Object.keys(parabola.ancestors)
      .sort()
      .map((n) => Point.getConfig(parabola.ancestors[n])),
  }
}

function getTempPoints() {
  return tempToolPoints
}

export default {
  jxgType,
  onHandler,
  getConfig,
  clean,
  getTempPoints,
  create,
  getColorParams,
  makeCallbackX,
  makeCallbackY,
}

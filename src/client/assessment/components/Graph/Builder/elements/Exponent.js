import { Point } from '.'
import { CONSTANT } from '../config'
import { handleSnap, colorGenerator, setLabel } from '../utils'
import { getLabelParameters } from '../settings'

const jxgType = 93

const defaultConfig = {
  fixed: false,
  strokeWidth: 2,
  highlightStrokeWidth: 2,
}

const makeCallback = (p1, p2) => (x) => {
  const a = p1.Y()
  const b = p2.Y() - p1.Y()
  const c = p2.X() - p1.X() >= 0 ? p2.X() - p1.X() : 1 / (p1.X() - p2.X())
  const d = -p1.X()
  return a + (b / c) * Math.E ** (x + d)
}

let points = []

function getColorParams(color) {
  return {
    fillColor: 'transparent',
    strokeColor: color,
    highlightStrokeColor: color,
    highlightFillColor: 'transparent',
  }
}

function create(board, object, expPoints, settings = {}) {
  const { labelIsVisible = true, fixed = false } = settings

  const { id = null, label, baseColor, priorityColor, dashed = false } = object

  const newLine = board.$board.create(
    'functiongraph',
    [makeCallback(...expPoints)],
    {
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
  )
  newLine.type = jxgType
  newLine.labelIsVisible = object.labelIsVisible
  newLine.baseColor = object.baseColor
  newLine.dashed = object.dashed

  newLine.addParents(expPoints)
  newLine.ancestors = {
    [expPoints[0].id]: expPoints[0],
    [expPoints[1].id]: expPoints[1],
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
    points.push(newPoint)
    if (points.length === 2) {
      points.forEach((point) => {
        point.isTemp = false
      })
      const object = {
        label: false,
        labelIsVisible: true,
        baseColor: colorGenerator(board.elements.length),
      }
      const newLine = create(board, object, points)
      points = []
      return newLine
    }
  }
}

function clean(board) {
  const result = points.length > 0
  points.forEach((point) => board.$board.removeObject(point))
  points = []
  return result
}

function getConfig(exponent) {
  return {
    _type: exponent.type,
    type: CONSTANT.TOOLS.EXPONENT,
    id: exponent.id,
    label: exponent.labelHTML || false,
    labelIsVisible: exponent.labelIsVisible,
    baseColor: exponent.baseColor,
    dashed: exponent.dashed,
    points: Object.keys(exponent.ancestors)
      .sort()
      .map((n) => Point.getConfig(exponent.ancestors[n])),
  }
}

function getTempPoints() {
  return points
}

export default {
  jxgType,
  onHandler,
  getConfig,
  clean,
  getTempPoints,
  create,
  makeCallback,
}

import { Point } from '.'
import { CONSTANT } from '../config'
import { handleSnap, colorGenerator, setLabel } from '../utils'
import { getLabelParameters } from '../settings'

const jxgType = 95

const defaultConfig = {
  fixed: false,
  strokeWidth: 2,
  highlightStrokeWidth: 2,
}

function isStart(startPointCoords, testPointCoords) {
  return (
    startPointCoords[1] === testPointCoords[1] &&
    startPointCoords[2] === testPointCoords[2]
  )
}

const makeCallback = (...points) => (x) => {
  let result = 0
  for (let i = 0; i < points.length; i++) {
    let li = 1
    for (let j = 0; j < points.length; j++) {
      if (i !== j) {
        li *= (x - points[j].X()) / (points[i].X() - points[j].X())
      }
    }
    result += points[i].Y() * li
  }

  return result
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

function flatConfigPoints(pointsConfig) {
  return pointsConfig.reduce((acc, p, i) => {
    acc[i] = p
    return acc
  }, {})
}

function create(board, object, polynomPoints, settings = {}) {
  const { labelIsVisible = true, fixed = false } = settings

  const { id = null, label, baseColor, priorityColor, dashed = false } = object

  const newPolynom = board.$board.create(
    'functiongraph',
    [makeCallback(...polynomPoints)],
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
  newPolynom.type = jxgType
  newPolynom.labelIsVisible = object.labelIsVisible
  newPolynom.baseColor = object.baseColor
  newPolynom.dashed = object.dashed

  newPolynom.addParents(polynomPoints)
  newPolynom.ancestors = flatConfigPoints(polynomPoints)

  if (!fixed) {
    handleSnap(newPolynom, Object.values(newPolynom.ancestors), board)
    board.handleStackedElementsMouseEvents(newPolynom)
  }

  if (labelIsVisible) {
    setLabel(newPolynom, label)
  }

  return newPolynom
}

function onHandler() {
  return (board, event) => {
    const newPoint = Point.onHandler(board, event)
    newPoint.isTemp = true
    if (!points.length) {
      newPoint.setAttribute(Point.getColorParams('#000'))
      points.push(newPoint)
      return
    }

    if (isStart(points[0].coords.usrCoords, newPoint.coords.usrCoords)) {
      board.$board.removeObject(newPoint)

      const baseColor = colorGenerator(board.elements.length)
      points[0].setAttribute(
        Point.getColorParams(board.priorityColor || baseColor)
      )
      points.forEach((point) => {
        point.isTemp = false
      })
      const object = {
        label: false,
        labelIsVisible: true,
        baseColor,
      }
      const newPolynom = create(board, object, points)
      points = []
      return newPolynom
    }

    points.push(newPoint)
  }
}

function clean(board) {
  const result = points.length > 0
  points.forEach((point) => board.$board.removeObject(point))
  points = []
  return result
}

function getConfig(polynom) {
  return {
    _type: polynom.type,
    type: CONSTANT.TOOLS.POLYNOM,
    id: polynom.id,
    label: polynom.labelHTML || false,
    baseColor: polynom.baseColor,
    dashed: polynom.dashed,
    labelIsVisible: polynom.labelIsVisible,
    points: Object.keys(polynom.ancestors)
      .sort()
      .map((n) => Point.getConfig(polynom.ancestors[n])),
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
  flatConfigPoints,
  getTempPoints,
  create,
  makeCallback,
}

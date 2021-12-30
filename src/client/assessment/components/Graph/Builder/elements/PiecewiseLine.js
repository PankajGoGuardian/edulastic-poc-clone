import JXG from 'jsxgraph'
import { notification } from '@edulastic/common'
import { Point } from '.'
import { CONSTANT } from '../config'
import { colorGenerator, setLabel, getClosest } from '../utils'
import { getLabelParameters } from '../settings'

const jxgType = 105

let tempPoints = []

const defaultConfig = {
  strokeWidth: 2,
  highlightStrokeWidth: 2,
}

function getColorParams(color) {
  return {
    fillColor: 'transparent',
    strokeColor: color,
    highlightStrokeColor: color,
    highlightFillColor: 'transparent',
  }
}

/**
 * @param {object[]} points [p1, p2, p3 | undefined, p4 | undefined]
 * @param {string} op x | y | min | max default y
 * @returns {null | function}
 */
function makeCallback(points, op = 'y') {
  const [p1, p2] = points.filter((p) => !p.piecewise)
  const vertical = p1.X() - p2.X() === 0
  const ax = vertical ? 'Y' : 'X'
  // min and max
  if (op === 'max') {
    const maxBase = p1[ax]() > p2[ax]() ? p1 : p2
    const max = points
      .filter((p) => p.piecewise)
      .find((p) => p[ax]() >= maxBase[ax]())
    if (!max) {
      return null
    }
    max.isMaxPoint = true
    return () => max[ax]()
  }

  if (op === 'min') {
    const minBase = p1[ax]() < p2[ax]() ? p1 : p2
    const min = points
      .filter((p) => p.piecewise)
      .find((p) => p[ax]() <= minBase[ax]())
    if (!min) {
      return null
    }
    return () => min[ax]()
  }
  // x and y
  return (v) => {
    if (p1.X() - p2.X() === 0) {
      return op === 'x' ? p1.X() : v
    }
    if (op === 'x') {
      return v
    }
    const m = (p1.Y() - p2.Y()) / (p1.X() - p2.X())
    return m * (v - p1.X()) + p1.Y()
  }
}

function getPossiblePoints(board, line) {
  const [p0, p1] = Object.values(line.ancestors)
    .filter((x) => !x.piecewise)
    .map((ancestor) => ({ x: ancestor.X(), y: ancestor.Y() }))

  const {
    gridParameters: { gridY, gridX },
    graphParameters: { xMin, xMax, yMin, yMax },
  } = board.parameters || { gridParameters: {} }

  const possibleY = []
  for (let i = gridY; i <= yMax; i += gridY) {
    possibleY.push(i)
  }

  for (let i = 0; i >= yMin; i -= gridY) {
    possibleY.push(i)
  }
  if (p0.x - p1.x === 0) {
    const max = p0.y > p1.y ? p0.y : p1.y
    const min = p0.y < p1.y ? p0.y : p1.y
    return possibleY
      .map((y) => {
        if (y >= max || y <= min) {
          return { x: p0.x, y }
        }
        return false
      })
      .filter((x) => x)
  }

  const m = (p0.y - p1.y) / (p0.x - p1.x)
  const max = p0.x > p1.x ? p0.x : p1.x
  const min = p0.x > p1.x ? p1.x : p0.x

  const possible = []
  for (let i = max; i <= xMax; i += gridX) {
    const y = m * (i - p0.x) + p0.y

    if (possibleY.includes(y)) {
      possible.push({ x: i, y })
    }
  }

  for (let i = min; i >= xMin; i -= gridX) {
    const y = m * (i - p0.x) + p0.y
    if (possibleY.includes(y)) {
      possible.push({ x: i, y })
    }
  }

  return possible
}

function createPiecewisePoint(board, pos, line) {
  const possiblePoints = getPossiblePoints(board, line)
  const [x0, x1] = Object.values(line.ancestors)
    .filter((x) => !x.piecewise)
    .map((ancestor) => ancestor.X())
  // check if can add point to line???
  if ((x0 < pos.x && x1 > pos.x) || (x0 > pos.x && x1 < pos.x)) {
    return null
  }

  const max = x0 > x1 ? x0 : x1
  const isMaxPoint = max < pos.x
  // allows to add only two point min or max
  const ancestors = Object.values(line.ancestors)
    .filter((x) => x.piecewise)
    .map((x) => x.isMaxPoint)
  if (
    (isMaxPoint && ancestors.some((x) => x)) ||
    (!isMaxPoint && ancestors.some((x) => !x))
  ) {
    return null
  }

  const object = {
    x: pos.x,
    y: pos.y,
    labelIsVisible: true,
    pointIsVisible: true,
    id: null,
  }
  const conf = { size: 6 }
  const newPoint = Point.create(board, object, conf)
  if (
    possiblePoints.some((p) => p.x === newPoint.X() && p.y === newPoint.Y())
  ) {
    newPoint.closed = true
    newPoint.piecewise = true
    return newPoint
  }

  const msgStr = possiblePoints.map((p) => `(${p.x}, ${p.y})`).join(',')
  notification({ msg: `Possible points are ${msgStr}` })
  newPoint.remove()
}

function handleDragPoint(board, line, point) {
  board.dragged = true
  if (!point.piecewise) {
    const ancestors = {}
    Object.values(line.ancestors).forEach((p) => {
      if (p.piecewise) {
        p.remove()
      } else {
        ancestors[p.id] = p
      }
    })

    line.ancestors = ancestors
    line.parents = Object.values(ancestors).map((p) => p.id)

    delete line.maxX
    delete line.minX
    return
  }
  const [p1, p2] = Object.values(line.ancestors).filter((p) => !p.piecewise)
  const vertical = p1.X() - p2.X() === 0
  const ax = vertical ? 'Y' : 'X'
  const maxBase = p1[ax]() > p2[ax]() ? p1 : p2
  const minBase = p1[ax]() < p2[ax]() ? p1 : p2

  if (point.isMaxPoint && point[ax]() <= maxBase[ax]()) {
    point.setPosition(JXG.COORDS_BY_USER, [maxBase.X(), maxBase.Y()])
    return
  }
  if (!point.isMaxPoint && point[ax]() >= minBase[ax]()) {
    point.setPosition(JXG.COORDS_BY_USER, [minBase.X(), minBase.Y()])
    return
  }

  if (!vertical) {
    const m = (p1.Y() - p2.Y()) / (p1.X() - p2.X())
    const y = m * (point.X() - p1.X()) + p1.Y()
    point.setPosition(JXG.COORDS_BY_USER, [point.X(), y])
  } else {
    point.setPosition(JXG.COORDS_BY_USER, [p1.X(), point.Y()])
  }
}

function handleDragStop(board, line, point) {
  if (point.piecewise) {
    const pArr = getPossiblePoints(board, line)
    if (pArr.length > 0) {
      const closest = getClosest(pArr, point.Y())
      point.setPosition(JXG.COORDS_BY_USER, [closest.x, closest.y])
      board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE)
    }
  }
}

function drawline(board, object, points, settings = {}) {
  const { labelIsVisible = true } = settings
  const { id = null, label, baseColor, priorityColor, dashed = false } = object
  const fxConf = [
    makeCallback(points, 'x'),
    makeCallback(points, 'y'),
    makeCallback(points, 'min'),
    makeCallback(points, 'max'),
  ]

  const line = board.$board.create('curve', fxConf, {
    ...defaultConfig,
    ...getColorParams(priorityColor || board.priorityColor || baseColor),
    label: {
      ...getLabelParameters(jxgType),
      visible: labelIsVisible,
    },
    dash: dashed ? 2 : 0,
    fixed: true,
    id,
  })

  line.type = jxgType
  line.labelIsVisible = object.labelIsVisible
  line.baseColor = object.baseColor
  line.dashed = object.dashed
  line.addParents(points)
  line.ancestors = {}

  points.forEach((p) => {
    line.ancestors[p.id] = p
    p.on('drag', () => handleDragPoint(board, line, p))
    p.on('up', () => handleDragStop(board, line, p))
  })

  if (labelIsVisible) {
    setLabel(line, label)
  }

  return line
}

function create(board, object, settings = {}) {
  const points = Object.values(object.points).map((p) => {
    if (!p.piecewise) {
      return Point.create(board, p)
    }
    const conf = {
      size: 6,
      fixed: false,
      attchEvent: false,
      snapToGrid: false,
      labelIsVisible: false,
      ...(p.closed ? {} : { fillColor: '#fff', highlightFillColor: '#fff' }),
    }
    const point = Point.create(board, p, conf)
    point.piecewise = true
    point.closed = p.closed
    return point
  })

  return drawline(board, object, points, settings)
}

function clean(board) {
  const result = tempPoints.length > 0
  tempPoints.forEach((point) => board.$board.removeObject(point))
  tempPoints = []
  return result
}

function getConfig(line) {
  return {
    _type: line.type,
    id: line.id,
    type: CONSTANT.TOOLS.PIECEWISE_LINE,
    label: line.labelHTML || false,
    baseColor: line.baseColor,
    dashed: line.dashed,
    labelIsVisible: line.labelIsVisible,
    points: Object.keys(line.ancestors).map((n) => {
      const pConf = Point.getConfig(line.ancestors[n])
      if (line.ancestors[n]?.piecewise) {
        pConf.closed = line.ancestors[n].closed
        pConf.piecewise = line.ancestors[n].piecewise
      }
      return pConf
    }),
  }
}

function getTempPoints() {
  return tempPoints
}

function onHandler() {
  return (board, event) => {
    const point = Point.onHandler(board, event)
    point.isTemp = true
    tempPoints.push(point)
    if (tempPoints.length === 2) {
      const object = {
        label: false,
        labelIsVisible: true,
        baseColor: colorGenerator(board.elements.length),
      }
      const newLine = drawline(board, object, tempPoints)
      tempPoints = []
      return newLine
    }
  }
}

export default {
  jxgType,
  onHandler,
  getConfig,
  clean,
  create,
  getTempPoints,
  createPiecewisePoint,
}

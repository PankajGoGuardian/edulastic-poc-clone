import JXG from 'jsxgraph'
import { notification } from '@edulastic/common'
import { Point } from '.'
import { CONSTANT } from '../config'
import { handleSnap, colorGenerator, setLabel } from '../utils'
import { getLabelParameters } from '../settings'

const jxgType = 106

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

const makeCallbackP = (points, op) => {
  const [p1, p2] = points.filter((p) => !p.piecewise)
  const dir = direction(p1, p2)
  const vertical = [1, 3].includes(dir)
  const ax = vertical ? 'X' : 'Y'

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

  return null
}

function getPossiblePoints(board, line) {
  const [p0, p1] = Object.values(line.ancestors).filter((x) => !x.piecewise)
  const {
    gridParameters: { gridY, gridX },
    graphParameters: { xMin, xMax, yMin, yMax },
  } = board.parameters || { gridParameters: {} }

  const possibleX = []
  const possibleY = []
  for (let i = gridX; i <= xMax; i += gridX) {
    possibleX.push(i)
  }
  for (let i = 0; i >= xMin; i -= gridX) {
    possibleX.push(i)
  }
  for (let i = gridY; i <= yMax; i += gridY) {
    possibleY.push(i)
  }
  for (let i = 0; i >= yMin; i -= gridY) {
    possibleY.push(i)
  }

  const dir = direction(p0, p1)
  let possible = []
  if ([1, 3].includes(dir)) {
    const callback = makeCallbackY(p0, p1)
    const max = p0.X() > p1.X() ? p0.X() : p1.X()
    const min = p0.X() < p1.X() ? p0.X() : p1.X()
    possible = possibleX
      .map((x) => ({ x, y: callback(x) }))
      .filter((p) => p.x >= max || p.x <= min)
  } else if ([2, 4].includes(dir)) {
    const callback = makeCallbackX(p0, p1)
    const max = p0.Y() > p1.Y() ? p0.Y() : p1.Y()
    const min = p0.Y() < p1.Y() ? p0.Y() : p1.Y()
    possible = possibleY
      .map((y) => ({ x: callback(y), y }))
      .filter((p) => p.y >= max || p.y <= min)
  }

  return possible.filter(
    (p) => possibleX.includes(p.x) && possibleY.includes(p.y)
  )
}

function createPiecewisePoint(board, pos, line) {
  const possible = getPossiblePoints(board, line)
  const object = {
    x: pos.x,
    y: pos.y,
    labelIsVisible: true,
    pointIsVisible: true,
    id: null,
  }
  const conf = { size: 6 }
  const newPoint = Point.create(board, object, conf)

  if (possible.some((p) => p.x === newPoint.X() && p.y === newPoint.Y())) {
    newPoint.closed = true
    newPoint.piecewise = true
    return newPoint
  }

  newPoint.remove()
  const msgStr = possible.map((p) => `(${p.x}, ${p.y})`).join(',')
  notification({ msg: `Possible points are ${msgStr}` })
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

function removePiecewise(board, line) {
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
}

function handleDragPoint(board, line, point) {
  board.dragged = true
  if (!point.piecewise) {
    removePiecewise(board, line)
    return
  }
  const [p0, p1] = Object.values(line.ancestors).filter((x) => !x.piecewise)
  const dir = direction(p0, p1)
  const vertical = [3, 1].includes(dir)
  const callback = vertical ? makeCallbackY(p0, p1) : makeCallbackX(p0, p1)

  point.setPosition(
    JXG.COORDS_BY_USER,
    vertical
      ? [point.X(), callback(point.X())]
      : [callback(point.Y()), point.Y()]
  )
}

function handleDragStop(board, line, point) {
  if (point.piecewise) {
    const pArr = getPossiblePoints(board, line)
    if (pArr.length > 0) {
      const dir = direction(
        ...Object.values(line.ancestors).filter((x) => !x.piecewise)
      )
      const vertical = [3, 1].includes(dir)
      const n = vertical ? point.X() : point.Y()
      const ax = vertical ? 'x' : 'y'

      const closest = pArr.reduce(
        (prev, curr) =>
          Math.abs(curr[ax] - n) < Math.abs(prev[ax] - n) ? curr : prev,
        pArr[0]
      )

      point.setPosition(JXG.COORDS_BY_USER, [closest.x, closest.y])
      board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE)
    }
  }
}

function drawline(board, object, points, settings = {}) {
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
    [
      makeCallbackX(...points.filter((p) => !p.piecewise)),
      makeCallbackY(...points.filter((p) => !p.piecewise)),
      makeCallbackP(points, 'min'),
      makeCallbackP(points, 'max'),
    ],
    params
  )

  newLine.type = jxgType
  newLine.labelIsVisible = object.labelIsVisible
  newLine.baseColor = object.baseColor
  newLine.dashed = object.dashed
  newLine.addParents(points)

  newLine.ancestors = {}
  points.forEach((p) => {
    newLine.ancestors[p.id] = p
    p.on('drag', () => handleDragPoint(board, newLine, p))
    p.on('up', () => handleDragStop(board, newLine, p))
  })

  if (!fixed) {
    newLine.on('drag', () => {
      board.dragged = true
      removePiecewise(board, newLine)
    })
    handleSnap(newLine, Object.values(newLine.ancestors), board)
    board.handleStackedElementsMouseEvents(newLine)
  }

  if (labelIsVisible) {
    setLabel(newLine, label)
  }

  return newLine
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
      const newLine = drawline(board, object, tempToolPoints)
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
    points: Object.keys(parabola.ancestors).map((n) => {
      const pConf = Point.getConfig(parabola.ancestors[n])
      if (parabola.ancestors[n]?.piecewise) {
        pConf.closed = parabola.ancestors[n].closed
        pConf.piecewise = parabola.ancestors[n].piecewise
      }
      return pConf
    }),
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
  drawline,
  getColorParams,
  makeCallbackX,
  makeCallbackY,
  createPiecewisePoint,
}

/* eslint-disable no-empty */
import JXG from 'jsxgraph'
import { flattenDeep, isEqual, max, min } from 'lodash'
import { notification } from '@edulastic/common'
import { parse } from 'mathjs'
import { CONSTANT } from '../config'
import {
  isInPolygon,
  getLineFunc,
  getCircleFunc,
  getEllipseFunc,
  getHyperbolaFunc,
  getParabolaFunc,
  getEquationFromApiLatex,
  fixApiLatex,
} from '../utils'
import {
  Equation,
  Exponent,
  Hyperbola,
  Logarithm,
  Parabola,
  Parabola2,
  Polynom,
  Secant,
  Sin,
  Cos,
  Tangent,
  Circle,
  Ellipse,
  Exponent2,
  Cardioid,
  Rose,
} from '.'

const jxgType = 100

const AVAILABLE_TYPES = [
  JXG.OBJECT_TYPE_CIRCLE,
  JXG.OBJECT_TYPE_CONIC,
  JXG.OBJECT_TYPE_LINE,
  JXG.OBJECT_TYPE_POLYGON,
  Exponent.jxgType,
  Hyperbola.jxgType,
  Logarithm.jxgType,
  Parabola.jxgType,
  Parabola2.jxgType,
  Polynom.jxgType,
  Sin.jxgType,
  Cos.jxgType,
  Equation.jxgType,
  Exponent2.jxgType,
  Cardioid.jxgType,
  Rose.jxgType,
]

function rnd(num) {
  return +num.toFixed(3)
}

function getColorParams(color) {
  return {
    fillColor: '#fff',
    strokeColor: color,
    highlightStrokeColor: color,
    highlightFillColor: '#fff',
  }
}

function checkElements(shapes) {
  return shapes.some(
    (el) => el.type === Secant.jxgType || el.type === Tangent.jxgType
  )
}

function getFunctions(shapes) {
  const funcs = shapes
    .filter((el) => AVAILABLE_TYPES.includes(el.type) && !el.latexIsBroken)
    .map((item) => {
      if (item.latex) {
        // fix apiLatex if not fixed already
        const apiLatex = getEquationFromApiLatex(item.apiLatex)
        item.fixedLatex = item.fixedLatex || fixApiLatex(apiLatex)
        // parse & evaluate the math equation
        const func = parse(item.fixedLatex.latexFunc)
        return (x, y) => func.eval({ x, y }) > 0
      }

      switch (item.type) {
        case JXG.OBJECT_TYPE_CIRCLE: {
          const { points } = Circle.getConfig(item)
          const func = getCircleFunc(
            { x: points[0].x, y: points[0].y },
            { x: points[1].x, y: points[1].y }
          )
          return (x, y) => func(x, y) > 0
        }
        case JXG.OBJECT_TYPE_CONIC: {
          const { points } = Ellipse.getConfig(item)
          const func = getEllipseFunc(
            { x: points[0].x, y: points[0].y },
            { x: points[1].x, y: points[1].y },
            { x: points[2].x, y: points[2].y }
          )
          return (x, y) => func(x, y) > 0
        }
        case JXG.OBJECT_TYPE_LINE: {
          const func = getLineFunc(
            { x: item.point1.X(), y: item.point1.Y() },
            { x: item.point2.X(), y: item.point2.Y() }
          )
          return (x, y) => func(x, y) > 0
        }
        case JXG.OBJECT_TYPE_POLYGON: {
          const vertices = Object.values(item.ancestors).map((anc) => ({
            x: anc.X(),
            y: anc.Y(),
          }))
          return (x, y) => isInPolygon({ x, y }, vertices)
        }
        case Exponent.jxgType: {
          const points = Object.values(item.ancestors)
          return (x, y) => y > Exponent.makeCallback(...points)(x)
        }
        case Exponent2.jxgType: {
          const points = Object.values(item.ancestors)
          return (x, y) => y > Exponent2.makeCallback(points[0])(x)
        }
        case Hyperbola.jxgType: {
          const { points } = Hyperbola.getConfig(item)
          const func = getHyperbolaFunc(
            { x: points[0].x, y: points[0].y },
            { x: points[1].x, y: points[1].y },
            { x: points[2].x, y: points[2].y }
          )
          return (x, y) => func(x, y) > 0
        }
        case Logarithm.jxgType: {
          const points = Object.values(item.ancestors)
          const [p1, p2] = points
          return (x, y) => {
            if (p2.Y() > p1.Y()) {
              return y < Logarithm.makeCallback(...points)(x)
            }
            return y > Logarithm.makeCallback(...points)(x)
          }
        }
        case Parabola.jxgType: {
          const points = Object.values(item.ancestors)
          return (x, y) =>
            Parabola.makeCallbackY(...points)(x) >
            Parabola.makeCallbackX(...points)(y)
        }
        case Parabola2.jxgType: {
          const points = Object.values(item.ancestors)
          const func = getParabolaFunc(
            { x: points[0].X(), y: points[0].Y() },
            { x: points[1].X(), y: points[1].Y() },
            { x: points[2].X(), y: points[2].Y() }
          )
          return (x, y) => func(x, y) > 0
        }
        case Polynom.jxgType: {
          const points = Object.values(item.ancestors)
          return (x, y) => y > Polynom.makeCallback(...points)(x)
        }
        case Secant.jxgType: {
          const points = Object.values(item.ancestors)
          return (x, y) => y > Secant.makeCallback(...points)(x)
        }
        case Sin.jxgType: {
          const points = Object.values(item.ancestors)
          return (x, y) => y > Sin.makeCallback(...points)(x)
        }
        case Cos.jxgType: {
          const points = Object.values(item.ancestors)
          return (x, y) => y > Cos.makeCallback(...points)(x)
        }
        case Tangent.jxgType: {
          const points = Object.values(item.ancestors)
          return (x, y) => y > Tangent.makeCallback(...points)(x)
        }
        default:
          return () => true
      }
    })
  return funcs
}

// return [xMax, xMin, yMax, yMin]
function getAreaBounding(lines) {
  const xGroup = flattenDeep(lines.map(({ p1, p2 }) => [p1.x, p2.x]))
  const yGroup = flattenDeep(lines.map(({ p1, p2 }) => [p1.y, p2.y]))
  return [max(xGroup), min(xGroup), max(yGroup), min(yGroup)]
}

function getExistAreaBoundings(board) {
  const existAreaBoundingBoxes = board.elements
    .filter((x) => x.type === jxgType)
    .map((area) => {
      const { shadingAreaLines } = area
      const lines = shadingAreaLines.map((line) => ({
        p1: {
          x: line.point1.X(),
          y: line.point1.Y(),
        },
        p2: {
          x: line.point2.X(),
          y: line.point2.Y(),
        },
      }))

      return getAreaBounding(lines)
    })
  return existAreaBoundingBoxes
}

function getAreaByPoint({ usrX, usrY }, [xMin, yMax, xMax, yMin], funcs) {
  const stepX = rnd(0.002 * Math.abs(xMax - xMin))
  const stepY = rnd(0.002 * Math.abs(yMax - yMin))

  function calc(x, y) {
    if (
      x < xMin - stepX ||
      x > xMax + stepX ||
      y < yMin - stepY ||
      y > yMax + stepY
    ) {
      return null
    }
    return funcs.map((func) => func(x, y))
  }

  const usrPointResult = calc(usrX, usrY)
  const x = usrX
  let y = usrY
  let pointResult = calc(x, y)
  // go down
  while (isEqual(pointResult, usrPointResult)) {
    y = rnd(y - stepY)
    pointResult = calc(x, y)
  }
  y = rnd(y + stepY)

  const startX = x
  const startY = y
  const areaPoints = []
  areaPoints.push({ x: startX, y: startY })

  function getNextDirection(direction) {
    if (direction === 'up') {
      return 'right'
    }
    if (direction === 'right') {
      return 'down'
    }
    if (direction === 'down') {
      return 'left'
    }
    if (direction === 'left') {
      return 'up'
    }
  }

  function getPrevDirection(direction) {
    if (direction === 'up') {
      return 'left'
    }
    if (direction === 'left') {
      return 'down'
    }
    if (direction === 'down') {
      return 'right'
    }
    if (direction === 'right') {
      return 'up'
    }
  }

  function getNextPointByDirection(point, direction) {
    if (direction === 'up') {
      return { x: point.x, y: rnd(point.y + stepY) }
    }
    if (direction === 'left') {
      return { x: rnd(point.x - stepX), y: point.y }
    }
    if (direction === 'down') {
      return { x: point.x, y: rnd(point.y - stepY) }
    }
    if (direction === 'right') {
      return { x: rnd(point.x + stepX), y: point.y }
    }
  }

  let currentDirection = 'down'
  let i = 0
  // go about border by clockwise
  while (
    areaPoints[i].x !== startX ||
    areaPoints[i].y !== startY ||
    areaPoints.length === 1
  ) {
    let point = getNextPointByDirection(areaPoints[i], currentDirection)
    let k = 0
    while (!isEqual(calc(point.x, point.y), usrPointResult)) {
      currentDirection = getNextDirection(currentDirection)
      point = getNextPointByDirection(areaPoints[i], currentDirection)
      k++
      // something wrong
      if (k === 5) {
        return
      }
    }

    currentDirection = getPrevDirection(currentDirection)

    if (areaPoints[i - 1] && isEqual(areaPoints[i - 1], point)) {
      areaPoints.pop()
      i--
    } else {
      areaPoints.push(point)
      i++
    }

    // something wrong
    if (i === 100000) {
      return
    }
  }

  const filteredAreaPoints = []
  // filter points on line
  areaPoints.push(areaPoints[1])
  for (let j = 1; j < areaPoints.length - 1; j++) {
    if (
      !(
        areaPoints[j - 1].x === areaPoints[j].x &&
        areaPoints[j].x === areaPoints[j + 1].x
      ) &&
      !(
        areaPoints[j - 1].y === areaPoints[j].y &&
        areaPoints[j].y === areaPoints[j + 1].y
      )
    ) {
      filteredAreaPoints.push(areaPoints[j])
    }
  }

  const isTurnRight = (p, p1, p2, p3) =>
    (p1.x === p2.x &&
      p.x > p1.x &&
      p3.x > p2.x &&
      p.y === p1.y &&
      p2.y === p3.y &&
      p.x > p2.x &&
      p.y < p2.y) ||
    (p1.y === p2.y &&
      p.y < p1.y &&
      p3.y < p2.y &&
      p.x === p1.x &&
      p2.x === p3.x &&
      p.x < p2.x &&
      p.y < p2.y) ||
    (p1.x === p2.x &&
      p.x < p1.x &&
      p3.x < p2.x &&
      p.y === p1.y &&
      p2.y === p3.y &&
      p.x < p2.x &&
      p.y > p2.y) ||
    (p1.y === p2.y &&
      p.y > p1.y &&
      p3.y > p2.y &&
      p.x === p1.x &&
      p2.x === p3.x &&
      p.x > p2.x &&
      p.y > p2.y)

  const isTurnLeft = (p, p1, p2, p3) =>
    (p1.x === p2.x &&
      p.x > p1.x &&
      p3.x > p2.x &&
      p.y === p1.y &&
      p2.y === p3.y &&
      p.x > p2.x &&
      p.y > p2.y) ||
    (p1.y === p2.y &&
      p.y < p1.y &&
      p3.y < p2.y &&
      p.x === p1.x &&
      p2.x === p3.x &&
      p.x > p2.x &&
      p.y < p2.y) ||
    (p1.x === p2.x &&
      p.x < p1.x &&
      p3.x < p2.x &&
      p.y === p1.y &&
      p2.y === p3.y &&
      p.x < p2.x &&
      p.y < p2.y) ||
    (p1.y === p2.y &&
      p.y > p1.y &&
      p3.y > p2.y &&
      p.x === p1.x &&
      p2.x === p3.x &&
      p.x < p2.x &&
      p.y > p2.y)

  // find indexes of turn points
  const turnIndexes = []
  filteredAreaPoints.push(filteredAreaPoints[0])
  filteredAreaPoints.push(filteredAreaPoints[1])
  filteredAreaPoints.push(filteredAreaPoints[2])
  for (let j = 0; j < filteredAreaPoints.length - 3; j++) {
    if (
      isTurnLeft(
        filteredAreaPoints[j],
        filteredAreaPoints[j + 1],
        filteredAreaPoints[j + 2],
        filteredAreaPoints[j + 3]
      )
    ) {
      turnIndexes.push(j)
      turnIndexes.push(j + 1)
      turnIndexes.push(j + 2)
      turnIndexes.push(j + 3)
    } else if (
      isTurnRight(
        filteredAreaPoints[j],
        filteredAreaPoints[j + 1],
        filteredAreaPoints[j + 2],
        filteredAreaPoints[j + 3]
      )
    ) {
      turnIndexes.push(j + 1)
      turnIndexes.push(j + 2)
    }
  }
  filteredAreaPoints.pop()
  filteredAreaPoints.pop()
  filteredAreaPoints.pop()
  if (turnIndexes.includes(filteredAreaPoints.length)) {
    turnIndexes.push(0)
  }
  if (turnIndexes.includes(filteredAreaPoints.length + 1)) {
    turnIndexes.push(1)
  }
  if (turnIndexes.includes(filteredAreaPoints.length + 2)) {
    turnIndexes.push(2)
  }

  const smoothedAreaPoints = []
  let lastAdded = false
  for (let j = 0; j < filteredAreaPoints.length; j++) {
    if (turnIndexes.includes(j)) {
      smoothedAreaPoints.push(filteredAreaPoints[j])
      lastAdded = true
      continue
    }
    if (lastAdded) {
      lastAdded = false
      continue
    }
    smoothedAreaPoints.push(filteredAreaPoints[j])
    lastAdded = true
  }

  const resultAreaPoints = []
  resultAreaPoints.push(smoothedAreaPoints[0])
  for (let j = 1; j < smoothedAreaPoints.length - 1; j++) {
    const x1 = smoothedAreaPoints[j].x
    const x2 = smoothedAreaPoints[j - 1].x
    const x3 = smoothedAreaPoints[j + 1].x
    const y1 = smoothedAreaPoints[j].y
    const y2 = smoothedAreaPoints[j - 1].y
    const y3 = smoothedAreaPoints[j + 1].y
    const left = (y1 - y2) / (x1 - x2)
    const right = (y1 - y3) / (x1 - x3)
    if (rnd(left) !== rnd(right)) {
      resultAreaPoints.push(smoothedAreaPoints[j])
    }
  }
  resultAreaPoints.push(smoothedAreaPoints[smoothedAreaPoints.length - 1])

  return resultAreaPoints
}

function getAreaLinesByPoint({ usrX, usrY }, board, funcs) {
  const result = []
  const [xMin, yMax, xMax, yMin] = board.$board.getBoundingBox()

  // horizontal lines
  // const stepX = rnd(0.002 * Math.abs(xMax - xMin));
  // const stepY = rnd(0.02 * Math.abs(yMax - yMin));
  //
  // function calc(x, y) {
  //   if (x < xMin - stepX || x > xMax + stepX || y < yMin - stepY || y > yMax + stepY) {
  //     return null;
  //   }
  //   return funcs.map(func => func(x, y));
  // }
  //
  // const usrPointResult = calc(usrX, usrY);
  //
  // for (let y = yMax; y >= yMin; y = rnd(y - stepY)) {
  //   let curPointResult = calc(xMin, y);
  //   let xStart = isEqual(curPointResult, usrPointResult) ? xMin : null;
  //
  //   for (let x = rnd(xMin + stepX); x <= xMax; x = rnd(x + stepX)) {
  //     curPointResult = calc(x, y);
  //     if (isEqual(curPointResult, usrPointResult) && xStart !== null) {
  //       continue;
  //     }
  //     if (!isEqual(curPointResult, usrPointResult) && xStart !== null) {
  //       result.push({
  //         p1: { x: xStart, y },
  //         p2: { x: rnd(x - stepX), y }
  //       });
  //       xStart = null;
  //       continue;
  //     }
  //     if (!isEqual(curPointResult, usrPointResult) && xStart === null) {
  //       continue;
  //     }
  //     if (isEqual(curPointResult, usrPointResult) && xStart === null) {
  //       xStart = x;
  //     }
  //   }
  //
  //   if (xStart !== null) {
  //     result.push({
  //       p1: { x: xStart, y },
  //       p2: { x: xMax, y }
  //     });
  //   }
  // }

  // 45 deg lines
  const step = 18 // px
  const width = board.$board.canvasWidth
  const height = board.$board.canvasHeight

  function calc(x, y) {
    if (x < xMin || x > xMax || y < yMin || y > yMax) {
      return null
    }
    return funcs.map((func) => func(x, y))
  }

  const usrPointResult = calc(usrX, usrY)

  let i
  for (i = step; i <= height; i += step) {
    let y = i
    let x = 0
    let xStart = null
    let yStart = null

    while (x < width && y > 0) {
      const coords = new JXG.Coords(JXG.COORDS_BY_SCREEN, [x, y], board.$board)
      const curPointResult = calc(coords.usrCoords[1], coords.usrCoords[2])

      if (
        isEqual(curPointResult, usrPointResult) &&
        xStart !== null &&
        yStart !== null
      ) {
      } else if (
        !isEqual(curPointResult, usrPointResult) &&
        xStart !== null &&
        yStart !== null
      ) {
        const resCoords = new JXG.Coords(
          JXG.COORDS_BY_SCREEN,
          [x - 1, y + 1],
          board.$board
        )
        result.push({
          p1: { x: rnd(xStart), y: rnd(yStart) },
          p2: {
            x: rnd(resCoords.usrCoords[1]),
            y: rnd(resCoords.usrCoords[2]),
          },
        })
        xStart = null
        yStart = null
      } else if (
        !isEqual(curPointResult, usrPointResult) &&
        xStart === null &&
        yStart === null
      ) {
      } else if (
        isEqual(curPointResult, usrPointResult) &&
        xStart === null &&
        yStart === null
      ) {
        xStart = coords.usrCoords[1]
        yStart = coords.usrCoords[2]
      }

      x += 2
      y -= 2
    }

    if (xStart !== null && yStart !== null) {
      const resCoords = new JXG.Coords(
        JXG.COORDS_BY_SCREEN,
        [x, y],
        board.$board
      )
      result.push({
        p1: { x: rnd(xStart), y: rnd(yStart) },
        p2: { x: rnd(resCoords.usrCoords[1]), y: rnd(resCoords.usrCoords[2]) },
      })
    }
  }

  for (i -= height; i <= width; i += step) {
    let y = height
    let x = i
    let xStart = null
    let yStart = null

    while (x < width && y > 0) {
      const coords = new JXG.Coords(JXG.COORDS_BY_SCREEN, [x, y], board.$board)
      const curPointResult = calc(coords.usrCoords[1], coords.usrCoords[2])

      if (
        isEqual(curPointResult, usrPointResult) &&
        xStart !== null &&
        yStart !== null
      ) {
      } else if (
        !isEqual(curPointResult, usrPointResult) &&
        xStart !== null &&
        yStart !== null
      ) {
        const resCoords = new JXG.Coords(
          JXG.COORDS_BY_SCREEN,
          [x - 1, y + 1],
          board.$board
        )
        result.push({
          p1: { x: rnd(xStart), y: rnd(yStart) },
          p2: {
            x: rnd(resCoords.usrCoords[1]),
            y: rnd(resCoords.usrCoords[2]),
          },
        })
        xStart = null
        yStart = null
      } else if (
        !isEqual(curPointResult, usrPointResult) &&
        xStart === null &&
        yStart === null
      ) {
      } else if (
        isEqual(curPointResult, usrPointResult) &&
        xStart === null &&
        yStart === null
      ) {
        xStart = coords.usrCoords[1]
        yStart = coords.usrCoords[2]
      }

      x += 2
      y -= 2
    }

    if (xStart !== null && yStart !== null) {
      const resCoords = new JXG.Coords(
        JXG.COORDS_BY_SCREEN,
        [x, y],
        board.$board
      )
      result.push({
        p1: { x: rnd(xStart), y: rnd(yStart) },
        p2: { x: rnd(resCoords.usrCoords[1]), y: rnd(resCoords.usrCoords[2]) },
      })
    }
  }

  return result
}

function renderArea(board, points, opacity = 0.3, priorityColor = null) {
  return board.$board.create(
    'polygon',
    points.map((p) => [p.x, p.y]),
    {
      fillColor: priorityColor || '#434B5D',
      highlightFillColor: priorityColor || '#434B5D',
      highlightFillOpacity: opacity,
      fillOpacity: opacity,
      hasInnerPoints: false,
      highlighted: false,
      withLines: false,
      vertices: {
        visible: false,
      },
      fixed: true,
    }
  )
}

function renderAreaByLines(board, lines, priorityColor = null) {
  return lines.map(({ p1, p2 }) =>
    board.$board.create(
      'line',
      [
        [p1.x, p1.y],
        [p2.x, p2.y],
      ],
      {
        strokeColor: priorityColor || '#434B5D',
        highlightStrokeColor: priorityColor || '#434B5D',
        firstarrow: false,
        lastarrow: false,
        straightfirst: false,
        straightlast: false,
        strokewidth: 1,
        highlightstrokewidth: 1,
        fixed: true,
      }
    )
  )
}

function updateShading(board, areaPoint, shapes) {
  // board.removeObject(areaPoint.shadingArea);
  board.removeObject(areaPoint.shadingAreaLines)

  const usrX = rnd(areaPoint.X())
  const usrY = rnd(areaPoint.Y())

  const funcs = getFunctions(shapes)
  // const points = getAreaByPoint({ usrX, usrY }, board.$board.getBoundingBox(), funcs);
  const lines = getAreaLinesByPoint({ usrX, usrY }, board, funcs)
  // const shadingArea = renderArea(board, points, 0.3, areaPoint.visProp.strokecolor);
  const shadingAreaLines = renderAreaByLines(
    board,
    lines,
    areaPoint.visProp.strokecolor
  )
  // areaPoint.addParents(shadingArea);
  areaPoint.addParents(shadingAreaLines)
  // areaPoint.shadingArea = shadingArea;
  areaPoint.shadingAreaLines = shadingAreaLines
}

function create(board, object, settings = {}) {
  const { fixed = false } = settings
  const { x, y, id = null, priorityColor } = object

  const areaPoint = board.$board.create('point', [x, y], {
    ...getColorParams(priorityColor || '#434B5D'),
    showInfoBox: false,
    size: 7,
    snapToGrid: false,
    label: {
      visible: false,
    },
    fixed,
    id,
  })

  if (!fixed) {
    areaPoint.on('up', () => {
      if (areaPoint.dragged) {
        areaPoint.dragged = false
        updateShading(board, areaPoint, board.elements)
        board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE)
      }
    })

    areaPoint.on('drag', () => {
      // don't use e.movementX === 0 && e.movementY === 0
      // movementX and movementY are always zero on Safari
      // it seems like the bug is in JSXGraph library
      // https://snapwiz.atlassian.net/browse/EV-19969
      // https://snapwiz.atlassian.net/browse/EV-23207

      areaPoint.dragged = true
      board.dragged = true
    })
  }
  areaPoint.type = jxgType

  return areaPoint
}

function canDrawAreaByPoint(board, { x, y }) {
  const hasTangetOrSecant = checkElements(board.elements)
  if (hasTangetOrSecant) {
    notification({
      msg: 'Cannot shade with Tangent or Secant',
      type: 'warning',
    })
    return false
  }
  const funcs = getFunctions(board.elements)
  const lines = getAreaLinesByPoint({ usrX: x, usrY: y }, board, funcs)
  const newAreaBounding = getAreaBounding(lines)
  const existingBoundings = getExistAreaBoundings(board)
  const isSameArea = existingBoundings.some((bounding) =>
    isEqual(bounding, newAreaBounding)
  )
  return !isSameArea
}

function onHandler() {
  return (board, event) => {
    const coords = board.getCoords(event).usrCoords
    const object = {
      x: coords[1],
      y: coords[2],
    }
    if (canDrawAreaByPoint(board, object)) {
      return create(board, object)
    }
  }
}

function getConfig(area) {
  return {
    _type: area.type,
    type: CONSTANT.TOOLS.AREA,
    id: area.id,
    x: area.coords.usrCoords[1],
    y: area.coords.usrCoords[2],
  }
}

function setAreasForEquations(board) {
  // find inequalities
  const inequalities = board.elements.filter(
    (el) =>
      el.type === Equation.jxgType &&
      !el.latexIsBroken &&
      el.fixedLatex.compSign !== '='
  )
  if (inequalities.length === 0) {
    return
  }

  // set funcs for calculating
  const funcs = inequalities.map((el) => {
    const func = parse(el.fixedLatex.latexFunc)
    if (el.fixedLatex.compSign === '>' || el.fixedLatex.compSign === '>=') {
      return (x, y) => func.eval({ x, y }) > 0
    }
    return (x, y) => func.eval({ x, y }) < 0
  })

  // add common shaded areas
  const areas = []
  const [xMin, yMax, xMax, yMin] = board.$board.getBoundingBox()
  const stepX = (xMax - xMin) / 50
  const stepY = (yMax - yMin) / 50
  for (let x = rnd(xMin + stepX); x < xMax; x = rnd(x + stepX)) {
    for (let y = rnd(yMin + stepY); y < yMax; y = rnd(y + stepY)) {
      if (
        !isEqual(
          funcs.map((func) => func(x, y)),
          funcs.map(() => true)
        )
      ) {
        continue
      }

      let areaIsExist = false
      for (let i = 0; i < areas.length; i++) {
        if (isInPolygon({ x, y }, areas[i])) {
          areaIsExist = true
          break
        }
      }
      if (areaIsExist) {
        continue
      }

      const points = getAreaByPoint(
        { usrX: x, usrY: y },
        [xMin, yMax, xMax, yMin],
        funcs
      )
      if (points) {
        areas.push(points)
      }
    }
  }

  const areaElements = areas.map((points) => renderArea(board, points, 0.1))
  inequalities[0].addParents(areaElements)
}

function setAreaForEquation(board, equation) {
  if (equation.fixedLatex.compSign === '=') {
    return
  }
  const funcs = [equation].map((el) => {
    const func = parse(el.fixedLatex.latexFunc)
    if (el.fixedLatex.compSign === '>' || el.fixedLatex.compSign === '>=') {
      return (x, y) => func.eval({ x, y }) > 0
    }
    return (x, y) => func.eval({ x, y }) < 0
  })

  // add common shaded areas
  const areas = []
  const [xMin, yMax, xMax, yMin] = board.$board.getBoundingBox()
  const stepX = (xMax - xMin) / 50
  const stepY = (yMax - yMin) / 50
  for (let x = rnd(xMin + stepX); x < xMax; x = rnd(x + stepX)) {
    for (let y = rnd(yMin + stepY); y < yMax; y = rnd(y + stepY)) {
      if (
        !isEqual(
          funcs.map((func) => func(x, y)),
          funcs.map(() => true)
        )
      ) {
        continue
      }

      let areaIsExist = false
      for (let i = 0; i < areas.length; i++) {
        if (isInPolygon({ x, y }, areas[i])) {
          areaIsExist = true
          break
        }
      }
      if (areaIsExist) {
        continue
      }

      const points = getAreaByPoint(
        { usrX: x, usrY: y },
        [xMin, yMax, xMax, yMin],
        funcs
      )
      if (points) {
        areas.push(points)
      }
    }
  }

  equation.areas = areas.map((points) =>
    renderArea(board, points, 0.1, '#FFFF99')
  )
}

function updateShadingsForAreaPoints(board, shapes) {
  const areaPoints = shapes.filter((el) => el.type === jxgType)
  areaPoints.forEach((areaPoint) => updateShading(board, areaPoint, shapes))
}

export default {
  jxgType,
  onHandler,
  getConfig,
  create,
  setAreasForEquations, // used to find area for all equations, now not used
  setAreaForEquation,
  updateShadingsForAreaPoints,
}

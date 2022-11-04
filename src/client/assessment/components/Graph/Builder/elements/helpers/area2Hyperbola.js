/* eslint-disable func-names */
import { getHyperbolaFunc, getLineFunc } from '../../utils'
import Hyperbola from '../Hyperbola'
import { getIntersections } from './getIntersections'

function getFunctions(shape) {
  const midX = shape.midpoint.X()
  const midY = shape.midpoint.Y()
  const { points } = Hyperbola.getConfig(shape)
  const [p1, p2, p3] = points // A, B, C

  const m = (p2.y - p1.y) / (p2.x - p1.x)
  const x3 = m === 0 ? midX : midX + 2
  const y3 = m === 0 ? midY + 2 : (midX - x3) / m + midY

  return [
    getLineFunc({ x: midX, y: midY }, { x: x3, y: y3 }),
    getHyperbolaFunc(
      { x: p1.x, y: p1.y },
      { x: p2.x, y: p2.y },
      { x: p3.x, y: p3.y }
    ),
    m >= 0,
  ]
}

const findNearest = (points, point) => {
  let result = null
  let maxDist = Number.MAX_SAFE_INTEGER
  for (let i = 0; i < points.length; i += 1) {
    const [px, py] = points[i]
    const dist = Math.sqrt((px - point[0]) ** 2 + (py - point[1]) ** 2)
    if (dist < maxDist) {
      maxDist = dist
      result = [px, py]
    }
  }
  return [result, maxDist]
}

function sortPoints(points, point) {
  const result = [point]
  points.forEach(() => {
    const comparePoint = result[result.length - 1]
    if (comparePoint) {
      const [nextPoint, dist] = findNearest(
        points.filter(
          (n) => !result.find((p) => p[0] === n[0] && p[1] === n[1])
        ),
        comparePoint
      )
      if (nextPoint && dist < 2) {
        const [px, py] = nextPoint
        result.push([px, py])
      }
    }
  })
  return result
}

function groupPoints(board, shape, intersections, midLineFunc) {
  const [xMin, yMax, xMax, yMin] = board.$board.getBoundingBox()

  const points = shape.points
    .filter((p) => {
      const [, px, py] = p.usrCoords
      return (
        px >= xMin - 1 && px <= xMax + 1 && py >= yMin - 1 && py <= yMax + 1
      )
    })
    .map((p) => [p.usrCoords[1], p.usrCoords[2]])

  const realIntersections = intersections.map((p) => findNearest(points, p)[0])

  const upPoints = []
  const bottomPoints = []

  points.forEach((p) => {
    const [x, y] = p
    if (midLineFunc(x, y) > 0) {
      upPoints.push([x, y])
    } else {
      bottomPoints.push([x, y])
    }
  })

  const intersectionsForUp = []
  const intersectionsForBottom = []
  const upLineEdges = []
  const bottomLineEdges = []

  realIntersections.forEach((p, i) => {
    if (upPoints.find((x) => x[0] === p[0] && x[1] === p[1])) {
      intersectionsForUp.push(p)
      upLineEdges.push(intersections[i])
    }

    if (bottomPoints.find((x) => x[0] === p[0] && x[1] === p[1])) {
      intersectionsForBottom.push(p)
      bottomLineEdges.push(intersections[i])
    }
  })

  return {
    line1: {
      p: sortPoints(upPoints, intersectionsForUp[0]),
      s: upLineEdges[0],
      e: upLineEdges[1],
    },
    line2: {
      p: sortPoints(bottomPoints, intersectionsForBottom[0]),
      s: bottomLineEdges[0],
      e: bottomLineEdges[1],
    },
  }
}

function getShapePoints(board, shape, areaPoint) {
  const [areaX, areaY] = areaPoint
  const [xMin, yMax, xMax, yMin] = board.$board.getBoundingBox()
  const [midLineFunc, shapeFunc, mDirect] = getFunctions(shape)
  const intersections = getIntersections(board, shapeFunc, 3)
  const { line1, line2 } = groupPoints(board, shape, intersections, midLineFunc)
  const inverse = shapeFunc(areaX, areaY) > 0

  if (inverse) {
    const res1 = line1.p
    const res2 = line2.p

    let l1 = [...res1]
    let l2 = [...res2]
    if (line1.s[1] === yMax && line1.e[1] === yMin) {
      if (mDirect) {
        l1 = [[xMax, yMax], ...res1, [xMax, yMin]]
      } else {
        l1 = [[xMin, yMax], ...res1, [xMin, yMin]]
      }
    }
    if (line2.s[1] === yMax && line2.e[1] === yMin) {
      if (mDirect) {
        l2 = [[xMin, yMax], ...res2, [xMin, yMin]]
      } else {
        l2 = [[xMax, yMax], ...res2, [xMax, yMin]]
      }
    }
    if (line1.s[1] === yMax && line1.e[0] === xMax) {
      l1 = [[xMax, yMax], ...res1]
    }
    if (line2.s[1] === yMin && line2.e[0] === xMin) {
      l2 = [[xMin, yMin], ...res2]
    }
    if (line1.s[0] === xMax && line1.e[0] === xMin) {
      l1 = [[xMax, yMax], ...res1, [xMin, yMax]]
    }
    if (line2.s[0] === xMax && line2.e[0] === xMin) {
      l2 = [[xMax, yMin], ...res2, [xMin, yMin]]
    }
    if (line1.s[1] === yMax && line1.e[0] === xMin) {
      l1 = [...res1, [xMin, yMax]]
    }
    if (line2.s[0] === xMax && line2.e[1] === yMin) {
      l2 = [[xMax, yMin], ...res2]
    }
    return [l1, l2]
  }

  if (
    line1.s[1] === yMax &&
    line2.s[1] === yMax &&
    line1.e[1] === yMin &&
    line2.e[1] === yMin
  ) {
    return [line1.p.concat(line2.p.reverse())]
  }
  if (
    line1.s[0] === xMax &&
    line1.e[0] === xMin &&
    line2.s[0] === xMax &&
    line2.e[0] === xMin
  ) {
    return [line1.p.concat(line2.p.reverse())]
  }

  if (
    line1.s[1] === yMax &&
    line1.e[0] === xMin &&
    line2.s[0] === xMax &&
    line2.e[1] === yMin
  ) {
    return [[...line1.p, [xMin, yMin], ...line2.p.reverse(), [xMax, yMax]]]
  }

  if (
    line1.s[1] === yMax &&
    line1.e[1] === yMin &&
    line2.s[0] === xMax &&
    line2.e[1] === yMin
  ) {
    return [[...line1.p, ...line2.p.reverse(), [xMax, yMax]]]
  }

  if (
    line1.s[1] === yMin &&
    line1.e[0] === xMin &&
    line2.s[0] === xMax &&
    line2.e[1] === yMin
  ) {
    return [[...line1.p, [xMin, yMax], [xMax, yMax], ...line2.p]]
  }

  if (
    line1.s[1] === yMax &&
    line1.e[1] === yMin &&
    line2.s[1] === yMin &&
    line2.e[0] === xMin
  ) {
    return [[...line1.p, ...line2.p, [xMin, yMax]]]
  }

  if (
    line1.s[0] === xMax &&
    line1.e[1] === yMin &&
    line2.s[1] === yMin &&
    line2.e[0] === xMin
  ) {
    return [[...line1.p, ...line2.p, [xMin, yMax], [xMax, yMax]]]
  }

  if (
    line1.s[1] === yMax &&
    line1.e[0] === xMax &&
    line2.s[1] === yMin &&
    line2.e[0] === xMin
  ) {
    return [[...line1.p, [xMax, yMin], ...line2.p, [xMin, yMax]]]
  }

  if (
    line1.s[1] === yMax &&
    line1.e[0] === xMin &&
    line2.s[1] === yMax &&
    line2.e[1] === yMin
  ) {
    return [[...line1.p, [xMin, yMin], ...line2.p.reverse()]]
  }

  if (
    line1.s[0] === xMax &&
    line1.e[0] === xMin &&
    line2.s[0] === xMax &&
    line2.e[1] === yMin
  ) {
    return [[...line1.p, [xMin, yMin], ...line2.p.reverse()]]
  }

  if (
    line1.s[1] === yMax &&
    line1.e[0] === xMax &&
    line2.s[0] === xMax &&
    line2.e[1] === yMin
  ) {
    return [[...line1.p, ...line2.p, [xMin, yMin], [xMin, yMax]]]
  }

  if (
    line1.s[0] === xMax &&
    line1.e[0] === xMin &&
    line2.s[1] === yMin &&
    line2.e[0] === xMin
  ) {
    return [[...line1.p, ...line2.p.reverse(), [xMax, yMin]]]
  }

  if (
    line1.s[0] === xMax &&
    line1.e[0] === xMax &&
    line2.s[0] === xMin &&
    line2.e[0] === xMin
  ) {
    return [
      [
        ...line1.p,
        [xMax, yMin],
        [xMin, yMin],
        ...line2.p,
        [xMin, yMax],
        [xMax, yMax],
      ],
    ]
  }

  if (
    line1.s[1] === yMax &&
    line1.e[0] === xMin &&
    line2.s[0] === xMax &&
    line2.e[0] === xMin
  ) {
    return [[[xMax, yMax], ...line1.p, ...line2.p.reverse()]]
  }

  if (
    line1.s[1] === yMax &&
    line1.e[0] === xMax &&
    line2.s[1] === yMax &&
    line2.e[1] === yMin
  ) {
    return [[...line1.p, ...line2.p.reverse()]]
  }

  if (
    line1.s[1] === yMax &&
    line1.e[1] === yMax &&
    line2.s[1] === yMin &&
    line2.e[1] === yMin
  ) {
    return [
      [
        [xMin, yMax],
        ...line1.p,
        [xMax, yMax],
        [xMax, yMin],
        ...line2.p,
        [xMin, yMin],
      ],
    ]
  }

  if (
    line1.s[1] === yMax &&
    line1.e[0] === xMax &&
    line2.s[0] === xMin &&
    line2.e[0] === xMin
  ) {
    return [[[xMin, yMax], ...line1.p, [xMax, yMin], [xMin, yMin], ...line2.p]]
  }

  return []
}

export function area2Hyperbola(board, shape, point, colors) {
  const [upPoints, bottomPoints] = getShapePoints(board, shape, point)

  const result = []
  if (upPoints) {
    const ineq1 = board.$board.create('curve', [[], []], colors)
    ineq1.updateDataArray = function () {
      if (board.dragged) {
        return
      }
      this.dataX = []
      this.dataY = []
      upPoints.forEach((p) => {
        const [x, y] = p
        this.dataX.push(x)
        this.dataY.push(y)
      })
    }
    result.push(ineq1)
  }

  if (bottomPoints) {
    const ineq2 = board.$board.create('curve', [[], []], colors)
    ineq2.updateDataArray = function () {
      if (board.dragged) {
        return
      }
      this.dataX = []
      this.dataY = []
      bottomPoints.forEach((p) => {
        const [x, y] = p
        this.dataX.push(x)
        this.dataY.push(y)
      })
    }
    result.push(ineq2)
  }

  board.$board.update()
  return [result]
}

/* eslint-disable func-names */
import { getParabolaFunc, getLineFunc } from '../../utils'

function getFunc(shape) {
  const points = Object.values(shape.ancestors)
  return getParabolaFunc(
    { x: points[0].X(), y: points[0].Y() },
    { x: points[1].X(), y: points[1].Y() },
    { x: points[2].X(), y: points[2].Y() }
  )
}

/**
 * find intersection points between graph and bound
 * it tries to find points clockwise
 * there will be two intersection points always
 * @returns Point[x,y][]
 */
function getIntersections(board, func) {
  const step = 0.1
  const [xMin, yMax, xMax, yMin] = board.$board.getBoundingBox()

  const intersections = []
  let usrResult = func(xMin, yMax) > 0
  for (let i = xMin; i <= xMax; i += step) {
    const currResult = func(i, yMax) > 0
    if (usrResult !== currResult) {
      intersections.push([i, yMax])
      usrResult = currResult
    }
    if (intersections.length > 1) {
      return intersections
    }
  }

  usrResult = func(xMax, yMax) > 0
  for (let i = yMax; i >= yMin; i -= step) {
    const currResult = func(xMax, i) > 0
    if (usrResult !== currResult) {
      intersections.push([xMax, i])
      usrResult = currResult
    }
    if (intersections.length > 1) {
      return intersections
    }
  }

  usrResult = func(xMax, yMin) > 0
  for (let i = xMax; i >= xMin; i -= step) {
    const currResult = func(i, yMin) > 0
    if (usrResult !== currResult) {
      intersections.push([i, yMin])
      usrResult = currResult
    }
    if (intersections.length > 1) {
      return intersections
    }
  }
  usrResult = func(xMin, yMin) > 0
  for (let i = yMin; i <= yMax; i += step) {
    const currResult = func(xMin, i) > 0
    if (usrResult !== currResult) {
      intersections.push([xMin, i])
      usrResult = currResult
    }
  }

  return intersections
}

const findNearest = (points, point) => {
  let result = null
  let maxDist = Number.MAX_SAFE_INTEGER
  for (let i = 0; i < points.length; i += 1) {
    const [, px, py] = points[i].usrCoords
    const dist = Math.sqrt((px - point[0]) ** 2 + (py - point[1]) ** 2)
    if (dist < maxDist) {
      maxDist = dist
      result = [px, py]
    }
  }
  return [result, maxDist]
}

const getDirectGraph = (shape) => {
  const points = Object.values(shape.ancestors)
  const func = getLineFunc(
    { x: points[0].X(), y: points[0].Y() },
    { x: points[1].X(), y: points[1].Y() }
  )

  return func(points[2].X(), points[2].Y()) > 0
}

/**
 * find points that ride on graph
 * @returns Point[x,y][]
 */
function getShapePoints(board, shape, func) {
  if (!shape.points || !shape.points.length) {
    return []
  }
  const [xMin, yMax, xMax, yMin] = board.$board.getBoundingBox()
  const [p0, p1] = getIntersections(board, func)
  const direct = getDirectGraph(shape)
  if (!p0 || !p1) {
    return []
  }

  const [startPoint] = findNearest(shape.points, p0)
  const points = shape.points.filter((p) => {
    const [, px, py] = p.usrCoords
    return px >= xMin && px <= xMax && py >= yMin && py <= yMax
  })

  const result = [startPoint]
  points.forEach(() => {
    const comparePoint = result[result.length - 1]
    if (comparePoint) {
      const [nextPoint, dist] = findNearest(
        points.filter((n) => {
          const [, x, y] = n.usrCoords
          return result.every((p) => p[0] !== x && p[1] !== y)
        }),
        comparePoint
      )
      if (nextPoint && dist < 1) {
        const [px, py] = nextPoint
        result.push([px, py])
      }
    }
  })
  result.push(p1)

  if (p1[1] === yMax) {
    result.push([xMax, yMax])
    result.push([xMax, yMin])
    result.push([xMin, yMin])
    result.push([xMin, yMax])
  } else if (p1[1] === yMin) {
    if (direct) {
      if (p0[1] === yMax) {
        result.push([xMax, yMin])
        result.push([xMax, yMax])
      } else {
        result.push([xMin, yMin])
        result.push([xMin, yMax])
      }
    } else if (p0[1] === yMin) {
      result.push([xMin, yMin])
      result.push([xMin, yMax])
      result.push([xMax, yMax])
      result.push([xMax, yMin])
    } else if (p0[1] === yMax) {
      result.push([xMin, yMin])
      result.push([xMin, yMax])
    } else {
      result.push([xMin, yMin])
      result.push([xMin, yMax])
      result.push([xMax, yMax])
    }
  } else if (p1[0] === xMin) {
    if (p0[1] === yMax) {
      result.push([xMin, yMin])
      result.push([xMax, yMin])
      result.push([xMax, yMax])
    } else if (p0[0] === xMax && direct) {
      result.push([xMin, yMin])
      result.push([xMax, yMin])
    } else {
      result.push([xMin, yMax])
      result.push([xMax, yMax])
      result.push([xMax, yMin])
    }
    if (p0[0] === xMin) {
      result.push([xMin, yMin])
    }
  } else if (p1[0] === xMax) {
    result.push([xMax, yMin])
    result.push([xMin, yMin])
    result.push([xMin, yMax])

    if (p0[1] !== yMax) {
      result.push([xMax, yMax])
    }
  }

  return result
}

export function area2Parabola2(board, shape, point, colors) {
  const [areaX, areaY] = point
  const func = getFunc(shape)
  const inverse = func(areaX, areaY) > 0

  let pints = []
  if (inverse) {
    pints = getShapePoints(board, shape, func)
  }

  const ineq = board.$board.create('curve', [[], []], colors)
  ineq.updateDataArray = function () {
    if (board.dragged) {
      return
    }
    this.dataX = []
    this.dataY = []
    if (inverse) {
      //
      pints.forEach((p) => {
        const [x, y] = p
        this.dataX.push(x)
        this.dataY.push(y)
      })
    } else {
      shape.points.forEach((p) => {
        const [, x, y] = p.usrCoords
        this.dataX.push(x)
        this.dataY.push(y)
      })
    }
  }
  board.$board.update()
  return ineq
}

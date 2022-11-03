/* eslint-disable func-names */
import { getHyperbolaFunc, getLineFunc } from '../../utils'
import Hyperbola from '../Hyperbola'
import { getIntersections } from './getIntersections'

let temp = []

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
  ]
}

function getShapePoints(board, shape, areaPoint) {
  const [areaX, areaY] = areaPoint
  const [midLineFunc, shapeFunc] = getFunctions(shape)
  const [xMin, yMax, xMax, yMin] = board.$board.getBoundingBox()
  const intersections = getIntersections(board, shapeFunc, 3)
  const inverse = shapeFunc(areaX, areaY) > 0

  const upPoints = []
  const bottomPoints = []

  shape.points
    .filter((p) => {
      const [, px, py] = p.usrCoords
      return px >= xMin && px <= xMax && py >= yMin && py <= yMax
    })
    .forEach((p) => {
      const [, x, y] = p.usrCoords
      if (midLineFunc(x, y) > 0) {
        upPoints.push([x, y])
      } else {
        bottomPoints.push([x, y])
      }
    })

  if (inverse) {
    // area point is outside graph
    return [upPoints, bottomPoints]
  }

  return []
}

export function area2Hyperbola(board, shape, point, colors) {
  temp.forEach((ineq) => {
    board.$board.removeObject(ineq)
  })
  temp = []

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

/* eslint-disable func-names */
import { maxBy, minBy } from 'lodash'
import { getParabolaFunc } from '../../utils'

const CURVE_FILL = {
  fillColor: '#FFF8DC',
  highlightFillColor: '#FFF8DC',
  fillOpacity: 0.5,
  highlightFillOpacity: 0.5,
  //   strokeColor: 'transparent',
  //   highlightStrokeColor: 'transparent',
}

let temp = []

export function area2Parabola2(board, shape, point) {
  temp.forEach((ineq) => {
    board.$board.removeObject(ineq)
  })
  temp = []

  const [xMin, yMax, xMax, yMin] = board.$board.getBoundingBox()
  const ineq = board.$board.create('curve', [[], []], CURVE_FILL)
  const [areaX, areaY] = point
  const points = Object.values(shape.ancestors)
  const func = getParabolaFunc(
    { x: points[0].X(), y: points[0].Y() },
    { x: points[1].X(), y: points[1].Y() },
    { x: points[2].X(), y: points[2].Y() }
  )

  const sp = shape.points
    .map((p) => [p.usrCoords[1], p.usrCoords[2]])
    .filter((p) => p[0] !== Infinity && p[1] !== Infinity)

  const midX = shape.midpoint.X()
  const midY = shape.midpoint.Y()
  const inverse = func(areaX, areaY) > 0

  const m = (points[1].Y() - points[0].Y()) / (points[1].X() - points[0].X())
  const x3 = m === 0 ? midX : midX + 2
  const y3 = m === 0 ? midY + 2 : (midX - x3) / m + midY

  const midpoint1 = board.$board.create('point', [midX, midY], {
    fixed: true,
    name: 'M0',
  })
  const midpoint2 = board.$board.create('point', [x3, y3], {
    fixed: true,
    name: 'M1',
  })
  const l2 = board.$board.create('line', [midpoint1, midpoint2], {
    fixed: true,
    dash: 2,
  })

  temp.push(l2)
  temp.push(midpoint1)
  temp.push(midpoint2)

  console.log(points[1].x - points[0].x)

  ineq.updateDataArray = function () {
    if (board.dragged) {
      return
    }
    this.dataX = []
    this.dataY = []
    if (inverse) {
      //   sp.sort((a, b) => a[0] - b[0])
      const maxPoint = maxBy(sp, (p) => p[0])
      const minPoint = minBy(sp, (p) => p[0])
      for (let i = 0; i < sp.length; i += 1) {
        const [x, y] = sp[i]
        this.dataX.push(x)
        this.dataY.push(y)
      }

      //   this.dataX.push(maxPoint[0])
      //   this.dataY.push(maxPoint[1])

      //   this.dataX.push(xMax)
      //   this.dataY.push(yMin)

      //   this.dataX.push(yMin)
      //   this.dataY.push(yMin)

      //   this.dataX.push(minPoint[0] > xMin ? xMin : minPoint[0])
      //   this.dataY.push(minPoint[1])
    } else {
      for (let i = 0; i < sp.length; i += 1) {
        this.dataX.push(sp[i][0])
        this.dataY.push(sp[i][1])
      }
    }
  }
  board.$board.update()
  return ineq
}

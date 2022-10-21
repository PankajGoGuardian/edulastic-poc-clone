/* eslint-disable func-names */
import { isNaN } from 'lodash'
import { getHyperbolaFunc, getLineFunc } from '../../utils'
import Hyperbola from '../Hyperbola'

const CURVE_FILL = {
  fillColor: '#FFF8DC',
  highlightFillColor: '#FFF8DC',
  fillOpacity: 0.5,
  highlightFillOpacity: 0.5,
  strokeColor: 'transparent',
  highlightStrokeColor: 'transparent',
}

let temp = []

export function area2Hyperbola(board, shape, point) {
  temp.forEach((ineq) => {
    board.$board.removeObject(ineq)
  })
  temp = []

  const [xMin, yMax, xMax, yMin] = board.$board.getBoundingBox()
  const midX = shape.midpoint.X()
  const midY = shape.midpoint.Y()
  const [areaX, areaY] = point
  const { points } = Hyperbola.getConfig(shape)
  const [p1, p2, p3] = points // A, B, C
  const m = (p2.y - p1.y) / (p2.x - p1.x)

  const x3 = m === 0 ? midX : midX + 2
  const y3 = m === 0 ? midY + 2 : (midX - x3) / m + midY

  const hyperbolaFunc = getHyperbolaFunc(
    { x: p1.x, y: p1.y },
    { x: p2.x, y: p2.y },
    { x: p3.x, y: p3.y }
  )

  // =================================================
  const p_1 = board.$board.create('point', [p1.x, p1.y], { visible: false })
  const p_2 = board.$board.create('point', [p2.x, p2.y], { visible: false })
  const l1 = board.$board.create('line', [p_1, p_2], { fixed: true, dash: 2 })
  const mp = board.$board.create('point', [midX, midY], {
    fixed: true,
    name: 'M0',
    size: 0.5,
  })
  const mp1 = board.$board.create('point', [x3, y3], {
    fixed: true,
    name: 'M1',
    size: 0.5,
  })
  const l2 = board.$board.create('line', [mp, mp1], { fixed: true, dash: 2 })

  temp.push(mp)
  temp.push(mp1)
  temp.push(l1)
  temp.push(l2)

  // xMin, yMax, xMax, yMin
  const step = 0.5
  for (let i = yMin; i <= yMax; i += step) {
    const t1 = board.$board.create('point', [xMax, i], { visible: false })
    const t2 = board.$board.create('point', [xMin, i], { visible: false })
    const tl = board.$board.create('line', [t1, t2], {
      dash: 2,
      strokeWidth: 0.2,
      strokeColor: 'red',
    })
    temp.push(t1)
    temp.push(t2)
    temp.push(tl)
  }
  // =================================================

  const inverse = hyperbolaFunc(areaX, areaY) > 0
  const ineq = board.$board.create('curve', [[], []], CURVE_FILL)
  ineq.updateDataArray = function () {
    if (board.dragged) {
      return
    }
    this.dataX = []
    this.dataY = []
    if (inverse) {
      console.log(inverse)
    }
  }
  board.$board.update()
  return ineq
}

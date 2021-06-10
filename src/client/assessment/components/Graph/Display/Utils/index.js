import { range } from 'lodash'

function getAllPointsOnNumberLine({ td, mt, xMin, xMax }) {
  const step = td / (mt + 1)
  const values = range(xMin, xMax + step, step)
  return values
}

export function roundPointToNearestValue({
  ticksDistance,
  minorTicks,
  point,
  xMin,
  xMax,
}) {
  const points = getAllPointsOnNumberLine({
    td: ticksDistance,
    mt: minorTicks,
    xMin,
    xMax,
  })
  const [, nearestPointIndex] = points.reduce(
    (acc, curr, index) => {
      const deviation = Math.abs(curr - point)
      if (deviation < acc[0]) {
        acc = [deviation, index]
      }
      return acc
    },
    [Infinity, -1]
  )
  if (nearestPointIndex !== -1) {
    return +points[nearestPointIndex].toFixed(4)
  }

  return point
}

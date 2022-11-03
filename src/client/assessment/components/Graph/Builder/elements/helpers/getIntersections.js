/**
 * find intersection points between graph and bound
 * it tries to find points clockwise
 * there will be two intersection points always
 * @returns Point[x,y][]
 */
export function getIntersections(board, func, limit = 1) {
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
    if (intersections.length > limit) {
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
    if (intersections.length > limit) {
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
    if (intersections.length > limit) {
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

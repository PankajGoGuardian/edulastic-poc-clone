import { CONSTANT } from '../config'
import {
  Point,
  Circle,
  Ellipse,
  Exponent,
  Hyperbola,
  Line,
  Logarithm,
  Parabola,
  Parabola2,
  Polygon,
  Polynom,
  Secant,
  Sin,
  Cos,
  Tangent,
  Area,
  Area2,
} from '.'

function onHandler(board, event) {
  const {
    drawingObject,
    parameters: {
      pointParameters: { snapSizeX, snapSizeY },
    },
  } = board

  if (!drawingObject) {
    return
  }

  const coords = board.getCoords(event)
  const deltaX = +snapSizeX
  const deltaY = +snapSizeY
  let newElement = null

  const { id, label, baseColor, type, pointLabels, dashed } = drawingObject

  if (type === CONSTANT.TOOLS.POINT) {
    newElement = Point.create(board, {
      id,
      label,
      baseColor,
      x: coords.usrCoords[1],
      y: coords.usrCoords[2],
    })
  } else if (type === CONSTANT.TOOLS.AREA) {
    newElement = Area.create(board, {
      id,
      x: coords.usrCoords[1],
      y: coords.usrCoords[2],
    })
  } else if (type === CONSTANT.TOOLS.AREA2) {
    newElement = Area2.create(board, {
      id,
      x: coords.usrCoords[1],
      y: coords.usrCoords[2],
    })
  } else {
    const points = []
    const offsets = [
      [0, 0],
      [1, 1],
      [2, 0],
    ]

    pointLabels.forEach((subPoint, i) => {
      if (
        i > 2 &&
        (type === CONSTANT.TOOLS.ELLIPSE || type === CONSTANT.TOOLS.HYPERBOLA)
      ) {
        return
      }

      let x
      let y
      if (i < 3) {
        x = coords.usrCoords[1] + offsets[i][0] * deltaX
        y = coords.usrCoords[2] + offsets[i][1] * deltaY
      } else {
        x = coords.usrCoords[1] + i * deltaX
        y = coords.usrCoords[2] - (i - 2) * deltaY
      }

      const object = {
        x,
        y,
        label: subPoint.label,
        baseColor: subPoint.baseColor,
      }
      const point = Point.create(board, object)
      points.push(point)
    })

    switch (type) {
      case CONSTANT.TOOLS.LINE:
      case CONSTANT.TOOLS.RAY:
      case CONSTANT.TOOLS.SEGMENT:
      case CONSTANT.TOOLS.VECTOR:
        newElement = Line.create(
          board,
          { id, label, baseColor, dashed },
          points,
          type
        )
        break
      case CONSTANT.TOOLS.CIRCLE:
        newElement = Circle.create(
          board,
          { id, label, baseColor, dashed },
          points
        )
        break
      case CONSTANT.TOOLS.SIN:
        newElement = Sin.create(board, { id, label, baseColor, dashed }, points)
        break
      case CONSTANT.TOOLS.COS:
        newElement = Cos.create(board, { id, label, baseColor, dashed }, points)
        break
      case CONSTANT.TOOLS.TANGENT:
        newElement = Tangent.create(
          board,
          { id, label, baseColor, dashed },
          points
        )
        break
      case CONSTANT.TOOLS.SECANT:
        newElement = Secant.create(
          board,
          { id, label, baseColor, dashed },
          points
        )
        break
      case CONSTANT.TOOLS.PARABOLA:
        newElement = Parabola.drawline(
          board,
          { id, label, baseColor, dashed },
          points
        )
        break
      case CONSTANT.TOOLS.PARABOLA2:
        newElement = Parabola2.create(
          board,
          { id, label, baseColor, dashed },
          points
        )
        break
      case CONSTANT.TOOLS.ELLIPSE:
        newElement = Ellipse.create(
          board,
          { id, label, baseColor, dashed },
          points
        )
        break
      case CONSTANT.TOOLS.EXPONENT:
        newElement = Exponent.create(
          board,
          { id, label, baseColor, dashed },
          points
        )
        break
      case CONSTANT.TOOLS.LOGARITHM:
        newElement = Logarithm.create(
          board,
          { id, label, baseColor, dashed },
          points
        )
        break
      case CONSTANT.TOOLS.HYPERBOLA:
        newElement = Hyperbola.create(
          board,
          { id, label, baseColor, dashed },
          points
        )
        break
      case CONSTANT.TOOLS.POLYGON:
        newElement = Polygon.create(
          board,
          { id, label, baseColor, dashed },
          points
        )
        break
      case CONSTANT.TOOLS.POLYNOM:
        newElement = Polynom.create(
          board,
          { id, label, baseColor, dashed },
          points
        )
        break
      default:
        return
    }
  }

  return newElement
}

export default {
  onHandler,
}

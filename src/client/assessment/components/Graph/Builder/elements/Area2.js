import JXG from 'jsxgraph'
import { isArray, last, first } from 'lodash'
import { CONSTANT } from '../config'
import {
  isInPolygon,
  getCircleFunc,
  getEllipseFunc,
  getLineFunc,
  getHyperbolaFunc,
} from '../utils'
import {
  Circle,
  Cos,
  Ellipse,
  Exponent,
  Exponent2,
  Hyperbola,
  Logarithm,
  Polynom,
  Parabola,
  Sin,
  Tangent,
} from '.'

const jxgType = 108

let inequalities = []

const CURVE_FILL = {
  fillColor: '#FFF8DC',
  highlightFillColor: '#FFF8DC',
  fillOpacity: 0.5,
  highlightFillOpacity: 0.5,
  strokeColor: 'transparent',
  highlightStrokeColor: 'transparent',
}

function getColorParams(color) {
  return {
    fillColor: '#fff',
    strokeColor: color,
    highlightStrokeColor: color,
    highlightFillColor: '#fff',
  }
}

function rnd(num) {
  return +num.toFixed(3)
}

function updateShading(board, areaPoint, shapes) {
  const areaX = rnd(areaPoint.X())
  const areaY = rnd(areaPoint.Y())

  if (isArray(shapes)) {
    shapes.forEach((shape) => {
      switch (shape.type) {
        case JXG.OBJECT_TYPE_CONIC: {
          const { points } = Ellipse.getConfig(shape)
          const func = getEllipseFunc(
            { x: points[0].x, y: points[0].y },
            { x: points[1].x, y: points[1].y },
            { x: points[2].x, y: points[2].y }
          )

          const shapePoints = shape.points.map((p) => [
            p.usrCoords[1],
            p.usrCoords[2],
          ])

          const inverse = func(areaX, areaY) > 0
          const ineq = board.$board.create('curve', [[], []], CURVE_FILL)
          const mpx = shape.midpoint.X()
          const mpy = shape.midpoint.Y()

          // eslint-disable-next-line func-names
          ineq.updateDataArray = function () {
            if (board.dragged) {
              return
            }
            const pi = Math.PI / 180
            const gap = 5
            const dataX = []
            const dataY = []

            if (inverse) {
              const [xMin, yMax, xMax, yMin] = board.$board.getBoundingBox()
              const outRadius = Math.max(
                ...[
                  [xMax, yMax],
                  [xMin, yMax],
                  [xMin, yMin],
                  [xMax, yMin],
                ].map((p) => {
                  const [px, py] = p
                  const a = px - mpx
                  const b = py - mpy
                  return Math.sqrt(a ** 2 + b ** 2)
                })
              )
              for (let alpha = 0; alpha <= 360; alpha += gap) {
                dataX.push(outRadius * Math.cos(alpha * pi))
                dataY.push(outRadius * Math.sin(alpha * pi))
              }
            }

            for (let i = shape.numberPoints - 1; i >= 0; i -= 1) {
              dataX.push(shapePoints[i][0])
              dataY.push(shapePoints[i][1])
            }

            this.dataX = dataX
            this.dataY = dataY
          }

          inequalities.push(ineq)
          board.$board.update()
          break
        }
        case JXG.OBJECT_TYPE_CIRCLE: {
          const { points } = Circle.getConfig(shape)
          const func = getCircleFunc(
            { x: points[0].x, y: points[0].y },
            { x: points[1].x, y: points[1].y }
          )
          const inverse = func(areaX, areaY) > 0
          const ineq = board.$board.create('curve', [[], []], CURVE_FILL)
          // eslint-disable-next-line func-names
          ineq.updateDataArray = function () {
            const pi = Math.PI / 180
            const gap = 5
            const mpx = shape.midpoint.X()
            const mpy = shape.midpoint.Y()
            this.dataX = [mpx + shape.radius]
            this.dataX = [mpy]
            if (inverse) {
              const [xMin, yMax, xMax, yMin] = board.$board.getBoundingBox()
              const outRadius = Math.max(
                ...[
                  [xMax, yMax],
                  [xMin, yMax],
                  [xMin, yMin],
                  [xMax, yMin],
                ].map((p) => {
                  const [px, py] = p
                  const a = px - mpx
                  const b = py - mpy
                  return Math.sqrt(a ** 2 + b ** 2)
                })
              )
              for (let alpha = 0; alpha <= 360; alpha += gap) {
                this.dataX.push(outRadius * Math.cos(alpha * pi))
                this.dataY.push(outRadius * Math.sin(alpha * pi))
              }
            }
            for (let alpha = 360; alpha >= 0; alpha -= gap) {
              this.dataX.push(mpx + shape.radius * Math.cos(alpha * pi))
              this.dataY.push(mpy + shape.radius * Math.sin(alpha * pi))
            }
          }
          inequalities.push(ineq)
          board.$board.update()
          return
        }
        case JXG.OBJECT_TYPE_LINE: {
          const [point1, point2] = Object.values(shape.ancestors)
          const func = getLineFunc(
            { x: point1.X(), y: point1.Y() },
            { x: point2.X(), y: point2.Y() }
          )
          let inverse = func(areaX, areaY) > 0

          if (point1.X() < point2.X()) {
            inverse = !inverse
          }

          if (point1.X() === point2.X() && point1.Y() > point2.Y()) {
            inverse = !inverse
          }

          const ineq = board.$board.create('inequality', [shape], {
            inverse,
          })
          inequalities.push(ineq)
          break
        }
        case JXG.OBJECT_TYPE_POLYGON: {
          const shapePoints = Object.values(shape.ancestors)
          const vertices = shapePoints.map((anc) => ({
            x: anc.X(),
            y: anc.Y(),
          }))
          const inverse = isInPolygon({ x: areaX, y: areaY }, vertices)
          const ineq = board.$board.create('curve', [[], []], CURVE_FILL)

          // eslint-disable-next-line func-names
          ineq.updateDataArray = function () {
            const [xMin, yMax, xMax, yMin] = board.$board.getBoundingBox()
            if (inverse) {
              this.dataX = []
              this.dataY = []
              vertices.forEach((vertex) => {
                this.dataX.push(vertex.x)
                this.dataY.push(vertex.y)
              })
              this.dataX.push(vertices[0].x)
              this.dataY.push(vertices[0].y)
            } else {
              this.dataX = [xMax, xMax, xMin, xMin, xMax, vertices[0].x]
              this.dataY = [yMax, yMin, yMin, yMax, yMax, vertices[0].y]

              for (let i = vertices.length - 1; i >= 0; i -= 1) {
                this.dataX.push(vertices[i].x)
                this.dataY.push(vertices[i].y)
              }
            }
          }

          inequalities.push(ineq)
          board.$board.update()
          break
        }
        case Parabola.jxgType: {
          const [xMin, yMax, xMax, yMin] = board.$board.getBoundingBox()
          const points = Object.values(shape.ancestors)
          const funcX = Parabola.makeCallbackX(...points)
          const funcY = Parabola.makeCallbackY(...points)
          const direction = Parabola.getDirection(...points)
          const inverse = [1, 4].includes(direction)
            ? funcY(areaX) > funcX(areaY)
            : funcY(areaX) < funcX(areaY)
          const ineq = board.$board.create('curve', [[], []], CURVE_FILL)
          // eslint-disable-next-line func-names
          ineq.updateDataArray = function () {
            const [, p0x, p0y] = first(shape.points).usrCoords
            const [, pnx, pny] = last(shape.points).usrCoords
            if (board.dragged) {
              return
            }
            if (inverse) {
              if (direction === 1) {
                this.dataX = [p0x, xMin, xMin, xMax, xMax]
                this.dataY = [p0y, yMax, yMin, yMin, yMax]
              } else if (direction === 2) {
                this.dataX = [p0x, xMax, xMin, xMin, xMax]
                this.dataY = [p0y, yMin, yMin, yMax, yMax]
              } else if (direction === 3) {
                const y0 = p0y > yMin ? yMin : p0y
                this.dataX = [p0x, xMax, xMin, xMin, xMax]
                this.dataY = [y0, yMin, yMin, yMax, yMax]
              } else if (direction === 4) {
                this.dataX = [p0x, xMax, xMax, xMin, pnx]
                this.dataY = [p0y, yMin, yMax, yMax, pny]
              }

              for (let i = shape.numberPoints - 1; i >= 0; i -= 1) {
                this.dataX.push(shape.points[i].usrCoords[1])
                this.dataY.push(shape.points[i].usrCoords[2])
              }
            } else {
              if (direction === 1) {
                this.dataX = [p0x]
                this.dataY = [p0y < yMax ? yMax : p0y]
              } else if (direction === 2) {
                this.dataX = [p0x < xMax ? xMax : p0x]
                this.dataY = [p0y]
              } else if (direction === 3) {
                this.dataX = [p0x]
                this.dataY = [p0y > yMin ? yMin : p0y]
              } else if (direction === 4) {
                this.dataX = [p0x > xMin ? xMin : p0x]
                this.dataY = [p0y]
              }

              for (let i = 1; i < shape.numberPoints - 1; i += 1) {
                this.dataX.push(shape.points[i].usrCoords[1])
                this.dataY.push(shape.points[i].usrCoords[2])
              }

              if (direction === 1) {
                this.dataX.push(pnx)
                this.dataY.push(pny < yMax ? yMax : pny)
              } else if (direction === 2) {
                this.dataX.push(pnx < xMax ? xMax : pnx)
                this.dataY.push(pny)
              } else if (direction === 3) {
                this.dataX.push(pnx)
                this.dataY.push(pny > yMin ? yMin : pny)
              } else if (direction === 4) {
                this.dataX.push(pnx > xMin ? xMin : pnx)
                this.dataY.push(pny)
              }
            }
          }

          inequalities.push(ineq)
          board.$board.update()

          break
        }
        case Hyperbola.jxgType: {
          const { points } = Hyperbola.getConfig(shape)
          const func = getHyperbolaFunc(
            { x: points[0].x, y: points[0].y },
            { x: points[1].x, y: points[1].y },
            { x: points[2].x, y: points[2].y }
          )
          const inverse = func(areaX, areaY) > 0
          console.log(inverse)
          break
        }
        case Logarithm.jxgType: {
          const points = Object.values(shape.ancestors)
          const [p1, p2] = points
          const func = Logarithm.makeCallback(...points)
          const inverse =
            p2.Y() > p1.Y() ? areaY > func(areaX) : areaY < func(areaX)
          inequalities.push(
            board.$board.create('inequality', [shape], { inverse })
          )
          break
        }
        case Sin.jxgType: {
          const points = Object.values(shape.ancestors)
          const inverse = areaY > Sin.makeCallback(...points)(areaX)
          inequalities.push(
            board.$board.create('inequality', [shape], { inverse })
          )
          break
        }
        case Cos.jxgType: {
          const points = Object.values(shape.ancestors)
          const inverse = areaY > Cos.makeCallback(...points)(areaX)
          inequalities.push(
            board.$board.create('inequality', [shape], { inverse })
          )
          break
        }
        case Tangent.jxgType: {
          const points = Object.values(shape.ancestors)
          const inverse = areaY > Tangent.makeCallback(...points)(areaX)
          inequalities.push(
            board.$board.create('inequality', [shape], { inverse })
          )
          break
        }
        case Exponent.jxgType: {
          const points = Object.values(shape.ancestors)
          const inverse = areaY > Exponent.makeCallback(...points)(areaX)
          inequalities.push(
            board.$board.create('inequality', [shape], { inverse })
          )
          break
        }
        case Exponent2.jxgType: {
          const points = Object.values(shape.ancestors)
          const inverse = areaY > Exponent2.makeCallback(...points)(areaX)
          inequalities.push(
            board.$board.create('inequality', [shape], { inverse })
          )
          break
        }
        case Polynom.jxgType: {
          const points = Object.values(shape.ancestors)
          const inverse = areaY > Polynom.makeCallback(...points)(areaX)
          inequalities.push(
            board.$board.create('inequality', [shape], { inverse })
          )
          break
        }
        default:
          break
      }
    })
  }
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

function onHandler() {
  return (board, event) => {
    const coords = board.getCoords(event).usrCoords
    const object = {
      x: coords[1],
      y: coords[2],
    }
    // TODO: should check if we can draw area point
    // if (canDrawAreaByPoint(board, object)) {
    return create(board, object)
    // }
  }
}

function getConfig(area) {
  return {
    _type: area.type,
    type: CONSTANT.TOOLS.AREA2,
    id: area.id,
    x: area.coords.usrCoords[1],
    y: area.coords.usrCoords[2],
  }
}

function updateShadingsForAreaPoints(board, shapes) {
  const areaPoints = shapes.filter((el) => el.type === jxgType)
  areaPoints.forEach((areaPoint) => updateShading(board, areaPoint, shapes))
}

function setAreaForEquation(board, equation) {
  console.log(!!board, !!equation)
}

function clearInequalities(board) {
  inequalities.forEach((ineq) => {
    board.$board.removeObject(ineq)
  })
  inequalities = []
}

export default {
  jxgType,
  create,
  onHandler,
  getConfig,
  updateShadingsForAreaPoints,
  setAreaForEquation,
  clearInequalities,
}

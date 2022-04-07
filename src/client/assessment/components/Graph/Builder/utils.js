import JXG from 'jsxgraph'
import striptags from 'striptags'
import { round } from 'lodash'
import { getMathHtml } from '@edulastic/common'
import { replaceLatexesWithMathHtml } from '@edulastic/common/src/utils/mathUtils'
import { convertNumberToFraction } from '../../../utils/helpers'
import { CONSTANT, Colors } from './config'
import { defaultConfig as lineConfig } from './elements/Line'
import { Area } from './elements' // , EditButton
import rayConfig from './elements/Ray'
import segmentConfig from './elements/Segment'
import vectorConfig from './elements/Vector'
import Polygon from './elements/Polygon'
import { MIN_SNAP_SIZE } from './config/constants'

export function isTouchDevice() {
  return JXG.isTouchDevice()
}

export function getEventName(name) {
  switch (name) {
    case 'up':
      return isTouchDevice() ? 'touchend' : 'up'
    // case "down": return isTouchDevice() ? "touchstart" : "down";
    // case "drag": return isTouchDevice() ? "touchdrag" : "drag";
    default:
      return name
  }
}

export function getAllObjectsUnderMouse(board, evt) {
  const cPos = board.$board.getCoordsTopLeftCorner()
  const absPos = JXG.getPosition(evt, 0, board.$board.document)
  const dx = absPos[0] - cPos[0]
  const dy = absPos[1] - cPos[1]
  const elList = []

  for (let el = 0; el < board.$board.objectsList.length; el++) {
    const pEl = board.$board.objectsList[el]
    if (pEl.visPropCalc.visible && pEl.hasPoint && pEl.hasPoint(dx, dy)) {
      elList[elList.length] = pEl
    }
  }

  return elList
}

// Calculate amount of units in chosen amount of pixels
export const calcMeasure = (x, y, board) => [
  x / board.$board.unitX,
  y / board.$board.unitY,
]

export const calcNumberlinePosition = (board) => {
  const {
    canvas: { yMax },
    layout: { linePosition },
  } = board.numberlineSettings
  const [, y] = calcMeasure(
    board.$board.canvasWidth,
    board.$board.canvasHeight,
    board
  )
  return yMax - (y / 100) * linePosition
}

export const findAvailableStackedSegmentPosition = (board) => {
  const {
    canvas: { yMax },
    layout: { linePosition },
  } = board.numberlineSettings
  const [, y] = calcMeasure(
    board.$board.canvasWidth,
    board.$board.canvasHeight,
    board
  )
  const [, yMeasure] = calcMeasure(0, board.stackResponsesSpacing, board)
  const lineY = yMax - (y / 100) * linePosition - yMeasure
  const calcedYPosition = lineY + yMeasure

  for (let i = 0; i <= board.elements.length; i++) {
    const yPosition = +(lineY + yMeasure * (i + 1)).toFixed(2)
    let isPositionAvailable = true

    board.elements.forEach((segment) => {
      if (segment.elType === 'point') {
        if (segment.Y() === yPosition) {
          isPositionAvailable = false
        }
      } else if (segment.point2.coords.usrCoords[2] === yPosition) {
        isPositionAvailable = false
      }
    })

    if (isPositionAvailable) {
      return yPosition
    }
  }

  return calcedYPosition
}

export const lineLabelCoord = (firstPoint, secondPoint) => {
  if (firstPoint === secondPoint) {
    return firstPoint
  }
  if (firstPoint < secondPoint) {
    const segmentLength = -firstPoint + secondPoint
    return secondPoint - segmentLength / 2
  }
  const segmentLength = -secondPoint + firstPoint
  return firstPoint - segmentLength / 2
}

// Calculate position between two points for line
export const calcLineLabelPosition = (line) => {
  const finalXCoord = lineLabelCoord(
    line.point1.coords.usrCoords[1],
    line.point2.coords.usrCoords[1]
  )
  const finalYCoord = lineLabelCoord(
    line.point1.coords.usrCoords[2],
    line.point2.coords.usrCoords[2]
  )
  return [finalXCoord, finalYCoord]
}

const fractionsNumber = (number) =>
  number.toString().includes('.')
    ? number.toString().split('.').pop().length
    : 0

// Calculate point rounded to ticksDistance value
export const calcRoundedToTicksDistance = (x, ticksDistance) => {
  if (fractionsNumber(ticksDistance) === 0) {
    if (x % ticksDistance >= ticksDistance / 2) {
      // closer to the biggest value
      let distanceDiff = x
      do {
        distanceDiff = Math.ceil(distanceDiff + 0.0001)
      } while (distanceDiff % ticksDistance !== 0)

      return x + (distanceDiff - x)
    }
    // closer to the smallest value
    return Math.round(x - (x % ticksDistance))
  }
  let ticksRounded = ticksDistance
  let iterationsCount = 0
  let xRounded = x

  do {
    xRounded *= 10
    ticksRounded *= 10
    iterationsCount += 1
  } while (fractionsNumber(ticksRounded) !== 0)

  xRounded = Math.floor(xRounded)

  let roundedCoord = calcRoundedToTicksDistance(xRounded, ticksRounded)

  do {
    roundedCoord /= 10
    iterationsCount -= 1
  } while (iterationsCount !== 0)

  return roundedCoord
}

// Calculate unitX
export const calcUnitX = (xMin, xMax, layoutWidth) => {
  const unitLength = -xMin + xMax
  return !layoutWidth ? 1 : layoutWidth / unitLength
}

function compareKeys(config, props) {
  return Object.keys(config).every((k) => !!props[k] === !!config[k])
}

function numberWithCommas(x) {
  x = x.toString()
  const pattern = /(-?\d+)(\d{3})/
  while (pattern.test(x)) {
    x = x.replace(pattern, '$1,$2')
  }
  return x
}

function getPointsFromFlatConfig(type, pointIds, config) {
  if (!pointIds) {
    return null
  }
  switch (type) {
    case CONSTANT.TOOLS.POLYGON:
    case CONSTANT.TOOLS.ELLIPSE:
    case CONSTANT.TOOLS.HYPERBOLA:
    case CONSTANT.TOOLS.POLYNOM:
    case CONSTANT.TOOLS.PARABOLA2:
    case CONSTANT.TOOLS.EXPONENTIAL2:
    case CONSTANT.TOOLS.PIECEWISE_LINE:
    case CONSTANT.TOOLS.PARABOLA:
    case CONSTANT.TOOLS.ROSE:
    case CONSTANT.TOOLS.CARDIOID:
      return Object.keys(pointIds)
        .sort()
        .map((k) => config.find((element) => element.id === pointIds[k]))
    default:
      return [
        config.find((element) => element.id === pointIds.startPoint),
        config.find((element) => element.id === pointIds.endPoint),
      ]
  }
}

export const disableSnapToGrid = (el) => {
  if (
    el.visProp?.snapsizex === MIN_SNAP_SIZE &&
    el.visProp?.snapsizey === MIN_SNAP_SIZE
  ) {
    return
  }
  el.setAttribute({
    snapSizeX: MIN_SNAP_SIZE,
    snapSizeY: MIN_SNAP_SIZE,
  })
}

export const enableSnapToGrid = (board, el) => {
  const snapSizeX = board.parameters.pointParameters?.snapSizeX || 1
  const snapSizeY = board.parameters.pointParameters?.snapSizeY || 1
  el.setAttribute({ snapSizeX, snapSizeY })
  el.snapToGrid()
}

export const handleSnap = (line, points, board) => {
  line.on('up', () => {
    if (line.dragged) {
      points.forEach((point) => point.snapToGrid())
      line.dragged = false
      Area.updateShadingsForAreaPoints(board, board.elements)
      board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE)
    }
  })
  line.on('drag', () => {
    line.dragged = true
    board.dragged = true
  })
  points.forEach((point) => {
    point.on('up', () => {
      if (point.dragged) {
        point.dragged = false
        Area.updateShadingsForAreaPoints(board, board.elements)
        board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE)
      }
    })
    point.on('drag', () => {
      point.dragged = true
      board.dragged = true
      // EditButton.cleanButton(board, point)
    })
  })
}

export function getLineTypeByProp(props) {
  if (compareKeys(lineConfig, props)) {
    return CONSTANT.TOOLS.LINE
  }
  if (compareKeys(rayConfig, props)) {
    return CONSTANT.TOOLS.RAY
  }
  if (compareKeys(segmentConfig, props)) {
    return CONSTANT.TOOLS.SEGMENT
  }
  if (compareKeys(vectorConfig, props)) {
    return CONSTANT.TOOLS.VECTOR
  }
  throw new Error('Unknown line', props)
}

export function getPropsByLineType(type) {
  switch (type) {
    case 'line':
      return lineConfig
    case 'ray':
      return rayConfig
    case 'segment':
      return segmentConfig
    case 'vector':
      return vectorConfig
    default:
      throw new Error('Unknown line type:', type)
  }
}

export function radianTickLabel(axe, drawZero = true, distance = 1) {
  return (coords) => {
    const label = axe === 'x' ? coords.usrCoords[1] : coords.usrCoords[2]
    if (label === 0) {
      if (axe === 'x') {
        // offset fix for zero label
        return drawZero ? '0&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;' : ''
      }
      if (axe === 'y') {
        return drawZero ? '0' : ''
      }
    }
    let tick = label * (distance / round(Math.PI, 2))
    tick = Math.abs(round(tick))

    let quotient = tick / distance
    const remainder = tick % distance
    const sign = label < 0 ? '-' : ''

    if (remainder === 0) {
      quotient = quotient === 1 ? '' : round(quotient)
      return getMathHtml(`${sign}${quotient}\\pi`)
    }

    if (tick === 1) {
      return getMathHtml(`${sign}\\frac{\\pi}{${distance}}`)
    }
    return getMathHtml(`${sign}\\frac{${tick}}{${distance}}\\pi`)
  }
}

export function tickLabel(
  axe,
  withComma = true,
  drawZero = true,
  distance = 0
) {
  return (coords) => {
    const label = axe === 'x' ? coords.usrCoords[1] : coords.usrCoords[2]
    if (label !== 0) {
      return withComma ? numberWithCommas(label.toFixed(distance)) : label
    }
    if (axe === 'x') {
      // offset fix for zero label
      return drawZero ? '0&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;' : ''
    }
    if (axe === 'y') {
      return drawZero ? '0' : ''
    }
  }
}

export function updatePointParameters(elements, attr, isSwitchToGrid) {
  if (!elements) {
    return
  }

  Object.keys(elements).forEach((key) => {
    const el = elements[key]
    if (el.type === JXG.OBJECT_TYPE_POINT || el.type === 101) {
      el.setAttribute(attr)
      if (isSwitchToGrid) {
        el.snapToGrid()
      }
    } else {
      updatePointParameters(
        Object.values(el.ancestors || {}),
        attr,
        isSwitchToGrid
      )
    }
  })
}

export function updateAxe(line, parameters, axe) {
  line.ticks[0].setAttribute({ drawZero: true })
  if ('ticksDistance' in parameters) {
    let axisTickDistance = parameters.ticksDistance
    if (parameters.useRadians) {
      axisTickDistance = round(Math.PI / axisTickDistance, 2)
    }
    line.ticks[0].setAttribute({ ticksDistance: axisTickDistance })
  }
  if ('showTicks' in parameters) {
    line.ticks[0].setAttribute({ majorHeight: parameters.showTicks ? 25 : 0 })
  }
  if ('drawLabels' in parameters) {
    line.ticks[0].setAttribute({ drawLabels: parameters.drawLabels })
  }
  if ('name' in parameters && line.name !== parameters.name) {
    if (!parameters.name) {
      line.setAttribute({ withLabel: false, name: '' })
    } else {
      line.setAttribute({ withLabel: true, name: parameters.name })
    }
  }
  if ('minArrow' in parameters || 'maxArrow' in parameters) {
    line.setArrow(
      parameters.minArrow === true
        ? { size: parameters.arrowSize || 8 }
        : false,
      parameters.maxArrow === true ? { size: parameters.arrowSize || 8 } : false
    )
  }

  if (parameters.useRadians) {
    line.ticks[0].generateLabelText = radianTickLabel(
      axe,
      parameters.drawZero,
      parameters.ticksDistance
    )
  } else {
    line.ticks[0].generateLabelText = tickLabel(
      axe,
      parameters.commaInLabel,
      parameters.drawZero
    )
  }

  if ('showAxis' in parameters) {
    line.setAttribute({ visible: parameters.showAxis })
  }

  if ('strokeColor' in parameters) {
    line.setAttribute({ strokeColor: parameters.strokeColor })
  }
}

export function updateGrid(grids, parameters) {
  const grid = grids[0]
  if (!grid) {
    return
  }

  grid.setAttribute({
    gridX: parameters.gridX,
    gridY: parameters.gridY,
    visible: parameters.showGrid,
  })
}

/**
 *
 * @param {object} boardParameters
 * @param {object} image
 * @requires Array [[left corner] ,[W,H]]
 */
export function getImageCoordsByPercent(boardParameters, bgImageParameters) {
  const { graphParameters } = boardParameters
  const { size = [], coords = [] } = bgImageParameters
  const xSize = Math.abs(graphParameters.xMin) + Math.abs(graphParameters.xMax)
  const ySize = Math.abs(graphParameters.yMin) + Math.abs(graphParameters.yMax)
  const imageSize = [(xSize / 100) * size[0], (ySize / 100) * size[1]]
  const leftCorner = [
    coords[0] - imageSize[0] / 2,
    coords[1] - imageSize[1] / 2,
  ]
  return [leftCorner, imageSize]
}

export function flatConfig(config, accArg = {}, isSub = false) {
  return config.reduce((acc, element) => {
    const { id, type, points } = element
    if (
      type === CONSTANT.TOOLS.POINT ||
      type === CONSTANT.TOOLS.AREA ||
      type === CONSTANT.TOOLS.DRAG_DROP
    ) {
      if (!acc[id]) {
        acc[id] = element
      }
      if (isSub) {
        acc[id].subElement = true
      }
      return acc
    }
    if (type === CONSTANT.TOOLS.EQUATION) {
      acc[id] = element
      return acc
    }

    acc[id] = {
      type,
      _type: element._type,
      id: element.id,
      label: element.label,
      labelIsVisible: element.labelIsVisible,
      baseColor: element.baseColor,
      priorityColor: element.priorityColor || null,
      text: element.text,
      dashed: element.dashed,
    }
    if (
      type !== CONSTANT.TOOLS.POLYGON &&
      type !== CONSTANT.TOOLS.ELLIPSE &&
      type !== CONSTANT.TOOLS.HYPERBOLA &&
      type !== CONSTANT.TOOLS.POLYNOM &&
      type !== CONSTANT.TOOLS.PARABOLA2 &&
      type !== CONSTANT.TOOLS.EXPONENTIAL2 &&
      type !== CONSTANT.TOOLS.PIECEWISE_LINE &&
      type !== CONSTANT.TOOLS.PARABOLA &&
      type !== CONSTANT.TOOLS.ROSE &&
      type !== CONSTANT.TOOLS.CARDIOID
    ) {
      acc[id].subElementsIds = {
        startPoint: points[0].id,
        endPoint: points[1].id,
      }
    } else {
      acc[id].subElementsIds = Polygon.flatConfigPoints(points)
    }
    return flatConfig(points, acc, true)
  }, accArg)
}

export function flat2nestedConfig(config) {
  return config && config.length
    ? Object.values(
        config.reduce((acc, element) => {
          const {
            id,
            type,
            subElement = false,
            text = null,
            dashed = false,
            customOptions = {},
            dimensions = {},
          } = element

          if (
            type === CONSTANT.TOOLS.EQUATION ||
            type === CONSTANT.TOOLS.NUMBERLINE_PLOT_POINT
          ) {
            acc[id] = element
            return acc
          }

          if (!acc[id] && !subElement) {
            acc[id] = {
              id,
              type,
              _type: element._type,
              priorityColor: element.priorityColor || null,
              label: element.label,
              labelIsVisible: element.labelIsVisible,
              baseColor: element.baseColor,
              text,
              dashed,
            }
            if (
              type === CONSTANT.TOOLS.POINT ||
              type === CONSTANT.TOOLS.DRAG_DROP ||
              type === CONSTANT.TOOLS.AREA
            ) {
              acc[id].x = element.x
              acc[id].y = element.y
              acc[id].priorityColor = element.priorityColor || null
              if (type === CONSTANT.TOOLS.POINT) {
                acc[id].pointIsVisible = element.pointIsVisible
                acc[id].labelIsVisible = element.labelIsVisible
                acc[id].baseColor = element.baseColor
              }
              if (type === CONSTANT.TOOLS.DRAG_DROP) {
                acc[id].dimensions = dimensions
              }
            } else {
              if (
                !element.subElementsIds &&
                (type === CONSTANT.TOOLS.POLYGON ||
                  type === CONSTANT.TOOLS.PIECEWISE_LINE)
              ) {
                element.subElementsIds = {}
              }
              acc[id].points = getPointsFromFlatConfig(
                type,
                element.subElementsIds,
                config
              )
            }
            acc[id].customOptions = customOptions
          }

          return acc
        }, {})
      )
    : []
}

export default getLineTypeByProp

/**
 * Returns array of ticks
 * @param {object} axis - jsxgraph axis object with special ticks
 * @return {array} array of number(s)
 * */
function getSpecialTicks(axis) {
  const ticks = axis.ticks.filter((t) => t.fixedTicks !== null)
  let fixedTicks = []
  ticks.forEach((t) => {
    fixedTicks = fixedTicks.concat(t.fixedTicks)
  })
  return fixedTicks
}

/**
 * Returns boolean value if the layout orientation is vertical
 * @param {object} board
 */
export const checkOrientation = (board) => {
  const {
    layout: { orientation },
  } = board.numberlineSettings
  return orientation === 'vertical'
}

/**
 * Returns closest number from array "ticks" to given number "pointX"
 * @param {number} pointX - any number
 * @param {object} axis - jsxgraph axis object with special ticks
 * */
export function getClosestTick(pointX, axis) {
  const ticks = getSpecialTicks(axis)

  function dist(x, t) {
    return Math.abs(x - t)
  }

  let minDist = dist(pointX, ticks[0])
  let closestTick = ticks[0]
  for (let i = 1; i < ticks.length; i++) {
    const tmpDist = dist(pointX, ticks[i])
    if (tmpDist < minDist) {
      minDist = tmpDist
      closestTick = ticks[i]
    }
  }
  return closestTick
}

export function getAvailablePositions(board, element, isStacked) {
  const isVertical = checkOrientation(board)

  const start = isVertical
    ? board.numberlineAxis.point1.Y()
    : board.numberlineAxis.point1.X()
  const result = [{ start }]

  if (!isStacked) {
    const otherElements =
      element !== null
        ? board.elements.filter((item) => item.id !== element.id)
        : board.elements

    const notAvailablePositions = otherElements
      .map((item) =>
        item.elType === 'point'
          ? item.X()
          : item.point1.X() < item.point2.X()
          ? [item.point1.X(), item.point2.X()]
          : [item.point2.X(), item.point1.X()]
      )
      .sort((a, b) => {
        const val1 = Array.isArray(a) ? a[0] : a
        const val2 = Array.isArray(b) ? b[0] : b
        return val1 - val2
      })

    notAvailablePositions.forEach((item, i) => {
      if (Array.isArray(item)) {
        // eslint-disable-next-line prefer-destructuring
        result[i].end = item[0]
        result.push({ start: item[1] })
      } else {
        result[i].end = item
        result.push({ start: item })
      }
    })
  }

  const end = isVertical
    ? board.numberlineAxis.point2.Y()
    : board.numberlineAxis.point2.X()
  result[result.length - 1].end = end

  return result
}

export const getEquationFromApiLatex = (apiLatex) =>
  // NOTE: object.apiLatex should be a string such that -
  // "[-x+y-2=0],[['line',[(0,2),(1,3)]]]" >> transforms to >> "-x+y-2=0"
  apiLatex.split('],[')[0].replace('[', '')

export function fixApiLatex(latex) {
  let splitExpr = latex.split('<=')
  if (splitExpr.length === 2) {
    const latexFunc = splitExpr[0]
    const compSign = '<='
    return { latexFunc, compSign }
  }

  splitExpr = latex.split('>=')
  if (splitExpr.length === 2) {
    const latexFunc = splitExpr[0]
    const compSign = '>='
    return { latexFunc, compSign }
  }

  splitExpr = latex.split('<')
  if (splitExpr.length === 2) {
    const latexFunc = splitExpr[0]
    const compSign = '<'
    return { latexFunc, compSign }
  }

  splitExpr = latex.split('>')
  if (splitExpr.length === 2) {
    const latexFunc = splitExpr[0]
    const compSign = '>'
    return { latexFunc, compSign }
  }

  splitExpr = latex.split('=')
  if (splitExpr.length === 2) {
    const latexFunc = splitExpr[0]
    const compSign = '='
    return { latexFunc, compSign }
  }

  return {
    latexFunc: latex,
    compSign: '=',
  }
}

export function getLineFunc(point1, point2) {
  const x1 = point1.x
  const y1 = point1.y
  const x2 = point2.x
  const y2 = point2.y

  // vertical line
  if (x1 === x2) {
    return (x) => x - x1
  }

  const a = (y2 - y1) / (x2 - x1)
  const c = (x2 * y1 - x1 * y2) / (x2 - x1)

  return (x, y) => y - a * x - c
}

export function getCircleFunc(point1, point2) {
  const x1 = point1.x
  const y1 = point1.y
  const x2 = point2.x
  const y2 = point2.y

  const r = (y2 - y1) ** 2 + (x2 - x1) ** 2

  return (x, y) => (x - x1) ** 2 + (y - y1) ** 2 - r
}

export function getEllipseFunc(point1, point2, point3) {
  const x1 = point1.x
  const y1 = point1.y
  const x2 = point2.x
  const y2 = point2.y
  const x3 = point3.x
  const y3 = point3.y

  const cX = (x1 + x2) / 2
  const cY = (y1 + y2) / 2
  const rff = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2)
  const r1 = Math.sqrt((y3 - y1) ** 2 + (x3 - x1) ** 2)
  const r2 = Math.sqrt((y3 - y2) ** 2 + (x3 - x2) ** 2)
  const aPow2 = ((r1 + r2) / 2) ** 2
  const bPow2 = aPow2 - (rff / 2) ** 2

  const cos = (x2 - x1) / rff
  const sin = (y1 - y2) / rff

  return (x, y) =>
    ((x - cX) * cos - (y - cY) * sin) ** 2 / aPow2 +
    ((x - cX) * sin + (y - cY) * cos) ** 2 / bPow2 -
    1
}

export function getHyperbolaFunc(point1, point2, point3) {
  const x1 = point1.x
  const y1 = point1.y
  const x2 = point2.x
  const y2 = point2.y
  const x3 = point3.x
  const y3 = point3.y

  const cX = (x1 + x2) / 2
  const cY = (y1 + y2) / 2
  const rff = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2)
  const r1 = Math.sqrt((y3 - y1) ** 2 + (x3 - x1) ** 2)
  const r2 = Math.sqrt((y3 - y2) ** 2 + (x3 - x2) ** 2)
  const aPow2 = ((r1 - r2) / 2) ** 2
  const bPow2 = (rff / 2) ** 2 - aPow2

  const cos = (x2 - x1) / rff
  const sin = (y1 - y2) / rff

  return (x, y) =>
    ((x - cX) * cos - (y - cY) * sin) ** 2 / aPow2 -
    ((x - cX) * sin + (y - cY) * cos) ** 2 / bPow2 -
    1
}

/**
 * Get parabola2 function by directrix and focus point
 * @param point1 directrix point
 * @param point2 directrix point
 * @param point3 focus point
 * @returns {*}
 */
export function getParabolaFunc(point1, point2, point3) {
  const x1 = point1.x
  const y1 = point1.y
  const x2 = point2.x
  const y2 = point2.y
  const x3 = point3.x
  const y3 = point3.y

  const a = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2)
  if (a === 0) {
    return () => 1
  }

  const p = ((y2 - y1) * x3 - (x2 - x1) * y3 + x2 * y1 - y2 * x1) / a
  const sin = p > 0 ? (x2 - x1) / a : (x1 - x2) / a
  const cos = p > 0 ? (y2 - y1) / a : (y1 - y2) / a
  const cX = p > 0 ? x3 - (p / 2) * cos : x3 + (p / 2) * cos
  const cY = p > 0 ? y3 + (p / 2) * sin : y3 - (p / 2) * sin

  return (x, y) =>
    ((x - cX) * sin + (y - cY) * cos) ** 2 -
    ((x - cX) * cos - (y - cY) * sin) * 2 * Math.abs(p)
}

export function isInPolygon(testPoint, vertices) {
  if (vertices.length < 3) {
    return false
  }

  function isBetween(x, a, b) {
    return (x - a) * (x - b) < 0
  }

  let result = false
  let lastVertex = vertices[vertices.length - 1]
  vertices.forEach((vertex) => {
    if (isBetween(testPoint.y, lastVertex.y, vertex.y)) {
      const t = (testPoint.y - lastVertex.y) / (vertex.y - lastVertex.y)
      const x = t * (vertex.x - lastVertex.x) + lastVertex.x
      if (x >= testPoint.x) {
        result = !result
      }
    } else {
      if (
        testPoint.y === lastVertex.y &&
        testPoint.x < lastVertex.x &&
        vertex.y > testPoint.y
      ) {
        result = !result
      }
      if (
        testPoint.y === vertex.y &&
        testPoint.x < vertex.x &&
        lastVertex.y > testPoint.y
      ) {
        result = !result
      }
    }
    lastVertex = vertex
  })

  return result
}

export const getLabel = (elements) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  for (let i = 0; i < alphabet.length; i++) {
    let match = false
    for (let k = 0; k < elements.length; k++) {
      if (elements[k] == alphabet[i]) {
        match = true
      }
    }
    if (!match) return alphabet[i]
  }

  return alphabet[elements.length]
}

export const nameGen = (elements) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  for (let i = 0; i < alphabet.length; i++) {
    if (
      !elements.some(
        (element) =>
          element &&
          ([element.name, element.labelHTML].includes(alphabet[i]) ||
            // || element.name === alphabet[i]
            Object.values(element.ancestors).some(
              (ancestor) =>
                ancestor &&
                [ancestor.name, ancestor.labelHTML].includes(alphabet[i])
            ))
      )
    ) {
      return alphabet[i]
    }
  }

  for (let j = 0; j < alphabet.length; j++) {
    for (let i = 0; i < alphabet.length; i++) {
      if (
        !elements.some(
          (element) =>
            element &&
            ([element.name, element.labelHTML].includes(
              alphabet[j] + alphabet[i]
            ) ||
              Object.values(element.ancestors).some(
                (ancestor) =>
                  ancestor &&
                  [ancestor.name, ancestor.labelHTML].includes(
                    alphabet[j] + alphabet[i]
                  )
              ))
        )
      ) {
        return alphabet[j] + alphabet[i]
      }
    }
  }
}

export function setLabel(element, label) {
  if (!label || element.latexIsBroken) {
    return
  }

  const content = replaceLatexesWithMathHtml(label)
  element.setLabel(striptags(content))
  element.label.rendNode.innerHTML = content

  element.labelHTML = label
}

export function colorGenerator(index) {
  const colorPool = [
    '#595e98',
    '#0b7e50',
    '#0becdd',
    '#99723b',
    '#96c3b3',
    '#ae1084',
    '#753d96',
    '#9a1d04',
    '#67d0da',
    '#aa878e',
    '#50d070',
    '#e07354',
    '#1e9301',
    '#9198f4',
    '#f0496b',
    '#9c39f2',
    '#a5d4d8',
    '#0cf073',
    '#de2bc3',
  ]

  return colorPool[index % colorPool.length]
}

export const toFractionHTML = (value, fractionsFormat) => {
  const fraction = convertNumberToFraction(value, fractionsFormat)

  const main = fraction.main !== null ? `${fraction.main}` : ''

  const fracs =
    fraction.sup !== null && fraction.sub !== null
      ? `<sup>${fraction.sup}</sup>/<sub>${fraction.sub}</sub>`
      : ''

  const space = main.length > 0 && fracs.length > 0 ? '&nbsp;' : ''

  const labelStyle = Object.keys(Colors.tickLabel).reduce(
    (acc, curr) => `${acc}${curr}:${Colors.tickLabel[curr]};`,
    ''
  )

  return `<span style="${labelStyle}" data-cy="label-${main}">${main}${space}${fracs}</span>`
}

/*
 * check can add dragged value to board
 * @param {object} board
 * @param {number} x
 * @param {number} y
 * @returns {object} coords
 */
export const canAddElementToBoard = (board, x, y) => {
  const coords = new JXG.Coords(JXG.COORDS_BY_SCREEN, [x, y], board.$board)
  const [xMin, yMax, xMax, yMin] = board.$board.getBoundingBox()
  if (
    coords.usrCoords[1] < xMin ||
    coords.usrCoords[1] > xMax ||
    coords.usrCoords[2] < yMin ||
    coords.usrCoords[2] > yMax
  ) {
    return false
  }
  return coords
}

export const getClosest = (points, n, compare = 'y') => {
  const closest = points.reduce(
    (prev, curr) =>
      Math.abs(curr[compare] - n) < Math.abs(prev[compare] - n) ? curr : prev,
    points[0]
  )
  return closest
}

import JXG from 'jsxgraph'
import { CONSTANT } from '../config'
import { defaultPointParameters, getLabelParameters } from '../settings'
// import EditButton from './EditButton'
import { setLabel, nameGen, colorGenerator } from '../utils'
import { Area, Equation } from '.'

function getColorParams(color) {
  return {
    fillColor: color,
    strokeColor: color,
    highlightStrokeColor: color,
    highlightFillColor: color,
  }
}

function getPointCoordsForPolar(intersections, point, snapToGrid) {
  if (!snapToGrid || !intersections) {
    return point
  }

  function distance(p) {
    return Math.sqrt((point[0] - p[0]) ** 2 + (point[1] - p[1]) ** 2)
  }

  const closest = intersections.reduce((a, b) =>
    distance(a) < distance(b) ? a : b
  )
  return closest
}

function create(board, object, settings = {}) {
  const {
    labelIsVisible = true,
    pointIsVisible = true,
    fixed = false,
    snapToGrid = true,
    latex = false,
    result = false,
    attchEvent = true,
  } = settings

  const { x, y, id = null, label, baseColor, priorityColor } = object
  const isPolarGrid = board.gridType === CONSTANT.POLAR_GRID
  const coords = isPolarGrid
    ? getPointCoordsForPolar(board.polarIntersections, [x, y], snapToGrid)
    : [x, y]

  const hideColor = pointIsVisible ? null : 'transparent'

  const pointConf = {
    ...(board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters()),
    ...getColorParams(
      hideColor || priorityColor || board.priorityColor || baseColor
    ),
    label: {
      ...getLabelParameters(JXG.OBJECT_TYPE_POINT),
      visible: labelIsVisible,
    },
    fixed,
    snapToGrid: isPolarGrid ? false : snapToGrid,
    id,
  }

  if ('size' in settings) {
    pointConf.size = settings.size
  }

  if ('fillColor' in settings) {
    pointConf.fillColor = settings.fillColor
  }

  if ('highlightFillColor' in settings) {
    pointConf.highlightFillColor = settings.highlightFillColor
  }

  if (object.opened) {
    pointConf.fillColor = '#fff'
    pointConf.highlightFillColor = '#fff'
  }

  const point = board?.$board?.create(
    'point',
    [coords[0], coords[1]],
    pointConf
  )

  point.pointIsVisible = object.pointIsVisible
  point.labelIsVisible = object.labelIsVisible
  point.baseColor = baseColor
  point.opened = object.opened
  point.subElement = object.subElement

  if (!fixed && attchEvent) {
    point.on('up', () => {
      if (isPolarGrid && snapToGrid) {
        const closest = getPointCoordsForPolar(
          board.polarIntersections,
          [point.X(), point.Y()],
          snapToGrid
        )
        point.setPosition(JXG.COORDS_BY_USER, [closest[0], closest[1]])
      }
      if (point.dragged) {
        point.dragged = false
        if (!point.isTemp) {
          Area.updateShadingsForAreaPoints(board, board.elements)
          board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE)
        }
      }
    })

    point.on('drag', () => {
      // don't use e.movementX === 0 && e.movementY === 0
      // movementX and movementY are always zero on Safari
      // it seems like the bug is in JSXGraph library
      // https://snapwiz.atlassian.net/browse/EV-19969
      // https://snapwiz.atlassian.net/browse/EV-23207

      point.dragged = true
      board.dragged = true
      // EditButton.cleanButton(board, point)
    })

    point.on('mouseover', (event) => board.handleElementMouseOver(point, event))
    point.on('mouseout', () => board.handleElementMouseOut(point))
  }

  if (labelIsVisible) {
    setLabel(point, label)
  }

  if (latex != false && result != false) {
    point.type = Equation.jxgType
    point.latex = latex
    point.apiLatex = result
  }

  return point
}

function onHandler(board, event, id = null) {
  const coords = board.getCoords(event).usrCoords
  const elements = board.elements.concat(
    board.getTempPoints(),
    board.bgElements
  )
  const object = {
    x: coords[1],
    y: coords[2],
    label: nameGen(elements),
    labelIsVisible: true,
    pointIsVisible: true,
    baseColor: colorGenerator(board.elements.length),
    id,
  }
  return create(board, object)
}

function getConfig(point) {
  return {
    _type: point.type,
    type: CONSTANT.TOOLS.POINT,
    x: point.coords.usrCoords[1],
    y: point.coords.usrCoords[2],
    id: point.id,
    label: point.labelHTML || false,
    labelIsVisible: point.labelIsVisible,
    pointIsVisible: point.pointIsVisible,
    baseColor: point.baseColor,
    opened: point.opened,
  }
}

export default {
  onHandler,
  getConfig,
  create,
  getColorParams,
  getPointCoordsForPolar,
}

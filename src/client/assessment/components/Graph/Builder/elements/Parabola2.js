import { Point, Line, Area, Area2, Equation } from '.'
import { CONSTANT } from '../config'
import { handleSnap, colorGenerator, setLabel } from '../utils'
import { getLabelParameters } from '../settings'

const jxgType = 102

const defaultConfig = {
  fixed: false,
  strokeWidth: 2,
  highlightStrokeWidth: 2,
}

let tempToolPoints = []

function getColorParams(color) {
  return {
    fillColor: 'transparent',
    strokeColor: color,
    highlightStrokeColor: color,
    highlightFillColor: 'transparent',
  }
}

function create(board, object, parabolaPoints, settings = {}) {
  const {
    labelIsVisible = true,
    fixed = false,
    latex = false,
    result = false,
    pointsLabel = false,
  } = settings

  const { id = null, label, baseColor, priorityColor, dashed = false } = object

  const params = {
    ...defaultConfig,
    ...getColorParams(priorityColor || board.priorityColor || baseColor),
    label: {
      ...getLabelParameters(jxgType),
      visible: labelIsVisible,
    },
    dash: dashed ? 2 : 0,
    fixed,
    id,
  }
  // parabolaPoints
  const directrixColor = `${
    priorityColor || board.priorityColor || baseColor
  }50`
  const directrix = board.$board.create(
    'line',
    [parabolaPoints[1], parabolaPoints[2]],
    {
      ...Line.getColorParams(directrixColor),
      fixed,
    }
  )

  const newLine = board.$board.create(
    'parabola',
    [parabolaPoints[0], directrix],
    params
  )

  newLine.type = jxgType
  newLine.labelIsVisible = object.labelIsVisible
  newLine.baseColor = object.baseColor
  newLine.dashed = object.dashed

  if (latex && result) {
    newLine.type = Equation.jxgType
    newLine.latex = latex
    newLine.apiLatex = result
    newLine.pointsLabel = pointsLabel
  }

  newLine.addParents([...parabolaPoints, directrix])
  newLine.ancestors = {
    [parabolaPoints[1].id]: parabolaPoints[1],
    [parabolaPoints[2].id]: parabolaPoints[2],
    [parabolaPoints[0].id]: parabolaPoints[0],
  }

  if (!fixed) {
    handleSnap(newLine, Object.values(newLine.ancestors), board)
    directrix.on('up', () => {
      if (directrix.dragged) {
        ;[parabolaPoints[1], parabolaPoints[2]].forEach((point) =>
          point.snapToGrid()
        )
        directrix.dragged = false
        Area.updateShadingsForAreaPoints(board, board.elements)
        Area2.updateShadingsForAreaPoints(board, board.elements)
        board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_UPDATE)
      }
    })
    directrix.on('drag', () => {
      // don't use e.movementX === 0 && e.movementY === 0
      // movementX and movementY are always zero on Safari
      // it seems like the bug is in JSXGraph library
      // https://snapwiz.atlassian.net/browse/EV-19969
      // https://snapwiz.atlassian.net/browse/EV-23207

      directrix.dragged = true
      board.dragged = true
    })
    board.handleStackedElementsMouseEvents(newLine)
  }

  if (labelIsVisible) {
    setLabel(newLine, label)
  }

  return newLine
}

function onHandler() {
  return (board, event) => {
    const newPoint = Point.onHandler(board, event)
    newPoint.isTemp = true
    tempToolPoints.push(newPoint)
    if (tempToolPoints.length === 3) {
      tempToolPoints.forEach((point) => {
        point.isTemp = false
      })
      const object = {
        label: false,
        labelIsVisible: true,
        baseColor: colorGenerator(board.elements.length),
      }
      const newLine = create(board, object, tempToolPoints)
      tempToolPoints = []
      return newLine
    }
  }
}

function clean(board) {
  const result = tempToolPoints.length > 0
  tempToolPoints.forEach((point) => board.$board.removeObject(point))
  tempToolPoints = []
  return result
}

function getConfig(parabola) {
  return {
    _type: parabola.type,
    type: CONSTANT.TOOLS.PARABOLA2,
    id: parabola.id,
    label: parabola.labelHTML || false,
    labelIsVisible: parabola.labelIsVisible,
    baseColor: parabola.baseColor,
    dashed: parabola.dashed,
    points: Object.keys(parabola.ancestors)
      .sort()
      .map((n) => Point.getConfig(parabola.ancestors[n])),
  }
}

function getTempPoints() {
  return tempToolPoints
}

export default {
  jxgType,
  onHandler,
  getConfig,
  clean,
  getTempPoints,
  create,
  getColorParams,
}

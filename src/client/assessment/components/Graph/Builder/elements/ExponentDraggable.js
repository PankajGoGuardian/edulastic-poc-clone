import { Point } from '.'
import { CONSTANT } from '../config'
import { handleSnap, colorGenerator, setLabel } from '../utils'
import { getLabelParameters } from '../settings'

const jxgType = 104

const defaultConfig = {
  fixed: false,
  strokeWidth: 2,
  highlightStrokeWidth: 2,
}

const makeCallback = (p1) => (x) => {
  const a = Math.log(p1.Y()) / p1.X()
  return Math.exp(a * x)
}

function getColorParams(color) {
  return {
    fillColor: 'transparent',
    strokeColor: color,
    highlightStrokeColor: color,
    highlightFillColor: 'transparent',
  }
}

function create(board, object, point, settings = {}) {
  const { labelIsVisible = true, fixed = false } = settings

  const { id = null, label, baseColor, priorityColor, dashed = false } = object

  const newLine = board.$board.create('functiongraph', [makeCallback(point)], {
    ...defaultConfig,
    ...getColorParams(priorityColor || board.priorityColor || baseColor),
    label: {
      ...getLabelParameters(jxgType),
      visible: labelIsVisible,
    },
    dash: dashed ? 2 : 0,
    fixed,
    id,
  })

  newLine.type = jxgType
  newLine.labelIsVisible = object.labelIsVisible
  newLine.baseColor = object.baseColor
  newLine.dashed = object.dashed

  newLine.addParents(point)
  newLine.ancestors = {
    [point.id]: point,
  }

  if (!fixed) {
    handleSnap(newLine, Object.values(newLine.ancestors), board)
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
    const object = {
      label: false,
      labelIsVisible: true,
      baseColor: colorGenerator(board.elements.length),
    }
    return create(board, object, newPoint)
  }
}

function getConfig(obj) {
  return {
    _type: obj.type,
    type: CONSTANT.TOOLS.EXPONENT_DRAGGABLE,
    id: obj.id,
    label: obj.labelHTML || false,
    labelIsVisible: obj.labelIsVisible,
    baseColor: obj.baseColor,
    dashed: obj.dashed,
    points: Object.keys(obj.ancestors)
      .sort()
      .map((n) => Point.getConfig(obj.ancestors[n])),
  }
}

export default {
  jxgType,
  onHandler,
  getConfig,
  create,
  makeCallback,
}

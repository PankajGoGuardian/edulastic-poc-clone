import JXG from 'jsxgraph'
import { Colors, CONSTANT } from '../config'
import {
  findAvailableStackedSegmentPosition,
  getAvailablePositions,
  getClosestTick,
  calcNumberlinePosition,
  checkOrientation,
} from '../utils'
import { defaultPointParameters } from '../settings'

const handleVectorPointDrag = (
  board,
  vector,
  point,
  segmentType,
  position,
  isStacked = false
) => {
  let availablePositions = null
  let lastTruePosition = null
  const isVertical = checkOrientation(board)

  point.on('drag', () => {
    // don't use e.movementX === 0 && e.movementY === 0
    // movementX and movementY are always zero on Safari
    // it seems like the bug is in JSXGraph library
    // https://snapwiz.atlassian.net/browse/EV-19969
    // https://snapwiz.atlassian.net/browse/EV-23207

    const currentPosition = isVertical ? point.Y() : point.X()
    const coord = isVertical
      ? [position, currentPosition]
      : [currentPosition, position]
    point.setPosition(JXG.COORDS_BY_USER, coord)
    point.dragged = true
    board.dragged = true
  })

  point.on('up', () => {
    if (point.dragged) {
      point.dragged = false
      let currentPosition = isVertical ? point.Y() : point.X()

      if (board.numberlineSnapToTicks) {
        currentPosition = getClosestTick(currentPosition, board.numberlineAxis)
      }

      if (
        availablePositions.findIndex(
          (pos) => currentPosition > pos.start && currentPosition < pos.end
        ) > -1
      ) {
        lastTruePosition = currentPosition
      }

      const coord = isVertical
        ? [position, lastTruePosition]
        : [lastTruePosition, position]

      point.setPosition(JXG.COORDS_BY_USER, coord)
      board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE)
    }
    availablePositions = null
    lastTruePosition = null
  })

  point.on('down', () => {
    lastTruePosition = isVertical ? point.Y() : point.X()
    availablePositions = getAvailablePositions(board, vector, isStacked)
    switch (segmentType) {
      case CONSTANT.TOOLS.RAY_LEFT_DIRECTION:
        availablePositions = [availablePositions[0]]
        break
      case CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW:
        availablePositions = [availablePositions[0]]
        break
      case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION:
        availablePositions = [availablePositions[availablePositions.length - 1]]
        break
      case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW:
      default:
        availablePositions = [availablePositions[availablePositions.length - 1]]
        break
    }
  })
}

// Draw segment point with proper settings
const drawPoint = (board, x, pointIncluded, fixed, colors, yPosition) => {
  const styles = pointIncluded
    ? { ...Colors.default[CONSTANT.TOOLS.POINT] }
    : { ...Colors.special[CONSTANT.TOOLS.POINT] }
  const highlightPointType = pointIncluded
    ? CONSTANT.TOOLS.POINT
    : CONSTANT.TOOLS.SEGMENTS_POINT

  return board.$board.create('point', [x, yPosition], {
    ...(board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters()),
    ...styles,
    highlightStrokeColor: () =>
      board.currentTool === CONSTANT.TOOLS.TRASH
        ? Colors.red[highlightPointType].highlightStrokeColor
        : Colors.default[highlightPointType].highlightStrokeColor,
    highlightFillColor: () =>
      board.currentTool === CONSTANT.TOOLS.TRASH
        ? Colors.red[highlightPointType].highlightFillColor
        : Colors.default[highlightPointType].highlightFillColor,
    ...colors,
    fixed,
    snapToGrid: false,
  })
}

// Draw invisible point of vector on proper place
const drawVectorPoint = (board, toRightDirection, position) => {
  const isVertical = checkOrientation(board)
  const min = isVertical
    ? board.numberlineAxis.point1.Y()
    : board.numberlineAxis.point1.X()
  const max = isVertical
    ? board.numberlineAxis.point2.Y()
    : board.numberlineAxis.point2.X()

  const invisiblePointX = isVertical ? position : toRightDirection ? max : min
  const invisiblePointY = isVertical ? (toRightDirection ? max : min) : position

  return board.$board.create('point', [invisiblePointX, invisiblePointY], {
    snapToGrid: false,
    visible: false,
    fixed: true,
  })
}

// Draw new vector line with proper settings
const drawVectorLine = (
  board,
  visiblePoint,
  invisiblePoint,
  toRightDirection,
  colors,
  segmentType
) => {
  const points = toRightDirection
    ? [visiblePoint, invisiblePoint]
    : [invisiblePoint, visiblePoint]

  const vector = board.$board.create('segment', points, {
    firstarrow: toRightDirection ? false : { size: 5 },
    lastarrow: toRightDirection ? { size: 5 } : false,
    straightfirst: false,
    straightlast: false,
    fixed: true,
    ...Colors.default[CONSTANT.TOOLS.LINE],
    highlightStrokeColor: () =>
      board.currentTool === CONSTANT.TOOLS.TRASH
        ? Colors.red[CONSTANT.TOOLS.LINE].highlightStrokeColor
        : Colors.default[CONSTANT.TOOLS.LINE].highlightStrokeColor,
    highlightFillColor: () =>
      board.currentTool === CONSTANT.TOOLS.TRASH
        ? Colors.red[CONSTANT.TOOLS.LINE].highlightFillColor
        : Colors.default[CONSTANT.TOOLS.LINE].highlightFillColor,
    ...colors,
  })
  vector.segmentType = segmentType
  return vector
}

const loadVector = (
  board,
  element,
  pointIncluded,
  toRightDirection,
  segmentType
) => {
  const isVertical = checkOrientation(board)
  const x = [
    CONSTANT.TOOLS.RAY_RIGHT_DIRECTION,
    CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW,
  ].includes(segmentType)
    ? element.point1
    : element.point2

  const yPos = board.stackResponses ? element.y : calcNumberlinePosition(board)

  const visiblePointX = isVertical ? yPos : x
  const visiblePointY = isVertical ? x : yPos
  const visiblePoint = drawPoint(
    board,
    visiblePointX,
    pointIncluded,
    false,
    element.pointColor,
    visiblePointY
  )

  const invisiblePoint = drawVectorPoint(board, toRightDirection, yPos)
  const vector = drawVectorLine(
    board,
    visiblePoint,
    invisiblePoint,
    toRightDirection,
    element.colors,
    segmentType
  )

  if (!board.stackResponses) {
    handleVectorPointDrag(
      board,
      vector,
      visiblePoint,
      segmentType,
      calcNumberlinePosition(board)
    )
  } else {
    handleVectorPointDrag(
      board,
      vector,
      visiblePoint,
      segmentType,
      element.y,
      true
    )
  }

  return vector
}

const onHandler = (board, coord) => {
  let pointIncluded = true
  let toRightDirection = true
  let availablePositions = getAvailablePositions(
    board,
    null,
    board.stackResponses
  )
  const isVertical = checkOrientation(board)

  switch (board.currentTool) {
    case CONSTANT.TOOLS.RAY_LEFT_DIRECTION:
      pointIncluded = true
      toRightDirection = false
      availablePositions = [availablePositions[0]]
      break
    case CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW:
      pointIncluded = false
      toRightDirection = false
      availablePositions = [availablePositions[0]]
      break
    case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION:
      pointIncluded = true
      toRightDirection = true
      availablePositions = [availablePositions[availablePositions.length - 1]]
      break
    case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW:
    default:
      pointIncluded = false
      toRightDirection = true
      availablePositions = [availablePositions[availablePositions.length - 1]]
      break
  }

  const [, x, y] = board.getCoords(coord).usrCoords

  let newStart = isVertical ? y : x

  if (board.numberlineSnapToTicks) {
    newStart = getClosestTick(newStart, board.numberlineAxis)
  }

  if (
    availablePositions.findIndex(
      (pos) => newStart > pos.start && newStart < pos.end
    ) === -1
  ) {
    return
  }

  if (!board.stackResponses) {
    const yPos = calcNumberlinePosition(board)
    const newStartX = isVertical ? yPos : newStart
    const newStartY = isVertical ? newStart : yPos
    const visiblePoint = drawPoint(
      board,
      newStartX,
      pointIncluded,
      false,
      null,
      newStartY
    )
    const invisiblePoint = drawVectorPoint(board, toRightDirection, yPos)
    const vector = drawVectorLine(
      board,
      visiblePoint,
      invisiblePoint,
      toRightDirection,
      null,
      board.currentTool
    )
    handleVectorPointDrag(board, vector, visiblePoint, board.currentTool, yPos)
    return vector
  }

  const calcedYPosition = findAvailableStackedSegmentPosition(board)
  const visiblePoint = drawPoint(
    board,
    isVertical ? calcedYPosition : newStart,
    pointIncluded,
    false,
    null,
    isVertical ? newStart : calcedYPosition
  )
  const invisiblePoint = drawVectorPoint(
    board,
    toRightDirection,
    calcedYPosition
  )
  const vector = drawVectorLine(
    board,
    visiblePoint,
    invisiblePoint,
    toRightDirection,
    null,
    board.currentTool
  )
  handleVectorPointDrag(
    board,
    vector,
    visiblePoint,
    board.currentTool,
    calcedYPosition,
    true
  )
  return vector
}

const renderAnswer = (board, config, pointIncluded, toRightDirection) => {
  const isVertical = checkOrientation(board)

  const yPos = board.stackResponses ? config.y : calcNumberlinePosition(board)

  const position = toRightDirection ? config.point1 : config.point2
  const visiblePointX = isVertical ? yPos : position
  const visiblePointY = isVertical ? position : yPos

  const visiblePoint = drawPoint(
    board,
    visiblePointX,
    pointIncluded,
    true,
    config.pointColor,
    visiblePointY
  )
  const invisiblePoint = drawVectorPoint(board, toRightDirection, yPos)
  return drawVectorLine(
    board,
    visiblePoint,
    invisiblePoint,
    toRightDirection,
    config.colors
  )
}

const determineAnswerType = (board, config) => {
  switch (config.type) {
    case CONSTANT.TOOLS.RAY_LEFT_DIRECTION:
      return renderAnswer(board, config, true, false)
    case CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW:
      return renderAnswer(board, config, false, false)
    case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION:
      return renderAnswer(board, config, true, true)
    case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW:
      return renderAnswer(board, config, false, true)
    default:
      throw new Error('Unknown tool:')
  }
}

const getConfig = (segment, board) => {
  const isVertical = checkOrientation(board)
  return isVertical
    ? {
        id: segment.id,
        type: segment.segmentType,
        point1: segment.point1.Y(),
        point2: segment.point2.Y(),
        y: segment.point1.X(),
      }
    : {
        id: segment.id,
        type: segment.segmentType,
        point1: segment.point1.X(),
        point2: segment.point2.X(),
        y: segment.point1.Y(),
      }
}

export default {
  onHandler,
  getConfig,
  loadVector,
  determineAnswerType,
}

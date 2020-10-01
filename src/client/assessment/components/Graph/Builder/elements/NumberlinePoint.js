import JXG from 'jsxgraph'
import {
  findAvailableStackedSegmentPosition,
  getAvailablePositions,
  getClosestTick,
  calcNumberlinePosition,
  checkOrientation,
} from '../utils'
import { Colors, CONSTANT } from '../config'
import { defaultPointParameters } from '../settings'

const handlePointDrag = (board, point, yPosition, isStacked = false) => {
  let availablePositions = null
  let lastTruePosition = null
  const isVertical = checkOrientation(board)

  point.on('drag', (e) => {
    if (e.movementX === 0 && e.movementY === 0) {
      return
    }

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

    point.setPosition(JXG.COORDS_BY_USER, [
      isVertical ? yPosition : lastTruePosition,
      isVertical ? lastTruePosition : yPosition,
    ])
    point.dragged = true
    board.dragged = true
  })

  point.on('up', () => {
    availablePositions = null
    lastTruePosition = null
    if (point.dragged) {
      point.dragged = false
      point.setPosition(JXG.COORDS_BY_USER, [
        isVertical ? yPosition : point.X(),
        isVertical ? point.Y() : yPosition,
      ])
      board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE)
    }
  })

  point.on('down', () => {
    lastTruePosition = isVertical ? point.Y() : point.X()
    availablePositions = getAvailablePositions(board, point, isStacked)
  })
}

const drawPoint = (board, x, fixed, colors, yPosition) => {
  const point = board.$board.create('point', [x, yPosition], {
    ...(board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters()),
    ...Colors.default[CONSTANT.TOOLS.POINT],
    highlightStrokeColor: () =>
      board.currentTool === CONSTANT.TOOLS.TRASH
        ? Colors.red[CONSTANT.TOOLS.POINT].highlightStrokeColor
        : Colors.default[CONSTANT.TOOLS.POINT].highlightStrokeColor,
    highlightFillColor: () =>
      board.currentTool === CONSTANT.TOOLS.TRASH
        ? Colors.red[CONSTANT.TOOLS.POINT].highlightFillColor
        : Colors.default[CONSTANT.TOOLS.POINT].highlightFillColor,
    ...colors,
    fixed,
    snapSizeX: null,
    snapToGrid: false,
  })
  point.segmentType = CONSTANT.TOOLS.SEGMENTS_POINT
  return point
}

const loadPoint = (board, element) => {
  const isVertical = checkOrientation(board)

  const yPos = board.stackResponses ? element.y : calcNumberlinePosition(board)
  const point = drawPoint(
    board,
    element.point1,
    false,
    element.colors,
    isVertical ? element.y : yPos
  )
  if (!board.stackResponses) {
    handlePointDrag(
      board,
      point,
      isVertical ? element.y : calcNumberlinePosition(board)
    )
  } else {
    handlePointDrag(board, point, element.y, true)
  }

  return point
}

const onHandler = (board, coord) => {
  if (!board.numberlineAxis) {
    return
  }
  const isVertical = checkOrientation(board)
  const availablePositions = getAvailablePositions(
    board,
    null,
    board.stackResponses
  )
  const [, x, y] = board.getCoords(coord).usrCoords
  let newX = isVertical ? y : x

  if (board.numberlineSnapToTicks) {
    newX = getClosestTick(isVertical ? y : x, board.numberlineAxis)
  }

  if (
    availablePositions.findIndex(
      (pos) => newX > pos.start && newX < pos.end
    ) === -1
  ) {
    return
  }

  if (!board.stackResponses) {
    const yPos = calcNumberlinePosition(board)
    const point = drawPoint(
      board,
      isVertical ? yPos : newX,
      false,
      null,
      isVertical ? newX : yPos
    )
    handlePointDrag(board, point, yPos)
    return point
  }
  const calcedYPosition = findAvailableStackedSegmentPosition(board)
  const point = drawPoint(board, newX, false, null, calcedYPosition)
  handlePointDrag(board, point, calcedYPosition, true)
  return point
}

const renderAnswer = (board, config) =>
  drawPoint(board, config.point1, true, config.colors, config.y)

const getConfig = (segment) => ({
  id: segment.id,
  type: segment.segmentType,
  point1: segment.X(),
  y: segment.Y(),
})

export default {
  onHandler,
  getConfig,
  renderAnswer,
  loadPoint,
}

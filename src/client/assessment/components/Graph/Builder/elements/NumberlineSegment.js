import JXG from 'jsxgraph'
import { Colors, CONSTANT } from '../config'
import {
  calcMeasure,
  findAvailableStackedSegmentPosition,
  getAvailablePositions,
  getClosestTick,
  calcNumberlinePosition,
  checkOrientation,
} from '../utils'
import { defaultPointParameters } from '../settings'

// Check if there an element inside after segment dragging, then find closest available space and put segment there
const handleSegmentDrag = (board, segment, position, isStacked = false) => {
  let pointAvailablePositions = null
  let pointLastTruePosition = null

  let pointsLastTruePositions = null
  let pointsLastPositions = null
  let availablePositions = null

  const isVertical = checkOrientation(board)

  ;[segment.point1, segment.point2].forEach((point) => {
    point.on('drag', (e) => {
      if (e.movementX === 0 && e.movementY === 0) {
        return
      }

      let currentPosition = isVertical ? point.Y() : point.X()

      if (board.numberlineSnapToTicks) {
        currentPosition = getClosestTick(currentPosition, board.numberlineAxis)
      }

      if (
        pointAvailablePositions.findIndex(
          (pos) => currentPosition > pos.start && currentPosition < pos.end
        ) > -1
      ) {
        pointLastTruePosition = currentPosition
      }

      const coord = isVertical
        ? [position, pointLastTruePosition]
        : [pointLastTruePosition, position]
      point.setPosition(JXG.COORDS_BY_USER, coord)
      point.dragged = true
      board.dragged = true
    })

    point.on('up', () => {
      pointAvailablePositions = null
      pointLastTruePosition = null
      if (point.dragged) {
        point.dragged = false
        const coord = isVertical ? [position, point.Y()] : [point.X(), position]
        point.setPosition(JXG.COORDS_BY_USER, coord)
        board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE)
      }
    })

    point.on('down', () => {
      pointLastTruePosition = point.X()
      pointAvailablePositions = getAvailablePositions(
        board,
        segment,
        board.stackResponses
      )
      pointAvailablePositions = pointAvailablePositions.filter(
        (item) =>
          pointLastTruePosition > item.start && pointLastTruePosition < item.end
      )
    })
  })

  segment.on('drag', (e) => {
    if (e.movementX === 0 && e.movementY === 0) {
      return
    }

    let [delta] = calcMeasure(e.movementX, 0, board)
    delta = +delta.toFixed(6)
    pointsLastPositions.point1X += delta
    pointsLastPositions.point2X += delta

    let newPoint1X = pointsLastPositions.point1X
    let newPoint2X = pointsLastPositions.point2X

    if (board.numberlineSnapToTicks) {
      newPoint1X = getClosestTick(newPoint1X, board.numberlineAxis)
      const segmentLength = +(
        pointsLastPositions.point2X - pointsLastPositions.point1X
      ).toFixed(6)
      newPoint2X = newPoint1X + segmentLength
    }

    if (
      availablePositions.findIndex(
        (pos) =>
          newPoint1X > pos.start &&
          newPoint1X < pos.end &&
          newPoint2X > pos.start &&
          newPoint2X < pos.end
      ) > -1
    ) {
      pointsLastTruePositions.point1X = newPoint1X
      pointsLastTruePositions.point2X = newPoint2X
    }

    segment.point1.setPosition(JXG.COORDS_BY_USER, [
      pointsLastTruePositions.point1X,
      position,
    ])
    segment.point2.setPosition(JXG.COORDS_BY_USER, [
      pointsLastTruePositions.point2X,
      position,
    ])
    segment.dragged = true
    board.dragged = true
  })

  segment.on('up', () => {
    pointsLastTruePositions = null
    pointsLastPositions = null
    availablePositions = null
    if (segment.dragged) {
      segment.dragged = false
      board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE)
    }
  })

  segment.on('down', () => {
    pointsLastPositions = {
      point1X: segment.point1.X(),
      point2X: segment.point2.X(),
    }
    pointsLastTruePositions = { ...pointsLastPositions }
    availablePositions = getAvailablePositions(board, segment, isStacked)
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

// Return point1 and point2 coordnate based on layout orientation
const getSegmentPointsCoords = (board, segment) => {
  const isVertical = checkOrientation(board)
  const { point1, point2, y } = segment
  const _posY = board.stackResponses ? y : calcNumberlinePosition(board)

  const point1X = isVertical ? y : point1
  const point2X = isVertical ? y : point2
  const point1Y = isVertical ? point1 : _posY
  const point2Y = isVertical ? point2 : _posY
  return { point1X, point1Y, point2X, point2Y }
}

// Draw new segment line
const drawLine = (board, firstPoint, secondPoint, colors, segmentType) => {
  const segment = board.$board.create('segment', [firstPoint, secondPoint], {
    firstArrow: false,
    lastArrow: false,
    straightfirst: false,
    straightlast: false,
    snapToGrid: false,
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
  segment.segmentType = segmentType
  return segment
}

const loadSegment = (
  board,
  element,
  leftIncluded,
  rightIncluded,
  segmentType
) => {
  const { point1X, point1Y, point2X, point2Y } = getSegmentPointsCoords(
    board,
    element
  )
  const firstPoint = drawPoint(
    board,
    point1X,
    leftIncluded,
    false,
    element.leftPointColor,
    point1Y
  )
  const secondPoint = drawPoint(
    board,
    point2X,
    rightIncluded,
    false,
    element.rightPointColor,
    point2Y
  )
  const segment = drawLine(
    board,
    firstPoint,
    secondPoint,
    element.lineColor,
    segmentType
  )

  if (!board.stackResponses) {
    handleSegmentDrag(board, segment, calcNumberlinePosition(board))
  } else {
    handleSegmentDrag(board, segment, element.y, true)
  }

  return segment
}

// Check if space is available for new segment, then draw new segment
const onHandler = (board, coord) => {
  let leftIncluded = true
  let rightIncluded = true
  switch (board.currentTool) {
    case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_HOLLOW:
      leftIncluded = false
      rightIncluded = false
      break
    case CONSTANT.TOOLS.SEGMENT_LEFT_POINT_HOLLOW:
      leftIncluded = false
      rightIncluded = true
      break
    case CONSTANT.TOOLS.SEGMENT_RIGHT_POINT_HOLLOW:
      leftIncluded = true
      rightIncluded = false
      break
    case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_INCLUDED:
    default:
      leftIncluded = true
      rightIncluded = true
  }

  const availablePositions = getAvailablePositions(
    board,
    null,
    board.stackResponses
  )
  const isVertical = checkOrientation(board)
  const ticksDistance = board.numberlineAxis.ticks[0].getAttribute(
    'ticksDistance'
  )
  const [, x, y] = board.getCoords(coord).usrCoords
  let newStartPoint = isVertical ? y : x

  if (board.numberlineSnapToTicks) {
    newStartPoint = getClosestTick(newStartPoint, board.numberlineAxis)
  }

  const newEndPoint = newStartPoint + ticksDistance

  if (
    availablePositions.findIndex(
      (pos) => newStartPoint > pos.start && newEndPoint < pos.end
    ) === -1
  ) {
    return
  }

  if (!board.stackResponses) {
    const point2 = calcNumberlinePosition(board)
    const firstPoint = drawPoint(
      board,
      isVertical ? point2 : newStartPoint,
      leftIncluded,
      false,
      null,
      isVertical ? newStartPoint : point2
    )
    const secondPoint = drawPoint(
      board,
      isVertical ? point2 : newEndPoint,
      rightIncluded,
      false,
      null,
      isVertical ? newEndPoint : point2
    )
    const segment = drawLine(
      board,
      firstPoint,
      secondPoint,
      null,
      board.currentTool
    )
    handleSegmentDrag(board, segment, point2)
    return segment
  }

  const calcedYPosition = findAvailableStackedSegmentPosition(board)
  const firstPoint = drawPoint(
    board,
    newStartPoint,
    leftIncluded,
    false,
    null,
    calcedYPosition
  )
  const secondPoint = drawPoint(
    board,
    newStartPoint,
    rightIncluded,
    false,
    null,
    calcedYPosition
  )
  const segment = drawLine(
    board,
    firstPoint,
    secondPoint,
    null,
    board.currentTool
  )
  handleSegmentDrag(board, segment, calcedYPosition, true)
  return segment
}

const renderAnswer = (board, config, leftIncluded, rightIncluded) => {
  const { point1X, point1Y, point2X, point2Y } = getSegmentPointsCoords(
    board,
    config
  )
  const firstPoint = drawPoint(
    board,
    point1X,
    leftIncluded,
    true,
    config.leftPointColor,
    point1Y
  )
  const secondPoint = drawPoint(
    board,
    point2X,
    rightIncluded,
    true,
    config.rightPointColor,
    point2Y
  )
  return drawLine(board, firstPoint, secondPoint, config.lineColor, config.type)
}

const determineAnswerType = (board, config) => {
  switch (config.type) {
    case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_INCLUDED:
      return renderAnswer(board, config, true, true)
    case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_HOLLOW:
      return renderAnswer(board, config, false, false)
    case CONSTANT.TOOLS.SEGMENT_LEFT_POINT_HOLLOW:
      return renderAnswer(board, config, false, true)
    case CONSTANT.TOOLS.SEGMENT_RIGHT_POINT_HOLLOW:
      return renderAnswer(board, config, true, false)
    default:
      throw new Error('Unknown tool:')
  }
}

const getConfig = (segment, board) => {
  const isVertical = checkOrientation(board)
  let point1 = isVertical ? segment.point1.Y() : segment.point1.X()
  let point2 = isVertical ? segment.point2.Y() : segment.point2.X()
  let { segmentType } = segment

  switch (segment.segmentType) {
    case CONSTANT.TOOLS.SEGMENT_LEFT_POINT_HOLLOW:
      if (point1 > point2) {
        const t = point1
        point1 = point2
        point2 = t
        segmentType = CONSTANT.TOOLS.SEGMENT_RIGHT_POINT_HOLLOW
      }
      break
    case CONSTANT.TOOLS.SEGMENT_RIGHT_POINT_HOLLOW:
      if (point1 > point2) {
        const t = point1
        point1 = point2
        point2 = t
        segmentType = CONSTANT.TOOLS.SEGMENT_LEFT_POINT_HOLLOW
      }
      break
    default:
  }

  return {
    id: segment.id,
    type: segmentType,
    point1,
    point2,
    y: isVertical ? segment.point1.X() : segment.point1.Y(),
  }
}

export default {
  onHandler,
  getConfig,
  loadSegment,
  determineAnswerType,
}

import JXG from "jsxgraph";
import { Colors, CONSTANT } from "../config";
import { findAvailableStackedSegmentPosition, getAvailablePositions, getClosestTick } from "../utils";
import { defaultPointParameters } from "../settings";

const handleVectorPointDrag = (board, vector, point, segmentType, yPosition, isStacked = false) => {
  let availablePositions = null;
  let lastTruePosition = null;

  point.on("drag", e => {
    if (e.movementX === 0 && e.movementY === 0) {
      return;
    }

    const currentPosition = point.X();
    let newX = currentPosition;

    if (board.numberlineSnapToTicks) {
      newX = getClosestTick(currentPosition, board.numberlineAxis);
    }

    if (availablePositions.findIndex(pos => newX > pos.start && newX < pos.end) > -1) {
      lastTruePosition = newX;
    }

    point.setPosition(JXG.COORDS_BY_USER, [lastTruePosition, yPosition]);
    point.dragged = true;
    board.dragged = true;
  });

  point.on("up", () => {
    availablePositions = null;
    lastTruePosition = null;
    if (point.dragged) {
      point.dragged = false;
      board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE);
    }
  });

  point.on("down", () => {
    lastTruePosition = point.X();
    availablePositions = getAvailablePositions(board, vector, isStacked);
    switch (segmentType) {
      case CONSTANT.TOOLS.RAY_LEFT_DIRECTION:
        availablePositions = [availablePositions[0]];
        break;
      case CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW:
        availablePositions = [availablePositions[0]];
        break;
      case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION:
        availablePositions = [availablePositions[availablePositions.length - 1]];
        break;
      case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW:
      default:
        availablePositions = [availablePositions[availablePositions.length - 1]];
        break;
    }
  });
};

// Draw segment point with proper settings
const drawPoint = (board, x, pointIncluded, fixed, colors, yPosition) => {
  const styles = pointIncluded
    ? { ...Colors.default[CONSTANT.TOOLS.POINT] }
    : { ...Colors.special[CONSTANT.TOOLS.POINT] };
  const highlightPointType = pointIncluded ? CONSTANT.TOOLS.POINT : CONSTANT.TOOLS.SEGMENTS_POINT;

  return board.$board.create("point", [x, yPosition], {
    ...(board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters()),
    ...styles,
    highlightStrokeColor: () =>
      board.currentTool === CONSTANT.TOOLS.TRASH
        ? Colors["red"][highlightPointType].highlightStrokeColor
        : Colors["default"][highlightPointType].highlightStrokeColor,
    highlightFillColor: () =>
      board.currentTool === CONSTANT.TOOLS.TRASH
        ? Colors["red"][highlightPointType].highlightFillColor
        : Colors["default"][highlightPointType].highlightFillColor,
    ...colors,
    fixed,
    snapToGrid: false
  });
};

// Draw invisible point of vector on proper place
const drawVectorPoint = (board, toRightDirection, yPosition) => {
  const xMin = board.numberlineAxis.point1.X();
  const xMax = board.numberlineAxis.point2.X();

  return board.$board.create("point", [toRightDirection ? xMax : xMin, yPosition], {
    snapToGrid: false,
    visible: false,
    fixed: true
  });
};

// Draw new vector line with proper settings
const drawVectorLine = (board, visiblePoint, invisiblePoint, toRightDirection, colors, segmentType) => {
  const points = toRightDirection ? [visiblePoint, invisiblePoint] : [invisiblePoint, visiblePoint];

  const vector = board.$board.create("segment", points, {
    firstarrow: toRightDirection ? false : { size: 5 },
    lastarrow: toRightDirection ? { size: 5 } : false,
    straightfirst: false,
    straightlast: false,
    fixed: true,
    ...Colors.default[CONSTANT.TOOLS.LINE],
    highlightStrokeColor: () =>
      board.currentTool === CONSTANT.TOOLS.TRASH
        ? Colors["red"][CONSTANT.TOOLS.LINE].highlightStrokeColor
        : Colors["default"][CONSTANT.TOOLS.LINE].highlightStrokeColor,
    highlightFillColor: () =>
      board.currentTool === CONSTANT.TOOLS.TRASH
        ? Colors["red"][CONSTANT.TOOLS.LINE].highlightFillColor
        : Colors["default"][CONSTANT.TOOLS.LINE].highlightFillColor,
    ...colors
  });
  vector.segmentType = segmentType;
  return vector;
};

const loadVector = (board, element, pointIncluded, toRightDirection, segmentType) => {
  const x = [CONSTANT.TOOLS.RAY_RIGHT_DIRECTION, CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW].includes(segmentType)
    ? element.point1
    : element.point2;

  const visiblePoint = drawPoint(board, x, pointIncluded, false, element.pointColor, element.y);
  const invisiblePoint = drawVectorPoint(board, toRightDirection, element.y);
  const vector = drawVectorLine(board, visiblePoint, invisiblePoint, toRightDirection, element.colors, segmentType);

  if (!board.stackResponses) {
    handleVectorPointDrag(board, vector, visiblePoint, segmentType, 0);
  } else {
    handleVectorPointDrag(board, vector, visiblePoint, segmentType, element.y, true);
  }

  return vector;
};

const onHandler = (board, coord) => {
  let pointIncluded = true;
  let toRightDirection = true;
  let availablePositions = getAvailablePositions(board, null, board.stackResponses);

  switch (board.currentTool) {
    case CONSTANT.TOOLS.RAY_LEFT_DIRECTION:
      pointIncluded = true;
      toRightDirection = false;
      availablePositions = [availablePositions[0]];
      break;
    case CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW:
      pointIncluded = false;
      toRightDirection = false;
      availablePositions = [availablePositions[0]];
      break;
    case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION:
      pointIncluded = true;
      toRightDirection = true;
      availablePositions = [availablePositions[availablePositions.length - 1]];
      break;
    case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW:
    default:
      pointIncluded = false;
      toRightDirection = true;
      availablePositions = [availablePositions[availablePositions.length - 1]];
      break;
  }

  const x = board.getCoords(coord).usrCoords[1];
  let newStartX = x;

  if (board.numberlineSnapToTicks) {
    newStartX = getClosestTick(x, board.numberlineAxis);
  }

  if (availablePositions.findIndex(pos => newStartX > pos.start && newStartX < pos.end) === -1) {
    return;
  }

  if (!board.stackResponses) {
    const visiblePoint = drawPoint(board, newStartX, pointIncluded, false, null, 0);
    const invisiblePoint = drawVectorPoint(board, toRightDirection, 0);
    const vector = drawVectorLine(board, visiblePoint, invisiblePoint, toRightDirection, null, board.currentTool);
    handleVectorPointDrag(board, vector, visiblePoint, board.currentTool, 0);
    return vector;
  }

  const calcedYPosition = findAvailableStackedSegmentPosition(board);
  const visiblePoint = drawPoint(board, newStartX, pointIncluded, false, null, calcedYPosition);
  const invisiblePoint = drawVectorPoint(board, toRightDirection, calcedYPosition);
  const vector = drawVectorLine(board, visiblePoint, invisiblePoint, toRightDirection, null, board.currentTool);
  handleVectorPointDrag(board, vector, visiblePoint, board.currentTool, calcedYPosition, true);
  return vector;
};

const renderAnswer = (board, config, pointIncluded, toRightDirection) => {
  const visiblePoint = drawPoint(
    board,
    toRightDirection ? config.point1 : config.point2,
    pointIncluded,
    true,
    config.pointColor,
    config.y
  );
  const invisiblePoint = drawVectorPoint(board, toRightDirection, config.y);
  return drawVectorLine(board, visiblePoint, invisiblePoint, toRightDirection, config.colors);
};

const determineAnswerType = (board, config) => {
  switch (config.type) {
    case CONSTANT.TOOLS.RAY_LEFT_DIRECTION:
      return renderAnswer(board, config, true, false);
    case CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW:
      return renderAnswer(board, config, false, false);
    case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION:
      return renderAnswer(board, config, true, true);
    case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW:
      return renderAnswer(board, config, false, true);
    default:
      throw new Error("Unknown tool:");
  }
};

const getConfig = segment => ({
  id: segment.id,
  type: segment.segmentType,
  point1: segment.point1.X(),
  point2: segment.point2.X(),
  y: segment.point1.Y()
});

export default {
  onHandler,
  getConfig,
  loadVector,
  determineAnswerType
};

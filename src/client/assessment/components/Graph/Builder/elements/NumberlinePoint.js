import JXG from "jsxgraph";
import { findAvailableStackedSegmentPosition, getAvailablePositions, getClosestTick } from "../utils";
import { Colors, CONSTANT } from "../config";
import { defaultPointParameters } from "../settings";

const handlePointDrag = (board, point, yPosition, isStacked = false) => {
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
    availablePositions = getAvailablePositions(board, point, isStacked);
  });
};

const drawPoint = (board, x, fixed, colors, yPosition) => {
  const point = board.$board.create("point", [x, yPosition], {
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
    snapToGrid: false
  });
  point.segmentType = CONSTANT.TOOLS.SEGMENTS_POINT;
  return point;
};

const loadPoint = (board, element) => {
  const point = drawPoint(board, element.point1, false, element.colors, element.y);

  if (!board.stackResponses) {
    handlePointDrag(board, point, 0);
  } else {
    handlePointDrag(board, point, element.y, true);
  }

  return point;
};

const onHandler = (board, coord) => {
  const availablePositions = getAvailablePositions(board, null, board.stackResponses);
  const x = board.getCoords(coord).usrCoords[1];
  let newX = x;

  if (board.numberlineSnapToTicks) {
    newX = getClosestTick(x, board.numberlineAxis);
  }

  if (availablePositions.findIndex(pos => newX > pos.start && newX < pos.end) === -1) {
    return;
  }

  if (!board.stackResponses) {
    const point = drawPoint(board, newX, false, null, 0);
    handlePointDrag(board, point, 0);
    return point;
  }

  const calcedYPosition = findAvailableStackedSegmentPosition(board);
  const point = drawPoint(board, newX, false, null, calcedYPosition);
  handlePointDrag(board, point, calcedYPosition, true);
  return point;
};

const renderAnswer = (board, config) => drawPoint(board, config.point1, true, config.colors, config.y);

const getConfig = segment => ({
  id: segment.id,
  type: segment.segmentType,
  point1: segment.X(),
  y: segment.Y()
});

export default {
  onHandler,
  getConfig,
  renderAnswer,
  loadPoint
};

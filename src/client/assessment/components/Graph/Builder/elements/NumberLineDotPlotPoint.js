import { getClosestTick, calcNumberlinePosition, canCreatePoint } from "../utils";
import { Colors, CONSTANT } from "../config";
import { defaultPointParameters } from "../settings";

const getPointYs = (board, newY) => {
  const {
    layout: { yDistance }
  } = board.numberlineSettings;
  const calcyMin = calcNumberlinePosition(board);

  const pointYs = [];
  for (let i = calcyMin + yDistance; i <= newY; i += yDistance) {
    pointYs.push(i);
  }
  return pointYs;
};

const removeDuplicatePoints = (board, x) => {
  const tempEmToDelete = board.tempElements.filter(em => em.X() === x);
  tempEmToDelete.forEach(em => board.$board.removeObject(em));

  board.elements = board.elements.filter(em => em.X() !== x);
  board.tempElements = board.tempElements.filter(em => em.X() !== x);
};

const drawPoint = (board, x, y, colors, createPoint) => {
  if (!canCreatePoint(board, x, y)) {
    return;
  }
  if (createPoint) {
    removeDuplicatePoints(board, x);
  }
  const pointYs = getPointYs(board, y);

  let point = null;

  const pointOptions = {
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
    fixed: true,
    snapToGrid: false
  };

  pointYs.forEach(pointY => {
    point = board.$board.create("point", [x, pointY], pointOptions);
    point.segmentType = CONSTANT.TOOLS.NUMBERLINE_PLOT_POINT;
    board.setTempElements(point);
  });
  return point;
};

const loadPoint = (board, element) => drawPoint(board, element.point1, element.point2, element.colors);

const onHandler = (board, coord) => {
  const [, x, y] = board.getCoords(coord).usrCoords;
  let newX = x;
  let newY = y;

  if (board.numberlineSnapToTicks) {
    newX = getClosestTick(x, board.numberlineAxis);
    newY = getClosestTick(y, board.numberlineAxis);
  }

  const point = drawPoint(board, newX, newY, null, true);

  if (!point) {
    return;
  }
  return point;
};

const renderAnswer = (board, config) => drawPoint(board, config.point1, config.point2, config.colors);

const getConfig = segment => ({
  id: segment.id,
  type: segment.segmentType,
  point1: segment.X(),
  point2: segment.Y()
});

export default {
  onHandler,
  getConfig,
  renderAnswer,
  loadPoint
};

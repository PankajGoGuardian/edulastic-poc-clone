import { getClosestTick, calcNumberlinePosition } from "../utils";
import { Colors, CONSTANT } from "../config";
import { defaultPointParameters } from "../settings";

const getPointCount = (board, y) => {
  const {
    layout: { maxPointsCount }
  } = board.numberlineSettings;
  const axisY = calcNumberlinePosition(board);
  const [, yMax, ,] = board.$board.getBoundingBox();

  const step = (yMax - axisY) / maxPointsCount;

  let count = (y - axisY) / step - 0.5;
  count = Math.round(count);
  return Math.max(0, count);
};

const getPointYs = (board, point2) => {
  const {
    layout: { maxPointsCount }
  } = board.numberlineSettings;
  const axisY = calcNumberlinePosition(board);
  const [, yMax, ,] = board.$board.getBoundingBox();

  const step = (yMax - axisY) / maxPointsCount;

  const pointYs = [];
  for (let i = 0; i < point2; i++) {
    pointYs.push(axisY + step * (i + 1));
  }
  return pointYs;
};

const removeDuplicatePoints = (board, x) => {
  const pointsGroup = board.elements.find(
    el =>
      el.segmentType === CONSTANT.TOOLS.NUMBERLINE_PLOT_POINT &&
      el.ancestors &&
      el.ancestors.length > 0 &&
      el.ancestors[0].X() === x
  );

  if (!pointsGroup) {
    return false;
  }

  board.elements = board.elements.filter(el => el.id !== pointsGroup.id);
  board.removeObject(pointsGroup);

  return true;
};

const drawPoint = (board, point1, point2, colors = null) => {
  const removeResult = removeDuplicatePoints(board, point1);

  const pointOptions = {
    ...(board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters()),
    ...Colors.gray[CONSTANT.TOOLS.POINT],
    highlightStrokeColor: () =>
      board.currentTool === CONSTANT.TOOLS.TRASH
        ? Colors.red[CONSTANT.TOOLS.POINT].highlightStrokeColor
        : Colors.gray[CONSTANT.TOOLS.POINT].highlightStrokeColor,
    highlightFillColor: () =>
      board.currentTool === CONSTANT.TOOLS.TRASH
        ? Colors.red[CONSTANT.TOOLS.POINT].highlightFillColor
        : Colors.gray[CONSTANT.TOOLS.POINT].highlightFillColor,
    ...colors,
    fixed: true,
    snapToGrid: false,
    size: 5,
    strokeWidth: 2
  };

  const pointYs = getPointYs(board, point2);
  if (pointYs.length === 0) {
    if (removeResult) {
      board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_UPDATE);
    }
    return null;
  }

  const points = pointYs.map(pointY => board.$board.create("point", [point1, pointY], pointOptions));
  const newElement = board.$board.create("group", points);
  newElement.ancestors = points;
  newElement.segmentType = CONSTANT.TOOLS.NUMBERLINE_PLOT_POINT;

  return newElement;
};

const render = (board, element) => drawPoint(board, element.point1, element.point2, element.colors);

const onHandler = (board, coord) => {
  const [, x, y] = board.getCoords(coord).usrCoords;
  const point1 = getClosestTick(x, board.numberlineAxis);
  const point2 = getPointCount(board, y);

  return drawPoint(board, point1, point2);
};

const getConfig = segment => ({
  id: segment.id,
  type: segment.segmentType,
  point1: segment.ancestors[0].X(),
  point2: segment.ancestors.length
});

const removeElementUnderMouse = (board, elementsUnderMouse) => {
  const point = elementsUnderMouse.find(em => em.elType === "point");
  if (!point) {
    return false;
  }

  const pointsGroup = board.elements.find(
    el => el.ancestors && el.ancestors.length > 0 && el.ancestors.find(p => p.id === point.id)
  );

  if (!pointsGroup) {
    return false;
  }

  board.elements = board.elements.filter(el => el.id !== pointsGroup.id);
  board.removeObject(pointsGroup);

  const point1 = point.X();
  const y = point.Y();
  const point2 = getPointCount(board, y - y * 0.01);
  const newPoint = drawPoint(board, point1, point2);

  if (newPoint) {
    board.elements.push(newPoint);
  }

  return true;
};

export default {
  onHandler,
  getConfig,
  render,
  removeElementUnderMouse
};

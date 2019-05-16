import JXG from "jsxgraph";
import { orderPoints, findAvailableStackedSegmentPosition, getClosestTick, getSpecialTicks } from "../utils";
import { CONSTANT, Colors } from "../config";
import { defaultPointParameters } from "../settings";

const previousPointsPositions = [];

export function removeBusyTicks(segments, ticks) {
  segments.forEach(segment => {
    if (segment.elType === "segment") {
      let points = [];
      Object.keys(segment.ancestors).forEach(key => {
        points.push(segment.ancestors[key].X());
      });

      points = orderPoints(points);

      ticks = ticks.filter(coor => coor < points[0] || coor > points[1]);
    } else {
      ticks = ticks.filter(coor => coor !== segment.coords.usrCoords[1]);
    }
  });
  return ticks;
}

const handlePointDrag = (point, board, axis) => {
  point.on("drag", () => {
    const currentPosition = point.X();

    const segments = board.elements
      .filter(element => element.elType === "segment" || element.elType === "point")
      .filter(element => element.id !== point.id);

    let prevPosIndex;

    previousPointsPositions.forEach((element, index) => {
      if (element.id === point.id) {
        prevPosIndex = index;
      }
    });

    let ticks = getSpecialTicks(axis);
    ticks = removeBusyTicks(segments, ticks);
    const newXCoord = getClosestTick(currentPosition, ticks);
    point.setPosition(JXG.COORDS_BY_USER, [newXCoord, 0]);
    previousPointsPositions[prevPosIndex].position = newXCoord;
  });
  point.on("up", () => {
    board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE);
  });
};

const handleStackedPointDrag = (point, axis, yPosition, board) => {
  point.on("drag", () => {
    const currentPosition = point.X();

    const xMin = axis.point1.X();
    const xMax = axis.point2.X();

    if (currentPosition > xMax) {
      point.setPosition(JXG.COORDS_BY_USER, [xMax, yPosition]);
    } else if (currentPosition < xMin) {
      point.setPosition(JXG.COORDS_BY_USER, [xMin, yPosition]);
    }
  });
  point.on("up", () => {
    board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE);
  });
};

const checkForPointRenderPosition = (axis, coord) => {
  const xMin = axis.point1.X();
  const xMax = axis.point2.X();

  if (coord < xMin || coord > xMax) {
    return false;
  }
  return true;
};

const checkForElementsOnPoint = (segments, coord) => {
  let isSpaceAvailable = true;

  segments.forEach(segment => {
    if (segment.elType === "segment") {
      let points = [];

      Object.keys(segment.ancestors).forEach(key => {
        points.push(segment.ancestors[key].X());
      });

      points = orderPoints(points);

      if (coord >= points[0] && coord <= points[1]) {
        isSpaceAvailable = false;
      }
    } else if (segment.coords.usrCoords[1] === coord) {
      isSpaceAvailable = false;
    }
  });

  return isSpaceAvailable;
};

const drawPoint = (board, coord, fixed, colors, yPosition) =>
  board.$board.create("point", [coord, yPosition || 0], {
    ...(board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters()),
    ...Colors.default[CONSTANT.TOOLS.POINT],
    highlightStrokeColor: () =>
      board.currentTool === CONSTANT.TOOLS.TRASH
        ? Colors["red"][CONSTANT.TOOLS.POINT].highlightStrokeColor
        : Colors["default"][CONSTANT.TOOLS.POINT].highlightStrokeColor,
    highlightFillColor: () =>
      board.currentTool === CONSTANT.TOOLS.TRASH
        ? Colors["red"][CONSTANT.TOOLS.POINT].highlightFillColor
        : Colors["default"][CONSTANT.TOOLS.POINT].highlightFillColor,
    ...colors,
    fixed,
    snapSizeX: null,
    snapToGrid: false
  });

const loadPoint = (board, element, stackResponses) => {
  if (!stackResponses) {
    const point = drawPoint(board, element.point1, false, element.colors);
    point.segmentType = "segments_point";
    previousPointsPositions.push({ id: point.id, position: point.X() });
    handlePointDrag(point, board, board.numberlineAxis);

    return point;
  } else {
    const point = drawPoint(board, element.point1, false, element.colors, element.y);
    point.segmentType = "segments_point";

    point.setAttribute({ snapSizeY: 0.05 });
    point.setPosition(JXG.COORDS_BY_USER, [point.X(), element.y]);
    board.$board.on("move", () => point.moveTo([point.X(), element.y]));

    handleStackedPointDrag(point, board.numberlineAxis, element.y, board);

    return point;
  }
};

const onHandler = (stackResponses, stackResponsesSpacing, tool) => (board, coord) => {
  const segments = board.elements.filter(element => element.elType === "segment" || element.elType === "point");

  const ticks = getSpecialTicks(board.numberlineAxis);
  let roundedCoord = coord;
  if (typeof coord !== "number") {
    const x = board.getCoords(coord).usrCoords[1];
    roundedCoord = getClosestTick(x, ticks);
  }

  if (!stackResponses) {
    if (
      checkForPointRenderPosition(board.numberlineAxis, roundedCoord) &&
      checkForElementsOnPoint(segments, roundedCoord)
    ) {
      const point = drawPoint(board, roundedCoord, false, null, null, tool);
      point.segmentType = "segments_point";
      previousPointsPositions.push({ id: point.id, position: point.X() });
      handlePointDrag(point, board, board.numberlineAxis);

      return point;
    }
  } else if (checkForPointRenderPosition(board.numberlineAxis, roundedCoord)) {
    const calcedYPosition = findAvailableStackedSegmentPosition(board, segments, stackResponsesSpacing);

    const point = drawPoint(board, roundedCoord, false, null, calcedYPosition, tool);
    point.segmentType = "segments_point";

    point.setAttribute({ snapSizeY: 0.05 });
    point.setPosition(JXG.COORDS_BY_USER, [point.X(), calcedYPosition]);
    board.$board.on("move", () => point.moveTo([point.X(), calcedYPosition]));

    handleStackedPointDrag(point, board.numberlineAxis, calcedYPosition, board);

    return point;
  }
};

const renderAnswer = (board, config) => {
  const point = drawPoint(board, config.point1, true, config.colors, config.y);
  point.answer = true;

  point.setAttribute({ snapSizeY: 0.05 });
  point.setPosition(JXG.COORDS_BY_USER, [point.X(), config.y]);

  return point;
};

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
  loadPoint,
  handlePointDrag
};

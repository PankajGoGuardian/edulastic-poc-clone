import JXG from "jsxgraph";
import { CONSTANT, Colors } from "../config";
import {
  findSegmentPosition,
  orderPoints,
  findAvailableStackedSegmentPosition,
  getSpecialTicks,
  getClosestTick
} from "../utils";
import { defaultPointParameters } from "../settings";

const previousPointsPositions = [];

function removeProhibitedTicks(segmentCoords, segments, ticks, currentPointX) {
  segments.forEach(segment => {
    if (segment.elType === "segment") {
      let points = [];
      Object.keys(segment.ancestors).forEach(key => {
        points.push(segment.ancestors[key].X());
      });
      points = orderPoints(points);

      if (segmentCoords[0] === currentPointX) {
        if (segmentCoords[1] < points[0]) {
          ticks = ticks.filter(t => t < points[0] && t !== segmentCoords[1]);
        } else if (segmentCoords[1] > points[1]) {
          ticks = ticks.filter(t => t > points[1] && t !== segmentCoords[1]);
        }
      } else if (segmentCoords[1] === currentPointX) {
        if (segmentCoords[0] < points[0]) {
          ticks = ticks.filter(t => t < points[0] && t !== segmentCoords[0]);
        } else if (segmentCoords[0] > points[1]) {
          ticks = ticks.filter(t => t > points[1] && t !== segmentCoords[0]);
        }
      }
    } else {
      const point = segment.coords.usrCoords[1];

      if (segmentCoords[0] === currentPointX) {
        if (segmentCoords[1] < point) {
          ticks = ticks.filter(t => t < point && t !== segmentCoords[1]);
        } else if (segmentCoords[1] > point) {
          ticks = ticks.filter(t => t > point && t !== segmentCoords[1]);
        }
      } else if (segmentCoords[1] === currentPointX) {
        if (segmentCoords[0] < point) {
          ticks = ticks.filter(t => t < point && t !== segmentCoords[0]);
        } else if (segmentCoords[0] > point) {
          ticks = ticks.filter(t => t > point && t !== segmentCoords[0]);
        }
      }
    }
  });
  return ticks;
}

const handleSegmentPointDrag = (point, board, segment, axis, ticks) => {
  point.on("drag", () => {
    const currentPosition = point.X();

    const segments = board.elements
      .filter(element => element.elType === "segment" || element.elType === "point")
      .filter(element => element.id !== segment.id);
    const segmentCoords = orderPoints([segment.point1.X(), segment.point2.X()]);

    let prevPosIndex;

    previousPointsPositions.forEach((element, index) => {
      if (element.id === point.id) {
        prevPosIndex = index;
      }
    });

    ticks = getSpecialTicks(axis);
    ticks = removeProhibitedTicks(segmentCoords, segments, ticks, currentPosition);
    const newXCoord = getClosestTick(currentPosition, ticks);
    point.setPosition(JXG.COORDS_BY_USER, [newXCoord, 0]);
    previousPointsPositions[prevPosIndex].position = newXCoord;
  });
  point.on("up", () => {
    board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE);
  });
};

const handleStackedSegmentPointDrag = (point, axis, yPosition, board) => {
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

const checkForElementsOnVector = (segments, coord, xMin, xMax, vectorDirection) => {
  let isSpaceAvailable = true;

  const vectorPoint = vectorDirection ? xMax : xMin;

  const vector = orderPoints([coord, vectorPoint]);

  segments.forEach(segment => {
    if (segment.elType === "segment") {
      Object.keys(segment.ancestors).forEach(key => {
        const point = segment.ancestors[key].X();

        if (point >= vector[0] && point <= vector[1]) {
          isSpaceAvailable = false;
        }
      });
    } else if (segment.coords.usrCoords[1] >= vector[0] && segment.coords.usrCoords[1] <= vector[1]) {
      isSpaceAvailable = false;
    }
  });

  return isSpaceAvailable;
};

// Pass board, click coordinate, ticksDistance, point type (true = default point, false = unfilled point)
// Draw segment point with proper settings
const drawPoint = (board, coord, ticksDistance, point, fixed, colors, yPosition) => {
  const styles = point ? { ...Colors.default[CONSTANT.TOOLS.POINT] } : { ...Colors.special[CONSTANT.TOOLS.POINT] };
  const highlightPointType = point ? CONSTANT.TOOLS.POINT : CONSTANT.TOOLS.SEGMENTS_POINT;

  return board.$board.create("point", [ticksDistance ? coord + ticksDistance : coord, yPosition || 0], {
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

// Pass board, xMin and xMax of numberlineAxis, vector direction
// Draw invisible point of vector on proper place
const drawVectorPoint = (board, xMin, xMax, vectorDirection, yPosition) => {
  const axisPadding = ((-xMin + xMax) / 100) * 3.5;

  return board.$board.create("point", [vectorDirection ? xMax + axisPadding : xMin - axisPadding, yPosition || 0], {
    ...(board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters()),
    snapToGrid: false,
    visible: false,
    fixed: true
  });
};

// Pass board, point that will be visible, invisible point that will be beginning or ending of vector(depending on direction),
// vector direction (true = vector goes from coordinate to +infinity, false = vector goes from -infinity to coordanate)
// Draw new vector line with proper settings
const drawVectorLine = (board, visiblePoint, invisiblePoint, vectorDirection, colors) => {
  const points = vectorDirection ? [visiblePoint, invisiblePoint] : [invisiblePoint, visiblePoint];

  return board.$board.create("segment", points, {
    firstarrow: vectorDirection ? false : { size: 5 },
    lastarrow: vectorDirection ? { size: 5 } : false,
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
};

const loadVector = (board, element, pointIncluded, vectorDirection, segmentType, stackResponses) => {
  const xMin = board.numberlineAxis.point1.X();
  const xMax = board.numberlineAxis.point2.X();

  let ticks = getSpecialTicks(board.numberlineAxis);
  ticks = ticks.sort((a, b) => a - b);

  const visiblePointCoord = [
    CONSTANT.TOOLS.RAY_RIGHT_DIRECTION,
    CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW
  ].includes(segmentType)
    ? element.point1
    : element.point2;

  if (!stackResponses) {
    const visiblePoint = drawPoint(board, visiblePointCoord, null, pointIncluded, false, element.pointColor);
    const invisiblePoint = drawVectorPoint(board, xMin, xMax, vectorDirection);
    const vector = drawVectorLine(board, visiblePoint, invisiblePoint, vectorDirection, element.colors);

    vector.segmentType = segmentType;

    previousPointsPositions.push(
      { id: visiblePoint.id, position: visiblePoint.X() },
      { id: invisiblePoint.id, position: invisiblePoint.X() }
    );

    handleSegmentPointDrag(visiblePoint, board, vector, board.numberlineAxis, ticks);

    return vector;
  } else {
    const visiblePoint = drawPoint(board, visiblePointCoord, null, pointIncluded, false, element.pointColor, element.y);
    const invisiblePoint = drawVectorPoint(board, xMin, xMax, vectorDirection, element.y);
    const vector = drawVectorLine(board, visiblePoint, invisiblePoint, vectorDirection, element.colors);

    vector.segmentType = segmentType;

    visiblePoint.setAttribute({ snapSizeY: 0.05 });
    visiblePoint.setPosition(JXG.COORDS_BY_USER, [visiblePoint.X(), element.y]);
    board.$board.on("move", () => visiblePoint.moveTo([visiblePoint.X(), element.y]));

    invisiblePoint.setAttribute({ snapSizeY: 0.05 });
    invisiblePoint.setPosition(JXG.COORDS_BY_USER, [invisiblePoint.X(), element.y]);

    handleStackedSegmentPointDrag(visiblePoint, board.numberlineAxis, element.y, board);

    return vector;
  }
};

const drawVector = (
  board,
  coord,
  pointIncluded,
  vectorDirection,
  segmentType,
  stackResponses,
  stackResponsesSpacing
) => {
  const segments = board.elements.filter(element => element.elType === "segment" || element.elType === "point");
  const xMin = board.numberlineAxis.point1.X();
  const xMax = board.numberlineAxis.point2.X();

  let ticks = getSpecialTicks(board.numberlineAxis);

  if (typeof coord !== "number") {
    const x = board.getCoords(coord).usrCoords[1];
    coord = getClosestTick(x, ticks);
  }

  ticks = ticks.sort((a, b) => a - b);

  if (!stackResponses) {
    if (checkForElementsOnVector(segments, coord, xMin, xMax, vectorDirection)) {
      const visiblePoint = drawPoint(board, coord, null, pointIncluded, false);
      const invisiblePoint = drawVectorPoint(board, xMin, xMax, vectorDirection);
      const vector = drawVectorLine(board, visiblePoint, invisiblePoint, vectorDirection);

      vector.segmentType = segmentType;

      previousPointsPositions.push(
        { id: visiblePoint.id, position: visiblePoint.X() },
        { id: invisiblePoint.id, position: invisiblePoint.X() }
      );

      handleSegmentPointDrag(visiblePoint, board, vector, board.numberlineAxis, ticks);

      return vector;
    }
  } else {
    const calcedYPosition = findAvailableStackedSegmentPosition(board, segments, stackResponsesSpacing);

    const visiblePoint = drawPoint(board, coord, null, pointIncluded, false, calcedYPosition);
    const invisiblePoint = drawVectorPoint(board, xMin, xMax, vectorDirection, calcedYPosition);
    const vector = drawVectorLine(board, visiblePoint, invisiblePoint, vectorDirection);

    vector.segmentType = segmentType;

    visiblePoint.setAttribute({ snapSizeY: 0.05 });
    visiblePoint.setPosition(JXG.COORDS_BY_USER, [visiblePoint.X(), calcedYPosition]);
    board.$board.on("move", () => visiblePoint.moveTo([visiblePoint.X(), calcedYPosition]));

    invisiblePoint.setAttribute({ snapSizeY: 0.05 });
    invisiblePoint.setPosition(JXG.COORDS_BY_USER, [invisiblePoint.X(), calcedYPosition]);

    handleStackedSegmentPointDrag(visiblePoint, board.numberlineAxis, calcedYPosition, board);

    return vector;
  }
};

const onHandler = (type, stackResponses, stackResponsesSpacing) => (board, coords) =>
  determineVectorType(type, board, findSegmentPosition(board, coords), stackResponses, stackResponsesSpacing);

const determineVectorType = (type, board, coords, stackResponses, stackResponsesSpacing) => {
  switch (type) {
    case CONSTANT.TOOLS.RAY_LEFT_DIRECTION:
      return drawVector(
        board,
        coords,
        true,
        false,
        CONSTANT.TOOLS.RAY_LEFT_DIRECTION,
        stackResponses,
        stackResponsesSpacing
      );
    case CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW:
      return drawVector(
        board,
        coords,
        false,
        false,
        CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW,
        stackResponses,
        stackResponsesSpacing
      );
    case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION:
      return drawVector(
        board,
        coords,
        true,
        true,
        CONSTANT.TOOLS.RAY_RIGHT_DIRECTION,
        stackResponses,
        stackResponsesSpacing
      );
    case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW:
      return drawVector(
        board,
        coords,
        false,
        true,
        CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW,
        stackResponses,
        stackResponsesSpacing
      );
    default:
      throw new Error("Unknown tool:");
  }
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

const renderAnswer = (board, config, pointIncluded, vectorDirection) => {
  const xMin = board.numberlineAxis.point1.X();
  const xMax = board.numberlineAxis.point2.X();

  const visiblePoint = drawPoint(
    board,
    vectorDirection ? config.point1 : config.point2,
    null,
    pointIncluded,
    true,
    config.pointColor,
    config.y
  );
  const invisiblePoint = drawVectorPoint(board, xMin, xMax, vectorDirection, config.y);
  const vector = drawVectorLine(board, visiblePoint, invisiblePoint, vectorDirection, config.colors);

  visiblePoint.setAttribute({ snapSizeY: 0.05 });
  visiblePoint.setPosition(JXG.COORDS_BY_USER, [visiblePoint.X(), config.y]);

  invisiblePoint.setAttribute({ snapSizeY: 0.05 });
  invisiblePoint.setPosition(JXG.COORDS_BY_USER, [invisiblePoint.X(), config.y]);

  vector.answer = visiblePoint.answer = invisiblePoint.answer = true;

  return vector;
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

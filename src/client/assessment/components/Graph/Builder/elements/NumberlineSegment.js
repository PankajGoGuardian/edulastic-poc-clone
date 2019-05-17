import JXG from "jsxgraph";
import { CONSTANT, Colors } from "../config";
import { orderPoints, findAvailableStackedSegmentPosition, getClosestTick, getSpecialTicks } from "../utils";
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

const findAvailableSegmentDragPlace = (segmentCoords, segments, ticksDistance, direction) => {
  const newSegmentCoords = [...segmentCoords];

  do {
    if (direction) {
      newSegmentCoords[0] += ticksDistance;
      newSegmentCoords[1] += ticksDistance;
    } else {
      newSegmentCoords[0] -= ticksDistance;
      newSegmentCoords[1] -= ticksDistance;
    }

    let isPointInside = false;

    segments.forEach(segment => {
      if (segment.elType === "segment") {
        let points = [];

        Object.keys(segment.ancestors).forEach(key => {
          points.push(segment.ancestors[key].X());
        });

        points = orderPoints(points);

        if (
          (newSegmentCoords[0] >= points[0] && newSegmentCoords[0] <= points[1]) ||
          (newSegmentCoords[1] >= points[0] && newSegmentCoords[1] <= points[1])
        ) {
          isPointInside = true;
        }
      } else if (
        segment.coords.usrCoords[1] >= newSegmentCoords[0] &&
        segment.coords.usrCoords[1] <= newSegmentCoords[1]
      ) {
        isPointInside = true;
      }
    });

    if (!isPointInside) {
      return newSegmentCoords;
    }
  } while (segments);
};

// Pass board, handling segment, ticksDistance, numberlineAxis
// Check if there an element inside after segment dragging, then find closest available space and put segment there
const handleSegmentDrag = (board, segment, axis) => {
  segment.on("up", () => {
    const segments = board.elements
      .filter(element => element.elType === "segment" || element.elType === "point")
      .filter(element => element.id !== segment.id);

    const segmentPoints = orderPoints([segment.point1.X(), segment.point2.X()]);

    let prevPosIndex;
    let newCoords;

    previousPointsPositions.forEach((element, index) => {
      if (element.id === segment.point1.id) {
        prevPosIndex = index;
      }
    });

    let ticks = getSpecialTicks(axis);
    if (segmentPoints[0] < previousPointsPositions[prevPosIndex].position) {
      ticks = removeProhibitedTicks(segmentPoints, segments, ticks, segmentPoints[0]);
    } else if (segmentPoints[0] > previousPointsPositions[prevPosIndex].position) {
      ticks = removeProhibitedTicks(segmentPoints, segments, ticks, segmentPoints[1]);
    }
    newCoords = [];
    newCoords[0] = getClosestTick(segmentPoints[0], ticks);
    newCoords[1] = getClosestTick(segmentPoints[1], ticks);
    console.log(newCoords);
    if (newCoords) {
      segment.point1.setPosition(JXG.COORDS_BY_USER, [newCoords[0], 0]);
      segment.point2.setPosition(JXG.COORDS_BY_USER, [newCoords[1], 0]);
    }

    previousPointsPositions.forEach((element, index) => {
      if (element.id === segment.point1.id) {
        previousPointsPositions[index].position = segment.point1.X();
      }

      if (element.id === segment.point2.id) {
        previousPointsPositions[index].position = segment.point2.X();
      }
    });

    board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE);
  });
};

const handleStackedSegmentDrag = (segment, ticksDistance, axis, yPosition) => {
  segment.on("up", () => {
    const segmentPoints = orderPoints([segment.point1.X(), segment.point2.X()]);

    const xMin = axis.point1.X();
    const xMax = axis.point2.X();

    let newCoords;

    if (segmentPoints[0] <= xMin) {
      newCoords = findAvailableSegmentDragPlace(
        [Math.round(xMin - ticksDistance), Math.round(xMin)],
        [],
        ticksDistance,
        true
      );
    } else if (segmentPoints[1] >= xMax) {
      newCoords = findAvailableSegmentDragPlace(
        [Math.round(xMax), Math.round(xMax + ticksDistance)],
        [],
        ticksDistance,
        false
      );
    }

    if (newCoords) {
      segment.point1.setPosition(JXG.COORDS_BY_USER, [newCoords[0], yPosition]);
      segment.point2.setPosition(JXG.COORDS_BY_USER, [newCoords[1], yPosition]);
    }

    // board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE);
  });
};

// Pass point, board, ticks distance of numberline axis, parent segment of point, numberline axis
// Function check if there an element inside of vector after dragging and if yes then find closest available space and put point there
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

// Pass segments, click coordinate, ticks distance of numberline axis
// Check if new segment is inside of existing segment
const checkForElementsOnSegment = (segments, coord, nextTick) => {
  let isSpaceAvailable = true;

  segments.forEach(segment => {
    if (segment.elType === "segment") {
      let points = [];

      Object.keys(segment.ancestors).forEach(key => {
        points.push(segment.ancestors[key].X());
      });

      points = orderPoints(points);

      if ((coord >= points[0] && coord <= points[1]) || (nextTick >= points[0] && nextTick <= points[1])) {
        isSpaceAvailable = false;
      }
    } else if (segment.coords.usrCoords[1] >= coord && segment.coords.usrCoords[1] <= nextTick) {
      isSpaceAvailable = false;
    }
  });

  return isSpaceAvailable;
};

// Pass numberlineAxis, click coordinate, ticksDistance
// Check if new segment is not falling outside of numberlineAxis
const checkForSegmentRenderPosition = (axis, coord, nextTick) => {
  const xMin = axis.point1.X();
  const xMax = axis.point2.X();

  if (coord < xMin || nextTick > xMax) {
    return false;
  }
  return true;
};

// Pass board, click coordinate, ticksDistance, point type (true = default point, false = unfilled point)
// Draw segment point with proper settings
const drawPoint = (board, coord, nextTick, point, fixed, colors, yPosition) => {
  const styles = point ? { ...Colors.default[CONSTANT.TOOLS.POINT] } : { ...Colors.special[CONSTANT.TOOLS.POINT] };
  const highlightPointType = point ? CONSTANT.TOOLS.POINT : CONSTANT.TOOLS.SEGMENTS_POINT;

  return board.$board.create("point", [nextTick || coord, yPosition || 0], {
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

// Pass board, first segment point, second segment point
// Draw new segment line
const drawLine = (board, firstPoint, secondPoint, colors) =>
  board.$board.create("segment", [firstPoint, secondPoint], {
    firstArrow: false,
    lastArrow: false,
    straightfirst: false,
    straightlast: false,
    snapToGrid: false,
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

const loadSegment = (board, element, leftIncluded, rightIncluded, segmentType, stackResponses) => {
  const ticksDistance = board.numberlineAxis.ticks[0].getAttribute("ticksDistance");

  let ticks = getSpecialTicks(board.numberlineAxis);
  ticks = ticks.sort((a, b) => a - b);

  if (!stackResponses) {
    const firstPoint = drawPoint(board, element.point1, null, leftIncluded, false, element.leftPointColor);
    const secondPoint = drawPoint(board, element.point2, null, rightIncluded, false, element.rightPointColor);
    const segment = drawLine(board, firstPoint, secondPoint, element.lineColor);
    segment.segmentType = segmentType;

    previousPointsPositions.push(
      { id: firstPoint.id, position: firstPoint.X() },
      { id: secondPoint.id, position: secondPoint.X() }
    );

    handleSegmentPointDrag(firstPoint, board, segment, board.numberlineAxis, ticks);
    handleSegmentPointDrag(secondPoint, board, segment, board.numberlineAxis, ticks);
    handleSegmentDrag(board, segment, board.numberlineAxis);

    return segment;
  } else {
    const firstPoint = drawPoint(board, element.point1, null, leftIncluded, false, element.leftPointColor, element.y);
    const secondPoint = drawPoint(
      board,
      element.point2,
      ticksDistance,
      rightIncluded,
      false,
      element.rightPointColor,
      element.y
    );

    firstPoint.setAttribute({ snapSizeY: 0.05 });
    firstPoint.setPosition(JXG.COORDS_BY_USER, [firstPoint.X(), element.y]);
    board.$board.on("move", () => firstPoint.moveTo([firstPoint.X(), element.y]));

    secondPoint.setAttribute({ snapSizeY: 0.05 });
    secondPoint.setPosition(JXG.COORDS_BY_USER, [secondPoint.X(), element.y]);
    board.$board.on("move", () => secondPoint.moveTo([secondPoint.X(), element.y]));

    const segment = drawLine(board, firstPoint, secondPoint, element.lineColor);
    segment.segmentType = segmentType;

    board.$board.on("drag", () => handleStackedSegmentDrag(segment, ticksDistance, board.numberlineAxis, element.y));

    handleStackedSegmentPointDrag(firstPoint, board.numberlineAxis, element.y, board);
    handleStackedSegmentPointDrag(secondPoint, board.numberlineAxis, element.y, board);

    return segment;
  }
};

// Pass board, coordinate (closest to ticksDistance click coordinate), left point type (true = filled point, false = unfilled point), right point type
// Check if space is available for new segment, then draw new segment
const drawSegment = (board, coord, leftIncluded, rightIncluded, segmentType, stackResponses, stackResponsesSpacing) => {
  const ticksDistance = board.numberlineAxis.ticks[0].getAttribute("ticksDistance");
  const segments = board.elements.filter(element => element.elType === "segment" || element.elType === "point");

  let ticks = getSpecialTicks(board.numberlineAxis);

  if (typeof coord !== "number") {
    const x = board.getCoords(coord).usrCoords[1];
    coord = getClosestTick(x, ticks);
  }

  ticks = ticks.sort((a, b) => a - b);
  const nextTick = ticks[ticks.indexOf(coord) + 1];

  if (!stackResponses) {
    if (
      checkForElementsOnSegment(segments, coord, nextTick) &&
      checkForSegmentRenderPosition(board.numberlineAxis, coord, nextTick)
    ) {
      const firstPoint = drawPoint(board, coord, null, leftIncluded, false);
      const secondPoint = drawPoint(board, coord, nextTick, rightIncluded, false);
      const segment = drawLine(board, firstPoint, secondPoint);
      segment.segmentType = segmentType;

      previousPointsPositions.push(
        { id: firstPoint.id, position: firstPoint.X() },
        { id: secondPoint.id, position: secondPoint.X() }
      );

      handleSegmentPointDrag(firstPoint, board, segment, board.numberlineAxis, ticks);
      handleSegmentPointDrag(secondPoint, board, segment, board.numberlineAxis, ticks);
      handleSegmentDrag(board, segment, board.numberlineAxis);

      return segment;
    }
  } else if (checkForSegmentRenderPosition(board.numberlineAxis, coord, ticksDistance)) {
    const calcedYPosition = findAvailableStackedSegmentPosition(board, segments, stackResponsesSpacing);

    const firstPoint = drawPoint(board, coord, null, leftIncluded, false, calcedYPosition);
    const secondPoint = drawPoint(board, coord, ticksDistance, rightIncluded, false, calcedYPosition);

    firstPoint.setAttribute({ snapSizeY: 0.05 });
    firstPoint.setPosition(JXG.COORDS_BY_USER, [firstPoint.X(), calcedYPosition]);
    board.$board.on("move", () => firstPoint.moveTo([firstPoint.X(), calcedYPosition]));

    secondPoint.setAttribute({ snapSizeY: 0.05 });
    secondPoint.setPosition(JXG.COORDS_BY_USER, [secondPoint.X(), calcedYPosition]);
    board.$board.on("move", () => secondPoint.moveTo([secondPoint.X(), calcedYPosition]));

    const segment = drawLine(board, firstPoint, secondPoint);
    segment.segmentType = segmentType;

    board.$board.on("drag", () =>
      handleStackedSegmentDrag(segment, ticksDistance, board.numberlineAxis, calcedYPosition)
    );

    handleStackedSegmentPointDrag(firstPoint, board.numberlineAxis, calcedYPosition, board);
    handleStackedSegmentPointDrag(secondPoint, board.numberlineAxis, calcedYPosition, board);

    return segment;
  }
};

const determineSegmentType = (type, board, coords, stackResponses, stackResponsesSpacing) => {
  switch (type) {
    case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_INCLUDED:
      return drawSegment(
        board,
        coords,
        true,
        true,
        CONSTANT.TOOLS.SEGMENT_BOTH_POINT_INCLUDED,
        stackResponses,
        stackResponsesSpacing
      );
    case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_HOLLOW:
      return drawSegment(
        board,
        coords,
        false,
        false,
        CONSTANT.TOOLS.SEGMENT_BOTH_POINT_HOLLOW,
        stackResponses,
        stackResponsesSpacing
      );
    case CONSTANT.TOOLS.SEGMENT_LEFT_POINT_HOLLOW:
      return drawSegment(
        board,
        coords,
        false,
        true,
        CONSTANT.TOOLS.SEGMENT_LEFT_POINT_HOLLOW,
        stackResponses,
        stackResponsesSpacing
      );
    case CONSTANT.TOOLS.SEGMENT_RIGHT_POINT_HOLLOW:
      return drawSegment(
        board,
        coords,
        true,
        false,
        CONSTANT.TOOLS.SEGMENT_RIGHT_POINT_HOLLOW,
        stackResponses,
        stackResponsesSpacing
      );
    default:
      throw new Error("Unknown tool:");
  }
};

const determineAnswerType = (board, config) => {
  switch (config.type) {
    case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_INCLUDED:
      return renderAnswer(board, config, true, true);
    case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_HOLLOW:
      return renderAnswer(board, config, false, false);
    case CONSTANT.TOOLS.SEGMENT_LEFT_POINT_HOLLOW:
      return renderAnswer(board, config, false, true);
    case CONSTANT.TOOLS.SEGMENT_RIGHT_POINT_HOLLOW:
      return renderAnswer(board, config, true, false);
    default:
      throw new Error("Unknown tool:");
  }
};

const onHandler = (type, stackResponses, stackResponsesSpacing) => (board, coords) =>
  determineSegmentType(type, board, coords, stackResponses, stackResponsesSpacing);

const renderAnswer = (board, config, leftIncluded, rightIncluded) => {
  const firstPoint = drawPoint(board, config.point1, null, leftIncluded, true, config.leftPointColor, config.y);
  const secondPoint = drawPoint(board, config.point2, null, rightIncluded, true, config.rightPointColor, config.y);
  const segment = drawLine(board, firstPoint, secondPoint, config.lineColor);

  firstPoint.setAttribute({ snapSizeY: 0.05 });
  firstPoint.setPosition(JXG.COORDS_BY_USER, [firstPoint.X(), config.y]);

  secondPoint.setAttribute({ snapSizeY: 0.05 });
  secondPoint.setPosition(JXG.COORDS_BY_USER, [secondPoint.X(), config.y]);

  segment.answer = firstPoint.answer = secondPoint.answer = true;

  return segment;
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
  loadSegment,
  determineAnswerType
};

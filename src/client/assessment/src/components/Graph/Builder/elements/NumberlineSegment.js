import { CONSTANT, Colors } from '../config';
import { findSegmentPosition, orderPoints, calcRoundedToTicksDistance, findAvailableStackedSegmentPosition } from '../utils';
import { defaultPointParameters } from '../settings';
import { JXG } from '../index';

const previousPointsPositions = [];

// Pass current segment coords, all segments except handling one, ticks distance of numerline axis,
// drag direction (true = point with bigger coord is dragging now, false = point with smaller coord is dragging now)
// Function return first available place for coordinate (depends on direction)
const findAvailableSegmentPointDragPlace = (segmentCoords, segments, ticksDistance, direction) => {
  const newSegmentCoords = [...segmentCoords];

  do {
    if (direction) {
      newSegmentCoords[1] -= ticksDistance;
    } else {
      newSegmentCoords[0] += ticksDistance;
    }

    let isPointInside = false;

    segments.forEach((segment) => {
      if (segment.elType === 'segment') {
        Object.keys(segment.ancestors).forEach((key) => {
          const point = segment.ancestors[key].X();

          if (point >= newSegmentCoords[0] && point <= newSegmentCoords[1]) {
            isPointInside = true;
          }
        });
      } else if (segment.coords.usrCoords[1] >= newSegmentCoords[0] && segment.coords.usrCoords[1] <= newSegmentCoords[1]) {
        isPointInside = true;
      }
    });

    if (!isPointInside) {
      return direction ? newSegmentCoords[1] : newSegmentCoords[0];
    }
  } while (segments);
};

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

    segments.forEach((segment) => {
      if (segment.elType === 'segment') {
        let points = [];

        Object.keys(segment.ancestors).forEach((key) => {
          points.push(segment.ancestors[key].X());
        });

        points = orderPoints(points);

        if (
          (newSegmentCoords[0] >= points[0] && newSegmentCoords[0] <= points[1])
          || (newSegmentCoords[1] >= points[0] && newSegmentCoords[1] <= points[1])
        ) {
          isPointInside = true;
        }
      } else if (segment.coords.usrCoords[1] >= newSegmentCoords[0] && segment.coords.usrCoords[1] <= newSegmentCoords[1]) {
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
const handleSegmentDrag = (board, segment, ticksDistance, axis) => {
  segment.on('up', () => {
    const segments = board.elements.filter(element => element.elType === 'segment' || element.elType === 'point').filter(element => element.id !== segment.id);

    const segmentPoints = orderPoints([segment.point1.X(), segment.point2.X()]);
    const roundedPoints = [calcRoundedToTicksDistance(segmentPoints[0], ticksDistance), calcRoundedToTicksDistance(segmentPoints[1], ticksDistance)];

    const xMin = axis.point1.X();
    const xMax = axis.point2.X();

    let isSpaceAvailable = true;
    let prevPosIndex;
    let newCoords;

    segments.forEach((segment) => {
      if (segment.elType === 'segment') {
        let points = [];

        Object.keys(segment.ancestors).forEach((key) => {
          points.push(segment.ancestors[key].X());
        });

        points = orderPoints(points);

        if (
          (roundedPoints[0] >= points[0] && roundedPoints[0] <= points[1])
          || (roundedPoints[1] >= points[0] && roundedPoints[1] <= points[1])
        ) {
          isSpaceAvailable = false;
        }
      } else if (segment.coords.usrCoords[1] >= roundedPoints[0] && segment.coords.usrCoords[1] <= roundedPoints[1]) {
        isSpaceAvailable = false;
      }
    });

    previousPointsPositions.forEach((element, index) => {
      if (element.id === segment.point1.id) {
        prevPosIndex = index;
      }
    });

    if (!isSpaceAvailable) {
      if (roundedPoints[0] < previousPointsPositions[prevPosIndex].position) {
        newCoords = findAvailableSegmentDragPlace(roundedPoints, segments, ticksDistance, true, xMin, xMax);
      } else if (roundedPoints[0] > previousPointsPositions[prevPosIndex].position) {
        newCoords = findAvailableSegmentDragPlace(roundedPoints, segments, ticksDistance, false, xMin, xMax);
      }
    } else if (segmentPoints[0] <= xMin) {
      newCoords = findAvailableSegmentDragPlace([Math.round(xMin - ticksDistance), Math.round(xMin)], segments, ticksDistance, true);
    } else if (segmentPoints[1] >= xMax) {
      newCoords = findAvailableSegmentDragPlace([Math.round(xMax), Math.round(xMax + ticksDistance)], segments, ticksDistance, false);
    }

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
  });
};

const handleStackedSegmentDrag = (segment, ticksDistance, axis, yPosition) => {
  segment.on('up', () => {
    const segmentPoints = orderPoints([segment.point1.X(), segment.point2.X()]);

    const xMin = axis.point1.X();
    const xMax = axis.point2.X();

    let newCoords;

    if (segmentPoints[0] <= xMin) {
      newCoords = findAvailableSegmentDragPlace([Math.round(xMin - ticksDistance), Math.round(xMin)], [], ticksDistance, true);
    } else if (segmentPoints[1] >= xMax) {
      newCoords = findAvailableSegmentDragPlace([Math.round(xMax), Math.round(xMax + ticksDistance)], [], ticksDistance, false);
    }

    if (newCoords) {
      segment.point1.setPosition(JXG.COORDS_BY_USER, [newCoords[0], yPosition]);
      segment.point2.setPosition(JXG.COORDS_BY_USER, [newCoords[1], yPosition]);
    }
  });
};

// Pass point, board, ticks distance of numberline axis, parent segment of point, numberline axis
// Function check if there an element inside of vector after dragging and if yes then find closest available space and put point there
const handleSegmentPointDrag = (point, board, ticksDistance, segment, axis) => {
  point.on('drag', () => {
    const currentPosition = point.X();

    const segments = board.elements.filter(element => element.elType === 'segment' || element.elType === 'point').filter(element => element.id !== segment.id);
    const segmentCoords = orderPoints([segment.point1.X(), segment.point2.X()]);

    const xMin = axis.point1.X();
    const xMax = axis.point2.X();

    let isPointInside = false;
    let prevPosIndex;

    segments.forEach((segment) => {
      if (segment.elType === 'segment') {
        Object.keys(segment.ancestors).forEach((key) => {
          const point = segment.ancestors[key].X();

          if (point >= segmentCoords[0] && point <= segmentCoords[1]) {
            isPointInside = true;
          }
        });
      } else if (segment.coords.usrCoords[1] >= segmentCoords[0] && segment.coords.usrCoords[1] <= segmentCoords[1]) {
        isPointInside = true;
      }
    });

    previousPointsPositions.forEach((element, index) => {
      if (element.id === point.id) {
        prevPosIndex = index;
      }
    });

    if (isPointInside) {
      if (currentPosition < previousPointsPositions[prevPosIndex].position) {
        // moving to the smaller coords
        const newXCoord = findAvailableSegmentPointDragPlace(segmentCoords, segments, ticksDistance, false);
        point.setPosition(JXG.COORDS_BY_USER, [newXCoord, 0]);
        previousPointsPositions[prevPosIndex].position = newXCoord;
      } else if (currentPosition > previousPointsPositions[prevPosIndex].position) {
        // moving to the bigger coords
        const newXCoord = findAvailableSegmentPointDragPlace(segmentCoords, segments, ticksDistance, true);
        point.setPosition(JXG.COORDS_BY_USER, [newXCoord, 0]);
        previousPointsPositions[prevPosIndex].position = newXCoord;
      }
    } else if (currentPosition > xMax) {
      point.setPosition(JXG.COORDS_BY_USER, [xMax, 0]);
    } else if (currentPosition < xMin) {
      point.setPosition(JXG.COORDS_BY_USER, [xMin, 0]);
    }
  });
};

const handleStackedSegmentPointDrag = (point, axis, yPosition) => {
  point.on('drag', () => {
    const currentPosition = point.X();

    const xMin = axis.point1.X();
    const xMax = axis.point2.X();


    if (currentPosition > xMax) {
      point.setPosition(JXG.COORDS_BY_USER, [xMax, yPosition]);
    } else if (currentPosition < xMin) {
      point.setPosition(JXG.COORDS_BY_USER, [xMin, yPosition]);
    }
  });
};

// Pass segments, click coordinate, ticks distance of numberline axis
// Check if new segment is inside of existing segment
const checkForElementsOnSegment = (segments, coord, ticksDistance) => {
  let isSpaceAvailable = true;

  segments.forEach((segment) => {
    if (segment.elType === 'segment') {
      let points = [];

      Object.keys(segment.ancestors).forEach((key) => {
        points.push(segment.ancestors[key].X());
      });

      points = orderPoints(points);

      if (
        (coord >= points[0] && coord <= points[1])
        || (coord + ticksDistance >= points[0] && coord + ticksDistance <= points[1])
      ) {
        isSpaceAvailable = false;
      }
    } else if (segment.coords.usrCoords[1] >= coord && segment.coords.usrCoords[1] <= coord + ticksDistance) {
      isSpaceAvailable = false;
    }
  });

  return isSpaceAvailable;
};


// Pass numberlineAxis, click coordinate, ticksDistance
// Check if new segment is not falling outside of numberlineAxis
const checkForSegmentRenderPosition = (axis, coord, ticksDistance) => {
  const xMin = axis.point1.X();
  const xMax = axis.point2.X();

  if (coord < xMin || coord + ticksDistance > xMax) {
    return false;
  }
  return true;
};

// Pass board, click coordinate, ticksDistance, point type (true = default point, false = unfilled point)
// Draw segment point with proper settings
const drawPoint = (board, coord, ticksDistance, point, fixed, colors, yPosition) => {
  const styles = point ? { ...Colors.default[CONSTANT.TOOLS.POINT] } : { ...Colors.special[CONSTANT.TOOLS.POINT] };

  return board.$board.create(
    'point',
    [ticksDistance ? coord + ticksDistance : coord, yPosition || 0],
    {
      ...board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters(),
      ...styles,
      ...colors,
      fixed
    }
  );
};

// Pass board, first segment point, second segment point
// Draw new segment line
const drawLine = (board, firstPoint, secondPoint, colors) => (
  board.$board.create(
    'segment',
    [firstPoint, secondPoint],
    {
      firstArrow: false,
      lastArrow: false,
      straightfirst: false,
      straightlast: false,
      snapToGrid: true,
      ...Colors.default[CONSTANT.TOOLS.LINE],
      ...colors
    }
  )
);

// Pass board, coordinate (closest to ticksDistance click coordinate), left point type (true = filled point, false = unfilled point), right point type
// Check if space is available for new segment, then draw new segment
const drawSegment = (board, coord, leftIncluded, rightIncluded, segmentType, stackResponses, stackResponsesSpacing) => {
  const numberlineAxis = board.elements.filter(element => element.elType === 'axis' || element.elType === 'arrow');
  const ticksDistance = numberlineAxis[0].ticks[0].getAttribute('ticksDistance');
  const segments = board.elements.filter(element => element.elType === 'segment' || element.elType === 'point');

  if (!stackResponses) {
    if (checkForElementsOnSegment(segments, coord, ticksDistance) && checkForSegmentRenderPosition(numberlineAxis[0], coord, ticksDistance)) {
      const firstPoint = drawPoint(board, coord, null, leftIncluded, false);
      const secondPoint = drawPoint(board, coord, ticksDistance, rightIncluded, false);
      const segment = drawLine(board, firstPoint, secondPoint);
      segment.segmentType = segmentType;

      previousPointsPositions.push(
        { id: firstPoint.id, position: firstPoint.X() },
        { id: secondPoint.id, position: secondPoint.X() }
      );

      handleSegmentPointDrag(firstPoint, board, ticksDistance, segment, numberlineAxis[0]);
      handleSegmentPointDrag(secondPoint, board, ticksDistance, segment, numberlineAxis[0]);
      handleSegmentDrag(board, segment, ticksDistance, numberlineAxis[0]);

      return segment;
    }
  } else if (checkForSegmentRenderPosition(numberlineAxis[0], coord, ticksDistance)) {
    const calcedYPosition = findAvailableStackedSegmentPosition(board, segments, stackResponsesSpacing);

    const firstPoint = drawPoint(board, coord, null, leftIncluded, false, calcedYPosition);
    const secondPoint = drawPoint(board, coord, ticksDistance, rightIncluded, false, calcedYPosition);

    firstPoint.setAttribute({ snapSizeY: 0.05 });
    firstPoint.setPosition(JXG.COORDS_BY_USER, [firstPoint.X(), calcedYPosition]);
    board.$board.on('move', () => firstPoint.moveTo([firstPoint.X(), calcedYPosition]));

    secondPoint.setAttribute({ snapSizeY: 0.05 });
    secondPoint.setPosition(JXG.COORDS_BY_USER, [secondPoint.X(), calcedYPosition]);
    board.$board.on('move', () => secondPoint.moveTo([secondPoint.X(), calcedYPosition]));


    const segment = drawLine(board, firstPoint, secondPoint);
    segment.segmentType = segmentType;

    board.$board.on('drag', () => handleStackedSegmentDrag(segment, ticksDistance, numberlineAxis[0], calcedYPosition));

    handleStackedSegmentPointDrag(firstPoint, numberlineAxis[0], calcedYPosition);
    handleStackedSegmentPointDrag(secondPoint, numberlineAxis[0], calcedYPosition);

    return segment;
  }
};

const determineSegmentType = (type, board, coords, stackResponses, stackResponsesSpacing) => {
  switch (type) {
    case CONSTANT.TOOLS.BOTH_INCLUDED_SEGMENT:
      return drawSegment(board, coords, true, true, CONSTANT.TOOLS.BOTH_INCLUDED_SEGMENT, stackResponses, stackResponsesSpacing);
    case CONSTANT.TOOLS.BOTH_NOT_INCLUDED_SEGMENT:
      return drawSegment(board, coords, false, false, CONSTANT.TOOLS.BOTH_NOT_INCLUDED_SEGMENT, stackResponses, stackResponsesSpacing);
    case CONSTANT.TOOLS.ONLY_RIGHT_INCLUDED_SEGMENT:
      return drawSegment(board, coords, false, true, CONSTANT.TOOLS.ONLY_RIGHT_INCLUDED_SEGMENT, stackResponses, stackResponsesSpacing);
    case CONSTANT.TOOLS.ONLY_LEFT_INCLUDED_SEGMENT:
      return drawSegment(board, coords, true, false, CONSTANT.TOOLS.ONLY_LEFT_INCLUDED_SEGMENT, stackResponses, stackResponsesSpacing);
    default:
      throw new Error('Unknown tool:');
  }
};

const determineAnswerType = (board, config) => {
  switch (config.type) {
    case CONSTANT.TOOLS.BOTH_INCLUDED_SEGMENT:
      return renderAnswer(board, config, true, true);
    case CONSTANT.TOOLS.BOTH_NOT_INCLUDED_SEGMENT:
      return renderAnswer(board, config, false, false);
    case CONSTANT.TOOLS.ONLY_RIGHT_INCLUDED_SEGMENT:
      return renderAnswer(board, config, false, true);
    case CONSTANT.TOOLS.ONLY_LEFT_INCLUDED_SEGMENT:
      return renderAnswer(board, config, true, false);
    default:
      throw new Error('Unknown tool:');
  }
};

const onHandler = (type, stackResponses, stackResponsesSpacing) => (board, coords) =>
  determineSegmentType(type, board, findSegmentPosition(board, coords), stackResponses, stackResponsesSpacing);

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
  determineAnswerType
};

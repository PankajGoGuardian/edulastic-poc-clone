import { CONSTANT, Colors } from '../config';
import { findSegmentPosition, calcMeasure, orderPoints } from '../utils';
import { defaultPointParameters } from '../settings';
import { JXG } from '../index';

const previousPointsPositions = [];

const onHandler = type => (board, coords) => determineVectorType(type, board, findSegmentPosition(board, coords));

const determineVectorType = (type, board, coords) => {
  switch (type) {
    case CONSTANT.TOOLS.INFINITY_TO_INCLUDED_SEGMENT:
      return drawVector(board, coords, true, false);
    case CONSTANT.TOOLS.INFINITY_TO_NOT_INCLUDED_SEGMENT:
      return drawVector(board, coords, false, false);
    case CONSTANT.TOOLS.INCLUDED_TO_INFINITY_SEGMENT:
      return drawVector(board, coords, true, true);
    case CONSTANT.TOOLS.NOT_INCLUDED_TO_INFINITY_SEGMENT:
      return drawVector(board, coords, false, true);
    default:
      throw new Error('Unknown tool:', tool);
  }
};

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

const checkForElementsOnVector = (segments, coord, xMin, xMax, vectorDirection) => {
  let isSpaceAvailable = true;

  const vectorPoint = vectorDirection ? xMax : xMin;

  const vector = orderPoints([coord, vectorPoint]);

  segments.forEach((segment) => {
    if (segment.elType === 'segment') {
      Object.keys(segment.ancestors).forEach((key) => {
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
const drawPoint = (board, coord, ticksDistance, point) => {
  const styles = point ? { ...Colors.default[CONSTANT.TOOLS.POINT] } : { ...Colors.special[CONSTANT.TOOLS.POINT] };

  return board.$board.create(
    'point',
    [ticksDistance ? coord + ticksDistance : coord, 0],
    {
      ...board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters(),
      ...styles
    }
  );
};

// Pass board, xMin and xMax of numberlineAxis, vector direction
// Draw invisible point of vector on proper place
const drawVectorPoint = (board, xMin, xMax, vectorDirection) => {
  const [x, y] = calcMeasure(15, 50, board);

  return board.$board.create(
    'point',
    [vectorDirection ? xMax + x : xMin - x, 0],
    {
      ...board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters(),
      snapToGrid: false,
      visible: false,
      fixed: true
    }
  );
};

// Pass board, point that will be visible, invisible point that will be beginning or ending of vector(depending on direction),
// vector direction (true = vector goes from coordinate to +infinity, false = vector goes from -infinity to coordanate)
// Draw new vector line with proper settings
const drawVectorLine = (board, visiblePoint, invisiblePoint, vectorDirection) => {
  const points = vectorDirection ? [visiblePoint, invisiblePoint] : [invisiblePoint, visiblePoint];

  return board.$board.create(
    'segment',
    points,
    {
      firstarrow: vectorDirection ? false : { size: 5 },
      lastarrow: vectorDirection ? { size: 5 } : false,
      straightfirst: false,
      straightlast: false,
      fixed: true,
      ...Colors.default[CONSTANT.TOOLS.LINE]
    }
  );
};

const drawVector = (board, coord, pointIncluded, vectorDirection) => {
  const numberlineAxis = board.elements.filter(element => element.elType === 'axis' || element.elType === 'arrow');
  const ticksDistance = numberlineAxis[0].ticks[0].getAttribute('ticksDistance');
  const segments = board.elements.filter(element => element.elType === 'segment' || element.elType === 'point');
  const xMin = numberlineAxis[0].point1.X();
  const xMax = numberlineAxis[0].point2.X();

  if (checkForElementsOnVector(segments, coord, xMin, xMax, vectorDirection)) {
    const visiblePoint = drawPoint(board, coord, null, pointIncluded);
    const invisiblePoint = drawVectorPoint(board, xMin, xMax, vectorDirection);
    const vector = drawVectorLine(board, visiblePoint, invisiblePoint, vectorDirection);

    previousPointsPositions.push(
      { id: visiblePoint.id, position: visiblePoint.X() },
      { id: invisiblePoint.id, position: invisiblePoint.X() }
    );

    handleSegmentPointDrag(visiblePoint, board, ticksDistance, vector, numberlineAxis[0]);

    return vector;
  }
};

export default {
  onHandler
};

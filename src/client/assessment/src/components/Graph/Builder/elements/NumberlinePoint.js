import { orderPoints, findSegmentPosition, findAvailableStackedSegmentPosition } from '../utils';
import { CONSTANT, Colors } from '../config';
import { defaultPointParameters } from '../settings';
import { JXG } from '../index';

const previousPointsPositions = [];

const findAvailablePointDragPlace = (pointCoord, segments, ticksDistance, direction) => {
  do {
    if (direction) {
      pointCoord -= ticksDistance;
    } else {
      pointCoord += ticksDistance;
    }

    let isPointInside = false;

    segments.forEach((segment) => {
      if (segment.elType === 'segment') {
        let points = [];

        Object.keys(segment.ancestors).forEach((key) => {
          points.push(segment.ancestors[key].X());
        });

        points = orderPoints(points);

        if (pointCoord >= points[0] && pointCoord <= points[1]) {
          isPointInside = true;
        }
      } else if (segment.coords.usrCoords[1] === pointCoord) {
        isPointInside = true;
      }
    });

    if (!isPointInside) {
      return pointCoord;
    }
  } while (segments);
};

const handlePointDrag = (point, board, ticksDistance, axis) => {
  point.on('drag', () => {
    const currentPosition = point.X();

    const segments = board.elements.filter(element => element.elType === 'segment' || element.elType === 'point').filter(element => element.id !== point.id);

    const xMin = axis.point1.X();
    const xMax = axis.point2.X();

    let isSpaceAvailable = true;
    let prevPosIndex;

    segments.forEach((segment) => {
      if (segment.elType === 'segment') {
        let points = [];

        Object.keys(segment.ancestors).forEach((key) => {
          points.push(segment.ancestors[key].X());
        });

        points = orderPoints(points);

        if (currentPosition >= points[0] && currentPosition <= points[1]) {
          isSpaceAvailable = false;
        }
      } else if (segment.coords.usrCoords[1] === currentPosition) {
        isSpaceAvailable = false;
      }
    });

    previousPointsPositions.forEach((element, index) => {
      if (element.id === point.id) {
        prevPosIndex = index;
      }
    });

    if (!isSpaceAvailable) {
      if (currentPosition < previousPointsPositions[prevPosIndex].position) {
        // moving to the smaller coords
        const newXCoord = findAvailablePointDragPlace(currentPosition, segments, ticksDistance, false);
        point.setPosition(JXG.COORDS_BY_USER, [newXCoord, 0]);
        previousPointsPositions[prevPosIndex].position = newXCoord;
      } else if (currentPosition > previousPointsPositions[prevPosIndex].position) {
        // moving to the bigger coords
        const newXCoord = findAvailablePointDragPlace(currentPosition, segments, ticksDistance, true);
        point.setPosition(JXG.COORDS_BY_USER, [newXCoord, 0]);
        previousPointsPositions[prevPosIndex].position = newXCoord;
      }
    } else if (currentPosition > xMax) {
      const newXCoord = findAvailablePointDragPlace(xMax, segments, ticksDistance, true);
      point.setPosition(JXG.COORDS_BY_USER, [newXCoord, 0]);
      previousPointsPositions[prevPosIndex].position = newXCoord;
    } else if (currentPosition < xMin) {
      const newXCoord = findAvailablePointDragPlace(xMin, segments, ticksDistance, false);
      point.setPosition(JXG.COORDS_BY_USER, [newXCoord, 0]);
      previousPointsPositions[prevPosIndex].position = newXCoord;
    }
  });
};

const handleStackedPointDrag = (point, axis, yPosition) => {
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

  segments.forEach((segment) => {
    if (segment.elType === 'segment') {
      let points = [];

      Object.keys(segment.ancestors).forEach((key) => {
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

const drawPoint = (board, coord, fixed, colors, yPosition) => (
  board.$board.create(
    'point',
    [coord, yPosition || 0],
    {
      ...board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters(),
      ...Colors.default[CONSTANT.TOOLS.POINT],
      ...colors,
      fixed
    }
  )
);


const onHandler = (stackResponses, stackResponsesSpacing) => (board, coord) => {
  const roundedCoord = findSegmentPosition(board, coord);
  const numberlineAxis = board.elements.filter(element => element.elType === 'axis' || element.elType === 'arrow');
  const ticksDistance = numberlineAxis[0].ticks[0].getAttribute('ticksDistance');
  const segments = board.elements.filter(element => element.elType === 'segment' || element.elType === 'point');

  if (!stackResponses) {
    if (checkForPointRenderPosition(numberlineAxis[0], roundedCoord) && checkForElementsOnPoint(segments, roundedCoord)) {
      const point = drawPoint(board, roundedCoord, false, null);
      point.segmentType = 'segmentsPoint';
      previousPointsPositions.push({ id: point.id, position: point.X() });
      handlePointDrag(point, board, ticksDistance, numberlineAxis[0]);

      return point;
    }
  } else if (checkForPointRenderPosition(numberlineAxis[0], roundedCoord)) {
    const calcedYPosition = findAvailableStackedSegmentPosition(board, segments, stackResponsesSpacing);

    const point = drawPoint(board, roundedCoord, false, null, calcedYPosition);
    point.segmentType = 'segmentsPoint';

    point.setAttribute({ snapSizeY: 0.05 });
    point.setPosition(JXG.COORDS_BY_USER, [point.X(), calcedYPosition]);
    board.$board.on('move', () => point.moveTo([point.X(), calcedYPosition]));

    handleStackedPointDrag(point, numberlineAxis[0], calcedYPosition);

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
  renderAnswer
};

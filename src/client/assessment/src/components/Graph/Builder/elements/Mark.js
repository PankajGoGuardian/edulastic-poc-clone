import { JXG } from '..';
import { clone } from 'lodash';
import { defaultTextParameters } from '../settings';
import { calcMeasure, checkMarksRenderSpace, calcRoundedToTicksDistance } from '../utils';

const snapMark = (mark, point, xCoords, snapToTicks, ticksDistance) => {
  mark.on('up', () => {
    const setCoords = JXG.COORDS_BY_USER;
    let x; let y;

    if (point.Y() >= -1 && point.X() < xCoords[0]) {
      y = 0;
      x = xCoords[0];
    } else if (point.Y() >= -1 && point.X() > xCoords[1]) {
      y = 0;
      x = xCoords[1];
    } else if (point.Y() >= -1 && point.X() < xCoords[1] && point.X() > xCoords[0]) {
      y = 0;
      if (snapToTicks) {
        point.setAttribute({ snapSizeX: ticksDistance });
        // x = calcRoundedToTicksDistance(point.X(), ticksDistance);
      } else {
        x = point.X();
      }
    } else {
      y = point.Y();
      x = point.X();
    }

    if (point.Y() >= -1) {
      mark.setAttribute({ cssClass: 'mark mounted', highlightCssClass: 'mark mounted' });
    } else {
      mark.setAttribute({ cssClass: 'mark', highlightCssClass: 'mark' });
    }

    // point.setPosition(setCoords, [x, y]);
  });
};

const onHandler = (board, coords, data, measure, xCoords, snapToTicks, ticksDistance) => {
  const point = board.$board.create('point', coords, { name: '', visible: false });
  const mark = board.$board.create(
    'text',
    [coords[0] - measure[0], coords[1] + measure[1], data.text],
    defaultTextParameters(),
  );
  const group = board.$board.create('group', [point, mark], { id: data.id });
  snapMark(mark, point, xCoords, snapToTicks, ticksDistance);
  return group;
};

const findObjectInGroup = (group, type) => {
  for (const element in group.objects) {
    if (group.objects[element].point && group.objects[element].point.elType === type) {
      return group.objects[element].point;
    }
  }
};

const rerenderMark = (mark, board, graphParameters, settings) => {
  const oldPoint = findObjectInGroup(mark, 'point');
  const oldMark = findObjectInGroup(mark, 'text');
  const data = { id: mark.id, text: clone(oldMark.htmlStr) };
  let oldCoords = [clone(oldPoint.coords.usrCoords[1]), clone(oldPoint.coords.usrCoords[2])];

  if (oldCoords[1] >= -1) {
    if (oldCoords[0] < graphParameters.xMin) {
      oldCoords[0] = graphParameters.xMin;
    } else if (oldCoords[0] > graphParameters.xMax) {
      oldCoords[0] = graphParameters.xMax;
    }
  } else {
    oldCoords = checkMarksRenderSpace(board);
  }

  const newMark = onHandler(
    board,
    oldCoords,
    data,
    calcMeasure(51.5, 45, board),
    [graphParameters.xMin, graphParameters.xMax],
    settings.snapToTicks,
    settings.ticksDistance
  );
  const newPoint = findObjectInGroup(newMark, 'point');
  const newLabel = findObjectInGroup(newMark, 'text');

  if (newPoint.Y() >= -1) {
    newLabel.setAttribute({ cssClass: 'mark mounted', highlightCssClass: 'mark mounted' });
  } else {
    newLabel.setAttribute({ cssClass: 'mark', highlightCssClass: 'mark' });
  }

  board.elements.push(newMark);
};

const updateTextSize = (mark, fontSize) => {
  const text = findObjectInGroup(mark, 'text');
  text.setAttribute({ fontSize });
};

const removeMark = (board, mark) => {
  const text = findObjectInGroup(mark, 'text');
  const point = findObjectInGroup(mark, 'point');
  board.$board.removeObject(text);
  board.$board.removeObject(point);
};

const renderMarksContainer = (board, xMin, xMax) => {
  const polygonCoords = [[xMin, -0.5], [xMin, -1.75], [xMax, -1.75], [xMax, -0.5]];
  const polygon = board.$board.create('polygon', polygonCoords, { fixed: true, withLines: false, fillOpacity: 1, fillColor: '#efefef' });
  polygon.vertices.forEach(ancestor => ancestor.setAttribute({ visible: false }));
  return polygon;
};

const updateMarksContainer = (board, xMin, xMax) => {
  const oldBoard = board.elements.filter(element => element.elType === 'polygon');
  board.$board.removeObject(oldBoard);
  board.elements = board.elements.filter(element => element.elType !== 'polygon');
  board.elements.push(renderMarksContainer(board, xMin, xMax));
};

const updateText = (oldText, newText) => oldText.setText(newText);

const checkForTextUpdate = (marks, elements) => {
  // Try to rewrite with lodash differenceBy
  marks.forEach((mark) => {
    elements.forEach((element) => {
      if (element.id === mark.id) {
        const oldText = findObjectInGroup(element, 'text');

        if (oldText.htmlStr !== mark.text) {
          updateText(oldText, mark.text);
        }
      }
    });
  });
};

const swapCoordinates = (swappedMarks, board) => {
  const newPositions = swappedMarks.map((swappedMark) => {
    const oldObject = board.elements.find(element => element.id === swappedMark.itemToSwap);
    const oldPoint = findObjectInGroup(oldObject, 'point');

    const newObject = board.elements.find(element => element.id === swappedMark.currentElement);
    const newPoint = findObjectInGroup(newObject, 'point');
    const newMark = findObjectInGroup(newObject, 'text');

    return {
      newCoords: clone(oldPoint.coords.usrCoords),
      oldCoords: clone(newPoint.coords.usrCoords),
      mark: newMark,
      point: newPoint
    };
  });

  newPositions.forEach((group) => {
    group.point.setPositionDirectly(JXG.COORDS_BY_USER, group.newCoords, group.oldCoords);

    if (group.point.Y() >= -1) {
      group.mark.setAttribute({ cssClass: 'mark mounted', highlightCssClass: 'mark mounted' });
    } else {
      group.mark.setAttribute({ cssClass: 'mark', highlightCssClass: 'mark' });
    }
  });
};

const checkForSwap = (marks, oldMarks, board) => {
  const swappedMarks = [];

  oldMarks.forEach((oldMark, index) => {
    if (oldMark.id !== marks[index].id) {
      marks.forEach((mark, i) => {
        if (oldMark.id === mark.id) {
          swappedMarks.push({
            currentElement: oldMark.id,
            itemToSwap: oldMarks[i].id
          });
        }
      });
    }
  });

  if (swappedMarks.length > 0) {
    swapCoordinates(swappedMarks, board);
  }
};

const checkForUpdate = (marks, elements, board, oldMarks) => {
  checkForTextUpdate(marks, elements);
  checkForSwap(marks, oldMarks, board);
  board.$board.fullUpdate();
};

export default {
  onHandler,
  renderMarksContainer,
  updateMarksContainer,
  updateText,
  updateTextSize,
  swapCoordinates,
  findObjectInGroup,
  checkForTextUpdate,
  checkForSwap,
  checkForUpdate,
  removeMark,
  rerenderMark
};

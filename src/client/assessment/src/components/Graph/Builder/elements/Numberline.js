import { union, isString } from 'lodash';
import { calcMeasure } from '../utils';
// import { JXG } from '../index';
import { RENDERING_BASE } from '../config/constants';

const onHandler = (board, xMin, xMax, settings, lineSettings) => {
  const [x, y] = calcMeasure(board.$board.canvasWidth, board.$board.canvasHeight, board);
  const calcY = lineSettings.yMax - (y / 100 * lineSettings.position);
  const axisPadding = (-(xMin) + xMax) / 100 * 3.5;

  const newAxis = board.$board.create(
    'axis',
    [[settings.showMin ? xMin - axisPadding : xMin + axisPadding, calcY], [settings.showMax ? xMax + axisPadding : xMax - axisPadding, calcY]],
    {
      straightFirst: false,
      straightLast: false,
      firstArrow: settings.leftArrow === true ? { size: 10 } : false,
      lastArrow: settings.rightArrow === true ? { size: 10 } : false,
      strokeColor: '#d6d6d6',
      highlightStrokeColor: '#d6d6d6'
    }
  );

  newAxis.removeAllTicks();
  let ticks = [];
  if (settings.renderingBase === RENDERING_BASE.ZERO_BASED) {
    for (let i = xMin; i <= xMax; i++) {
      if (i === xMin || i === xMax) {
        ticks.push(i);
      } else if (i % (settings.ticksDistance * settings.labelsFrequency) === 0) {
        ticks.push(i);
      }
    }
  } else if (settings.renderingBase === RENDERING_BASE.LINE_MINIMUM_VALUE) {
    let i = xMin;
    while (i < xMax) {
      ticks.push(i);
      i += settings.ticksDistance;
    }
    ticks.push(xMax);
  }
  if (isString(settings.specificPoints)) {
    const tickArr = settings.specificPoints.split(',')
      .map(s => parseFloat(s))
      .filter(num => isNaN(num) === false);
    ticks = union(ticks, tickArr);
  }
  board.$board.create('ticks', [newAxis, ticks],
    {
      straightFirst: false,
      straightLast: false,
      firstArrow: settings.leftArrow === true ? { size: 10 } : false,
      lastArrow: settings.rightArrow === true ? { size: 10 } : false,
      strokeColor: '#d6d6d6',
      highlightStrokeColor: '#d6d6d6',
      visible: settings.showTicks,
      anchor: 'middle',
      insertTicks: false,
      drawZero: true,
      tickEndings: [1, 1],
      majorHeight: 25,
      minorHeight: 0,
      drawLabels: true,
      ticksDistance: settings.ticksDistance,
      label: {
        offset: [0, -13],
        anchorX: 'middle',
        fontSize: settings.fontSize
      }
    });

  return newAxis;
};

const updateCoords = (board, xMin, xMax, settings, lineSettings) => {
  const oldAxis = board.elements.filter(element => element.elType === 'axis' || element.elType === 'arrow');
  board.$board.removeObject(oldAxis);
  board.elements = board.elements.filter(element => element.elType !== 'axis').filter(element => element.elType !== 'arrow');
  const newAxis = onHandler(board, xMin, xMax, settings, lineSettings);
  board.elements.push(newAxis);
  board.$board.fullUpdate();
};

export default {
  onHandler,
  updateCoords
};

import { JXG } from '..';
import { CONSTANT, Colors } from '../config';
import { defaultPointParameters } from '../settings';

export const getPointLabelParameters = () => ({
  offset: [0, 10],
  anchorX: 'middle',
  anchorY: 'bottom',
  cssClass: 'myLabel',
  highlightCssClass: 'myLabel'
});

function roundCoords(coords) {
  return [Math.round(coords[1]), Math.round(coords[2])];
}

export function findPoint(elements, coords) {
  const [x, y] = roundCoords(coords);
  for (const el in elements) {
    if (JXG.isPoint(elements[el])) {
      if (elements[el].coords.usrCoords[1] === x && elements[el].coords.usrCoords[2] === y) {
        return elements[el];
      }
    } else if (elements[el].ancestors) {
      const point = findPoint(elements[el].ancestors, coords);
      if (point) {
        return point;
      }
    }
  }
  return null;
}

function onHandler(board, event) {
  const coords = board.getCoords(event);
  const point = findPoint(board.elements, coords.usrCoords);
  if (!point) {
    return board.$board.create(
      'point',
      coords.usrCoords,
      {
        ...board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters(),
        ...Colors.default[CONSTANT.TOOLS.POINT],
        label: getPointLabelParameters(),
      },
    );
  }
  return point;
}

function getConfig(point) {
  return {
    type: CONSTANT.TOOLS.POINT,
    _type: point.type,
    x: point.coords.usrCoords[1],
    y: point.coords.usrCoords[2],
    id: point.id,
    label: point.hasLabel ? point.label.plaintext : false,
  };
}

function parseConfig(config, pointParameters) {
  return [
    'point',
    [config.x, config.y],
    {
      ...(pointParameters || defaultPointParameters()),
      label: getPointLabelParameters(),
    },
  ];
}

export default {
  onHandler,
  getConfig,
  parseConfig,
  roundCoords,
  findPoint,
};

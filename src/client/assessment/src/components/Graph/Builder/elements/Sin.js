import { Point } from '.';
import { CONSTANT, Colors } from '../config';

export const defaultConfig = {
  type: CONSTANT.TOOLS.SIN,
};

export const getSinLabelParameters = () => ({
  offset: [0, 10],
  position: 'mdl',
  anchorX: 'middle',
  anchorY: 'middle',
  cssClass: 'myLabel',
  highlightCssClass: 'myLabel'
});

const makeCallback = (p1, p2) => (x) => {
  const a = p1.Y();
  const b = p2.Y() - p1.Y();
  const c = 1 / ((p2.X() - p1.X()) / (Math.PI / 2));
  const d = 0 - p1.X() * Math.PI / (2 * (p2.X() - p1.X()));
  return a + b * Math.sin(x * c + d);
};

let points = [];

function onHandler() {
  return (board, event) => {
    const newPoint = Point.onHandler(board, event);
    if (newPoint) {
      points.push(newPoint);
    }
    if (points.length === 2) {
      const newLine = board.$board.create('functiongraph',
        [makeCallback(...points)], {
          ...defaultConfig,
          ...Colors.default[CONSTANT.TOOLS.SIN],
          label: getSinLabelParameters(),
        });

      if (newLine) {
        newLine.addParents(points);
        newLine.ancestors = {
          [points[0].id]: points[0],
          [points[1].id]: points[1],
        };
        points = [];
        return newLine;
      }
    }
  };
}

function parseConfig(points) {
  return [
    'functiongraph',
    [points => makeCallback(...points), points],
    {
      ...defaultConfig,
      fillColor: 'transparent',
      label: getSinLabelParameters(),
    },
  ];
}

function abort(cb) {
  cb(points);
  points = [];
}

export default {
  onHandler,
  parseConfig,
  abort,
};

import { Point } from ".";
import { CONSTANT, Colors } from "../config";
import { handleSnap } from "../utils";
import { getLabelParameters } from "../settings";

const jxgType = 96;

export const defaultConfig = {
  type: CONSTANT.TOOLS.SIN,
  fixed: false
};

const makeCallback = (p1, p2) => x => {
  const a = p1.Y();
  const b = p2.Y() - p1.Y();
  const c = 1 / ((p2.X() - p1.X()) / (Math.PI / 2));
  const d = 0 - (p1.X() * Math.PI) / (2 * (p2.X() - p1.X()));
  return a + b * Math.sin(x * c + d);
};

let points = [];

function create(board, sinPoints, id = null) {
  const newLine = board.$board.create("functiongraph", [makeCallback(...sinPoints)], {
    ...defaultConfig,
    ...Colors.default[CONSTANT.TOOLS.SIN],
    label: getLabelParameters(jxgType),
    id
  });
  newLine.type = jxgType;
  newLine.addParents(sinPoints);
  newLine.ancestors = {
    [sinPoints[0].id]: sinPoints[0],
    [sinPoints[1].id]: sinPoints[1]
  };
  handleSnap(newLine, Object.values(newLine.ancestors), board);
  return newLine;
}

function onHandler() {
  return (board, event) => {
    const newPoint = Point.onHandler(board, event);
    newPoint.isTemp = true;
    points.push(newPoint);
    if (points.length === 2) {
      points.forEach(point => {
        point.isTemp = false;
      });
      const newLine = create(board, points);
      points = [];
      return newLine;
    }
  };
}

function clean(board) {
  const result = points.length > 0;
  points.forEach(point => board.$board.removeObject(point));
  points = [];
  return result;
}

function getConfig(sine) {
  return {
    _type: sine.type,
    type: CONSTANT.TOOLS.SIN,
    id: sine.id,
    label: sine.labelHTML || false,
    points: Object.keys(sine.ancestors)
      .sort()
      .map(n => Point.getConfig(sine.ancestors[n]))
  };
}

function parseConfig(pointsConfig) {
  return [
    "functiongraph",
    [pointsArgument => makeCallback(...pointsArgument), pointsConfig],
    {
      ...defaultConfig,
      ...Colors.default[CONSTANT.TOOLS.SIN],
      label: getLabelParameters(jxgType)
    }
  ];
}

function getPoints() {
  return points;
}

export default {
  onHandler,
  getConfig,
  parseConfig,
  clean,
  getPoints,
  create
};

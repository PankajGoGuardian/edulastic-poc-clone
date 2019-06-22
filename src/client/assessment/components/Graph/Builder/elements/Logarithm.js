import { Point } from ".";
import { CONSTANT, Colors } from "../config";
import { handleSnap } from "../utils";
import { getLabelParameters } from "../settings";

const jxgType = 94;

export const defaultConfig = {
  type: CONSTANT.TOOLS.LOGARITHM,
  fixed: false
};

const makeCallback = (p1, p2) => x => {
  const a = p1.Y();
  const b = p2.Y() - p1.Y();
  const c = p2.X() - p1.X() >= 0 ? p2.X() - p1.X() : 1 / (p1.X() - p2.X());
  const d = -p1.X();
  return a + (b / c) * Math.log(x + d);
};

let points = [];

function create(board, logPoints, id = null) {
  const newLine = board.$board.create("functiongraph", [makeCallback(...logPoints)], {
    ...defaultConfig,
    ...Colors.default[CONSTANT.TOOLS.LOGARITHM],
    label: getLabelParameters(jxgType),
    id
  });
  newLine.type = jxgType;
  newLine.addParents(logPoints);
  newLine.ancestors = {
    [logPoints[0].id]: logPoints[0],
    [logPoints[1].id]: logPoints[1]
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
function getConfig(logarithm) {
  return {
    _type: logarithm.type,
    type: CONSTANT.TOOLS.LOGARITHM,
    id: logarithm.id,
    label: logarithm.labelHTML || false,
    points: Object.keys(logarithm.ancestors)
      .sort()
      .map(n => Point.getConfig(logarithm.ancestors[n]))
  };
}

function parseConfig(pointsConfig) {
  return [
    "functiongraph",
    [pointsArgument => makeCallback(...pointsArgument), pointsConfig],
    {
      ...defaultConfig,
      ...Colors.default[CONSTANT.TOOLS.LOGARITHM],
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

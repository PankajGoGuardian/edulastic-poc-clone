import { Point } from ".";
import { CONSTANT, Colors } from "../config";
import { handleSnap } from "../utils";
import { getLabelParameters } from "../settings";

const jxgType = 91;

export const defaultConfig = {
  type: CONSTANT.TOOLS.TANGENT,
  fixed: false
};

const makeCallback = (p1, p2) => x => {
  const a = p1.Y();
  const b = p2.Y() - p1.Y();
  const c = 1 / ((p2.X() - p1.X()) / (Math.PI / 2));
  const d = 0 - (p1.X() * Math.PI) / (2 * (p2.X() - p1.X()));
  return a + b * Math.tan(x * c + d);
};

let points = [];

function create(board, tangentPoints, id = null) {
  const newLine = board.$board.create("functiongraph", [makeCallback(...tangentPoints)], {
    ...defaultConfig,
    ...Colors.default[CONSTANT.TOOLS.TANGENT],
    label: getLabelParameters(jxgType),
    id
  });
  newLine.type = jxgType;
  newLine.addParents(tangentPoints);
  newLine.ancestors = {
    [tangentPoints[0].id]: tangentPoints[0],
    [tangentPoints[1].id]: tangentPoints[1]
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

function getConfig(tangent) {
  return {
    _type: tangent.type,
    type: CONSTANT.TOOLS.TANGENT,
    id: tangent.id,
    label: tangent.labelHTML || false,
    points: Object.keys(tangent.ancestors)
      .sort()
      .map(n => Point.getConfig(tangent.ancestors[n]))
  };
}

function parseConfig(pointsConfig) {
  return [
    "functiongraph",
    [pointsArgument => makeCallback(...pointsArgument), pointsConfig],
    {
      ...defaultConfig,
      ...Colors.default[CONSTANT.TOOLS.TANGENT],
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

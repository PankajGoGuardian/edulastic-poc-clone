import { Point } from ".";
import { CONSTANT, Colors } from "../config";
import { handleSnap } from "../utils";
import { getLabelParameters } from "../settings";

const jxgType = 90;

export const defaultConfig = { fixed: false };

let points = [];

function create(board, hypPoints, id = null) {
  const newLine = board.$board.create("hyperbola", hypPoints, {
    ...defaultConfig,
    ...Colors.default[CONSTANT.TOOLS.HYPERBOLA],
    label: getLabelParameters(jxgType),
    id
  });
  newLine.type = jxgType;
  newLine.labelIsVisible = true;
  newLine.color = "#00b2ff";
  handleSnap(newLine, Object.values(newLine.ancestors), board);
  board.handleStackedElementsMouseEvents(newLine);

  return newLine;
}

function onHandler() {
  return (board, event) => {
    const newPoint = Point.onHandler(board, event);
    newPoint.isTemp = true;
    points.push(newPoint);
    if (points.length === 3) {
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

function getConfig(hyperbola) {
  return {
    _type: hyperbola.type,
    type: CONSTANT.TOOLS.HYPERBOLA,
    id: hyperbola.id,
    label: hyperbola.labelHTML || false,
    labelIsVisible: hyperbola.labelIsVisible,
    color: hyperbola.color || "#00b2ff",
    points: Object.keys(hyperbola.ancestors)
      .sort()
      .map(n => Point.getConfig(hyperbola.ancestors[n]))
  };
}

function parseConfig() {
  return {
    ...defaultConfig,
    ...Colors.default[CONSTANT.TOOLS.HYPERBOLA],
    label: getLabelParameters(jxgType)
  };
}

function getPoints() {
  return points;
}

export default {
  onHandler,
  getConfig,
  clean,
  parseConfig,
  getPoints,
  create
};
